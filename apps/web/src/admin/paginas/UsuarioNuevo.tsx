import { useEffect } from 'react';
import { usarRobotsNoindex } from '../../lib/seo';
import { FormularioUsuario } from '../componentes/FormularioUsuario';

export function UsuarioNuevo() {
  usarRobotsNoindex();
  useEffect(() => {
    document.title = 'Añadir usuario · Administración';
  }, []);
  return <FormularioUsuario modo="crear" />;
}
