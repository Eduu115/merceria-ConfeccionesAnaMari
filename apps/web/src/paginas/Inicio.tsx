import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { Boton } from '../componentes/Boton';
import { MarcadorSinFoto } from '../componentes/MarcadorSinFoto';
import { RejillaProductos } from '../componentes/TarjetaProducto';
import { TablaHorario } from '../componentes/TablaHorario';
import { Mapa } from '../componentes/Mapa';
import { enlaceWhatsApp, mapsDir, telHref } from '../lib/whatsapp';

export function Inicio() {
  usarSeo(metas['/'].title, metas['/'].description);
  const { data } = useQuery({ queryKey: ['inicio'], queryFn: api.inicio });
  if (!data) return <div className="envoltorio py-16">Cargando…</div>;
  const a = data.ajustes;
  const wa = enlaceWhatsApp(a.whatsapp_telefono, 'hero');
  const waArr = enlaceWhatsApp(a.whatsapp_telefono, 'arreglos');

  return (
    <>
      <section className="grid md:min-h-[420px] md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-crema px-4 py-10 md:order-1 md:px-10">
          <div className="mx-auto w-full max-w-xl">
            <h1 className="font-titular text-3xl font-semibold leading-tight text-tinta md:text-4xl">
              {a.inicio_titular}
            </h1>
            <p className="mt-4 text-tinta-3">{a.inicio_subtitulo}</p>
            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <Boton href={wa} externo aria-label="Escríbenos por WhatsApp">
                {copys.botones.escribenos}
              </Boton>
              <Boton variante="secundario" to="/catalogo">
                {copys.botones.verCatalogo}
              </Boton>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <MarcadorSinFoto className="h-56 rounded-none border-0 md:h-full md:min-h-[420px]" />
        </div>
      </section>

      <section className="envoltorio py-12 md:py-16">
        <h2 className="mb-6 font-titular text-2xl text-tinta">{copys.inicio.queEncontraras}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {data.categorias.map((c) => (
            <Link
              key={c.slug}
              to={c.tipo === 'merceria' ? '/catalogo/merceria' : `/catalogo?categoria=${c.slug}`}
              className="border border-borde bg-white"
            >
              <MarcadorSinFoto className="border-0" />
              <div className="p-3">
                <h3 className="font-medium text-tinta">{c.nombre}</h3>
                <p className="mt-1 text-sm text-tinta-apagada">{c.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid bg-arena md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden min-h-[220px] md:block">
          <MarcadorSinFoto className="h-full min-h-[280px] border-0 bg-arena-3" />
        </div>
        <div className="px-4 py-10 md:px-10">
          <h2 className="font-titular text-2xl text-tinta md:text-3xl">
            {copys.inicio.arreglosTitular}
          </h2>
          <p className="mt-3 text-tinta-3">{a.arreglos_intro}</p>
          <ol className="mt-6 space-y-3">
            {copys.inicio.pasos.map((p) => (
              <li key={p.n} className="flex gap-3">
                <span className="font-titular text-xl text-acento">{p.n}.</span>
                <span className="pt-0.5 font-medium text-tinta">{p.titulo}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <Boton href={waArr} externo aria-label="Consúltanos por WhatsApp">
              {copys.botones.consultanos}
            </Boton>
          </div>
        </div>
      </section>

      <section className="envoltorio py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-titular text-2xl text-tinta">{copys.inicio.seleccion}</h2>
          <Link to="/catalogo" className="hidden text-sm text-acento underline md:inline">
            {copys.inicio.verTodo}
          </Link>
        </div>
        <RejillaProductos productos={data.destacados} />
        <Link to="/catalogo" className="mt-4 block text-sm text-acento underline md:hidden">
          {copys.inicio.verTodo}
        </Link>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-4 py-10 md:order-1 md:px-10">
          <div className="mx-auto w-full max-w-xl">
            <h2 className="font-titular text-2xl text-tinta md:text-3xl">
              {copys.inicio.sobreTitular}
            </h2>
            <p className="mt-4 text-tinta-3">{a.nosotros_p1}</p>
            <div className="mt-6">
              <Boton variante="secundario" to="/nosotros">
                {copys.botones.conocenos}
              </Boton>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <MarcadorSinFoto className="h-56 border-0 md:h-full md:min-h-[280px]" />
        </div>
      </section>

      <section className="envoltorio grid gap-8 py-12 md:grid-cols-2 md:py-16">
        <div className="order-2 md:order-1">
          <Mapa url={a.mapa_embed_url} titulo="Mapa de la tienda en Getafe" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="font-titular text-2xl text-tinta">{copys.inicio.donde}</h2>
          <div className="mt-4">
            <TablaHorario dias={data.horario.dias} />
          </div>
          <p className="mt-4 text-tinta-2">
            {a.direccion} · {a.poblacion}
          </p>
          <p>
            <a className="hover:underline" href={telHref(a.telefono)}>
              {a.telefono}
            </a>
          </p>
          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <Boton href={mapsDir(a.direccion, a.poblacion)} externo>
              {copys.botones.comoLlegar}
            </Boton>
            <Boton variante="secundario" href={telHref(a.telefono)}>
              {copys.botones.llamar}
            </Boton>
          </div>
        </div>
      </section>
    </>
  );
}
