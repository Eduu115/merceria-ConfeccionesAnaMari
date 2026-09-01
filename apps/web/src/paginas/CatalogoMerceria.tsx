import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { Desplegable } from '../componentes/Desplegable';
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

export function CatalogoMerceria() {
  usarSeo(metas['/catalogo/merceria'].title, metas['/catalogo/merceria'].description);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const tipos = (params.get('tipo_merceria') ?? '').split(',').filter(Boolean);
  const color = params.get('color') ?? '';
  const orden = params.get('orden') ?? 'novedades';
  const pagina = Number(params.get('pagina') ?? '1') || 1;
  const { data: tiposAttr } = useQuery({
    queryKey: ['atributos', 'tipo_merceria'],
    queryFn: () => api.atributos('tipo_merceria'),
  });
  const { data: colores } = useQuery({
    queryKey: ['atributos', 'color'],
    queryFn: () => api.atributos('color'),
  });
  const { data: ajustes } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });

  const qs = new URLSearchParams({ tipo: 'merceria', orden, pagina: String(pagina), por_pagina: '8' });
  if (tipos.length) qs.set('tipo_merceria', tipos.join(','));
  if (color) qs.set('color', color);
  const { data } = useQuery({
    queryKey: ['productos', qs.toString()],
    queryFn: () => api.productos(qs.toString()),
  });

  const [abierto, setAbierto] = useState<'tipo' | 'color' | 'orden' | null>(null);
  const opcionesTipo = useMemo(
    () => [
      ...(tiposAttr ?? []).map((t) => ({ valor: t.slug, etiqueta: t.nombre })),
      { valor: 'ropa', etiqueta: copys.catalogo.tituloRopa },
    ],
    [tiposAttr],
  );
  const opcionesColor = useMemo(
    () => [
      { valor: '', etiqueta: 'Todos' },
      ...(colores ?? []).map((c) => ({ valor: c.slug, etiqueta: c.nombre })),
    ],
    [colores],
  );

  function setLista(clave: string, valor: string) {
    if (clave === 'tipo_merceria' && valor === 'ropa') {
      navigate('/catalogo');
      return;
    }
    const n = new URLSearchParams(params);
    if (clave === 'tipo_merceria') {
      const set = new Set(tipos);
      if (set.has(valor)) set.delete(valor);
      else set.add(valor);
      const v = [...set].join(',');
      if (v) n.set(clave, v);
      else n.delete(clave);
    } else if (clave === 'color') {
      if (!valor) n.delete('color');
      else n.set('color', valor);
    } else {
      n.set(clave, valor);
    }
    n.delete('pagina');
    setParams(n);
    if (clave !== 'tipo_merceria') setAbierto(null);
  }

  const wa = ajustes ? enlaceWhatsApp(ajustes.whatsapp_telefono, 'merceria-vacio') : '#';

  return (
    <>
      <CabeceraDePagina
        migas={[
          { href: '/', label: 'Inicio' },
          { href: '/catalogo', label: 'Catálogo' },
          { label: copys.catalogo.tituloMerceria },
        ]}
        titulo={copys.catalogo.tituloMerceria}
      />
      <div className="sticky top-[4.25rem] z-20 border-b-[1.5px] border-borde bg-arena">
        <div className="envoltorio flex gap-3 py-3">
          <Desplegable
            rotulo={copys.catalogo.tipo}
            valor={tipos}
            opciones={opcionesTipo}
            multiple
            abierto={abierto === 'tipo'}
            onToggle={() => setAbierto((v) => (v === 'tipo' ? null : 'tipo'))}
            onCerrar={() => setAbierto(null)}
            onCambiar={(v) => setLista('tipo_merceria', v)}
          />
          <Desplegable
            rotulo={copys.catalogo.color}
            valor={color}
            opciones={opcionesColor}
            abierto={abierto === 'color'}
            onToggle={() => setAbierto((v) => (v === 'color' ? null : 'color'))}
            onCerrar={() => setAbierto(null)}
            onCambiar={(v) => setLista('color', v)}
          />
          <Desplegable
            rotulo={copys.catalogo.orden}
            valor={orden}
            opciones={ORDEN}
            abierto={abierto === 'orden'}
            onToggle={() => setAbierto((v) => (v === 'orden' ? null : 'orden'))}
            onCerrar={() => setAbierto(null)}
            onCambiar={(v) => setLista('orden', v)}
          />
        </div>
      </div>
      <div className="envoltorio py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <p className="text-sm text-tinta-3">{data ? `${data.total} productos` : ''}</p>
          {tipos.map((t) => (
            <EtiquetaFiltro
              key={t}
              texto={opcionesTipo.find((o) => o.valor === t)?.etiqueta ?? t}
              onQuitar={() => setLista('tipo_merceria', t)}
            />
          ))}
          {color && (
            <EtiquetaFiltro
              texto={opcionesColor.find((o) => o.valor === color)?.etiqueta ?? color}
              onQuitar={() => setLista('color', '')}
            />
          )}
          {(tipos.length || color) && (
            <QuitarFiltros onClick={() => setParams(new URLSearchParams())} />
          )}
        </div>
        {!data ? (
          <p>Cargando…</p>
        ) : data.total === 0 ? (
          <EstadoVacio
            titulo={copys.catalogo.vacioTitulo}
            texto={copys.catalogo.vacioMerceria}
            primario={{ href: wa, label: copys.catalogo.vacioMerceriaCta }}
            secundario={{ to: '/catalogo/merceria', label: copys.catalogo.verTodaMerceria }}
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
