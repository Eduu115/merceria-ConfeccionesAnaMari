import { eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import { config } from '../config.js';
import { registro } from '../registro.js';
import { db } from '../db/cliente.js';
import { correosPendientes } from '../db/esquema.js';

export type Correo = {
  para: string;
  asunto: string;
  texto: string;
  html?: string;
};

function transport() {
  if (!config.smtpHost) return null;
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPuerto,
    secure: config.smtpPuerto === 465,
    auth:
      config.smtpUsuario.length > 0
        ? { user: config.smtpUsuario, pass: config.smtpPassword }
        : undefined,
  });
}

export async function enviar(correo: Correo): Promise<void> {
  const t = transport();
  if (!t) {
    registro.warn({ para: correo.para, asunto: correo.asunto }, 'SMTP no configurado; correo omitido');
    return;
  }
  await t.sendMail({
    from: config.correoDestino,
    to: correo.para,
    subject: correo.asunto,
    text: correo.texto,
    html: correo.html,
  });
}

export async function enviarOEncolar(correo: Correo): Promise<void> {
  try {
    await enviar(correo);
  } catch (err) {
    registro.error({ err }, 'Fallo al enviar correo; se encola');
    await db.insert(correosPendientes).values({
      para: correo.para,
      asunto: correo.asunto,
      texto: correo.texto,
      html: correo.html ?? null,
    });
  }
}

export async function reintentarPendientes(): Promise<void> {
  const pendientes = await db.select().from(correosPendientes).limit(20);
  for (const p of pendientes) {
    try {
      await enviar({
        para: p.para,
        asunto: p.asunto,
        texto: p.texto,
        html: p.html ?? undefined,
      });
      await db.delete(correosPendientes).where(eq(correosPendientes.id, p.id));
    } catch (err) {
      registro.warn({ err, id: p.id }, 'Sigue fallando un correo pendiente');
    }
  }
}
