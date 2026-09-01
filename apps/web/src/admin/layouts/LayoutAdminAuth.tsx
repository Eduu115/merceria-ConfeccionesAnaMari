import { Outlet } from 'react-router-dom';

// Pantalla centrada, sin navegación, para acceso y recuperación de contraseña
// (§01-plan.md Paso 0). En escritorio: tarjeta blanca de ~380 px sobre fondo gris.
// En móvil: mismo contenido a ancho completo, sin tarjeta.
export function LayoutAdminAuth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-fondo px-4.5 py-11 font-cuerpo text-admin-texto-2">
      <div className="w-full max-w-[380px] md:rounded-xl md:border md:border-admin-borde md:bg-white md:p-6">
        <Outlet />
      </div>
    </div>
  );
}
