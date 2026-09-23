import { Router } from 'express';
import argon2 from 'argon2';
import { asc, count, desc, eq } from 'drizzle-orm';
import multer, { MulterError } from 'multer';
import { z } from 'zod';
import { db } from '../db/cliente.js';
import {
  ajustes,
  atributos,
  categorias,
  horario,
  imagenes,
  mensajes,
  paginas,
  preguntas,
  productoAtributos,
  productoColores,
  productoTallas,
  productos,
  servicios,
  usuarios,
} from '../db/esquema.js';
import { ROLES_USUARIO } from '@anamari/compartido';
import { exigirGestionUsuarios, exigirPropietaria, exigirSesion } from '../middleware/auth.js';
import { ipCliente, limiteIntentos } from '../middleware/limites.js';
import {
  MAX_BYTES_IMAGEN,
  MAX_IMAGENES_POR_PRODUCTO,
  borrarArchivosImagen,
  mimeDeclaradoValido,
  procesarImagen,
} from '../servicios/imagenes.js';
import { avisoProductoActualizado } from '../servicios/sockets.js';
import { etiquetaValorColor } from '../lib/colores.js';

function generarSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function slugUnico(nombre: string, ignorarId?: number): Promise<string> {
  const base = generarSlug(nombre) || 'producto';
  let slug = base;
  let sufijo = 2;
  for (;;) {
    const filas = await db.select({ id: productos.id }).from(productos).where(eq(productos.slug, slug));
    const choque = filas.find((f) => f.id !== ignorarId);
    if (!choque) return slug;
    slug = `${base}-${sufijo}`;
    sufijo += 1;
  }
}

const valorColor = z.union([
  z.literal('multicolor'),
  z.literal('transparente'),
  z.string().regex(/^#[0-9A-Fa-f]{6}$/),
]);

const esquemaProducto = z.object({
  nombre: z.string().trim().min(1),
  tipo: z.enum(['ropa', 'merceria']),
  categoria_id: z.number().int(),
  descripcion: z.string().trim().optional().nullable(),
  composicion: z.string().trim().optional().nullable(),
  colores: z
    .array(
      z.object({
        valor: valorColor,
        orden: z.number().int().min(0).max(2),
      }),
    )
    .max(3)
    .optional(),
  caracteristica: z.string().trim().optional().nullable(),
  precio_centimos: z.number().int().min(0).optional().nullable(),
  agotado: z.boolean().optional(),
  destacado: z.boolean().optional(),
  visible: z.boolean().optional(),
  tallas: z.array(z.object({ talla: z.string().trim().min(1), disponible: z.boolean().optional() })).optional(),
  atributos: z.array(z.number().int()).optional(),
});

async function reemplazarColores(productoId: number, colores?: { valor: string; orden: number }[]) {
  await db.delete(productoColores).where(eq(productoColores.productoId, productoId));
  const filas = (colores ?? [])
    .filter((c) => c.valor)
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 3);
  if (!filas.length) return;
  await db.insert(productoColores).values(
    filas.map((c, i) => ({
      productoId,
      valor: c.valor.toLowerCase().startsWith('#') ? c.valor.toLowerCase() : c.valor,
      orden: i,
    })),
  );
}

export const admin = Router();
admin.use(exigirSesion);

const subida = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES_IMAGEN, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!mimeDeclaradoValido(file.mimetype)) {
      cb(new Error('FORMATO_NO_PERMITIDO'));
      return;
    }
    cb(null, true);
  },
});

function manejarSubida(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) {
  subida.single('archivo')(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({ error: 'La imagen supera el tamaño máximo (5 MB).' });
        return;
      }
      res.status(422).json({ error: 'No se ha podido recibir el archivo.' });
      return;
    }
    if (err instanceof Error && err.message === 'FORMATO_NO_PERMITIDO') {
      res.status(415).json({ error: 'Formato no permitido. Usa JPG, PNG o WebP.' });
      return;
    }
    next(err);
  });
}

const limiteSubidaFotos = limiteIntentos(
  (req) => `foto:${req.usuario?.id ?? '0'}:${ipCliente(req)}`,
  20,
  60 * 60 * 1000,
);

