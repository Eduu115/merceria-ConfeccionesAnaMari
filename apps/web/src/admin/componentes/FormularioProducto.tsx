import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ImagePlus } from 'lucide-react';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin, type ProductoDetalle, type ProductoEntrada } from '../lib/api-admin';
import { CabeceraAdminEscritorio } from './CabeceraAdminEscritorio';
import { CabeceraAdminMovil } from './CabeceraAdminMovil';
import { CampoTexto } from './CampoTexto';
import { BotonAdmin } from './BotonAdmin';
import { ToggleAdmin } from './ToggleAdmin';
import { ConfirmarAdmin } from './ConfirmarAdmin';

type Props = { modo: 'crear' } | { modo: 'editar'; productoId: number };

const TALLAS_HABITUALES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const ID_FORMULARIO = 'formulario-producto';

export function FormularioProducto(props: Props) {
  const c = copysAdmin.formulario;
  const navegar = useNavigate();
  const cliente = useQueryClient();

  const detalle = useQuery({
    queryKey: ['admin', 'producto', props.modo === 'editar' ? props.productoId : null],
    queryFn: () => apiAdmin.productos.obtener((props as { productoId: number }).productoId),
    enabled: props.modo === 'editar',
  });

  const productoId = props.modo === 'editar' ? props.productoId : null;
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'ropa' | 'merceria'>('ropa');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [categoriaPadreId, setCategoriaPadreId] = useState<number | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [composicion, setComposicion] = useState('');
  const [colores, setColores] = useState('');
  const [caracteristica, setCaracteristica] = useState('');
  const [tallas, setTallas] = useState<{ talla: string; disponible: boolean }[]>([]);
  const [atributosSel, setAtributosSel] = useState<number[]>([]);
  const [visible, setVisible] = useState(true);
  const [agotado, setAgotado] = useState(false);
  const [destacado, setDestacado] = useState(false);

  const [cargado, setCargado] = useState(props.modo === 'crear');
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.modo === 'editar' && detalle.data && !cargado) {
      const d: ProductoDetalle = detalle.data;
      setNombre(d.nombre);
      setTipo(d.tipo);
      setCategoriaId(d.categoria_id);
      setDescripcion(d.descripcion ?? '');
      setPrecio(d.precio_centimos != null ? (d.precio_centimos / 100).toFixed(2) : '');
      setComposicion(d.composicion ?? '');
      setColores(d.colores ?? '');
      setCaracteristica(d.caracteristica ?? '');
      setTallas(d.tallas);
      setAtributosSel(d.atributos);
      setVisible(d.visible);
      setAgotado(d.agotado);
      setDestacado(d.destacado);
      setCargado(true);
    }
  }, [detalle.data, props.modo, cargado]);

  const categorias = useQuery({
    queryKey: ['admin', 'categorias', tipo],
    queryFn: () => apiAdmin.categorias(tipo),
  });
  const atributosColor = useQuery({
    queryKey: ['admin', 'atributos', 'color'],
    queryFn: () => apiAdmin.atributos('color'),
    enabled: tipo === 'merceria',
  });
  const atributosTipoMerceria = useQuery({
    queryKey: ['admin', 'atributos', 'tipo_merceria'],
    queryFn: () => apiAdmin.atributos('tipo_merceria'),
    enabled: tipo === 'merceria',
  });

  useEffect(() => {
    if (tipo === 'merceria' && !categoriaId && categorias.data?.length === 1) {
      setCategoriaId(categorias.data[0].id);
    }
  }, [tipo, categorias.data, categoriaId]);

  // Al cargar un producto de ropa existente, deducimos qué categoría "padre"
  // (Mujer/Hombre/Niños) tenía seleccionada a partir de la subcategoría guardada.
  useEffect(() => {
    if (tipo === 'ropa' && categoriaId && categorias.data && !categoriaPadreId) {
      const cat = categorias.data.find((c) => c.id === categoriaId);
      if (cat) setCategoriaPadreId(cat.padreId ?? cat.id);
    }
  }, [tipo, categoriaId, categorias.data, categoriaPadreId]);

  const categoriasRaiz = categorias.data?.filter((c) => !c.padreId) ?? [];

  function seleccionarCategoriaPadre(cat: { id: number }) {
    setCategoriaPadreId(cat.id);
    const hijas = categorias.data?.filter((c) => c.padreId === cat.id) ?? [];
    setCategoriaId(hijas.length ? '' : cat.id);
  }

  function alternarTalla(talla: string) {
    setTallas((prev) => {
      const existe = prev.find((t) => t.talla === talla);
      if (existe) return prev.filter((t) => t.talla !== talla);
      return [...prev, { talla, disponible: true }];
    });
  }

  function alternarAtributo(id: number) {
    setAtributosSel((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    setError('');
    if (!categoriaId) {
      setError(c.errorGenerico);
      return;
    }
    setGuardando(true);
    const datos: ProductoEntrada = {
      nombre,
      tipo,
      categoria_id: Number(categoriaId),
      descripcion: descripcion || null,
      composicion: composicion || null,
      colores: colores || null,
      caracteristica: caracteristica || null,
      precio_centimos: precio ? Math.round(Number(precio) * 100) : null,
      visible,
      agotado,
      destacado,
      tallas,
      atributos: atributosSel,
    };
    try {
      if (productoId) {
        await apiAdmin.productos.actualizar(productoId, datos);
        await cliente.invalidateQueries({ queryKey: ['admin', 'producto', productoId] });
      } else {
        await apiAdmin.productos.crear(datos);
      }
      await cliente.invalidateQueries({ queryKey: ['admin', 'productos'] });
      navegar('/admin', { replace: true });
    } catch {
      setError(c.errorGenerico);
    } finally {
      setGuardando(false);
    }
  }

  async function borrarProducto() {
    if (!productoId) return;
    setBorrando(true);
    try {
      await apiAdmin.productos.borrar(productoId);
      await cliente.invalidateQueries({ queryKey: ['admin', 'productos'] });
      navegar('/admin', { replace: true });
    } finally {
      setBorrando(false);
      setConfirmandoBorrar(false);
    }
  }

  const titulo = props.modo === 'editar' ? c.tituloEditar : c.tituloNuevo;

  const accionesEscritorio = (
    <>
      {props.modo === 'editar' && (
        <BotonAdmin variante="peligro" cargando={borrando} onClick={() => setConfirmandoBorrar(true)}>
          {borrando ? c.borrando : c.borrar}
        </BotonAdmin>
      )}
      <Link to="/admin">
        <BotonAdmin variante="secundario">{c.cancelar}</BotonAdmin>
      </Link>
      <BotonAdmin type="submit" form={ID_FORMULARIO} cargando={guardando} className="min-w-24">
        {guardando ? c.guardando : c.guardar}
      </BotonAdmin>
    </>
  );

  if (props.modo === 'editar' && !cargado) {
    return (
      <>
        <CabeceraAdminMovil variante="detalle" titulo={titulo} atras="/admin" />
        <CabeceraAdminEscritorio titulo={titulo} />
        <p className="p-5 text-[0.9rem] text-admin-texto-3">Cargando…</p>
      </>
    );
  }

  return (
    <>
      <CabeceraAdminMovil variante="detalle" titulo={titulo} atras="/admin" />
      <CabeceraAdminEscritorio
        migas={props.modo === 'editar' ? 'Productos · Editar' : 'Productos · Añadir'}
        titulo={titulo}
        acciones={accionesEscritorio}
      />

      <form
        id={ID_FORMULARIO}
        onSubmit={guardar}
        className="grid grid-cols-1 gap-8 p-[1.4rem] pb-28 md:p-7 lg:grid-cols-[1fr_320px] lg:p-[2.8rem] xl:grid-cols-[1fr_360px] xl:gap-10 xl:px-[4.2rem] xl:py-14 2xl:px-28"
      >
        <div className="flex flex-col gap-7 lg:order-1">
          <section className="flex flex-col gap-3">
            <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionFotos}</h2>
            {/* Maqueta sin funcionalidad: cómo se subirán las fotos aún está por decidir. */}
            <div
              aria-disabled="true"
              className="flex min-h-32 cursor-not-allowed flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-admin-borde-campo-2 bg-white text-center opacity-70"
            >
              <ImagePlus className="h-6 w-6 text-admin-texto-tenue" aria-hidden />
              <span className="text-[0.9rem] font-medium text-admin-texto">{c.fotosArrastra}</span>
              <span className="text-[0.82rem] text-admin-texto-tenue">{c.fotosPulsa}</span>
            </div>
            <p className="text-[0.78rem] italic text-admin-texto-tenue">{c.fotosPendiente}</p>
          </section>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.9rem] font-semibold text-admin-texto">{c.campoNombre}</span>
            <input
              required
              value={nombre}
              placeholder={c.nombrePlaceholder}
              onChange={(e) => setNombre(e.target.value)}
              className="min-h-11 rounded-md border border-admin-borde-campo px-3 text-[0.95rem] text-admin-texto outline-none focus:border-admin-acento"
            />
            <span className="text-[0.8rem] text-admin-texto-tenue">{c.nombreAyuda}</span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.9rem] font-semibold text-admin-texto">{c.campoDescripcion}</span>
            <textarea
              rows={4}
              value={descripcion}
              placeholder={c.descripcionPlaceholder}
              onChange={(e) => setDescripcion(e.target.value)}
              className="rounded-md border border-admin-borde-campo px-3 py-2 text-[0.95rem] text-admin-texto outline-none focus:border-admin-acento"
            />
            <span className="text-[0.8rem] text-admin-texto-tenue">{c.descripcionAyuda}</span>
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CampoTexto
              etiqueta={c.campoPrecio}
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*(\.\d{0,2})?$/.test(v)) setPrecio(v);
              }}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (e.target.value && !Number.isNaN(n)) setPrecio(n.toFixed(2));
              }}
            />
            <CampoTexto etiqueta={c.campoCaracteristica} value={caracteristica} onChange={(e) => setCaracteristica(e.target.value)} />
            {tipo === 'ropa' && (
              <>
                <CampoTexto etiqueta={c.campoComposicion} value={composicion} onChange={(e) => setComposicion(e.target.value)} />
                <CampoTexto etiqueta={c.campoColores} value={colores} onChange={(e) => setColores(e.target.value)} />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-7 lg:order-2">
          <section className="flex flex-col gap-3">
            <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionCatalogo}</h2>
            <div className="grid grid-cols-2 gap-2">
              {(['ropa', 'merceria'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTipo(t);
                    setCategoriaId('');
                    setCategoriaPadreId('');
                  }}
                  className={`min-h-16 rounded-md border px-3 text-[0.85rem] font-semibold transition-colors ${
                    tipo === t
                      ? 'border-admin-acento bg-admin-acento text-white'
                      : 'border-admin-borde-campo bg-white text-admin-texto-2'
                  }`}
                >
                  {t === 'ropa' ? c.tipoRopa : c.tipoMerceria}
                </button>
              ))}
            </div>
          </section>

          {tipo === 'ropa' && (
            <section className="flex flex-col gap-2">
              <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionCategoria}</h2>
              <div className="flex flex-col gap-2">
                {categoriasRaiz.map((cat) => {
                  const activa = categoriaPadreId === cat.id;
                  const hijas = categorias.data?.filter((h) => h.padreId === cat.id) ?? [];
                  return (
                    <div key={cat.id}>
                      <button
                        type="button"
                        onClick={() => seleccionarCategoriaPadre(cat)}
                        className={`flex min-h-11 w-full items-center justify-between rounded-md border px-3.5 text-[0.88rem] font-medium transition-colors ${
                          activa
                            ? 'border-admin-acento bg-admin-acento-fondo text-admin-acento'
                            : 'border-admin-borde-campo bg-white text-admin-texto-2'
                        }`}
                      >
                        {cat.nombre}
                        {activa && hijas.length === 0 && <Check className="h-4 w-4" aria-hidden />}
                      </button>
                      {activa && hijas.length > 0 && (
                        <div className="ml-3 mt-2 flex flex-col gap-2 border-l-2 border-admin-borde-campo pl-3">
                          {hijas.map((hija) => {
                            const activaHija = categoriaId === hija.id;
                            return (
                              <button
                                key={hija.id}
                                type="button"
                                onClick={() => setCategoriaId(hija.id)}
                                className={`flex min-h-11 items-center justify-between rounded-md border px-3.5 text-[0.88rem] font-medium transition-colors ${
                                  activaHija
                                    ? 'border-admin-acento bg-admin-acento-fondo text-admin-acento'
                                    : 'border-admin-borde-campo bg-white text-admin-texto-2'
                                }`}
                              >
                                {hija.nombre}
                                {activaHija && <Check className="h-4 w-4" aria-hidden />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {tipo === 'ropa' && (
            <section className="flex flex-col gap-2">
              <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionTallas}</h2>
              <div className="grid grid-cols-3 gap-2">
                {TALLAS_HABITUALES.map((t) => {
                  const activa = tallas.some((x) => x.talla === t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => alternarTalla(t)}
                      className={`min-h-11 rounded-md border text-[0.85rem] font-semibold transition-colors ${
                        activa
                          ? 'border-admin-acento bg-admin-acento text-white'
                          : 'border-admin-borde-campo bg-white text-admin-texto-2'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {tipo === 'merceria' && (
            <section className="flex flex-col gap-2">
              <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionTipoMerceria}</h2>
              <div className="flex flex-col divide-y divide-admin-borde-2 rounded-md border border-admin-borde-campo bg-white">
                {atributosTipoMerceria.data?.map((a) => {
                  const activo = atributosSel.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className="flex min-h-11 cursor-pointer items-center gap-3 px-3.5 text-[0.88rem] text-admin-texto-2"
                    >
                      <input
                        type="checkbox"
                        checked={activo}
                        onChange={() => alternarAtributo(a.id)}
                        style={{ accentColor: '#2f5d8c' }}
                        className="h-4 w-4"
                      />
                      {a.nombre}
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          {tipo === 'merceria' && (
            <section className="flex flex-col gap-2">
              <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionAtributos}</h2>
              <div className="flex flex-wrap gap-2">
                {atributosColor.data?.map((a) => {
                  const activo = atributosSel.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => alternarAtributo(a.id)}
                      className={`flex min-h-10 items-center gap-2 rounded-md border px-3 text-[0.85rem] font-medium transition-colors ${
                        activo
                          ? 'border-admin-acento bg-admin-acento-fondo text-admin-acento'
                          : 'border-admin-borde-campo bg-white text-admin-texto-2'
                      }`}
                    >
                      {a.hex && (
                        <span className="h-3.5 w-3.5 rounded-full border border-admin-borde" style={{ background: a.hex }} />
                      )}
                      {a.nombre}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-2">
            <ToggleAdmin etiqueta={c.campoVisible} ayuda={c.campoVisibleAyuda} checked={visible} onChange={setVisible} />
            <ToggleAdmin etiqueta={c.campoAgotado} ayuda={c.campoAgotadoAyuda} checked={agotado} onChange={setAgotado} />
            <ToggleAdmin etiqueta={c.campoDestacado} ayuda={c.campoDestacadoAyuda} checked={destacado} onChange={setDestacado} />
          </section>

          {props.modo === 'crear' && <p className="text-[0.78rem] italic text-admin-texto-tenue">{c.notaSinBorrar}</p>}
        </div>

        {error && <p className="text-[0.85rem] text-admin-error lg:col-span-2">{error}</p>}
      </form>

      <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-admin-borde bg-white p-4 lg:hidden">
        {props.modo === 'editar' && (
          <BotonAdmin variante="peligro" cargando={borrando} onClick={() => setConfirmandoBorrar(true)}>
            {borrando ? c.borrando : c.borrar}
          </BotonAdmin>
        )}
        <BotonAdmin type="submit" form={ID_FORMULARIO} cargando={guardando} className="flex-1">
          {guardando ? c.guardando : c.guardar}
        </BotonAdmin>
      </div>

      <ConfirmarAdmin
        abierto={confirmandoBorrar}
        titulo={c.confirmarBorrarTitulo}
        descripcion={
          <>
            Vas a borrar <strong className="font-semibold text-admin-error">«{nombre || titulo}»</strong>. {c.confirmarBorrarTexto}
          </>
        }
        textoConfirmar={borrando ? c.borrando : c.confirmarBorrarBoton}
        cargando={borrando}
        onConfirmar={borrarProducto}
        onCancelar={() => setConfirmandoBorrar(false)}
      />
    </>
  );
}
