import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { puedeAdministrarSitio } from '@anamari/compartido';
import { db } from '../db/cliente.js';
import { sesiones, usuarios } from '../db/esquema.js';
import { config, esProduccion } from '../config.js';

const NOMBRE_COOKIE = 'sesion';
const DIAS = 7;

function parsearCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const parte of header.split(';')) {
    const i = parte.indexOf('=');
    if (i === -1) continue;
    const k = parte.slice(0, i).trim();
    const v = decodeURIComponent(parte.slice(i + 1).trim());
    out[k] = v;
  }
  return out;
}

export function ponerCookieSesion(res: Response, id: string): void {
  const maxAge = DIAS * 24 * 60 * 60;
  const partes = [
    `${NOMBRE_COOKIE}=${id}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (esProduccion) partes.push('Secure');
  res.setHeader('Set-Cookie', partes.join('; '));
}

export function borrarCookieSesion(res: Response): void {
  const partes = [
    `${NOMBRE_COOKIE}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (esProduccion) partes.push('Secure');
  res.setHeader('Set-Cookie', partes.join('; '));
}

export async function crearSesion(usuarioId: number, ip: string | undefined): Promise<string> {
  const expiraEn = new Date(Date.now() + DIAS * 24 * 60 * 60 * 1000);
  const [fila] = await db
    .insert(sesiones)
    .values({ usuarioId, expiraEn, ip: ip ?? null })
    .returning();
  return fila.id;
}

export type UsuarioSesion = {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin_web' | 'propietario' | 'cliente';
};

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioSesion;
    }
  }
}

export async function leerUsuario(req: Request): Promise<UsuarioSesion | null> {
  const cookies = parsearCookies(req.headers.cookie);
  const id = cookies[NOMBRE_COOKIE];
  if (!id) return null;
  const filas = await db
    .select({
      sesionId: sesiones.id,
      expiraEn: sesiones.expiraEn,
      id: usuarios.id,
      email: usuarios.email,
      nombre: usuarios.nombre,
      rol: usuarios.rol,
      activo: usuarios.activo,
    })
    .from(sesiones)
    .innerJoin(usuarios, eq(sesiones.usuarioId, usuarios.id))
    .where(eq(sesiones.id, id))
    .limit(1);
  const fila = filas[0];
  if (!fila || !fila.activo || fila.expiraEn.getTime() < Date.now()) return null;
  return { id: fila.id, email: fila.email, nombre: fila.nombre, rol: fila.rol };
}

export async function exigirSesion(req: Request, res: Response, next: NextFunction) {
  const usuario = await leerUsuario(req);
  if (!usuario) {
    res.status(401).json({ error: 'Necesitas entrar.' });
    return;
  }
  if (!puedeAdministrarSitio(usuario.rol)) {
    res.status(403).json({ error: 'No tienes acceso a esta área.' });
    return;
  }
  req.usuario = usuario;
  next();
}

export { config };