admin.get('/mensajes', async (_req, res) => {
  const filas = await db.select().from(mensajes).orderBy(desc(mensajes.creadoEn));
  res.json(
    filas.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      email: m.email,
      mensaje: m.mensaje,
      leido: m.leido,
      creado_en: m.creadoEn.toISOString(),
    })),
  );
});

admin.patch('/mensajes/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [fila] = await db
    .update(mensajes)
    .set({ leido: true })
    .where(eq(mensajes.id, id))
    .returning();
  if (!fila) {
    res.status(404).json({ error: 'Mensaje no encontrado' });
    return;
  }
  res.json({ ok: true });
});

admin.get('/productos', async (req, res) => {
  const tipo = req.query.tipo;
  const filas = await db.select().from(productos).orderBy(desc(productos.creadoEn));
  const lista = filas
    .filter((p) => (tipo === 'ropa' || tipo === 'merceria' ? p.tipo === tipo : true))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      tipo: p.tipo,
      categoria: p.tipo === 'ropa' ? 'Ropa' : 'Mercería y costura',
      visible: p.visible,
      agotado: p.agotado,
      destacado: p.destacado,
      precio_centimos: p.precioCentimos,
    }));
  res.json(lista);
});

admin.get('/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const filas = await db
    .select()
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(eq(productos.id, id))
    .limit(1);
  const fila = filas[0];
  if (!fila) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  const [tallas, atrs, imgs, coloresFilas] = await Promise.all([
    db.select().from(productoTallas).where(eq(productoTallas.productoId, id)).orderBy(asc(productoTallas.orden)),
    db.select({ id: productoAtributos.atributoId }).from(productoAtributos).where(eq(productoAtributos.productoId, id)),
    db.select().from(imagenes).where(eq(imagenes.productoId, id)).orderBy(desc(imagenes.principal), asc(imagenes.orden)),
    db
      .select()
      .from(productoColores)
      .where(eq(productoColores.productoId, id))
      .orderBy(asc(productoColores.orden)),
  ]);
  res.json({
    id: fila.productos.id,
    slug: fila.productos.slug,
    nombre: fila.productos.nombre,
    descripcion: fila.productos.descripcion,
    categoria_id: fila.productos.categoriaId,
    tipo: fila.productos.tipo,
    composicion: fila.productos.composicion,
    colores: coloresFilas.map((c) => ({
      valor: c.valor,
      etiqueta: etiquetaValorColor(c.valor),
      orden: c.orden,
    })),
    caracteristica: fila.productos.caracteristica,
    agotado: fila.productos.agotado,
    destacado: fila.productos.destacado,
    visible: fila.productos.visible,
    precio_centimos: fila.productos.precioCentimos,
    tallas: tallas.map((t) => ({ talla: t.talla, disponible: t.disponible })),
    atributos: atrs.map((a) => a.id),
    imagenes: imgs,
  });
});

admin.post('/productos', async (req, res) => {
  const parsed = esquemaProducto.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Revisa los datos del producto.' });
    return;
  }
  const d = parsed.data;
  const slug = await slugUnico(d.nombre);
  const [creado] = await db
    .insert(productos)
    .values({
      slug,
      nombre: d.nombre,
      descripcion: d.descripcion || null,
      categoriaId: d.categoria_id,
      tipo: d.tipo,
      composicion: d.composicion || null,
      caracteristica: d.caracteristica || null,
      precioCentimos: d.precio_centimos ?? null,
      agotado: d.agotado ?? false,
      destacado: d.destacado ?? false,
      visible: d.visible ?? true,
    })
    .returning();
  if (d.tallas?.length) {
    await db
      .insert(productoTallas)
      .values(d.tallas.map((t, i) => ({ productoId: creado.id, talla: t.talla, disponible: t.disponible ?? true, orden: i })));
  }
  if (d.atributos?.length) {
    await db.insert(productoAtributos).values(d.atributos.map((atributoId) => ({ productoId: creado.id, atributoId })));
  }
  await reemplazarColores(creado.id, d.colores);
  res.status(201).json({ id: creado.id, slug: creado.slug });
});

