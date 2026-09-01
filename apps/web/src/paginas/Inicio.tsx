import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { Boton, BotonesContacto, BotonWhatsApp, EnlaceTexto } from '../componentes/Boton';
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
      <section className="grid md:min-h-[520px] md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-crema px-5 py-12 md:order-1 md:px-10 lg:px-12">
          <div className="w-full max-w-2xl">
            <h1 className="font-titular text-[2.35rem] font-semibold leading-[1.12] text-tinta md:text-[2.85rem] lg:text-[3.1rem]">
              {a.inicio_titular}
            </h1>
            <p className="mt-4 max-w-lg text-tinta-3">{a.inicio_subtitulo}</p>
            <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center">
              <BotonWhatsApp href={wa} />
              <Boton variante="secundario" to="/catalogo">
                {copys.botones.verCatalogo}
              </Boton>
            </div>
          </div>
        </div>
        <div className="order-1 min-h-[240px] md:order-2 md:min-h-[520px]">
          <MarcadorSinFoto
            variante="bloque"
            etiqueta="Foto: máquina de coser / manos trabajando"
            className="h-60 min-h-[240px] md:h-full md:min-h-[520px]"
          />
        </div>
      </section>

      <section className="border-y border-borde">
        <div className="envoltorio py-12 md:py-16">
          <h2 className="mb-6 font-titular text-[2rem] text-tinta md:text-[2.35rem]">
            {copys.inicio.queEncontraras}
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {data.categorias.map((c) => (
              <Link
                key={c.slug}
                to={c.tipo === 'merceria' ? '/catalogo/merceria' : `/catalogo?categoria=${c.slug}`}
                className="block border border-borde bg-white"
              >
                <MarcadorSinFoto variante="bloque" etiqueta="" className="aspect-[5/4] w-full" />
                <div className="p-3">
                  <h3 className="font-cuerpo text-[1.05rem] font-semibold text-tinta">{c.nombre}</h3>
                  <p className="mt-1 text-sm leading-snug text-tinta-apagada">{c.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden md:flex">
          <MarcadorSinFoto
            variante="macro"
            etiqueta="Textura macro · cremallera / hilos"
            className="min-h-[320px] flex-1"
          />
        </div>
        <div className="bg-arena px-5 py-12 md:px-10 lg:px-12">
          <h2 className="font-titular text-[2.15rem] leading-[1.15] text-tinta md:text-[2.5rem]">
            {copys.inicio.arreglosTitular}
          </h2>
          <p className="mt-3 max-w-lg text-tinta-3">{a.arreglos_intro}</p>
          <ol className="mt-5 space-y-2">
            {copys.inicio.pasos.map((p) => (
              <li
                key={p.n}
                className="flex items-center gap-3 border border-[#ccc6b9] bg-crema px-3 py-2.5"
              >
                <span className="w-6 shrink-0 font-cuerpo text-lg font-bold leading-none text-acento">
                  {p.n}
                </span>
                <span className="font-cuerpo text-[0.95rem] font-semibold text-tinta-2">{p.titulo}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <BotonesContacto whatsapp={waArr} telefono={telHref(a.telefono)} />
          </div>
        </div>
      </section>

      <section className="border-b border-borde">
        <div className="envoltorio py-12 md:py-16">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-titular text-[2rem] text-tinta md:text-[2.35rem]">
              {copys.inicio.seleccion}
            </h2>
            <EnlaceTexto to="/catalogo" className="hidden text-sm md:inline-flex">
              {copys.inicio.verTodo}
            </EnlaceTexto>
          </div>
          <RejillaProductos productos={data.destacados} />
          <Link
            to="/catalogo"
            className="mt-4 flex min-h-12 items-center justify-center border-[1.5px] border-tinta-apagada text-center text-[0.95rem] font-semibold text-tinta md:hidden"
          >
            {copys.inicio.verTodo}
          </Link>
        </div>
      </section>

      <section className="grid items-center border-b border-borde bg-crema md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-5 py-12 md:order-1 md:px-10 lg:px-12">
          <div className="w-full max-w-2xl">
            <h2 className="font-titular text-[2.15rem] leading-[1.15] text-tinta md:text-[2.5rem]">
              {copys.inicio.sobreTitular}
            </h2>
            <div className="mt-4 space-y-3 text-tinta-3">
              <p>{a.nosotros_p1}</p>
              <p>{a.nosotros_p2}</p>
              <p>{a.nosotros_p3}</p>
            </div>
            <div className="mt-6">
              <Boton variante="secundario" to="/nosotros">
                {copys.botones.conocenos}
              </Boton>
            </div>
          </div>
        </div>
        <div className="order-1 p-5 md:order-2 md:p-8">
          <MarcadorSinFoto
            variante="bloque"
            etiqueta="Foto: Ana y el equipo"
            className="h-60 min-h-[240px] border border-dashed border-borde-fuerte md:h-[340px]"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <h2 className="envoltorio pt-10 font-titular text-[2rem] text-tinta md:hidden">
          {copys.inicio.donde}
        </h2>
        <div className="min-h-[220px] bg-arena-2 md:min-h-[340px]">
          <Mapa
            url={a.mapa_embed_url}
            titulo="Mapa de la tienda en Getafe"
            className="h-full min-h-[220px] md:min-h-[340px]"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-12 md:px-10 lg:px-12">
          <div className="flex w-full max-w-2xl flex-col md:ml-auto">
            <h2 className="hidden font-titular text-[2.15rem] leading-[1.15] text-tinta md:block md:text-[2.5rem]">
              {copys.inicio.donde}
            </h2>
            <div className="order-2 mt-4 md:order-1">
              <TablaHorario dias={data.horario.dias} />
            </div>
            <div className="order-1 mt-4 md:order-2">
              <p className="font-medium text-tinta">
                {a.direccion} · {a.poblacion}
              </p>
              <p className="mt-1">
                <a className="hover:underline" href={telHref(a.telefono)}>
                  {a.telefono}
                </a>
              </p>
            </div>
            <div className="order-3 mt-6 flex flex-col gap-3 md:flex-row">
              <Boton href={mapsDir(a.direccion, a.poblacion)} externo>
                {copys.botones.comoLlegar}
              </Boton>
              <Boton variante="secundario" href={telHref(a.telefono)} className="hidden md:inline-flex">
                {copys.botones.llamar}
              </Boton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
