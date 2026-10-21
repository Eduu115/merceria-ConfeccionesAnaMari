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

// La primera IP de X-Forwarded-For la escribe el cliente: con ella, cambiar la
// cabecera en cada peticion se saltaba los limites. req.ip recorre la cadena
// desde la derecha y se para en el primer salto que no es un proxy de confianza
// ('trust proxy' en index.ts).
export function ipCliente(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? '0.0.0.0';
}
