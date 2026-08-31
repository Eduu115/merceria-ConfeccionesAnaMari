import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { esquemaContacto, type DatosContacto } from '@anamari/compartido';
import { Check } from 'lucide-react';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { TablaHorario } from '../componentes/TablaHorario';
import { Mapa } from '../componentes/Mapa';
import { Boton } from '../componentes/Boton';
import { IconoWhatsApp } from '../componentes/BurbujaWhatsApp';
import { enlaceWhatsApp, mapsDir, telHref } from '../lib/whatsapp';
import { cx } from '../lib/cx';

export function Contacto() {
  usarSeo(metas['/contacto'].title, metas['/contacto'].description);
  const { data: a } = useQuery({ queryKey: ['ajustes'], queryFn: api.ajustes });
  const { data: horario } = useQuery({ queryKey: ['horario'], queryFn: api.horario });
  if (!a || !horario) return <div className="envoltorio py-16">Cargando…</div>;

  const wa = enlaceWhatsApp(a.whatsapp_telefono, 'cabecera');
  const botones = (
    <div className="flex flex-col gap-3 md:flex-row">
      <Boton variante="whatsapp" href={wa} externo aria-label="WhatsApp" className="md:flex-none">
        <IconoWhatsApp className="h-4 w-4" />
        {copys.botones.whatsapp}
      </Boton>
      <div className="grid grid-cols-2 gap-3 md:contents">
        <Boton variante="secundario" href={telHref(a.telefono)}>
          {copys.botones.llamar}
        </Boton>
        <Boton variante="secundario" href={mapsDir(a.direccion, a.poblacion)} externo>
          {copys.botones.comoLlegar}
        </Boton>
      </div>
    </div>
  );

  return (
    <>
      <CabeceraDePagina
        migas={[{ href: '/', label: 'Inicio' }, { label: copys.contacto.titulo }]}
        titulo={copys.contacto.titulo}
      />
      <section className="envoltorio grid gap-8 py-10 md:grid-cols-2">
        <div className="order-1 md:order-none">
          <div className="mb-6 md:hidden">{botones}</div>
          <p className="font-semibold text-tinta">{a.direccion}</p>
          <p>{a.poblacion}</p>
          <p className="mt-2">
            <a className="hover:underline" href={telHref(a.telefono)}>
              {a.telefono}
            </a>
          </p>
          <p>
            <a className="hover:underline" href={`mailto:${a.email}`}>
              {a.email}
            </a>
          </p>
          <div className="mt-4">
            <TablaHorario dias={horario.dias} />
          </div>
          <div className="mt-6 hidden md:block">{botones}</div>
        </div>
        <div className="relative order-3 min-h-[280px] md:order-none">
          <Mapa
            url={a.mapa_embed_url}
            titulo="Mapa de Confecciones Ana Mari en Getafe"
            className="absolute inset-0 h-full min-h-[280px] w-full"
          />
        </div>
        <div className="order-2 md:col-span-2">
          <FormularioContacto telefono={a.whatsapp_telefono} />
        </div>
      </section>
    </>
  );
}

function FormularioContacto({ telefono }: { telefono: string }) {
  const [ok, setOk] = useState(false);
  const form = useForm<DatosContacto>({
    resolver: zodResolver(esquemaContacto),
    mode: 'onBlur',
  });

  if (ok) {
    return (
      <div className="border-[1.5px] border-acento bg-acento-fondo p-6">
        <Check className="mb-2 h-8 w-8 text-acento" aria-hidden />
        <h2 className="font-titular text-2xl text-tinta">{copys.contacto.exitoTitulo}</h2>
        <p className="mt-2 text-tinta-3">{copys.contacto.exitoTexto}</p>
        <div className="mt-4">
          <Boton variante="whatsapp" href={enlaceWhatsApp(telefono, 'cabecera')} externo>
            <IconoWhatsApp className="h-4 w-4" />
            {copys.botones.whatsapp}
          </Boton>
        </div>
      </div>
    );
  }

  return (
    <form
      className="max-w-xl"
      onSubmit={form.handleSubmit(async (vals) => {
        try {
          await api.contacto(vals);
          setOk(true);
        } catch (e) {
          const err = e as { status?: number; cuerpo?: { errores?: Record<string, string> } };
          if (err.status === 422 && err.cuerpo?.errores) {
            for (const [k, v] of Object.entries(err.cuerpo.errores)) {
              form.setError(k as keyof DatosContacto, { message: v });
            }
          }
        }
      })}
      noValidate
    >
      <h2 className="font-titular text-2xl text-tinta">{copys.contacto.formTitulo}</h2>
      <p className="mt-2 text-tinta-3">{copys.contacto.formIntro}</p>
      <Campo label={copys.contacto.nombre} error={form.formState.errors.nombre?.message}>
        <input
          className={inputCls(!!form.formState.errors.nombre)}
          autoComplete="name"
          {...form.register('nombre')}
        />
      </Campo>
      <Campo label={copys.contacto.email} error={form.formState.errors.email?.message}>
        <input
          type="email"
          className={inputCls(!!form.formState.errors.email)}
          autoComplete="email"
          {...form.register('email')}
        />
      </Campo>
      <Campo label={copys.contacto.mensaje} error={form.formState.errors.mensaje?.message}>
        <textarea
          rows={5}
          className={inputCls(!!form.formState.errors.mensaje)}
          {...form.register('mensaje')}
        />
      </Campo>
      <div className="absolute -left-[9999px]" aria-hidden>
        <input tabIndex={-1} autoComplete="off" {...form.register('sitio')} />
      </div>
      <div className="mt-4">
        <Boton type="submit" cargando={form.formState.isSubmitting}>
          {copys.botones.enviar}
        </Boton>
      </div>
    </form>
  );
}

function Campo({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-medium text-tinta">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-error">{error}</span>}
    </label>
  );
}

function inputCls(error: boolean) {
  return cx(
    'w-full border bg-white px-3 py-2.5',
    error ? 'border-[1.5px] border-error' : 'border-borde-fuerte',
  );
}
