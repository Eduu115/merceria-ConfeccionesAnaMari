import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
import { Cabecera } from '../componentes/Cabecera';
import { PieDePagina } from '../componentes/PieDePagina';
import { BurbujaWhatsApp } from '../componentes/BurbujaWhatsApp';
import { ProveedorWhatsApp } from '../hooks/whatsapp-pagina';
import { JsonLd } from '../lib/seo';
import { usarAjustes } from '../hooks/usar-ajustes';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function LayoutPublico() {
  const matches = useMatches();
  const legal = matches.some((m) => (m.handle as { legal?: boolean } | undefined)?.legal);
  const { data: ajustes } = usarAjustes();
  const { data: horario } = useQuery({
    queryKey: ['horario'],
    queryFn: api.horario,
    staleTime: 5 * 60 * 1000,
  });

  const origen =
    (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const localBusiness =
    ajustes && horario
      ? {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Confecciones Ana Mari',
          alternateName: 'Mercería Ana Mari',
          url: origen || undefined,
          image: origen ? `${origen}/og-cuadrado.png` : '/og-cuadrado.png',
          logo: origen ? `${origen}/marca/logo-fondo.png` : '/marca/logo-fondo.png',
          telephone: ajustes.telefono,
          email: ajustes.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: ajustes.direccion,
            addressLocality: 'Getafe',
            postalCode: '28904',
            addressCountry: 'ES',
          },
          openingHoursSpecification: horario.dias
            .filter((d) => !d.cerrado)
            .map((d) => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ][d.dia],
              opens: d.manana_abre,
              closes: d.tarde_cierra ?? d.manana_cierra,
            })),
        }
      : null;

  return (
    <ProveedorWhatsApp>
      <div className="flex min-h-screen flex-col">
        <Cabecera />
        <main className="flex-1 min-h-[100dvh]">
          <Outlet />
        </main>
        <PieDePagina />
        {!legal && <BurbujaWhatsApp />}
        <ScrollRestoration />
        {localBusiness && <JsonLd datos={localBusiness} />}
      </div>
    </ProveedorWhatsApp>
  );
}
