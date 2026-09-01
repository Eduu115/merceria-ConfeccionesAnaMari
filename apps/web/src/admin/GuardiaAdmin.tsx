import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usarSesionAdmin } from './hooks/usar-sesion-admin';

// /admin sin sesión redirige a /admin/entrar (§D del plan).
export function GuardiaAdmin() {
  const { data, isLoading, isError } = usarSesionAdmin();
  const loc = useLocation();

  if (isLoading) return null;
  if (isError || !data) {
    return <Navigate to="/admin/entrar" replace state={{ desde: loc }} />;
  }
  return <Outlet />;
}
