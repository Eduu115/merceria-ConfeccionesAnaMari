import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { MarcadorSinFoto } from '../componentes/MarcadorSinFoto';
import { Boton } from '../componentes/Boton';
import { enlaceWhatsApp } from '../lib/whatsapp';

export function Nosotros() {
  usarSeo(metas['/nosotros'].title, metas['/nosotros'].description);
  const { data: a } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });
  if (!a) return <div className="envoltorio py-16">Cargando…</div>;
  const wa = enlaceWhatsApp(a.whatsapp_telefono, 'cabecera');

  return (
    <>
      <CabeceraDePagina
        migas={[{ href: '/', label: 'Inicio' }, { label: copys.menu.nosotros }]}
        titulo={copys.nosotros.titulo}
      />
      <section className="envoltorio grid items-center gap-8 py-10 md:grid-cols-[1.05fr_0.95fr] md:py-14">
        <div className="order-2 md:order-1">
          <h2 className="font-titular text-[2rem] leading-[1.15] text-tinta md:text-[2.35rem]">{a.nosotros_titular}</h2>
          <div className="mt-4 space-y-4 text-tinta-3">
            <p>{a.nosotros_p1}</p>
            <p>{a.nosotros_p2}</p>
            <p>{a.nosotros_p3}</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <MarcadorSinFoto
            variante="bloque"
            etiqueta="Foto: Ana y el equipo"
            className="min-h-[230px] border border-dashed border-borde-fuerte md:min-h-[280px]"
          />
        </div>
      </section>

      <section className="envoltorio pb-12">
        <h2 className="mb-4 font-titular text-[2.15rem] text-tinta">{copys.nosotros.local}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {copys.nosotros.pies.map((pie) => (
            <figure key={pie} className="w-[130px] shrink-0 md:w-auto">
              <MarcadorSinFoto variante="bloque" className="aspect-[4/3] min-h-[130px]" etiqueta="" />
              <figcaption className="mt-2 font-cuerpo text-sm text-tinta-apagada">{pie}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-arena-2">
        <div className="envoltorio py-10">
          <p className="font-titular text-[1.85rem] leading-[1.2] text-tinta md:text-[2.1rem]">{copys.nosotros.cierre}</p>
          <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row">
            <Boton variante="secundario" to="/catalogo">
              {copys.botones.verCatalogo}
            </Boton>
            <Boton href={wa} externo aria-label="Escríbenos por WhatsApp">
              {copys.botones.escribenos}
            </Boton>
          </div>
        </div>
      </section>
    </>
  );
}
