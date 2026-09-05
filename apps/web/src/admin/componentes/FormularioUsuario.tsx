import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { copysAdmin } from '../lib/copys-admin';
import { apiAdmin, type UsuarioGestionado } from '../lib/api-admin';
import { usarSesionAdmin } from '../hooks/usar-sesion-admin';
import { CabeceraAdminEscritorio } from './CabeceraAdminEscritorio';
import { CabeceraAdminMovil } from './CabeceraAdminMovil';
import { CampoTexto } from './CampoTexto';
import { BotonAdmin } from './BotonAdmin';
import { ToggleAdmin } from './ToggleAdmin';
import { ConfirmarAdmin } from './ConfirmarAdmin';

type Props = { modo: 'crear' } | { modo: 'editar'; usuarioId: number };

const ID_FORMULARIO = 'formulario-usuario';
const ROLES: { valor: 'admin_web' | 'propietario'; etiqueta: keyof typeof copysAdmin.usuarios }[] = [
  { valor: 'admin_web', etiqueta: 'rolAdminWeb' },
  { valor: 'propietario', etiqueta: 'rolPropietario' },
];

export function FormularioUsuario(props: Props) {
  const c = copysAdmin.formularioUsuario;
  const navegar = useNavigate();
  const cliente = useQueryClient();
  const { data: sesion } = usarSesionAdmin();

  const detalle = useQuery({
    queryKey: ['admin', 'usuario', props.modo === 'editar' ? props.usuarioId : null],
    queryFn: () => apiAdmin.usuarios.obtener((props as { usuarioId: number }).usuarioId),
    enabled: props.modo === 'editar',
  });

  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'admin_web' | 'propietario' | 'cliente'>('propietario');
  const [activo, setActivo] = useState(true);
  const [password, setPassword] = useState('');
  const [cargado, setCargado] = useState(props.modo === 'crear');
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.modo === 'editar' && detalle.data && !cargado) {
      const d: UsuarioGestionado = detalle.data;
      setEmail(d.email);
      setNombre(d.nombre);
      setRol(d.rol);
      setActivo(d.activo);
      setCargado(true);
    }
  }, [detalle.data, props.modo, cargado]);

  const esUnoMismo = props.modo === 'editar' && sesion?.id === props.usuarioId;
  const titulo = props.modo === 'editar' ? c.tituloEditar : c.tituloNuevo;

  async function guardar(ev: React.FormEvent) {
    ev.preventDefault();
    setError('');
    if (props.modo === 'crear' && password.length < 8) {
      setError(c.errorGenerico);
      return;
    }
    setGuardando(true);
    try {
      if (props.modo === 'editar') {
        await apiAdmin.usuarios.actualizar(props.usuarioId, {
          nombre,
          rol,
          activo,
          password: password || undefined,
        });
        await cliente.invalidateQueries({ queryKey: ['admin', 'usuario', props.usuarioId] });
      } else {
        await apiAdmin.usuarios.crear({ email, nombre, rol, password });
      }
      await cliente.invalidateQueries({ queryKey: ['admin', 'usuarios'] });
      navegar('/admin/usuarios', { replace: true });
    } catch (err) {
      const cuerpo = (err as { cuerpo?: { error?: string } })?.cuerpo;
      setError(cuerpo?.error ?? c.errorGenerico);
    } finally {
      setGuardando(false);
    }
  }

  async function borrarUsuario() {
    if (props.modo !== 'editar') return;
    setBorrando(true);
    try {
      await apiAdmin.usuarios.borrar(props.usuarioId);
      await cliente.invalidateQueries({ queryKey: ['admin', 'usuarios'] });
      navegar('/admin/usuarios', { replace: true });
    } catch (err) {
      const cuerpo = (err as { cuerpo?: { error?: string } })?.cuerpo;
      setError(cuerpo?.error ?? c.errorGenerico);
    } finally {
      setBorrando(false);
      setConfirmandoBorrar(false);
    }
  }

  const accionesEscritorio = (
    <>
      {props.modo === 'editar' && !esUnoMismo && (
        <BotonAdmin variante="peligro" cargando={borrando} onClick={() => setConfirmandoBorrar(true)}>
          {borrando ? c.borrando : c.borrar}
        </BotonAdmin>
      )}
      <Link to="/admin/usuarios">
        <BotonAdmin variante="secundario">Cancelar</BotonAdmin>
      </Link>
      <BotonAdmin type="submit" form={ID_FORMULARIO} cargando={guardando} className="min-w-24">
        {guardando ? c.guardando : c.guardar}
      </BotonAdmin>
    </>
  );

  if (props.modo === 'editar' && !cargado) {
    return (
      <>
        <CabeceraAdminMovil variante="detalle" titulo={titulo} atras="/admin/usuarios" />
        <CabeceraAdminEscritorio titulo={titulo} />
        <p className="p-5 text-[0.9rem] text-admin-texto-3">Cargando…</p>
      </>
    );
  }

  return (
    <>
      <CabeceraAdminMovil variante="detalle" titulo={titulo} atras="/admin/usuarios" />
      <CabeceraAdminEscritorio
        migas={props.modo === 'editar' ? 'Usuarios · Editar' : 'Usuarios · Añadir'}
        titulo={titulo}
        acciones={accionesEscritorio}
      />

      <div className="flex justify-center p-4 pb-28 md:p-7 lg:p-[2.8rem] lg:pb-8 xl:px-[4.2rem] xl:py-14 2xl:px-28">
      <form
        id={ID_FORMULARIO}
        onSubmit={guardar}
        className="flex w-full max-w-lg flex-col gap-10 rounded-xl border border-admin-borde bg-white p-6 shadow-sm md:p-8"
      >
        <section className="flex max-w-sm flex-col gap-4">
          <h2 className="font-cuerpo text-[0.95rem] font-semibold text-admin-texto">Datos de la cuenta</h2>
          {props.modo === 'editar' ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.85rem] font-medium text-admin-texto-2">{c.campoCorreo}</span>
              <span className="min-h-11 rounded-md border border-admin-borde-campo-2 bg-admin-fondo px-3 py-2.5 text-[0.95rem] text-admin-texto-3">
                {email}
              </span>
            </label>
          ) : (
            <CampoTexto
              etiqueta={c.campoCorreo}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <CampoTexto etiqueta={c.campoNombre} required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </section>

        <section className="flex max-w-sm flex-col gap-4 border-t border-admin-borde-2 pt-8">
          <h2 className="font-cuerpo text-[0.95rem] font-semibold text-admin-texto">Rol y acceso</h2>
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.85rem] font-medium text-admin-texto-2">{c.campoRol}</span>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.valor}
                  type="button"
                  disabled={esUnoMismo}
                  onClick={() => setRol(r.valor)}
                  className={`min-h-11 flex-1 rounded-md border text-[0.9rem] font-medium transition-colors disabled:opacity-60 ${
                    rol === r.valor
                      ? 'border-admin-acento bg-admin-acento-fondo text-admin-acento'
                      : 'border-admin-borde-campo text-admin-texto-2'
                  }`}
                >
                  {copysAdmin.usuarios[r.etiqueta]}
                </button>
              ))}
            </div>
          </label>
          {props.modo === 'editar' && (
            <ToggleAdmin
              etiqueta={c.campoActivo}
              ayuda={esUnoMismo ? c.errorPropioAcceso : c.campoActivoAyuda}
              checked={activo}
              onChange={esUnoMismo ? () => {} : setActivo}
            />
          )}
        </section>

        <section className="flex max-w-sm flex-col gap-1.5 border-t border-admin-borde-2 pt-8">
          <h2 className="font-cuerpo text-[0.95rem] font-semibold text-admin-texto">{c.campoContrasena}</h2>
          <CampoTexto
            etiqueta={props.modo === 'editar' ? c.campoContrasenaNueva : c.campoContrasena}
            type="password"
            autoComplete="new-password"
            minLength={8}
            required={props.modo === 'crear'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-[0.8rem] text-admin-texto-tenue">
            {props.modo === 'editar' ? c.ayudaContrasenaNueva : c.ayudaMinimo}
          </p>
        </section>

        {error && <p className="text-[0.85rem] text-admin-error">{error}</p>}
      </form>
      </div>

      <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-admin-borde bg-white p-4 lg:hidden">
        {props.modo === 'editar' && !esUnoMismo && (
          <BotonAdmin variante="peligro" cargando={borrando} onClick={() => setConfirmandoBorrar(true)}>
            {borrando ? c.borrando : c.borrar}
          </BotonAdmin>
        )}
        <BotonAdmin type="submit" form={ID_FORMULARIO} cargando={guardando} className="flex-1">
          {guardando ? c.guardando : c.guardar}
        </BotonAdmin>
      </div>

      <ConfirmarAdmin
        abierto={confirmandoBorrar}
        titulo={c.confirmarBorrarTitulo}
        descripcion={c.confirmarBorrarTexto}
        textoConfirmar={borrando ? c.borrando : c.confirmarBorrarBoton}
        cargando={borrando}
        onConfirmar={borrarUsuario}
        onCancelar={() => setConfirmandoBorrar(false)}
      />
    </>
  );
}
