import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, LogOut, Menu, User } from 'lucide-react';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin } from '../lib/api-admin';
import { ConfirmarAdmin } from './ConfirmarAdmin';

type Props =
  | { variante: 'listado'; titulo: string }
  | { variante: 'detalle'; titulo: string; atras: string };

// Cabecera móvil del panel: sin barra inferior (§0 Armazón común de 02-vistas.md).
// En «listado» el título deja claro que esto es el modo administrador, y un botón
// tipo hamburguesa despliega «Ver la web», «Mi cuenta» y «Salir» — lo que en
// escritorio ofrece la barra lateral pero en móvil no tenía sitio.
export function CabeceraAdminMovil(props: Props) {
  if (props.variante === 'listado') {
    return <CabeceraListado titulo={props.titulo} />;
  }

  return (
    <div className="flex h-11 items-center justify-between border-b border-admin-borde bg-white px-3.5 lg:hidden">
      <Link to={props.atras} className="flex h-11 min-w-11 items-center gap-1 text-admin-texto-3" aria-label="Volver">
        <ArrowLeft className="h-5 w-5" aria-hidden />
      </Link>
      <span className="truncate text-[0.95rem] font-bold text-admin-texto">{props.titulo}</span>
      <span className="w-11" aria-hidden />
    </div>
  );
}

function CabeceraListado({ titulo }: { titulo: string }) {
  const cliente = useQueryClient();
  const navegar = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [confirmandoSalir, setConfirmandoSalir] = useState(false);

  async function salir() {
    await apiAdmin.salir();
    cliente.setQueryData(['admin', 'yo'], null);
    navegar('/admin/entrar', { replace: true });
  }

  return (
    <div className="relative border-b border-admin-borde bg-white lg:hidden">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[0.62rem] font-semibold uppercase tracking-wide text-admin-acento">
            {copysAdmin.armazon.modoAdmin}
          </span>
          <span className="truncate text-[1.05rem] font-bold text-admin-texto">{titulo}</span>
        </div>
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-admin-borde-campo bg-white text-admin-texto-2"
        >
          <Menu className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {abierto && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute right-3.5 top-[calc(100%+6px)] z-40 w-56 overflow-hidden rounded-xl border border-admin-borde bg-white shadow-lg">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 text-[0.9rem] font-medium text-admin-texto-2"
            >
              <ExternalLink className="h-4 w-4 text-admin-texto-tenue" aria-hidden />
              {copysAdmin.armazon.verLaWeb}
            </a>
            <Link
              to="/admin/cuenta"
              onClick={() => setAbierto(false)}
              className="flex items-center gap-2.5 border-t border-admin-borde-2 px-4 py-3 text-[0.9rem] font-medium text-admin-texto-2"
            >
              <User className="h-4 w-4 text-admin-texto-tenue" aria-hidden />
              {copysAdmin.armazon.miCuenta}
            </Link>
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                setConfirmandoSalir(true);
              }}
              className="flex w-full items-center gap-2.5 border-t border-admin-borde-2 px-4 py-3 text-left text-[0.9rem] font-medium text-admin-error"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {copysAdmin.armazon.salir}
            </button>
          </div>
        </>
      )}

      <ConfirmarAdmin
        abierto={confirmandoSalir}
        variante="primario"
        titulo={copysAdmin.confirmarSalir.titulo}
        descripcion={copysAdmin.confirmarSalir.texto}
        textoConfirmar={copysAdmin.confirmarSalir.boton}
        onConfirmar={salir}
        onCancelar={() => setConfirmandoSalir(false)}
      />
    </div>
  );
}
