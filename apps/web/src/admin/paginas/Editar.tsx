import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usarRobotsNoindex } from '../../lib/seo';
import { FormularioProducto } from '../componentes/FormularioProducto';

export function Editar() {
  usarRobotsNoindex();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    document.title = 'Editar producto · Administración';
  }, []);
  return <FormularioProducto modo="editar" productoId={Number(id)} />;
}
