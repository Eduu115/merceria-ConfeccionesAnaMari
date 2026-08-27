import { Router } from 'express';
import { asc, desc, eq } from 'drizzle-orm';
import multer from 'multer';
import { db } from '../db/cliente.js';
import {
  ajustes,
  categorias,
  horario,
  imagenes,
  mensajes,
  paginas,
  preguntas,
  productos,
  servicios,
} from '../db/esquema.js';
import { exigirSesion } from '../middleware/auth.js';
import { procesarImagen } from '../servicios/imagenes.js';
import { avisoProductoActualizado } from '../servicios/sockets.js';

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
      categoria: f.categorias.slug,
      visible: f.productos.visible,
      agotado: f.productos.agotado,
      destacado: f.productos.destacado,
      precio_centimos: f.productos.precioCentimos,
    }));
  res.json(lista);
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
