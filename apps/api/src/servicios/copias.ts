import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { config } from '../config.js';
import { registro } from '../registro.js';

function fechaStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function copiaSeguridad(): Promise<string> {
  await fs.mkdir(config.rutaCopias, { recursive: true });
  const destino = path.join(config.rutaCopias, `anamari-${fechaStamp()}.sql`);
  const url = new URL(config.databaseUrl);
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(
      'pg_dump',
      [
        '-h',
        url.hostname,
        '-p',
        url.port || '5432',
        '-U',
        decodeURIComponent(url.username),
        '-d',
        url.pathname.replace('/', ''),
        '-f',
        destino,
      ],
      {
        env: { ...process.env, PGPASSWORD: decodeURIComponent(url.password) },
      },
    );
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pg_dump salió con código ${code}`));
    });
  });
  await podar(30);
  registro.info({ destino }, 'Copia de seguridad hecha');
  return destino;
}

async function podar(dias: number): Promise<void> {
  const limite = Date.now() - dias * 24 * 60 * 60 * 1000;
  let ficheros: string[] = [];
  try {
    ficheros = await fs.readdir(config.rutaCopias);
  } catch {
    return;
  }
  for (const f of ficheros) {
    const full = path.join(config.rutaCopias, f);
    const st = await fs.stat(full);
    if (st.mtimeMs < limite) await fs.unlink(full);
  }
}
