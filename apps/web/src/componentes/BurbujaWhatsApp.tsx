import { usarAjustes } from '../hooks/usar-ajustes';
import { usarWhatsAppPagina } from '../hooks/whatsapp-pagina';
import { enlaceWhatsApp } from '../lib/whatsapp';
import { IconoWhatsApp } from './IconoWhatsApp';

export function BurbujaWhatsApp() {
  const { data } = usarAjustes();
  const { origen, nombre } = usarWhatsAppPagina();
  if (!data?.whatsapp_telefono) return null;
  const href = enlaceWhatsApp(data.whatsapp_telefono, origen, { nombre });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-3 right-3 z-40 grid h-[62px] w-[62px] place-items-center rounded-full bg-whatsapp text-white shadow-panel hover:bg-whatsapp-oscuro"
    >
      <IconoWhatsApp className="h-[34px] w-[34px]" />
    </a>
  );
}
