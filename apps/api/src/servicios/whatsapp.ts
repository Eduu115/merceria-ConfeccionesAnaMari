import { registro } from '../registro.js';

export async function verificarWebhookWhatsApp(): Promise<never> {
  registro.warn('WhatsApp Cloud API aún no está conectada');
  throw new Error('WhatsApp Cloud API no está configurada.');
}
