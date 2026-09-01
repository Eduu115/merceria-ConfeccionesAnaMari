import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { BotonesContacto } from '../componentes/Boton';
import { MarcadorSinFoto } from '../componentes/MarcadorSinFoto';
import { enlaceWhatsApp, telHref } from '../lib/whatsapp';

export function Arreglos() {
  usarSeo(metas['/arreglos'].title, metas['/arreglos'].description);
  const { data: ajustes } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });
  const { data: servicios } = useQuery({ queryKey: ['servicios'], queryFn: api.servicios });
  if (!ajustes || !servicios) return <div className="envoltorio py-16">Cargando…</div>;
  const wa = enlaceWhatsApp(ajustes.whatsapp_telefono, 'arreglos');

  return (
    <>
      <section className="grid md:min-h-[420px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 flex flex-col justify-center bg-crema px-5 py-10 md:order-1 md:px-10 lg:px-12">
          <div className="w-full max-w-2xl">
            <p className="mb-3 text-sm text-tinta-apagada">Inicio · {copys.arreglos.migas}</p>
            <h1 className="font-titular text-[2.4rem] font-semibold leading-[1.12] text-tinta md:text-[2.75rem]">
              {copys.arreglos.titular}
            </h1>
            <p className="mt-4 text-tinta-3">{ajustes.arreglos_intro}</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <MarcadorSinFoto
            variante="bloque"
            etiqueta="Foto del taller"
            className="h-52 min-h-[200px] md:h-full md:min-h-[420px]"
          />
        </div>
      </section>

      <section className="bg-arena">
        <div className="envoltorio py-10 md:py-14">
          <h2 className="mb-6 font-titular text-[2.15rem] text-tinta">{copys.arreglos.queHacemos}</h2>
          <div className="hidden overflow-hidden border border-[#ccc6b9] bg-crema md:block">
            <table className="w-full border-collapse">
              <thead className="bg-[#efece6] text-left text-rotulo uppercase text-tinta-apagada">
                <tr>
                  <th className="border-b-[1.5px] border-borde px-4 py-3 font-semibold">
                    {copys.arreglos.servicio}
                  </th>
                  <th className="border-b-[1.5px] border-borde px-4 py-3 font-semibold">
                    {copys.arreglos.incluye}
                  </th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.slug} className="border-t border-[#eae6de] bg-crema">
                    <th className="px-4 py-3 text-left font-semibold text-tinta">{s.nombre}</th>
                    <td className="px-4 py-3 text-tinta-3">{s.incluye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {servicios.map((s) => (
              <article key={s.slug} className="border border-[#ccc6b9] bg-crema p-4">
                <h3 className="font-cuerpo font-semibold text-tinta">{s.nombre}</h3>
                <p className="mt-1 text-tinta-3">{s.incluye}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-tinta-3">{copys.arreglos.nota}</p>
        </div>
      </section>

      <section className="envoltorio py-12 md:py-16">
        <h2 className="mb-8 font-titular text-[2.15rem] text-tinta">{copys.arreglos.como}</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {copys.arreglos.pasos.map((p) => (
            <li key={p.n} className="flex gap-3 md:block">
              <p className="font-cuerpo text-[1.35rem] font-bold leading-none text-acento">{p.n}</p>
              <div>
                <p className="font-cuerpo font-medium text-tinta">{p.titulo}</p>
                <p className="mt-1 text-sm text-tinta-3">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-arena">
        <div className="envoltorio flex flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <p className="border-l-2 border-acento pl-4 font-titular text-[1.85rem] leading-[1.2] text-tinta md:text-[2.1rem]">
            {copys.arreglos.cierre}
          </p>
          <BotonesContacto whatsapp={wa} telefono={telHref(ajustes.telefono)} />
        </div>
      </section>
    </>
  );
}
