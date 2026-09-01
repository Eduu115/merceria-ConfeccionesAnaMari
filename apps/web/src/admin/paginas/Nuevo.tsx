import { useEffect } from 'react';
import { usarRobotsNoindex } from '../../lib/seo';
import { FormularioProducto } from '../componentes/FormularioProducto';

export function Nuevo() {
  usarRobotsNoindex();
  useEffect(() => {
    document.title = 'Añadir producto · Administración';
  }, []);
  return <FormularioProducto modo="crear" />;
}
