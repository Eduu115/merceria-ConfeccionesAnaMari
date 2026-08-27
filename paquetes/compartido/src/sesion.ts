import { z } from 'zod';
import { ROLES_USUARIO } from './roles.js';

export const esquemaSesion = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'La contraseña es demasiado corta.'),
});

export const esquemaUsuarioPublico = z.object({
  id: z.number().int(),
  email: z.string().email(),
  nombre: z.string(),
  rol: z.enum(ROLES_USUARIO),
});

export type UsuarioPublico = z.infer<typeof esquemaUsuarioPublico>;
