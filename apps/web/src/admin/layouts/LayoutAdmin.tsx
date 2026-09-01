import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin } from '../lib/api-admin';
import { useQueryClient } from '@tanstack/react-query';
import { usarSesionAdmin } from '../hooks/usar-sesion-admin';
import { ConfirmarAdmin } from '../componentes/ConfirmarAdmin';

// Con un solo destino la navegación desaparece: en escritorio una única entrada
// «Productos» en la barra lateral; en móvil cada pantalla trae su propia cabecera
// (sin barra inferior ni hamburguesa). §01-plan.md A.
export function LayoutAdmin() {
  return (
    <div className="bg-admin-fondo font-cuerpo text-admin-texto-2 lg:h-screen">
      <div className="flex lg:h-full lg:items-stretch">
        <BarraLateral />
        <div className="flex min-w-0 flex-1 flex-col lg:h-full lg:overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function BarraLateral() {
  const cliente = useQueryClient();
  const { data: sesion } = usarSesionAdmin();
  const [confirmandoSalir, setConfirmandoSalir] = useState(false);

  async function salir() {
    await apiAdmin.salir();
    cliente.setQueryData(['admin', 'yo'], null);
  }

  return (
    <aside className="hidden w-[220px] flex-none flex-col border-r border-admin-borde bg-white lg:flex xl:w-[260px]">
      <div className="border-b border-admin-borde-2 px-3.5 py-3.5 leading-tight">
        <p className="text-[0.8rem] font-bold text-admin-texto">{copysAdmin.armazon.marcaLinea1}</p>
        <p className="text-[0.8rem] font-bold text-admin-texto">{copysAdmin.armazon.marcaLinea2}</p>
        <p className="mt-0.5 text-[0.6rem] text-admin-texto-tenue">{copysAdmin.armazon.marcaSufijo}</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-2.5 rounded-md px-3 text-[0.8rem] font-bold ${
              isActive ? 'bg-admin-acento-fondo text-admin-acento' : 'text-admin-texto-2'
            }`
          }
        >
          <LayoutGrid className="h-4 w-4" aria-hidden />
          {copysAdmin.armazon.navProductos}
        </NavLink>
      </nav>
      <div className="space-y-1.5 border-t border-admin-borde-2 px-3.5 py-3.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[0.75rem] font-bold text-admin-acento"
        >
          {copysAdmin.armazon.verLaWeb}
        </a>
        <p className="text-[0.8rem] font-bold text-admin-texto">{sesion?.nombre ?? copysAdmin.armazon.nombreUsuaria}</p>
        <NavLink to="/admin/cuenta" className="block text-[0.75rem] text-admin-texto-3">
          {copysAdmin.armazon.miCuenta}
        </NavLink>
        <button
          type="button"
          className="block text-left text-[0.75rem] text-admin-texto-3"
          onClick={() => setConfirmandoSalir(true)}
        >
          {copysAdmin.armazon.salir}
        </button>
      </div>

      <ConfirmarAdmin
        abierto={confirmandoSalir}
        variante="primario"
        titulo={copysAdmin.confirmarSalir.titulo}
        descripcion={copysAdmin.confirmarSalir.texto}
        textoConfirmar={copysAdmin.confirmarSalir.boton}
        onConfirmar={salir}
        onCancelar={() => setConfirmandoSalir(false)}
      />
    </aside>
  );
}
