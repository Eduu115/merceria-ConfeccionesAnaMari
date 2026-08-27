import { z } from 'zod';
import { ORDENES_PRODUCTO, TIPOS_CATALOGO } from './roles.js';

export const esquemaConsultaProductos = z.object({
  tipo: z.enum(TIPOS_CATALOGO),
  categoria: z.string().min(1).optional(),
  tipo_merceria: z.string().optional(),
  color: z.string().optional(),
  orden: z.enum(ORDENES_PRODUCTO).default('novedades'),
  pagina: z.coerce.number().int().min(1).default(1),
  por_pagina: z.coerce.number().int().min(1).max(24).default(8),
});

export type ConsultaProductos = z.infer<typeof esquemaConsultaProductos>;
