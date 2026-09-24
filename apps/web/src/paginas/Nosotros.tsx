import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { Imagen } from '../componentes/Imagen';
import { VisorFotos } from '../componentes/VisorFotos';
import { fotoFrente, fotosTienda } from '../lib/fotos-tienda';
import { Boton, BotonTelefono, BotonWhatsApp } from '../componentes/Boton';
import { enlaceWhatsApp, telHref } from '../lib/whatsapp';

export function Nosotros() {
  usarSeo(metas['/nosotros'].title, metas['/nosotros'].description);
  const [visor, setVisor] = useState<number | null>(null);
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
          <Imagen
            src={fotoFrente.src}
            alt={fotoFrente.alt}
            className="min-h-[230px] w-full border border-borde object-top md:min-h-[280px]"
          />
        </div>
      </section>

      <section className="envoltorio pb-12">
        <h2 className="mb-4 font-titular text-[2.15rem] text-tinta">{copys.nosotros.local}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {fotosTienda.map((foto, i) => (
            <figure key={foto.pie} className="w-[156px] shrink-0 md:w-auto">
              <button
                type="button"
                className="block w-full cursor-zoom-in"
                aria-label={`Ampliar foto: ${foto.pie}`}
                onClick={() => setVisor(i)}
              >
                <Imagen
                  src={foto.src}
                  alt={foto.alt}
                  className="aspect-[4/3] min-h-[156px] w-full border border-borde"
                />
              </button>
              <figcaption className="mt-2 font-cuerpo text-sm text-tinta-apagada">{foto.pie}</figcaption>
            </figure>
          ))}
        </div>
        <VisorFotos
          fotos={fotosTienda}
          indice={visor}
          onCerrar={() => setVisor(null)}
          onIr={setVisor}
        />
      </section>

      <section className="bg-arena">
        <div className="envoltorio py-10">
          <p className="font-titular text-[1.85rem] leading-[1.2] text-tinta md:text-[2.1rem]">{copys.nosotros.cierre}</p>
          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <Boton variante="secundario" to="/catalogo" className="order-last md:order-first">
              {copys.botones.verCatalogo}
            </Boton>
            <BotonWhatsApp href={wa} />
            <BotonTelefono href={telHref(a.telefono)} />
          </div>
        </div>
      </section>
    </>
  );
}
