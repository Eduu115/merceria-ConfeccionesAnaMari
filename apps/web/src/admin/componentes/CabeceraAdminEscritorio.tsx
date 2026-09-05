import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { usarSesionAdmin } from '../hooks/usar-sesion-admin';

type Props = {
  migas?: string;
  titulo: string;
  acciones?: React.ReactNode;
};

// Cabecera de contenido en escritorio: migas pequeñas + título grande a la izquierda,
// acciones de la pantalla y quién ha entrado a la derecha (§0 Armazón común de 02-vistas.md).
export function CabeceraAdminEscritorio({ migas, titulo, acciones }: Props) {
  const { data: sesion } = usarSesionAdmin();

  return (
    <div className="hidden items-center justify-between gap-4 border-b border-admin-borde bg-white px-[2.8rem] py-[1.4rem] lg:flex xl:px-[4.2rem] xl:py-7 2xl:px-28">
      <div>
        {migas && <p className="text-[0.8rem] text-admin-texto-tenue xl:text-[0.85rem]">{migas}</p>}
        <p className="text-[1.375rem] font-bold text-admin-texto xl:text-[1.5rem]">{titulo}</p>
      </div>
      <div className="flex items-center gap-4">
        {acciones && <div className="flex items-center gap-3">{acciones}</div>}
        {sesion?.nombre && (
          <Link
            to="/admin/cuenta"
            className="flex items-center gap-2 border-l border-admin-borde-2 pl-4 text-[0.85rem] font-medium text-admin-texto-2"
          >
            <UserRound className="h-4 w-4 text-admin-texto-tenue" aria-hidden />
            {sesion.nombre}
          </Link>
        )}
      </div>
    </div>
  );
}
