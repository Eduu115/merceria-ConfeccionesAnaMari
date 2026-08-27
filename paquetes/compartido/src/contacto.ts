import { z } from 'zod';

export const esquemaContacto = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Dinos cómo te llamas.')
    .max(80, 'Dinos cómo te llamas.'),
  email: z
    .string()
    .trim()
    .email('Revisa el correo: falta el dominio.'),
  mensaje: z
    .string()
    .trim()
    .min(10, 'Escríbenos un poco más para poder ayudarte.')
    .max(2000, 'Escríbenos un poco más para poder ayudarte.'),
  sitio: z.string().optional(),
});

export type DatosContacto = z.infer<typeof esquemaContacto>;
