import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { config } from '../config.js';

const ANCHOS = [400, 800, 1200] as const;

export async function procesarImagen(archivo: Express.Multer.File, slugBase: string) {
  await fs.mkdir(config.rutaSubidas, { recursive: true });
  const id = `${slugBase}-${Date.now()}`;
  const buffer = await sharp(archivo.buffer)
    .rotate()
    .resize(1200, 1600, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toBuffer();

  const meta = await sharp(buffer).metadata();
  const rutas: string[] = [];

  for (const ancho of ANCHOS) {
    const alto = Math.round((ancho * 4) / 3);
    const nombre = `${id}-${ancho}.webp`;
    const destino = path.join(config.rutaSubidas, nombre);
    await sharp(buffer).resize(ancho, alto, { fit: 'cover' }).webp({ quality: 82 }).toFile(destino);
    rutas.push(`/subidas/${nombre}`);
  }

  return {
    ruta: rutas[1] ?? rutas[0]!,
    alt: archivo.originalname,
    ancho: meta.width ?? 800,
    alto: meta.height ?? 1067,
  };
}
