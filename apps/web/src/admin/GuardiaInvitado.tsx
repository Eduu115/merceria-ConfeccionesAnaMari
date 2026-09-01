import { Navigate, Outlet } from 'react-router-dom';
import { usarSesionAdmin } from './hooks/usar-sesion-admin';

// Con sesión, /admin/entrar redirige a /admin (§D del plan).
export function GuardiaInvitado() {
  const { data, isLoading } = usarSesionAdmin();

  if (isLoading) return null;
  if (data) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
