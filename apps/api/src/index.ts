import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';
import { config, esProduccion } from './config.js';
import { registro } from './registro.js';
import { migrar } from './db/migrar.js';
import { sembrar } from './db/semilla.js';
import { publicas, existePagina, existeProductoVisible } from './rutas/publicas.js';
import { contacto } from './rutas/contacto.js';
import { auth } from './rutas/auth.js';
import { admin } from './rutas/admin.js';
import { errores } from './middleware/errores.js';
import { montarSockets } from './servicios/sockets.js';
import { reintentarPendientes } from './servicios/correo.js';
import { copiaSeguridad } from './servicios/copias.js';

const RUTAS_ESTATICAS = new Set([
  '/',
  '/arreglos',
  '/nosotros',
  '/contacto',
  '/preguntas-frecuentes',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
  '/catalogo',
  '/catalogo/merceria',
]);

async function esperarBase(intentos = 20): Promise<void> {
  const { sql } = await import('./db/cliente.js');
  for (let i = 0; i < intentos; i++) {
    try {
      await sql`SELECT 1`;
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('No se pudo conectar a PostgreSQL');
}

async function arrancar() {
  await esperarBase();
  await migrar();
  await sembrar(false);

  const app = express();
  app.set('trust proxy', 1);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: esProduccion ? config.origenPublico : true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use('/subidas', express.static(config.rutaSubidas, { maxAge: '7d' }));

  app.get('/sitemap.xml', async (_req, res) => {
    const { sql: pg } = await import('./db/cliente.js');
    const slugs = await pg<{ slug: string }[]>`SELECT slug FROM productos WHERE visible = true`;
    const estaticas = [
      '/',
      '/arreglos',
      '/nosotros',
      '/contacto',
      '/preguntas-frecuentes',
      '/catalogo',
      '/catalogo/merceria',
      '/aviso-legal',
      '/privacidad',
      '/cookies',
    ];
    const urls = [
      ...estaticas.map((p) => `${config.origenPublico}${p}`),
      ...slugs.map((s) => `${config.origenPublico}/producto/${s.slug}`),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
    res.type('application/xml').send(xml);
  });

  app.use('/api', publicas);
  app.use('/api', contacto);
  app.use('/api/admin', auth);
  app.use('/api/admin', admin);

  app.use(errores);

  if (config.servirEstaticos) {
    const publico = config.rutaPublico;
    app.use(express.static(publico, { index: false, maxAge: '1h' }));
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/subidas')) {
        next();
        return;
      }
      const index = path.join(publico, 'index.html');
      if (!fs.existsSync(index)) {
        res.status(500).send('Falta el front compilado');
        return;
      }
      const codigo = (await esRutaConocida(req.path)) ? 200 : 404;
      res.status(codigo).sendFile(index);
    });
  }

  const server = http.createServer(app);
  montarSockets(server);

  cron.schedule('15 3 * * *', () => {
    reintentarPendientes().catch((err) => registro.error({ err }, 'Reintento de correo'));
    copiaSeguridad().catch((err) => registro.error({ err }, 'Copia de seguridad'));
  });

  server.listen(config.puerto, () => {
    registro.info({ puerto: config.puerto }, 'API en marcha');
  });
}

async function esRutaConocida(pathname: string): Promise<boolean> {
  const limpia = pathname.replace(/\/$/, '') || '/';
  if (RUTAS_ESTATICAS.has(limpia)) return true;
  if (limpia.startsWith('/catalogo/')) return true;
  if (limpia.startsWith('/producto/')) {
    const slug = limpia.slice('/producto/'.length);
    return slug.length > 0 && (await existeProductoVisible(slug));
  }
  if (['/aviso-legal', '/privacidad', '/cookies'].includes(limpia)) {
    return existePagina(limpia.slice(1));
  }
  return false;
}

arrancar().catch((err) => {
  registro.error({ err }, 'No se pudo arrancar');
  process.exit(1);
});
