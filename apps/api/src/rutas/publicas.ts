import { Router } from 'express';
import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNull,
  sql as dsql,
} from 'drizzle-orm';
import {
  esquemaConsultaProductos,
  type AtributoPublico,
  type CategoriaPublica,
  type DiaHorario,
  type ImagenPublica,
  type ProductoFicha,
  type ProductoTarjeta,
  type TallaPublica,
} from '@anamari/compartido';
import { db } from '../db/cliente.js';
import {
  ajustes,
  atributos,
  categorias,
  horario,
  imagenes,
  paginas,
  preguntas,
  productoAtributos,
  productoTallas,
  productos,
  servicios,
} from '../db/esquema.js';
import { horarioPublico } from '../lib/horario.js';
import { imagenPublica, mapearAjustes, tarjetaProducto } from '../serializadores/publico.js';

export const publicas = Router();

function cacheCorta(res: import('express').Response) {
  res.setHeader('Cache-Control', 'public, max-age=300');
}

publicas.get('/salud', (_req, res) => {
  res.json({ ok: true });
});

publicas.get('/ajustes', async (_req, res) => {
  cacheCorta(res);
  const filas = await db.select().from(ajustes);
  res.json(mapearAjustes(filas));
});

publicas.get('/horario', async (_req, res) => {
  cacheCorta(res);
  const dias = await cargarHorario();
  res.json(horarioPublico(dias));
});

publicas.get('/categorias', async (req, res) => {
  cacheCorta(res);
  const tipo = req.query.tipo === 'merceria' || req.query.tipo === 'ropa' ? req.query.tipo : undefined;
  const filas = await db
    .select()
    .from(categorias)
    .where(
      tipo
        ? and(eq(categorias.visible, true), eq(categorias.tipo, tipo))
        : eq(categorias.visible, true),
    )
    .orderBy(asc(categorias.orden));
  const porId = new Map(filas.map((f) => [f.id, f.slug]));
  const padres = filas.filter((f) => !f.padreId).sort((a, b) => a.orden - b.orden);
  const hijosPorPadre = new Map<number, typeof filas>();
  for (const f of filas) {
    if (!f.padreId) continue;
    const lista = hijosPorPadre.get(f.padreId) ?? [];
    lista.push(f);
    hijosPorPadre.set(f.padreId, lista);
  }
  const ordenadas = padres.flatMap((p) => [p, ...(hijosPorPadre.get(p.id) ?? []).sort((a, b) => a.orden - b.orden)]);
  res.json(ordenadas.map((f) => catPublica(f, f.padreId ? (porId.get(f.padreId) ?? null) : null)));
});

publicas.get('/servicios', async (_req, res) => {
  cacheCorta(res);
  const filas = await db
    .select()
    .from(servicios)
    .where(eq(servicios.visible, true))
    .orderBy(asc(servicios.orden));
  res.json(
    filas.map((s) => ({
      slug: s.slug,
      nombre: s.nombre,
      incluye: s.incluye,
      orden: s.orden,
    })),
  );
});

publicas.get('/preguntas', async (_req, res) => {
  cacheCorta(res);
  const filas = await db
    .select()
    .from(preguntas)
    .where(eq(preguntas.visible, true))
    .orderBy(asc(preguntas.grupo), asc(preguntas.orden));
  res.json(
    filas.map((p) => ({
      grupo: p.grupo,
      pregunta: p.pregunta,
      respuesta: p.respuesta,
      orden: p.orden,
    })),
  );
});

publicas.get('/paginas/:slug', async (req, res) => {
  cacheCorta(res);
  const [fila] = await db.select().from(paginas).where(eq(paginas.slug, req.params.slug)).limit(1);
  if (!fila) {
    res.status(404).json({ error: 'Página no encontrada' });
    return;
  }
  res.json({
    slug: fila.slug,
    titulo: fila.titulo,
    contenido: fila.contenido,
    actualizado_en: fila.actualizadoEn.toISOString(),
  });
});