admin.put('/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = esquemaProducto.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Revisa los datos del producto.' });
    return;
  }
  const d = parsed.data;
  const [existente] = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  if (!existente) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  const slug = existente.nombre === d.nombre ? existente.slug : await slugUnico(d.nombre, id);
  const [actualizado] = await db
    .update(productos)
    .set({
      slug,
      nombre: d.nombre,
      descripcion: d.descripcion || null,
      categoriaId: d.categoria_id,
      tipo: d.tipo,
      composicion: d.composicion || null,
      caracteristica: d.caracteristica || null,
      precioCentimos: d.precio_centimos ?? null,
      agotado: d.agotado ?? false,
      destacado: d.destacado ?? false,
      visible: d.visible ?? true,
      actualizadoEn: new Date(),
    })
    .where(eq(productos.id, id))
    .returning();
  await db.delete(productoTallas).where(eq(productoTallas.productoId, id));
  if (d.tallas?.length) {
    await db
      .insert(productoTallas)
      .values(d.tallas.map((t, i) => ({ productoId: id, talla: t.talla, disponible: t.disponible ?? true, orden: i })));
  }
  await db.delete(productoAtributos).where(eq(productoAtributos.productoId, id));
  if (d.atributos?.length) {
    await db.insert(productoAtributos).values(d.atributos.map((atributoId) => ({ productoId: id, atributoId })));
  }
  await reemplazarColores(id, d.colores);
  avisoProductoActualizado({ slug: actualizado.slug });
  res.json({ id: actualizado.id, slug: actualizado.slug });
});

admin.delete('/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [existente] = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  if (!existente) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  const fotos = await db.select({ ruta: imagenes.ruta }).from(imagenes).where(eq(imagenes.productoId, id));
  await db.delete(productos).where(eq(productos.id, id));
  await Promise.all(fotos.map((f) => borrarArchivosImagen(f.ruta)));
  res.status(204).end();
});

admin.delete('/imagenes/:id', exigirPropietaria, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(422).json({ error: 'Imagen no válida.' });
    return;
  }
  const [fila] = await db.delete(imagenes).where(eq(imagenes.id, id)).returning();
  if (!fila) {
    res.status(404).json({ error: 'Imagen no encontrada' });
    return;
  }
  await borrarArchivosImagen(fila.ruta);
  if (fila.productoId) {
    const [p] = await db.select({ slug: productos.slug }).from(productos).where(eq(productos.id, fila.productoId));
    if (p) avisoProductoActualizado({ slug: p.slug });
  }
  res.status(204).end();
});

admin.put('/yo/contrasena', async (req, res) => {
  const actual = typeof req.body?.actual === 'string' ? req.body.actual : '';
  const nueva = typeof req.body?.nueva === 'string' ? req.body.nueva : '';
  if (nueva.length < 8) {
    res.status(422).json({ error: 'La contraseña nueva debe tener al menos 8 caracteres.' });
    return;
  }
  const [user] = await db.select().from(usuarios).where(eq(usuarios.id, req.usuario!.id)).limit(1);
  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  const ok = await argon2.verify(user.passwordHash, actual);
  if (!ok) {
    res.status(401).json({ error: 'La contraseña actual no es correcta.' });
    return;
  }
  const passwordHash = await argon2.hash(nueva);
  await db.update(usuarios).set({ passwordHash, actualizadoEn: new Date() }).where(eq(usuarios.id, user.id));
  res.json({ ok: true });
});

const esquemaUsuarioNuevo = z.object({
  email: z.string().trim().email(),
  nombre: z.string().trim().min(1),
  password: z.string().min(8),
  rol: z.enum(ROLES_USUARIO),
});

const esquemaUsuarioEditado = z.object({
  nombre: z.string().trim().min(1),
  rol: z.enum(ROLES_USUARIO),
  activo: z.boolean(),
  password: z.string().min(8).optional().or(z.literal('')),
});

function usuarioPublico(u: typeof usuarios.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    nombre: u.nombre,
    rol: u.rol,
    activo: u.activo,
    creadoEn: u.creadoEn.toISOString(),
  };
}

admin.get('/usuarios', exigirGestionUsuarios, async (_req, res) => {
  const filas = await db.select().from(usuarios).orderBy(asc(usuarios.nombre));
  res.json(filas.map(usuarioPublico));
});

