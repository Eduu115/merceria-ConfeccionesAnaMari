import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usarRobotsNoindex } from '../../lib/seo';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin } from '../lib/api-admin';
import { CampoTexto } from '../componentes/CampoTexto';
import { BotonAdmin } from '../componentes/BotonAdmin';

export function Acceso() {
  usarRobotsNoindex();
  const c = copysAdmin.acceso;
  const cliente = useQueryClient();
  const navegar = useNavigate();
  const ubicacion = useLocation() as { state?: { desde?: Location } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = 'Entrar · Administración';
  }, []);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const usuario = await apiAdmin.entrar({ email, password });
      cliente.setQueryData(['admin', 'yo'], usuario);
      const destino = ubicacion.state?.desde?.pathname ?? '/admin';
      navegar(destino, { replace: true });
    } catch (err) {
      const cuerpo = (err as { cuerpo?: { error?: string } })?.cuerpo;
      setError(cuerpo?.error ?? c.errorGenerico);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-5">
      <h1 className="text-[1.3rem] font-semibold text-admin-texto">{c.titulo}</h1>
      <CampoTexto
        etiqueta={c.campoEmail}
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CampoTexto
        etiqueta={c.campoContrasena}
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-[0.85rem] text-admin-error">{error}</p>}
      <BotonAdmin type="submit" cargando={enviando} className="w-full">
        {enviando ? c.botonEnviando : c.boton}
      </BotonAdmin>
    </form>
  );
}