publicas.get('/inicio', async (_req, res) => {
  cacheCorta(res);
  const [filasAjustes, cats, serv, dias, dest] = await Promise.all([
    db.select().from(ajustes),
    db
      .select()
      .from(categorias)
      .where(and(eq(categorias.visible, true), isNull(categorias.padreId)))
      .orderBy(asc(categorias.orden)),
    db
      .select()
      .from(servicios)
      .where(eq(servicios.visible, true))
      .orderBy(asc(servicios.orden)),
    cargarHorario(),
    db
      .select()
      .from(productos)
      .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
      .where(and(eq(productos.visible, true), eq(productos.destacado, true)))
      .orderBy(asc(productos.orden), desc(productos.creadoEn))
      .limit(8),
  ]);

  const ids = dest.map((d) => d.productos.id);
  const extras = await cargarExtras(ids);

  res.json({
    ajustes: mapearAjustes(filasAjustes),
    categorias: cats.map((c) => catPublica(c)),
    servicios: serv.map((s) => ({
      slug: s.slug,
      nombre: s.nombre,
      incluye: s.incluye,
      orden: s.orden,
    })),
    horario: horarioPublico(dias),
    destacados: dest.map((d) =>
      tarjetaProducto({
        slug: d.productos.slug,
        nombre: d.productos.nombre,
        tipo: d.productos.tipo,
        agotado: d.productos.agotado,
        caracteristica: d.productos.caracteristica,
        categoriaSlug: d.categorias.slug,
        categoriaNombre: d.categorias.nombre,
        tallas: extras.tallas.get(d.productos.id) ?? [],
        imagen: extras.imagenes.get(d.productos.id) ?? null,
      }),
    ),
  });
});

publicas.get('/productos', async (req, res) => {
  const parsed = esquemaConsultaProductos.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ error: 'Parámetros no válidos', detalles: parsed.error.flatten() });
    return;
  }
  const q = parsed.data;
  cacheCorta(res);

  const filtros = [eq(productos.visible, true), eq(productos.tipo, q.tipo)];

  if (q.categoria) {
    const [cat] = await db
      .select({ id: categorias.id })
      .from(categorias)
      .where(eq(categorias.slug, q.categoria))
      .limit(1);
    if (!cat) {
      res.json({ productos: [], total: 0, pagina: q.pagina, paginas: 0, por_pagina: q.por_pagina });
      return;
    }
    const hijas = await db
      .select({ id: categorias.id })
      .from(categorias)
      .where(eq(categorias.padreId, cat.id));
    filtros.push(inArray(productos.categoriaId, [cat.id, ...hijas.map((h) => h.id)]));
  }

  let idsPorAtributo: number[] | null = null;
  const slugsTipo = q.tipo_merceria?.split(',').filter(Boolean) ?? [];
  if (slugsTipo.length) {
    idsPorAtributo = await productosConAtributos('tipo_merceria', slugsTipo);
  }
  if (q.color) {
    const idsColor = await productosConAtributos('color', [q.color]);
    idsPorAtributo = idsPorAtributo
      ? idsPorAtributo.filter((id) => idsColor.includes(id))
      : idsColor;
  }
  if (idsPorAtributo) {
    if (idsPorAtributo.length === 0) {
      res.json({ productos: [], total: 0, pagina: q.pagina, paginas: 0, por_pagina: q.por_pagina });
      return;
    }
    filtros.push(inArray(productos.id, idsPorAtributo));
  }

  const where = and(...filtros);
  const [{ total }] = await db
    .select({ total: count() })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(where);

  const orden =
    q.orden === 'az'
      ? [asc(productos.nombre)]
      : q.orden === 'za'
        ? [desc(productos.nombre)]
        : [desc(productos.creadoEn), asc(productos.orden)];

  const offset = (q.pagina - 1) * q.por_pagina;
  const filas = await db
    .select()
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(where)
    .orderBy(...orden)
    .limit(q.por_pagina)
    .offset(offset);

  const extras = await cargarExtras(filas.map((f) => f.productos.id));
  const lista: ProductoTarjeta[] = filas.map((f) =>
    tarjetaProducto({
      slug: f.productos.slug,
      nombre: f.productos.nombre,
      tipo: f.productos.tipo,
      agotado: f.productos.agotado,
      caracteristica: f.productos.caracteristica,
      categoriaSlug: f.categorias.slug,
      categoriaNombre: f.categorias.nombre,
      tallas: extras.tallas.get(f.productos.id) ?? [],
      imagen: extras.imagenes.get(f.productos.id) ?? null,
    }),
  );

  const paginasTotal = total === 0 ? 0 : Math.ceil(total / q.por_pagina);
  res.json({
    productos: lista,
    total,
    pagina: q.pagina,
    paginas: paginasTotal,
    por_pagina: q.por_pagina,
  });
});

