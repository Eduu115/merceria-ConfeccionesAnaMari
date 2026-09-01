import { Router } from 'express';
import argon2 from 'argon2';
import { asc, desc, eq } from 'drizzle-orm';
import multer from 'multer';
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
  productoTallas,
  productos,
  servicios,
  usuarios,
} from '../db/esquema.js';
import { exigirSesion } from '../middleware/auth.js';
import { procesarImagen } from '../servicios/imagenes.js';
import { avisoProductoActualizado } from '../servicios/sockets.js';

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

const esquemaProducto = z.object({
  nombre: z.string().trim().min(1),
  tipo: z.enum(['ropa', 'merceria']),
  categoria_id: z.number().int(),
  descripcion: z.string().trim().optional().nullable(),
  composicion: z.string().trim().optional().nullable(),
  colores: z.string().trim().optional().nullable(),
  caracteristica: z.string().trim().optional().nullable(),
  precio_centimos: z.number().int().min(0).optional().nullable(),
  agotado: z.boolean().optional(),
  destacado: z.boolean().optional(),
  visible: z.boolean().optional(),
  tallas: z.array(z.object({ talla: z.string().trim().min(1), disponible: z.boolean().optional() })).optional(),
  atributos: z.array(z.number().int()).optional(),
});

export const admin = Router();
admin.use(exigirSesion);

const subida = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(null, ok);
  },
});

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
  const filas = await db
    .select()
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .orderBy(desc(productos.creadoEn));
  const lista = filas
    .filter((f) => (tipo === 'ropa' || tipo === 'merceria' ? f.productos.tipo === tipo : true))
    .map((f) => ({
      id: f.productos.id,
      slug: f.productos.slug,
      nombre: f.productos.nombre,
      tipo: f.productos.tipo,
      categoria: f.categorias.nombre,
      visible: f.productos.visible,
      agotado: f.productos.agotado,
      destacado: f.productos.destacado,
      precio_centimos: f.productos.precioCentimos,
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
  const [tallas, atrs, imgs] = await Promise.all([
    db.select().from(productoTallas).where(eq(productoTallas.productoId, id)).orderBy(asc(productoTallas.orden)),
    db.select({ id: productoAtributos.atributoId }).from(productoAtributos).where(eq(productoAtributos.productoId, id)),
    db.select().from(imagenes).where(eq(imagenes.productoId, id)).orderBy(desc(imagenes.principal), asc(imagenes.orden)),
  ]);
  res.json({
    id: fila.productos.id,
    slug: fila.productos.slug,
    nombre: fila.productos.nombre,
    descripcion: fila.productos.descripcion,
    categoria_id: fila.productos.categoriaId,
    tipo: fila.productos.tipo,
    composicion: fila.productos.composicion,
    colores: fila.productos.colores,
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
      colores: d.colores || null,
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
      colores: d.colores || null,
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
  await db.delete(productos).where(eq(productos.id, id));
  res.status(204).end();
});

admin.delete('/imagenes/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [fila] = await db.delete(imagenes).where(eq(imagenes.id, id)).returning();
  if (!fila) {
    res.status(404).json({ error: 'Imagen no encontrada' });
    return;
  }
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

admin.post('/imagenes', subida.single('archivo'), async (req, res) => {
  if (!req.file) {
    res.status(422).json({ error: 'Falta el archivo.' });
    return;
  }
  const productoId = req.body.producto_id ? Number(req.body.producto_id) : null;
  const procesada = await procesarImagen(req.file, 'img');
  const [fila] = await db
    .insert(imagenes)
    .values({
      productoId,
      ruta: procesada.ruta,
      alt: typeof req.body.alt === 'string' && req.body.alt ? req.body.alt : procesada.alt,
      ancho: procesada.ancho,
      alto: procesada.alto,
      principal: req.body.principal === 'true',
    })
    .returning();
  if (productoId) {
    const [p] = await db.select({ slug: productos.slug }).from(productos).where(eq(productos.id, productoId));
    if (p) avisoProductoActualizado({ slug: p.slug });
  }
  res.status(201).json(fila);
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
