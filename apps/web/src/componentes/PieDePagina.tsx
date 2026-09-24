import { Link } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';
import { usarAjustes } from '../hooks/usar-ajustes';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys } from '../lib/copys';
import { telHref } from '../lib/whatsapp';
import { LogoMarca } from './LogoMarca';
import { cx } from '../lib/cx';

const CREDITOS = [
  {
    nombre: 'Eduardo Serrano',
    linkedin: 'https://www.linkedin.com/in/eduardo-serrano-trenado',
    github: 'https://github.com/Eduu115',
  },
  {
    nombre: 'Anthony Gómez',
    linkedin: 'https://www.linkedin.com/in/anthony-e-gomez',
    github: 'https://github.com/Tony1406',
  },
] as const;

function IconosPerfil({ linkedin, github, nombre }: { linkedin: string; github: string; nombre: string }) {
  const clase = cx(
    'inline-flex h-7 w-7 items-center justify-center rounded-md text-tinta-apagada',
    'transition-colors hover:bg-arena-2 hover:text-tinta',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-borde',
  );
  return (
    <span className="ml-0.5 inline-flex items-center gap-0.5 align-middle">
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={clase}
        aria-label={`LinkedIn de ${nombre}`}
      >
        <Linkedin className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />
      </a>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className={clase}
        aria-label={`GitHub de ${nombre}`}
      >
        <Github className="h-3.5 w-3.5" aria-hidden strokeWidth={1.75} />
      </a>
    </span>
  );
}

function CreditoPersona({
  nombre,
  linkedin,
  github,
}: {
  nombre: string;
  linkedin: string;
  github: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
      <span>{nombre}</span>
      <IconosPerfil nombre={nombre} linkedin={linkedin} github={github} />
    </span>
  );
}

export function PieDePagina() {
  const { data: ajustes } = usarAjustes();
  const { data: horario } = useQuery({
    queryKey: ['horario'],
    queryFn: api.horario,
    staleTime: 5 * 60 * 1000,
  });
  if (!ajustes) return null;

  const redes = [
    ajustes.redes_facebook && { href: ajustes.redes_facebook, label: 'Facebook' },
    ajustes.redes_instagram && { href: ajustes.redes_instagram, label: 'Instagram' },
  ].filter(Boolean) as { href: string; label: string }[];

  const [eduardo, anthony] = CREDITOS;

  return (
    <footer className="mt-auto bg-arena-2">
      <div className="envoltorio grid gap-10 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label={copys.negocio}>
            <LogoMarca tamano="pie" />
            <span className="font-titular text-2xl text-tinta">{copys.negocio}</span>
          </Link>
          <p className="mt-2 max-w-md text-tinta-3">{ajustes.negocio_descripcion}</p>
          <p className="mt-4 text-tinta-2">
            {ajustes.direccion} · {ajustes.poblacion}
          </p>
          <p>
            <a className="hover:underline" href={telHref(ajustes.telefono)}>
              {ajustes.telefono}
            </a>
            {' · '}
            <a className="hover:underline" href={`mailto:${ajustes.email}`}>
              {ajustes.email}
            </a>
          </p>
          {horario && <p className="mt-1 text-sm text-tinta-apagada">{horario.linea}</p>}
          {redes.length > 0 && (
            <ul className="mt-3 flex gap-3">
              {redes.map((r) => (
                <li key={r.label}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="underline">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="mb-3 text-rotulo font-semibold uppercase text-tinta-apagada">
            {copys.pie.informacion}
          </p>
          <ul className="space-y-2">
            <li>
              <Link className="hover:underline" to="/preguntas-frecuentes">
                {copys.pie.faq}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/contacto">
                {copys.pie.comoLlegar}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/aviso-legal">
                {copys.pie.aviso}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/privacidad">
                {copys.pie.privacidad}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/cookies">
                {copys.pie.cookies}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-borde/60 bg-arena-3 px-4 py-4 text-center text-[0.8rem] leading-relaxed text-tinta-apagada">
        <p className="text-tinta-apagada/90">{copys.pie.copyright}</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
          <span>{copys.pie.desarrolladoPor}</span>
          <CreditoPersona {...eduardo} />
          <span>{copys.pie.yPor}</span>
          <CreditoPersona {...anthony} />
          <span className="mx-0.5 text-borde" aria-hidden>
            ·
          </span>
          <span
            className="inline-flex items-center opacity-80 transition-opacity hover:opacity-100"
            title="Gubia Digital"
          >
            <img
              src="/creditos/gubia-lockup-tinta.svg"
              alt="gubia"
              width={120}
              height={46}
              className="h-[1.35rem] w-auto"
              loading="lazy"
              decoding="async"
            />
          </span>
        </p>
      </div>
    </footer>
  );
}