publicas.get('/productos/:slug', async (req, res) => {
  cacheCorta(res);
  const filas = await db
    .select()
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(and(eq(productos.slug, req.params.slug), eq(productos.visible, true)))
    .limit(1);
  const fila = filas[0];
  if (!fila) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  const extras = await cargarExtras([fila.productos.id], true);
  const attrs = extras.atributos.get(fila.productos.id) ?? [];
  const imgs = extras.todasImagenes.get(fila.productos.id) ?? [];

  const relacionadosFilas = await db
    .select()
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(
      and(
        eq(productos.visible, true),
        eq(productos.categoriaId, fila.productos.categoriaId),
        dsql`${productos.id} <> ${fila.productos.id}`,
      ),
    )
    .orderBy(asc(productos.orden), desc(productos.creadoEn))
    .limit(4);
  const relExtras = await cargarExtras(relacionadosFilas.map((r) => r.productos.id));

  const ficha: ProductoFicha = {
    ...tarjetaProducto({
      slug: fila.productos.slug,
      nombre: fila.productos.nombre,
      tipo: fila.productos.tipo,
      agotado: fila.productos.agotado,
      caracteristica: fila.productos.caracteristica,
      categoriaSlug: fila.categorias.slug,
      categoriaNombre: fila.categorias.nombre,
      tallas: extras.tallas.get(fila.productos.id) ?? [],
      imagen: extras.imagenes.get(fila.productos.id) ?? null,
    }),
    descripcion: fila.productos.descripcion,
    composicion: fila.productos.composicion,
    colores: fila.productos.colores,
    atributos: attrs,
    imagenes: imgs,
    relacionados: relacionadosFilas.map((r) =>
      tarjetaProducto({
        slug: r.productos.slug,
        nombre: r.productos.nombre,
        tipo: r.productos.tipo,
        agotado: r.productos.agotado,
        caracteristica: r.productos.caracteristica,
        categoriaSlug: r.categorias.slug,
        categoriaNombre: r.categorias.nombre,
        tallas: relExtras.tallas.get(r.productos.id) ?? [],
        imagen: relExtras.imagenes.get(r.productos.id) ?? null,
      }),
    ),
  };

  res.json(ficha);
});

publicas.get('/atributos', async (req, res) => {
  cacheCorta(res);
  const familia = req.query.familia === 'color' ? 'color' : 'tipo_merceria';
  const filas = await db
    .select()
    .from(atributos)
    .where(eq(atributos.familia, familia))
    .orderBy(asc(atributos.orden));
  res.json(
    filas.map((a) => ({
      familia: a.familia,
      slug: a.slug,
      nombre: a.nombre,
      hex: a.hex,
    })),
  );
});

