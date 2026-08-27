import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from './cliente.js';
import { registro } from '../registro.js';

const carpeta = path.dirname(fileURLToPath(import.meta.url));
const dirMigraciones = path.join(carpeta, 'migraciones');

export async function migrar(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS esquema_migraciones (
      id TEXT PRIMARY KEY,
      aplicada_en TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  const aplicadas = await sql<{ id: string }[]>`
    SELECT id FROM esquema_migraciones ORDER BY id
  `;
  const hechas = new Set(aplicadas.map((f) => f.id));

  const ficheros = fs
    .readdirSync(dirMigraciones)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const fichero of ficheros) {
    if (hechas.has(fichero)) continue;
    const texto = fs.readFileSync(path.join(dirMigraciones, fichero), 'utf8');
    registro.info({ fichero }, 'Aplicando migración');
    await sql.begin(async (tx) => {
      await tx.unsafe(texto);
      await tx`INSERT INTO esquema_migraciones (id) VALUES (${fichero})`;
    });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrar()
    .then(async () => {
      registro.info('Migraciones al día');
      await sql.end();
    })
    .catch(async (err) => {
      registro.error(err, 'Fallo al migrar');
      await sql.end();
      process.exit(1);
    });
}
