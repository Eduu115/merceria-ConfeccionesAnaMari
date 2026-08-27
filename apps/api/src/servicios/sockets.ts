import type { Server } from 'node:http';
import { Server as SocketServer } from 'socket.io';
import { config } from '../config.js';
import { leerUsuario } from '../middleware/auth.js';
import type { IncomingMessage } from 'node:http';

let io: SocketServer | null = null;

export function montarSockets(httpServer: Server): SocketServer {
  io = new SocketServer(httpServer, {
    path: '/socket.io',
    cors: { origin: config.origenPublico, credentials: true },
  });

  const admin = io.of('/admin');
  admin.use(async (socket, next) => {
    const req = socket.request as IncomingMessage;
    const usuario = await leerUsuario(req as never);
    if (!usuario) {
      next(new Error('No autorizado'));
      return;
    }
    next();
  });

  return io;
}

export function avisoMensajeNuevo(payload: { id: number; nombre: string }): void {
  io?.of('/admin').emit('mensaje:nuevo', payload);
}

export function avisoProductoActualizado(payload: { slug: string }): void {
  io?.of('/admin').emit('producto:actualizado', payload);
}