admin.get('/usuarios/:id', exigirGestionUsuarios, async (req, res) => {
  const [fila] = await db.select().from(usuarios).where(eq(usuarios.id, Number(req.params.id))).limit(1);
  if (!fila) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  res.json(usuarioPublico(fila));
});

admin.post('/usuarios', exigirGestionUsuarios, async (req, res) => {
  const parsed = esquemaUsuarioNuevo.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Revisa los datos del usuario.' });
    return;
  }
  const d = parsed.data;
  const email = d.email.toLowerCase();
  const [existente] = await db.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.email, email)).limit(1);
  if (existente) {
    res.status(409).json({ error: 'Ya existe un usuario con ese correo.' });
    return;
  }
  const passwordHash = await argon2.hash(d.password);
  const [creado] = await db
    .insert(usuarios)
    .values({ email, nombre: d.nombre, rol: d.rol, passwordHash, activo: true })
    .returning();
  res.status(201).json(usuarioPublico(creado));
});

admin.put('/usuarios/:id', exigirGestionUsuarios, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = esquemaUsuarioEditado.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Revisa los datos del usuario.' });
    return;
  }
  const d = parsed.data;
  if (id === req.usuario!.id && (d.rol !== req.usuario!.rol || !d.activo)) {
    res.status(422).json({ error: 'No puedes quitarte tu propio acceso.' });
    return;
  }
  const [existente] = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  if (!existente) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  const passwordHash = d.password ? await argon2.hash(d.password) : existente.passwordHash;
  const [actualizado] = await db
    .update(usuarios)
    .set({ nombre: d.nombre, rol: d.rol, activo: d.activo, passwordHash, actualizadoEn: new Date() })
    .where(eq(usuarios.id, id))
    .returning();
  res.json(usuarioPublico(actualizado));
});

admin.delete('/usuarios/:id', exigirGestionUsuarios, async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.usuario!.id) {
    res.status(422).json({ error: 'No puedes borrar tu propia cuenta.' });
    return;
  }
  const [fila] = await db.delete(usuarios).where(eq(usuarios.id, id)).returning();
  if (!fila) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  res.status(204).end();
});

admin.get('/categorias', async (req, res) => {
  const tipo = req.query.tipo === 'ropa' || req.query.tipo === 'merceria' ? req.query.tipo : undefined;
  const filas = await db.select().from(categorias).orderBy(asc(categorias.orden));
  res.json(tipo ? filas.filter((c) => c.tipo === tipo) : filas);
});

admin.get('/atributos', async (req, res) => {
  const familia = req.query.familia === 'color' ? 'color' : 'tipo_merceria';
  const filas = await db.select().from(atributos).where(eq(atributos.familia, familia)).orderBy(asc(atributos.orden));
  res.json(filas);
});

