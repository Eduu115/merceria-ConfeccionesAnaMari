import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usarRobotsNoindex } from '../../lib/seo';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin } from '../lib/api-admin';
import { CabeceraAdminEscritorio } from '../componentes/CabeceraAdminEscritorio';
import { CabeceraAdminMovil } from '../componentes/CabeceraAdminMovil';
import { CampoTexto } from '../componentes/CampoTexto';
import { BotonAdmin } from '../componentes/BotonAdmin';
import { ConfirmarAdmin } from '../componentes/ConfirmarAdmin';

export function Cuenta() {
  usarRobotsNoindex();
  const c = copysAdmin.cuenta;
  const cliente = useQueryClient();
  const navegar = useNavigate();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmandoSalir, setConfirmandoSalir] = useState(false);

  useEffect(() => {
    document.title = 'Mi cuenta · Administración';
  }, []);

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);
    try {
      await apiAdmin.cambiarContrasena(actual, nueva);
      setMensaje(c.exito);
      setActual('');
      setNueva('');
    } catch (err) {
      const cuerpo = (err as { cuerpo?: { error?: string } })?.cuerpo;
      setError(cuerpo?.error ?? c.errorActual);
    } finally {
      setEnviando(false);
    }
  }

  async function salir() {
    await apiAdmin.salir();
    cliente.setQueryData(['admin', 'yo'], null);
    navegar('/admin/entrar', { replace: true });
  }

  return (
    <>
      <CabeceraAdminMovil variante="detalle" titulo={c.titulo} atras="/admin" />
      <CabeceraAdminEscritorio titulo={c.titulo} />
      <div className="flex max-w-md flex-col gap-8 p-[1.4rem] md:p-7 lg:p-[2.8rem] xl:px-[4.2rem] xl:py-14 2xl:px-28">
        <form onSubmit={guardar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[0.95rem] font-semibold text-admin-texto">{c.seccionContrasena}</h2>
            <p className="text-[0.8rem] text-admin-texto-tenue">{c.ayudaMinimo}</p>
          </div>
          <CampoTexto
            etiqueta={c.campoActual}
            type="password"
            autoComplete="current-password"
            required
            value={actual}
            onChange={(e) => setActual(e.target.value)}
          />
          <CampoTexto
            etiqueta={c.campoNueva}
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          {mensaje && <p className="text-[0.85rem] text-admin-exito">{mensaje}</p>}
          {error && <p className="text-[0.85rem] text-admin-error">{error}</p>}
          <BotonAdmin type="submit" cargando={enviando} className="self-start">
            {enviando ? c.botonEnviando : c.boton}
          </BotonAdmin>
        </form>

        <BotonAdmin variante="secundario" onClick={() => setConfirmandoSalir(true)} className="self-start">
          {c.salir}
        </BotonAdmin>
      </div>

      <ConfirmarAdmin
        abierto={confirmandoSalir}
        variante="primario"
        titulo={copysAdmin.confirmarSalir.titulo}
        descripcion={copysAdmin.confirmarSalir.texto}
        textoConfirmar={copysAdmin.confirmarSalir.boton}
        onConfirmar={salir}
        onCancelar={() => setConfirmandoSalir(false)}
      />
    </>
  );
}
