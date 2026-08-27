import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { config } from '../config.js';
import { registro } from '../registro.js';
import { db, sql } from './cliente.js';
import {
  ajustes,
  atributos,
  categorias,
  horario,
  paginas,
  preguntas,
  productoAtributos,
  productoTallas,
  productos,
  servicios,
  usuarios,
} from './esquema.js';
import {
  CATEGORIAS,
  COLORES,
  HORARIO,
  MERCERIA,
  PAGINAS,
  PREGUNTAS,
  ROPA,
  SERVICIOS,
  TIPOS_MERCERIA,
  ajustesIniciales,
  tallasDe,
} from './semilla-datos.js';

export async function sembrar(forzar = false): Promise<void> {
  const existentes = await db.select({ id: categorias.id }).from(categorias).limit(1);
  if (existentes.length > 0 && !forzar) {
    await asegurarPropietario();
    registro.info('La base ya tiene datos; solo se comprueba el usuario inicial');
    return;
  }

  if (forzar) {
    await sql`TRUNCATE producto_atributos, producto_tallas, productos, atributos, categorias, servicios, preguntas, horario, ajustes, paginas, imagenes RESTART IDENTITY CASCADE`;
  }

  await asegurarPropietario();

  const cats = await db.insert(categorias).values(CATEGORIAS).returning();
  const porSlug = Object.fromEntries(cats.map((c) => [c.slug, c]));

  const tiposIns = await db
    .insert(atributos)
    .values(TIPOS_MERCERIA.map((t) => ({ ...t, familia: 'tipo_merceria' as const })))
    .returning();
  const coloresIns = await db
    .insert(atributos)
    .values(COLORES.map((c) => ({ ...c, familia: 'color' as const })))
    .returning();
  const tipoPorSlug = Object.fromEntries(tiposIns.map((t) => [t.slug, t]));
  const colorPorSlug = Object.fromEntries(coloresIns.map((c) => [c.slug, c]));

  for (const prenda of ROPA) {
    const cat = porSlug[prenda.categoria];
    if (!cat) continue;
    const [fila] = await db
      .insert(productos)
      .values({
        slug: prenda.slug,
        nombre: prenda.nombre,
        descripcion: prenda.descripcion,
        categoriaId: cat.id,
        tipo: 'ropa',
        composicion: prenda.composicion,
        colores: prenda.colores,
        agotado: prenda.agotado ?? false,
        destacado: prenda.destacado ?? false,
        visible: true,
      })
      .returning();
    await db.insert(productoTallas).values(
      tallasDe(prenda).map((t) => ({
        productoId: fila.id,
        talla: t.talla,
        disponible: t.disponible,
        orden: t.orden,
      })),
    );
  }

  for (const art of MERCERIA) {
    const cat = porSlug['merceria-y-costura'];
    if (!cat) continue;
    const [fila] = await db
      .insert(productos)
      .values({
        slug: art.slug,
        nombre: art.nombre,
        descripcion: art.descripcion,
        categoriaId: cat.id,
        tipo: 'merceria',
        composicion: art.composicion ?? null,
        colores: art.colores,
        caracteristica: art.caracteristica,
        agotado: art.agotado ?? false,
        destacado: art.destacado ?? false,
        visible: true,
      })
      .returning();
    const tipo = tipoPorSlug[art.tipo];
    const color = colorPorSlug[art.color];
    const attrs = [tipo, color].filter(Boolean);
    if (attrs.length) {
      await db.insert(productoAtributos).values(
        attrs.map((a) => ({ productoId: fila.id, atributoId: a!.id })),
      );
    }
  }

  await db.insert(servicios).values(SERVICIOS);
  await db.insert(preguntas).values(PREGUNTAS);
  await db.insert(horario).values(
    HORARIO.map((h) => ({
      dia: h.dia,
      cerrado: h.cerrado,
      mananaAbre: h.manana_abre,
      mananaCierra: h.manana_cierra,
      tardeAbre: h.tarde_abre,
      tardeCierra: h.tarde_cierra,
    })),
  );
  await db.insert(ajustes).values(
    Object.entries(
      ajustesIniciales({
        whatsapp: config.whatsappTelefono,
        mapa: config.mapaEmbedUrl,
        email: config.correoDestino,
      }),
    ).map(([clave, valor]) => ({ clave, valor })),
  );
  await db.insert(paginas).values(PAGINAS);
  registro.info('Semilla aplicada');
}

async function asegurarPropietario(): Promise<void> {
  const email = config.adminEmail.trim().toLowerCase();
  const hash = await argon2.hash(config.adminPassword, { type: argon2.argon2id });
  const existente = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);
  if (existente[0]) {
    await db
      .update(usuarios)
      .set({
        nombre: config.adminNombre,
        rol: 'propietario',
        activo: true,
        actualizadoEn: new Date(),
      })
      .where(eq(usuarios.email, email));
    return;
  }
  await db.insert(usuarios).values({
    email,
    passwordHash: hash,
    nombre: config.adminNombre,
    rol: 'propietario',
    activo: true,
  });
  registro.info({ email }, 'Usuario propietario creado');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const forzar = process.argv.includes('--forzar');
  sembrar(forzar)
    .then(async () => {
      await sql.end();
    })
    .catch(async (err) => {
      registro.error(err, 'Fallo en la semilla');
      await sql.end();
      process.exit(1);
    });
}
