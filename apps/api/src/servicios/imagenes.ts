import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { config } from '../config.js';

const ANCHOS = [400, 800, 1200] as const;
export const MAX_BYTES_IMAGEN = 5 * 1024 * 1024;
export const MAX_IMAGENES_POR_PRODUCTO = 8;
const MIME_PERMITIDOS = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type TipoImagen = 'jpeg' | 'png' | 'webp';

export function detectarTipoImagen(buf: Buffer): TipoImagen | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

export function mimeDeclaradoValido(mime: string): boolean {
  return MIME_PERMITIDOS.has(mime);
}

function sanitizarBase(slugBase: string): string {
  const limpio = slugBase
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return limpio || 'img';
}

function truncarAlt(texto: string): string {
  return texto.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120) || 'Foto del producto';
}

/** Variantes en disco a partir de la ruta pública guardada en BD (`/subidas/id-800.webp`). */
export function rutasVariantesDesdePublica(rutaPublica: string): string[] {
  const nombre = path.basename(rutaPublica);
  const base = nombre.replace(/-\d+\.webp$/i, '');
  if (!base || base.includes('..') || base.includes('/') || base.includes('\\')) return [];
  return ANCHOS.map((ancho) => path.join(config.rutaSubidas, `${base}-${ancho}.webp`));
}

export async function borrarArchivosImagen(rutaPublica: string): Promise<void> {
  for (const fichero of rutasVariantesDesdePublica(rutaPublica)) {
    try {
      await fs.unlink(fichero);
    } catch {
      /* ya no existe */
    }
  }
}

export async function procesarImagen(archivo: Express.Multer.File, slugBase: string) {
  if (!archivo.buffer?.length) {
    throw Object.assign(new Error('Archivo vacío.'), { codigo: 'ARCHIVO_VACIO' });
  }
  if (archivo.size > MAX_BYTES_IMAGEN || archivo.buffer.length > MAX_BYTES_IMAGEN) {
    throw Object.assign(new Error('La imagen supera el tamaño máximo (5 MB).'), { codigo: 'DEMASIADO_GRANDE' });
  }
  if (!mimeDeclaradoValido(archivo.mimetype)) {
    throw Object.assign(new Error('Formato no permitido. Usa JPG, PNG o WebP.'), { codigo: 'TIPO_INVALIDO' });
  }
  const tipoReal = detectarTipoImagen(archivo.buffer);
  if (!tipoReal) {
    throw Object.assign(new Error('El archivo no es una imagen válida.'), { codigo: 'TIPO_INVALIDO' });
  }

  await fs.mkdir(config.rutaSubidas, { recursive: true });
  const id = `${sanitizarBase(slugBase)}-${Date.now()}`;

  let buffer: Buffer;
  try {
    buffer = await sharp(archivo.buffer, { failOn: 'error' })
      .rotate()
      .resize(1200, 1600, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw Object.assign(new Error('No se ha podido procesar la imagen.'), { codigo: 'PROCESADO' });
  }

  const meta = await sharp(buffer).metadata();
  const rutas: string[] = [];

  for (const ancho of ANCHOS) {
    const alto = Math.round((ancho * 4) / 3);
    const nombre = `${id}-${ancho}.webp`;
    const destino = path.join(config.rutaSubidas, nombre);
    // Asegura que el destino queda dentro de la carpeta de subidas.
    if (!destino.startsWith(config.rutaSubidas + path.sep)) {
      throw Object.assign(new Error('Ruta de destino no válida.'), { codigo: 'RUTA' });
    }
    await sharp(buffer).resize(ancho, alto, { fit: 'cover' }).webp({ quality: 82 }).toFile(destino);
    rutas.push(`/subidas/${nombre}`);
  }

  return {
    ruta: rutas[1] ?? rutas[0]!,
    alt: truncarAlt(archivo.originalname),
    ancho: meta.width ?? 800,
    alto: meta.height ?? 1067,
  };
}