async function productosConAtributos(
  familia: 'tipo_merceria' | 'color',
  slugs: string[],
): Promise<number[]> {
  const filas = await db
    .select({ productoId: productoAtributos.productoId })
    .from(productoAtributos)
    .innerJoin(atributos, eq(productoAtributos.atributoId, atributos.id))
    .where(and(eq(atributos.familia, familia), inArray(atributos.slug, slugs)));
  return [...new Set(filas.map((f) => f.productoId))];
}

async function cargarHorario(): Promise<DiaHorario[]> {
  const filas = await db.select().from(horario).orderBy(asc(horario.dia));
  return filas.map((h) => ({
    dia: h.dia,
    cerrado: h.cerrado,
    manana_abre: h.mananaAbre,
    manana_cierra: h.mananaCierra,
    tarde_abre: h.tardeAbre,
    tarde_cierra: h.tardeCierra,
  }));
}

function catPublica(c: typeof categorias.$inferSelect, padreSlug: string | null = null): CategoriaPublica {
  return {
    slug: c.slug,
    nombre: c.nombre,
    descripcion: c.descripcion,
    tipo: c.tipo,
    orden: c.orden,
    padreSlug,
  };
}

async function cargarExtras(ids: number[], conTodo = false) {
  const tallas = new Map<number, TallaPublica[]>();
  const imagenPrincipal = new Map<number, ImagenPublica>();
  const todasImagenes = new Map<number, ImagenPublica[]>();
  const attrs = new Map<number, AtributoPublico[]>();
  if (ids.length === 0) {
    return { tallas, imagenes: imagenPrincipal, todasImagenes, atributos: attrs };
  }

  const tFilas = await db
    .select()
    .from(productoTallas)
    .where(inArray(productoTallas.productoId, ids))
    .orderBy(asc(productoTallas.orden));
  for (const t of tFilas) {
    const lista = tallas.get(t.productoId) ?? [];
    lista.push({ talla: t.talla, disponible: t.disponible });
    tallas.set(t.productoId, lista);
  }

  const iFilas = await db
    .select()
    .from(imagenes)
    .where(inArray(imagenes.productoId, ids))
    .orderBy(asc(imagenes.orden));
  for (const img of iFilas) {
    if (!img.productoId) continue;
    const pub = imagenPublica(img);
    const lista = todasImagenes.get(img.productoId) ?? [];
    lista.push(pub);
    todasImagenes.set(img.productoId, lista);
    if (img.principal && !imagenPrincipal.has(img.productoId)) {
      imagenPrincipal.set(img.productoId, pub);
    }
  }
  for (const [id, lista] of todasImagenes) {
    if (!imagenPrincipal.has(id) && lista[0]) imagenPrincipal.set(id, lista[0]);
  }

  if (conTodo) {
    const aFilas = await db
      .select({
        productoId: productoAtributos.productoId,
        familia: atributos.familia,
        slug: atributos.slug,
        nombre: atributos.nombre,
        hex: atributos.hex,
      })
      .from(productoAtributos)
      .innerJoin(atributos, eq(productoAtributos.atributoId, atributos.id))
      .where(inArray(productoAtributos.productoId, ids));
    for (const a of aFilas) {
      const lista = attrs.get(a.productoId) ?? [];
      lista.push({ familia: a.familia, slug: a.slug, nombre: a.nombre, hex: a.hex });
      attrs.set(a.productoId, lista);
    }
  }

  return { tallas, imagenes: imagenPrincipal, todasImagenes, atributos: attrs };
}

export async function existeProductoVisible(slug: string): Promise<boolean> {
  const [fila] = await db
    .select({ id: productos.id })
    .from(productos)
    .where(and(eq(productos.slug, slug), eq(productos.visible, true)))
    .limit(1);
  return Boolean(fila);
}

export async function existePagina(slug: string): Promise<boolean> {
  const [fila] = await db.select({ slug: paginas.slug }).from(paginas).where(eq(paginas.slug, slug)).limit(1);
  return Boolean(fila);
}