admin.post(
  '/imagenes',
  exigirPropietaria,
  limiteSubidaFotos,
  manejarSubida,
  async (req, res) => {
    if (!req.file) {
      res.status(422).json({ error: 'Falta el archivo.' });
      return;
    }
    const productoId = Number(req.body?.producto_id);
    if (!Number.isFinite(productoId) || productoId <= 0) {
      res.status(422).json({ error: 'Indica el producto al que pertenece la foto.' });
      return;
    }
    const [producto] = await db.select().from(productos).where(eq(productos.id, productoId)).limit(1);
    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }
    const [{ total }] = await db
      .select({ total: count() })
      .from(imagenes)
      .where(eq(imagenes.productoId, productoId));
    if (Number(total) >= MAX_IMAGENES_POR_PRODUCTO) {
      res.status(422).json({
        error: `Este producto ya tiene el máximo de ${MAX_IMAGENES_POR_PRODUCTO} fotos.`,
      });
      return;
    }

    let procesada: Awaited<ReturnType<typeof procesarImagen>>;
    try {
      procesada = await procesarImagen(req.file, producto.slug);
    } catch (err) {
      const codigo = err && typeof err === 'object' && 'codigo' in err ? String((err as { codigo: string }).codigo) : '';
      const mensaje = err instanceof Error ? err.message : 'No se ha podido procesar la imagen.';
      const status = codigo === 'DEMASIADO_GRANDE' ? 413 : codigo === 'TIPO_INVALIDO' ? 415 : 422;
      res.status(status).json({ error: mensaje });
      return;
    }

    const cuantas = Number(total);
    const quierePrincipal = req.body?.principal === 'true' || cuantas === 0;
    if (quierePrincipal) {
      await db.update(imagenes).set({ principal: false }).where(eq(imagenes.productoId, productoId));
    }
    const alt =
      typeof req.body?.alt === 'string' && req.body.alt.trim()
        ? req.body.alt.trim().slice(0, 120)
        : procesada.alt;

    const [fila] = await db
      .insert(imagenes)
      .values({
        productoId,
        ruta: procesada.ruta,
        alt,
        ancho: procesada.ancho,
        alto: procesada.alto,
        principal: quierePrincipal,
        orden: cuantas,
      })
      .returning();
    avisoProductoActualizado({ slug: producto.slug });
    res.status(201).json({
      id: fila.id,
      productoId: fila.productoId,
      ruta: fila.ruta,
      alt: fila.alt,
      principal: fila.principal,
      orden: fila.orden,
    });
  },
);
admin.patch('/imagenes/:id/principal', exigirPropietaria, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(422).json({ error: 'Imagen no válida.' });
    return;
  }
  const [fila] = await db.select().from(imagenes).where(eq(imagenes.id, id)).limit(1);
  if (!fila || !fila.productoId) {
    res.status(404).json({ error: 'Imagen no encontrada' });
    return;
  }
  await db.update(imagenes).set({ principal: false }).where(eq(imagenes.productoId, fila.productoId));
  await db.update(imagenes).set({ principal: true }).where(eq(imagenes.id, id));
  const [p] = await db.select({ slug: productos.slug }).from(productos).where(eq(productos.id, fila.productoId));
  if (p) avisoProductoActualizado({ slug: p.slug });
  res.json({ ok: true });
});

admin.get('/ajustes', async (_req, res) => {
  const filas = await db.select().from(ajustes);
  res.json(Object.fromEntries(filas.map((f) => [f.clave, f.valor])));
});

admin.put('/ajustes', async (req, res) => {
  const cuerpo = req.body as Record<string, string>;
  for (const [clave, valor] of Object.entries(cuerpo)) {
    if (typeof valor !== 'string') continue;
    await db
      .insert(ajustes)
      .values({ clave, valor, actualizadoEn: new Date() })
      .onConflictDoUpdate({
        target: ajustes.clave,
        set: { valor, actualizadoEn: new Date() },
      });
  }
  res.json({ ok: true });
});

admin.get('/horario', async (_req, res) => {
  const filas = await db.select().from(horario).orderBy(asc(horario.dia));
  res.json(filas);
});

admin.put('/horario', async (req, res) => {
  const dias = Array.isArray(req.body) ? req.body : [];
  for (const d of dias) {
    await db
      .update(horario)
      .set({
        cerrado: Boolean(d.cerrado),
        mananaAbre: d.manana_abre ?? null,
        mananaCierra: d.manana_cierra ?? null,
        tardeAbre: d.tarde_abre ?? null,
        tardeCierra: d.tarde_cierra ?? null,
        actualizadoEn: new Date(),
      })
      .where(eq(horario.dia, Number(d.dia)));
  }
  res.json({ ok: true });
});

admin.get('/paginas', async (_req, res) => {
  res.json(await db.select().from(paginas));
});

admin.put('/paginas/:slug', async (req, res) => {
  const [fila] = await db
    .update(paginas)
    .set({
      titulo: String(req.body.titulo ?? ''),
      contenido: String(req.body.contenido ?? ''),
      actualizadoEn: new Date(),
    })
    .where(eq(paginas.slug, req.params.slug))
    .returning();
  if (!fila) {
    res.status(404).json({ error: 'Página no encontrada' });
    return;
  }
  res.json(fila);
});

admin.get('/preguntas', async (_req, res) => {
  res.json(await db.select().from(preguntas).orderBy(asc(preguntas.grupo), asc(preguntas.orden)));
});

admin.get('/servicios', async (_req, res) => {
  res.json(await db.select().from(servicios).orderBy(asc(servicios.orden)));
});
