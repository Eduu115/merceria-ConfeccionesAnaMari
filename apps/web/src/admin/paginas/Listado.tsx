import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { usarRobotsNoindex } from '../../lib/seo';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin } from '../lib/api-admin';
import { CabeceraAdminEscritorio } from '../componentes/CabeceraAdminEscritorio';
import { CabeceraAdminMovil } from '../componentes/CabeceraAdminMovil';
import { BotonAdmin } from '../componentes/BotonAdmin';

type Filtro = 'todos' | 'ropa' | 'merceria';

export function Listado() {
  usarRobotsNoindex();
  const c = copysAdmin.listado;
  const navegar = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');

  useEffect(() => {
    document.title = 'Productos · Administración';
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'productos'],
    queryFn: () => apiAdmin.productos.listar(),
  });

  const productos = useMemo(() => {
    const lista = data ?? [];
    return lista.filter((p) => {
      const pasaTipo = filtro === 'todos' || p.tipo === filtro;
      const pasaTexto = p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
      return pasaTipo && pasaTexto;
    });
  }, [data, filtro, busqueda]);

  return (
    <>
      <CabeceraAdminMovil variante="listado" titulo={c.titulo} />
      <CabeceraAdminEscritorio
        titulo={c.titulo}
        acciones={
          <Link to="/admin/productos/nuevo">
            <BotonAdmin>
              <Plus className="h-4 w-4" aria-hidden /> {c.anadir}
            </BotonAdmin>
          </Link>
        }
      />

      <div className="flex flex-col gap-4 p-[1.4rem] md:p-7 lg:p-[2.8rem] lg:text-base xl:px-[4.2rem] xl:py-14 xl:gap-6 2xl:px-28">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm xl:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-texto-tenue" aria-hidden />
            <input
              type="search"
              placeholder={c.buscar}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="min-h-11 w-full rounded-md border border-admin-borde-campo bg-white pl-9 pr-3 text-[0.9rem] outline-none focus:border-admin-acento xl:min-h-12 xl:text-base"
            />
          </div>
          <div className="flex gap-2">
            {(['todos', 'ropa', 'merceria'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltro(f)}
                className={`min-h-9 rounded-md px-3 text-[0.85rem] font-medium transition-colors xl:min-h-11 xl:px-4 xl:text-[0.95rem] ${
                  filtro === f
                    ? 'bg-admin-acento-fondo text-admin-acento'
                    : 'text-admin-texto-3 hover:bg-admin-fondo'
                }`}
              >
                {f === 'todos' ? c.filtroTodos : f === 'ropa' ? c.filtroRopa : c.filtroMerceria}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p className="text-[0.9rem] text-admin-texto-3">{c.cargando}</p>}
        {isError && <p className="text-[0.9rem] text-admin-error">{c.errorCarga}</p>}

        {!isLoading && !isError && productos.length === 0 && (
          <div className="rounded-lg border border-dashed border-admin-borde-campo p-8 text-center">
            <p className="font-medium text-admin-texto">{c.vacioTitulo}</p>
            <p className="mt-1 text-[0.9rem] text-admin-texto-3">{c.vacioTexto}</p>
          </div>
        )}

        {!isLoading && productos.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-admin-borde bg-white">
            <table className="w-full table-fixed text-left text-[0.9rem] xl:text-[0.95rem]">
              <colgroup>
                <col className="w-1/2" />
                <col className="hidden lg:table-column lg:w-1/5" />
                <col className="hidden lg:table-column lg:w-1/6" />
                <col className="w-1/2 lg:w-auto" />
              </colgroup>
              <thead className="hidden bg-admin-fondo text-[0.8rem] text-admin-texto-3 lg:table-header-group xl:text-[0.85rem]">
                <tr>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaNombre}</th>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaCategoria}</th>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaPrecio}</th>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaEstado}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-borde-2">
                {productos.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navegar(`/admin/productos/${p.id}`)}
                    tabIndex={0}
                    role="link"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navegar(`/admin/productos/${p.id}`);
                    }}
                    className="cursor-pointer hover:bg-admin-fondo focus-visible:bg-admin-fondo focus-visible:outline-none"
                  >
                    <td className="px-4 py-3 xl:px-6 xl:py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-admin-texto">{p.nombre}</span>
                        <span className="flex gap-2 text-[0.75rem] text-admin-texto-tenue lg:hidden">
                          {p.categoria}
                          {p.precio_centimos != null && ` · ${(p.precio_centimos / 100).toFixed(2)} €`}
                        </span>
                        <span className="flex gap-2 text-[0.75rem]">
                          {p.agotado && <span className="text-admin-error">{c.etiquetaAgotado}</span>}
                          {p.destacado && <span className="text-admin-acento">{c.etiquetaDestacado}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-admin-texto-2 lg:table-cell xl:px-6 xl:py-4">{p.categoria}</td>
                    <td className="hidden px-4 py-3 text-admin-texto-2 lg:table-cell xl:px-6 xl:py-4">
                      {p.precio_centimos != null ? `${(p.precio_centimos / 100).toFixed(2)} €` : '—'}
                    </td>
                    <td className="px-4 py-3 xl:px-6 xl:py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-medium xl:px-3 xl:py-1.5 xl:text-[0.8rem] ${
                          p.visible ? 'bg-admin-acento-fondo text-admin-acento' : 'bg-admin-fondo text-admin-texto-tenue'
                        }`}
                      >
                        {p.visible ? c.estadoVisible : c.estadoOculto}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Link
        to="/admin/productos/nuevo"
        aria-label={c.anadir}
        className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-admin-acento text-white shadow-lg lg:hidden"
      >
        <Plus className="h-6 w-6" aria-hidden />
      </Link>
    </>
  );
}
