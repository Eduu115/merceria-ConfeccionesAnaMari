import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { Boton } from '../componentes/Boton';
import { MarcadorSinFoto } from '../componentes/MarcadorSinFoto';
import { enlaceWhatsApp } from '../lib/whatsapp';

export function Arreglos() {
  usarSeo(metas['/arreglos'].title, metas['/arreglos'].description);
  const { data: ajustes } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });
  const { data: servicios } = useQuery({ queryKey: ['servicios'], queryFn: api.servicios });
  if (!ajustes || !servicios) return <div className="envoltorio py-16">Cargando…</div>;
  const wa = enlaceWhatsApp(ajustes.whatsapp_telefono, 'arreglos');

  return (
    <>
      <section className="grid md:min-h-[340px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 flex flex-col justify-center bg-crema px-4 py-8 md:order-1 md:px-10">
          <div className="mx-auto w-full max-w-xl">
            <p className="mb-3 text-sm text-tinta-apagada">Inicio · {copys.arreglos.migas}</p>
            <h1 className="font-titular text-3xl font-semibold text-tinta md:text-4xl">
              {copys.arreglos.titular}
            </h1>
            <p className="mt-4 text-tinta-3">{ajustes.arreglos_intro}</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <MarcadorSinFoto className="h-52 border-0 md:h-full" />
        </div>
      </section>

      <section className="bg-arena">
        <div className="envoltorio py-10 md:py-14">
          <h2 className="mb-6 font-titular text-2xl text-tinta">{copys.arreglos.queHacemos}</h2>
          <div className="hidden overflow-hidden border border-borde md:block">
            <table className="w-full border-collapse">
              <thead className="bg-crema text-left text-rotulo uppercase text-tinta-apagada">
                <tr>
                  <th className="px-4 py-3 font-semibold">{copys.arreglos.servicio}</th>
                  <th className="px-4 py-3 font-semibold">{copys.arreglos.incluye}</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.slug} className="border-t border-borde bg-white">
                    <th className="px-4 py-3 text-left font-medium text-tinta">{s.nombre}</th>
                    <td className="px-4 py-3 text-tinta-3">{s.incluye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {servicios.map((s) => (
              <article key={s.slug} className="border border-borde bg-white p-4">
                <h3 className="font-medium text-tinta">{s.nombre}</h3>
                <p className="mt-1 text-tinta-3">{s.incluye}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-tinta-3">{copys.arreglos.nota}</p>
        </div>
      </section>

      <section className="envoltorio py-12 md:py-16">
        <h2 className="mb-8 font-titular text-2xl text-tinta">{copys.arreglos.como}</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {copys.arreglos.pasos.map((p) => (
            <li key={p.n} className="flex gap-3 md:block">
              <p className="font-titular text-2xl text-acento">{p.n}</p>
              <div>
                <p className="font-medium text-tinta">{p.titulo}</p>
                <p className="mt-1 text-sm text-tinta-3">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-arena-2">
        <div className="envoltorio flex flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <p className="border-l-[3px] border-acento pl-4 font-titular text-xl text-tinta md:text-2xl">
            {copys.arreglos.cierre}
          </p>
          <Boton href={wa} externo aria-label="Escríbenos por WhatsApp">
            {copys.botones.escribenos}
          </Boton>
        </div>
      </section>
    </>
  );
}
