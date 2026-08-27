import type { Request, Response, NextFunction } from 'express';
import { registro } from '../registro.js';

export function errores(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  registro.error({ err }, 'Error no controlado');
  res.status(500).json({ error: 'Algo ha fallado. Inténtalo de nuevo.' });
}
