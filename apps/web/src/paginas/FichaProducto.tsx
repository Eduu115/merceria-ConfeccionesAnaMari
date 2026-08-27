import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { JsonLd, usarSeo } from '../lib/seo';
import { MarcadorSinFoto } from '../componentes/MarcadorSinFoto';
import { RejillaProductos } from '../componentes/TarjetaProducto';
import { usarWhatsAppPagina } from '../hooks/whatsapp-pagina';
import { cx } from '../lib/cx';

export function FichaProducto() {
  const { slug = '' } = useParams();
  const { data, isError } = useQuery({
    queryKey: ['producto', slug],
    queryFn: () => api.producto(slug),
    retry: false,
  });
  const { setOrigen } = usarWhatsAppPagina();

  useEffect(() => {
    if (data) setOrigen('producto', data.nombre);
    return () => setOrigen('cabecera');
  }, [data, setOrigen]);

  usarSeo(
    data ? `${data.nombre} · Confecciones Ana Mari` : metas['/catalogo'].title,
    data?.descripcion?.slice(0, 155) ?? metas['/catalogo'].description,
  );

  if (isError) return <ProductoNoExiste />;
  if (!data) return <div className="envoltorio py-16">Cargando…</div>;

  const fotos = data.imagenes;
  const tipos = data.atributos.filter((a) => a.familia === 'tipo_merceria');
  const coloresAttr = data.atributos.filter((a) => a.familia === 'color' && a.hex);

  return (
    <>
      <JsonLd
        datos={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.nombre,
          description: data.descripcion,
        }}
      />
      <article className="envoltorio grid gap-8 py-8 md:grid-cols-2">
        <Galeria fotos={fotos} nombre={data.nombre} />
        <div>
          <nav className="mb-3 text-sm text-tinta-apagada" aria-label="Migas de pan">
            <Link to="/" className="hover:underline">
              Inicio
            </Link>
            {' · '}
            <Link to={data.tipo === 'merceria' ? '/catalogo/merceria' : '/catalogo'} className="hover:underline">
              Catálogo
            </Link>
            {' · '}
            <Link
              to={
                data.tipo === 'merceria'
                  ? '/catalogo/merceria'
                  : `/catalogo?categoria=${data.categoria.slug}`
              }
              className="hover:underline"
            >
              {data.categoria.nombre}
            </Link>
            {' · '}
            <span>{data.nombre}</span>
          </nav>
          <h1 className="font-titular text-3xl text-tinta">{data.nombre}</h1>
          <div className="h-6" aria-hidden />
          {data.tipo === 'ropa' ? (
            <div className="mt-4">
              <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
                {copys.ficha.tallas}
              </p>
              <ul className="flex flex-wrap gap-2">
                {data.tallas.map((t) => (
                  <li
                    key={t.talla}
                    className={cx(
                      'grid h-11 w-11 place-items-center border text-sm md:h-[34px] md:w-10',
                      t.disponible
                        ? 'border-borde text-tinta'
                        : 'border-borde text-tinta-tenue line-through',
                    )}
                  >
                    {t.talla}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
                {copys.ficha.caracteristicas}
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {data.caracteristica && (
                    <tr className="border-b border-borde">
                      <th className="py-2 pr-4 text-left font-medium">Detalle</th>
                      <td>{data.caracteristica}</td>
                    </tr>
                  )}
                  {tipos.map((t) => (
                    <tr key={t.slug} className="border-b border-borde">
                      <th className="py-2 pr-4 text-left font-medium">Tipo</th>
                      <td>{t.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {coloresAttr.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
                    {copys.ficha.carta}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {coloresAttr.slice(0, 12).map((c) => (
                      <li
                        key={c.slug}
                        title={c.nombre}
                        className="h-[22px] w-[22px] border border-borde md:h-[22px] md:w-[22px]"
                        style={{ background: c.hex ?? '#ccc' }}
                      />
                    ))}
                    {coloresAttr.length > 12 && (
                      <li className="grid h-[22px] w-[22px] place-items-center border border-dashed border-borde-fuerte text-[10px] text-tinta-apagada">
                        +{coloresAttr.length - 12}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          {data.descripcion && <p className="mt-6 whitespace-pre-line text-tinta-3">{data.descripcion}</p>}
        </div>
      </article>

      <section className="envoltorio pb-8">
        <h2 className="mb-3 font-titular text-xl text-tinta">{copys.ficha.detalles}</h2>
        <table className="max-w-xl text-sm">
          <tbody>
            <tr className="border-b border-borde">
              <th className="py-2 pr-6 text-left font-medium">{copys.ficha.categoria}</th>
              <td>{data.categoria.nombre}</td>
            </tr>
            {data.composicion && (
              <tr className="border-b border-borde">
                <th className="py-2 pr-6 text-left font-medium">{copys.ficha.composicion}</th>
                <td>{data.composicion}</td>
              </tr>
            )}
            {data.colores && (
              <tr className="border-b border-borde">
                <th className="py-2 pr-6 text-left font-medium">{copys.ficha.colores}</th>
                <td>{data.colores}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {data.relacionados.length > 0 && (
        <section className="envoltorio pb-14">
          <h2 className="mb-4 font-titular text-xl text-tinta">
            {copys.ficha.tambien} {data.categoria.nombre.toLowerCase()}
          </h2>
          <RejillaProductos productos={data.relacionados} />
        </section>
      )}
    </>
  );
}

function Galeria({
  fotos,
  nombre,
}: {
  fotos: { ruta: string; alt: string }[];
  nombre: string;
}) {
  const [i, setI] = useState(0);
  if (fotos.length === 0) {
    return <MarcadorSinFoto variante="ficha" />;
  }
  const actual = fotos[i]!;
  return (
    <div>
      <div className="relative">
        <img
          src={actual.ruta}
          alt={actual.alt || nombre}
          className="aspect-[3/4] w-full object-cover"
          width={800}
          height={1067}
        />
        {fotos.length > 1 && (
          <p className="absolute bottom-2 right-2 bg-black/55 px-2 py-0.5 text-xs text-white md:hidden">
            FOTO {i + 1} de {fotos.length}
          </p>
        )}
      </div>
      {fotos.length > 1 && (
        <>
          <div className="mt-2 flex justify-center gap-1.5 md:hidden">
            {fotos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Foto ${idx + 1}`}
                className={cx('h-2.5 w-2.5 rounded-full', idx === i ? 'bg-acento' : 'bg-borde-fuerte')}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
          <ul className="mt-2 hidden grid-cols-4 gap-2 md:grid">
            {fotos.slice(0, 4).map((f, idx) => (
              <li key={f.ruta}>
                <button
                  type="button"
                  onClick={() => setI(idx)}
                  className={cx('block w-full', idx === i && 'ring-2 ring-acento')}
                >
                  <img src={f.ruta} alt="" className="aspect-[3/4] w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ProductoNoExiste() {
  const loc = useLocation();
  return (
    <div className="envoltorio py-16">
      <h1 className="font-titular text-2xl">No encontramos ese artículo</h1>
      <p className="mt-2 text-tinta-3">
        La dirección <code>{loc.pathname}</code> no corresponde a un producto visible.
      </p>
      <p className="mt-4">
        <Link className="text-acento underline" to="/catalogo">
          Ver el catálogo
        </Link>
      </p>
    </div>
  );
}
