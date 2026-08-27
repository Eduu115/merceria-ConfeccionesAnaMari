import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(aqui, '../../../.env') });
dotenv.config({ path: path.resolve(aqui, '../../.env') });
dotenv.config();

function opcional(nombre: string, defecto: string): string {
  return process.env[nombre] && process.env[nombre]!.length > 0
    ? process.env[nombre]!
    : defecto;
}

function numero(nombre: string, defecto: number): number {
  const v = process.env[nombre];
  if (!v) return defecto;
  const n = Number(v);
  return Number.isFinite(n) ? n : defecto;
}

export const config = {
  entorno: opcional('NODO_ENTORNO', 'desarrollo'),
  puerto: numero('PUERTO', 3010),
  origenPublico: opcional('ORIGEN_PUBLICO', 'http://localhost:5173'),
  servirEstaticos: opcional('SERVIR_ESTATICOS', 'false') === 'true',
  databaseUrl: opcional(
    'DATABASE_URL',
    'postgres://anamari:anamari@localhost:5434/anamari',
  ),
  sesionSecreto: opcional('SESION_SECRETO', 'cambia-este-secreto-en-produccion'),
  adminEmail: opcional('ADMIN_EMAIL', 'ana@confeccionesanamari.es'),
  adminNombre: opcional('ADMIN_NOMBRE', 'Ana Mari'),
  adminPassword: opcional('ADMIN_PASSWORD', 'cambia-esta-clave'),
  smtpHost: opcional('SMTP_HOST', ''),
  smtpPuerto: numero('SMTP_PUERTO', 587),
  smtpUsuario: opcional('SMTP_USUARIO', ''),
  smtpPassword: opcional('SMTP_PASSWORD', ''),
  correoDestino: opcional('CORREO_DESTINO', 'hola@confeccionesanamari.es'),
  whatsappTelefono: opcional('WHATSAPP_TELEFONO', '34615644940'),
  mapaEmbedUrl: opcional(
    'MAPA_EMBED_URL',
    'https://www.google.com/maps?q=Calle+Almagro+15,+28904+Getafe&output=embed',
  ),
  rutaSubidas: path.resolve(aqui, opcional('RUTA_SUBIDAS', '../datos/subidas')),
  rutaPublico: path.resolve(aqui, opcional('RUTA_PUBLICO', '../../web/dist')),
  rutaCopias: path.resolve(aqui, opcional('RUTA_COPIAS', '../datos/copias')),
};

export const esProduccion = config.entorno === 'produccion';
