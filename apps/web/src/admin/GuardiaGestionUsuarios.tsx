import { Navigate, Outlet } from 'react-router-dom';
import { usarSesionAdmin } from './hooks/usar-sesion-admin';

// Solo admin_web gestiona usuarios y roles; propietario no llega aquí.
export function GuardiaGestionUsuarios() {
  const { data, isLoading } = usarSesionAdmin();

  if (isLoading) return null;
  if (data?.rol !== 'admin_web') {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
