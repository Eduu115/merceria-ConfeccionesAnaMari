import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { Desplegable, type Opcion } from '../componentes/Desplegable';
import { EtiquetaFiltro, QuitarFiltros } from '../componentes/EtiquetaFiltro';
import { RejillaProductos } from '../componentes/TarjetaProducto';
import { Paginacion } from '../componentes/Paginacion';
import { EstadoVacio } from '../componentes/EstadoVacio';
import { enlaceWhatsApp } from '../lib/whatsapp';

const ORDEN = [
  { valor: 'novedades', etiqueta: copys.catalogo.novedades },
  { valor: 'az', etiqueta: copys.catalogo.az },
  { valor: 'za', etiqueta: copys.catalogo.za },
];

export function CatalogoRopa() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = params.get('categoria') ?? '';
  const orden = params.get('orden') ?? 'novedades';
  const pagina = Number(params.get('pagina') ?? '1') || 1;
  const { data: cats } = useQuery({ queryKey: ['categorias', 'ropa'], queryFn: () => api.categorias('ropa') });
  const { data: ajustes } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });
  const qs = new URLSearchParams({
    tipo: 'ropa',
    orden,
    pagina: String(pagina),
    por_pagina: '8',
  });
  if (categoria) qs.set('categoria', categoria);
  const { data } = useQuery({
    queryKey: ['productos', qs.toString()],
    queryFn: () => api.productos(qs.toString()),
  });

  const catActual = cats?.find((c) => c.slug === categoria);
  const lista = cats ?? [];
  // Si venimos de un enlace tipo «Hombre» (navbar), o de una de sus subcategorías,
  // esta vista queda «anclada» a esa categoría raíz: el desplegable solo ofrece sus
  // propias subcategorías, no las de las demás. Para ver otra rama se vuelve al navbar.
  const raizActual = categoria
    ? catActual?.padreSlug
      ? lista.find((c) => c.slug === catActual.padreSlug)
      : catActual
    : undefined;
  const hijosDeRaiz = raizActual ? lista.filter((h) => h.padreSlug === raizActual.slug) : [];

  // El título de la página es siempre la categoría raíz (Mujer/Hombre/Niños): elegir
  // una subcategoría solo filtra la lista, no cambia el título ni las migas.
  const titulo = raizActual?.nombre ?? copys.catalogo.tituloRopa;
  usarSeo(
    raizActual ? `${raizActual.nombre} · Confecciones Ana Mari` : metas['/catalogo'].title,
    metas['/catalogo'].description,
  );

  const [abierto, setAbierto] = useState<'categoria' | 'orden' | null>(null);

  const opcionesCat = useMemo(() => {
    if (raizActual) {
      const opciones: Opcion[] = [
        { valor: raizActual.slug, etiqueta: 'Todos' },
      ];
      for (const hijo of hijosDeRaiz) opciones.push({ valor: hijo.slug, etiqueta: hijo.nombre, nivel: 1 });
      return opciones;
    }
    const raiz = lista.filter((c) => !c.padreSlug);
    const opciones: Opcion[] = [{ valor: '', etiqueta: copys.catalogo.todas }];
    for (const padre of raiz) {
      opciones.push({ valor: padre.slug, etiqueta: padre.nombre });
      for (const hijo of lista.filter((h) => h.padreSlug === padre.slug)) {
        opciones.push({ valor: hijo.slug, etiqueta: hijo.nombre, nivel: 1 });
      }
    }
    opciones.push({ valor: 'merceria', etiqueta: 'Mercería y costura' });
    return opciones;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats, raizActual?.slug]);

  function setFiltro(clave: string, valor: string) {
    if (clave === 'categoria' && valor === 'merceria') {
      navigate('/catalogo/merceria');
      return;
    }
    const n = new URLSearchParams(params);
    if (!valor) n.delete(clave);
    else n.set(clave, valor);
    n.delete('pagina');
    setParams(n);
    setAbierto(null);
  }

  const migas = raizActual
    ? [
        { href: '/', label: 'Inicio' },
        { href: '/catalogo', label: 'Catálogo' },
        { label: raizActual.nombre },
      ]
    : [{ href: '/', label: 'Inicio' }, { label: copys.catalogo.tituloRopa }];

  const wa = ajustes ? enlaceWhatsApp(ajustes.whatsapp_telefono, 'catalogo-vacio') : '#';

  return (
    <>
      <CabeceraDePagina
        migas={migas}
        titulo={titulo}
        intro={ajustes?.catalogo_intro}
      />
      <div className="sticky top-[4.25rem] z-20 border-b-[1.5px] border-borde bg-arena">
        <div className="envoltorio flex gap-3 py-3">
          {(!raizActual || hijosDeRaiz.length > 0) && (
            <Desplegable
              rotulo={copys.catalogo.categoria}
              valor={categoria}
              opciones={opcionesCat}
              abierto={abierto === 'categoria'}
              onToggle={() => setAbierto((v) => (v === 'categoria' ? null : 'categoria'))}
              onCerrar={() => setAbierto(null)}
              onCambiar={(v) => setFiltro('categoria', v)}
            />
          )}
          <div className={raizActual && hijosDeRaiz.length === 0 ? 'w-full max-w-[220px]' : 'flex-1'}>
            <Desplegable
              rotulo={copys.catalogo.orden}
              valor={orden}
              opciones={ORDEN}
              abierto={abierto === 'orden'}
              onToggle={() => setAbierto((v) => (v === 'orden' ? null : 'orden'))}
              onCerrar={() => setAbierto(null)}
              onCambiar={(v) => setFiltro('orden', v)}
            />
          </div>
        </div>
      </div>
      <div className="envoltorio py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <p className="text-sm text-tinta-3">{data ? `${data.total} productos` : ''}</p>
          {categoria && catActual && (
            <EtiquetaFiltro
              texto={catActual.nombre}
              onQuitar={() => setFiltro('categoria', catActual.padreSlug ?? '')}
            />
          )}
          {orden !== 'novedades' && (
            <EtiquetaFiltro
              texto={ORDEN.find((o) => o.valor === orden)?.etiqueta ?? orden}
              onQuitar={() => setFiltro('orden', 'novedades')}
            />
          )}
          {(categoria || orden !== 'novedades') && (
            <QuitarFiltros onClick={() => setParams(new URLSearchParams())} />
          )}
        </div>
        {!data ? (
          <p>Cargando…</p>
        ) : data.total === 0 ? (
          <EstadoVacio
            titulo={copys.catalogo.vacioTitulo}
            texto={copys.catalogo.vacioRopa}
            primario={{ href: wa, label: copys.catalogo.vacioRopaCta }}
            secundario={{ to: '/catalogo', label: copys.catalogo.verTodas }}
          />
        ) : (
          <>
            <RejillaProductos productos={data.productos} />
            <Paginacion
              pagina={data.pagina}
              paginas={data.paginas}
              total={data.total}
              onCambiar={(p) => {
                const n = new URLSearchParams(params);
                n.set('pagina', String(p));
                setParams(n);
                window.scrollTo({ top: 0 });
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
