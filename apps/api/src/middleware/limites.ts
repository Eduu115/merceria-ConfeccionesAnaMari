import type { Request, Response, NextFunction } from 'express';

const ventana = new Map<string, number[]>();

export function limiteIntentos(clave: (req: Request) => string, maximo: number, ms: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = clave(req);
    const ahora = Date.now();
    const lista = (ventana.get(id) ?? []).filter((t) => ahora - t < ms);
    if (lista.length >= maximo) {
      res.status(429).json({ error: 'Demasiados intentos. Prueba más tarde.' });
      return;
    }
    lista.push(ahora);
    ventana.set(id, lista);
    next();
  };
}

export function ipCliente(req: Request): string {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0]!.trim();
  return req.socket.remoteAddress ?? '0.0.0.0';
}
