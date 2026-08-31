import { usarAjustes } from '../hooks/usar-ajustes';
import { usarWhatsAppPagina } from '../hooks/whatsapp-pagina';
import { enlaceWhatsApp } from '../lib/whatsapp';

function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.07 6.48 2.07 12c0 1.76.46 3.48 1.34 5L2 22l5.14-1.35A9.93 9.93 0 0 0 12.04 22c5.49 0 9.97-4.48 9.97-10 0-2.67-1.04-5.18-2.96-7.09zM12.04 20.15a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.05.8.81-2.97-.19-.3a8.1 8.1 0 0 1-1.25-4.37c0-4.48 3.65-8.13 8.14-8.13 2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.74c-.01 4.48-3.66 8.13-8.16 8.13zm4.46-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

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
      className="fixed bottom-3 right-3 z-40 grid h-[52px] w-[52px] place-items-center rounded-full bg-whatsapp text-white shadow-panel hover:bg-whatsapp-oscuro"
    >
      <IconoWhatsApp className="h-7 w-7" />
    </a>
  );
}

export { IconoWhatsApp };
