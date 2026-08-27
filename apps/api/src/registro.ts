import pino from 'pino';
import { esProduccion } from './config.js';

export const registro = pino({
  level: esProduccion ? 'info' : 'debug',
  transport: esProduccion
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss' },
      },
});
