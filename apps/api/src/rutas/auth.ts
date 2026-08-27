import { Router } from 'express';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { puedeAdministrarSitio, esquemaSesion } from '@anamari/compartido';
import { db } from '../db/cliente.js';
import { sesiones, usuarios } from '../db/esquema.js';
import {
  borrarCookieSesion,
  crearSesion,
  exigirSesion,
  leerUsuario,
  ponerCookieSesion,
} from '../middleware/auth.js';
import { ipCliente, limiteIntentos } from '../middleware/limites.js';

export const auth = Router();

auth.post(
  '/sesion',
  limiteIntentos((req) => `login:${ipCliente(req)}`, 10, 60 * 60 * 1000),
  async (req, res) => {
    const parsed = esquemaSesion.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Revisa el correo y la contraseña.' });
      return;
    }
    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, parsed.data.email.trim().toLowerCase()))
      .limit(1);
    if (!user || !user.activo) {
      res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      return;
    }
    const ok = await argon2.verify(user.passwordHash, parsed.data.password);
    if (!ok) {
      res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      return;
    }
    if (!puedeAdministrarSitio(user.rol)) {
      res.status(403).json({ error: 'No tienes acceso a esta área.' });
      return;
    }
    const id = await crearSesion(user.id, ipCliente(req));
    ponerCookieSesion(res, id);
    res.json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    });
  },
);

auth.delete('/sesion', async (req, res) => {
  const usuario = await leerUsuario(req);
  if (usuario) {
    const cookies = req.headers.cookie ?? '';
    const m = cookies.match(/(?:^|; )sesion=([^;]+)/);
    if (m?.[1]) {
      await db.delete(sesiones).where(eq(sesiones.id, m[1]));
    }
  }
  borrarCookieSesion(res);
  res.status(204).end();
});

auth.get('/yo', exigirSesion, (req, res) => {
  res.json(req.usuario);
});
