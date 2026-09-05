import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { usarRobotsNoindex } from '../../lib/seo';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin } from '../lib/api-admin';
import { CabeceraAdminEscritorio } from '../componentes/CabeceraAdminEscritorio';
import { CabeceraAdminMovil } from '../componentes/CabeceraAdminMovil';
import { BotonAdmin } from '../componentes/BotonAdmin';

const ETIQUETA_ROL = {
  admin_web: copysAdmin.usuarios.rolAdminWeb,
  propietario: copysAdmin.usuarios.rolPropietario,
  cliente: copysAdmin.usuarios.rolCliente,
};

export function Usuarios() {
  usarRobotsNoindex();
  const c = copysAdmin.usuarios;
  const navegar = useNavigate();

  useEffect(() => {
    document.title = 'Usuarios · Administración';
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'usuarios'],
    queryFn: () => apiAdmin.usuarios.listar(),
  });

  return (
    <>
      <CabeceraAdminMovil variante="detalle" titulo={c.titulo} atras="/admin" />
      <CabeceraAdminEscritorio
        titulo={c.titulo}
        acciones={
          <Link to="/admin/usuarios/nuevo">
            <BotonAdmin>
              <Plus className="h-4 w-4" aria-hidden /> {c.anadir}
            </BotonAdmin>
          </Link>
        }
      />

      <div className="flex flex-col gap-4 p-4 md:p-5 lg:p-8 lg:text-base xl:px-[4.2rem] xl:py-14 xl:gap-6 2xl:px-28">
        {isLoading && <p className="text-[0.9rem] text-admin-texto-3">{c.cargando}</p>}
        {isError && <p className="text-[0.9rem] text-admin-error">{c.errorCarga}</p>}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="rounded-lg border border-dashed border-admin-borde-campo p-8 text-center">
            <p className="font-medium text-admin-texto">{c.vacioTitulo}</p>
            <p className="mt-1 text-[0.9rem] text-admin-texto-3">{c.vacioTexto}</p>
          </div>
        )}

        {!isLoading && data && data.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-admin-borde bg-white">
            <table className="w-full table-fixed text-left text-[0.9rem] xl:text-[0.95rem]">
              <colgroup>
                <col className="w-1/2" />
                <col className="hidden lg:table-column lg:w-1/4" />
                <col className="hidden lg:table-column lg:w-1/6" />
                <col className="w-1/2 lg:w-auto" />
              </colgroup>
              <thead className="hidden bg-admin-fondo text-[0.8rem] text-admin-texto-3 lg:table-header-group xl:text-[0.85rem]">
                <tr>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaNombre}</th>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaCorreo}</th>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaRol}</th>
                  <th className="px-4 py-3 xl:px-6 xl:py-4 font-medium">{c.columnaEstado}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-borde-2">
                {data.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => navegar(`/admin/usuarios/${u.id}`)}
                    tabIndex={0}
                    role="link"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navegar(`/admin/usuarios/${u.id}`);
                    }}
                    className="cursor-pointer hover:bg-admin-fondo focus-visible:bg-admin-fondo focus-visible:outline-none"
                  >
                    <td className="px-4 py-3 xl:px-6 xl:py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-admin-texto">{u.nombre}</span>
                        <span className="text-[0.75rem] text-admin-texto-tenue lg:hidden">{u.email}</span>
                        <span className="text-[0.75rem] text-admin-texto-tenue lg:hidden">{ETIQUETA_ROL[u.rol]}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-admin-texto-2 lg:table-cell xl:px-6 xl:py-4">{u.email}</td>
                    <td className="hidden px-4 py-3 text-admin-texto-2 lg:table-cell xl:px-6 xl:py-4">
                      {ETIQUETA_ROL[u.rol]}
                    </td>
                    <td className="px-4 py-3 xl:px-6 xl:py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-medium xl:px-3 xl:py-1.5 xl:text-[0.8rem] ${
                          u.activo ? 'bg-admin-acento-fondo text-admin-acento' : 'bg-admin-fondo text-admin-texto-tenue'
                        }`}
                      >
                        {u.activo ? c.estadoActivo : c.estadoInactivo}
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
        to="/admin/usuarios/nuevo"
        aria-label={c.anadir}
        className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-admin-acento text-white shadow-lg lg:hidden"
      >
        <Plus className="h-6 w-6" aria-hidden />
      </Link>
    </>
  );
}
