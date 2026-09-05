import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usarRobotsNoindex } from '../../lib/seo';
import { FormularioUsuario } from '../componentes/FormularioUsuario';

export function UsuarioEditar() {
  usarRobotsNoindex();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    document.title = 'Editar usuario · Administración';
  }, []);
  return <FormularioUsuario modo="editar" usuarioId={Number(id)} />;
}
