import { Router } from 'express';
import { and, count, eq, gte } from 'drizzle-orm';
import { esquemaContacto } from '@anamari/compartido';
import { db } from '../db/cliente.js';
import { ajustes, mensajes } from '../db/esquema.js';
import { ipCliente, limiteIntentos } from '../middleware/limites.js';
import { enviarOEncolar } from '../servicios/correo.js';
import { avisoMensajeNuevo } from '../servicios/sockets.js';
import { config } from '../config.js';

export const contacto = Router();

contacto.post(
  '/contacto',
  limiteIntentos((req) => `contacto:${ipCliente(req)}`, 5, 60 * 60 * 1000),
  async (req, res) => {
    const parsed = esquemaContacto.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errores: Record<string, string> = {};
      for (const [k, v] of Object.entries(fieldErrors)) {
        if (v?.[0]) errores[k] = v[0];
      }
      res.status(422).json({ errores });
      return;
    }

    if (parsed.data.sitio && parsed.data.sitio.length > 0) {
      res.status(201).json({ ok: true });
      return;
    }

    const ip = ipCliente(req);
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000);
    const [{ n }] = await db
      .select({ n: count() })
      .from(mensajes)
      .where(and(eq(mensajes.ip, ip), gte(mensajes.creadoEn, haceUnaHora)));
    if (n >= 5) {
      res.status(429).json({ error: 'Demasiados envíos. Prueba más tarde.' });
      return;
    }

    const [fila] = await db
      .insert(mensajes)
      .values({
        nombre: parsed.data.nombre,
        email: parsed.data.email,
        mensaje: parsed.data.mensaje,
        ip,
      })
      .returning();

    const telefonoAjuste = await db
      .select()
      .from(ajustes)
      .where(eq(ajustes.clave, 'whatsapp_telefono'))
      .limit(1);
    const whatsapp = telefonoAjuste[0]?.valor ?? config.whatsappTelefono;

    await enviarOEncolar({
      para: config.correoDestino,
      asunto: `Mensaje de la web · ${parsed.data.nombre}`,
      texto: `${parsed.data.nombre} <${parsed.data.email}>\n\n${parsed.data.mensaje}`,
    });
    await enviarOEncolar({
      para: parsed.data.email,
      asunto: 'Hemos recibido tu mensaje · Confecciones Ana Mari',
      texto: `Hola ${parsed.data.nombre},\n\nHemos recibido tu mensaje y te contestamos en horario de tienda. Si es urgente, escríbenos por WhatsApp al ${whatsapp}.\n\nConfecciones Ana Mari\nCalle Almagro, 15 · Getafe`,
    });

    avisoMensajeNuevo({ id: fila.id, nombre: fila.nombre });
    res.status(201).json({ ok: true });
  },
);
