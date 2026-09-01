import { useQuery } from '@tanstack/react-query';
import type { GrupoPregunta } from '@anamari/compartido';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { JsonLd, usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { Acordeon } from '../componentes/Acordeon';
import { BotonesContacto } from '../componentes/Boton';
import { enlaceWhatsApp, telHref } from '../lib/whatsapp';

const ORDEN: GrupoPregunta[] = ['tienda', 'arreglos', 'comprar'];

export function PreguntasFrecuentes() {
  usarSeo(metas['/preguntas-frecuentes'].title, metas['/preguntas-frecuentes'].description);
  const { data: preguntas } = useQuery({ queryKey: ['preguntas'], queryFn: api.preguntas });
  const { data: a } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });
  if (!preguntas || !a) return <div className="envoltorio py-16">Cargando…</div>;

  const grupos = ORDEN.map((g) => ({
    titulo: copys.faq.grupos[g],
    items: preguntas.filter((p) => p.grupo === g),
  })).filter((g) => g.items.length);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  };

  return (
    <>
      <JsonLd datos={faqLd} />
      <CabeceraDePagina
        migas={[{ href: '/', label: 'Inicio' }, { label: copys.faq.titulo }]}
        titulo={copys.faq.titulo}
      />
      <section className="envoltorio py-10 md:py-14">
        <Acordeon grupos={grupos} />
      </section>
      <section className="bg-arena-2">
        <div className="envoltorio flex flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <p className="font-titular text-[1.85rem] text-tinta">{copys.faq.cierre}</p>
          <BotonesContacto
            whatsapp={enlaceWhatsApp(a.whatsapp_telefono, 'faq')}
            telefono={telHref(a.telefono)}
          />
        </div>
      </section>
    </>
  );
}
