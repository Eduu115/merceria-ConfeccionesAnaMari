import { Link } from 'react-router-dom';
import { usarAjustes } from '../hooks/usar-ajustes';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys } from '../lib/copys';
import { telHref } from '../lib/whatsapp';

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

  return (
    <footer className="mt-auto bg-arena-2">
      <div className="envoltorio grid gap-10 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-titular text-xl text-tinta">{copys.negocio}</p>
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
      <div className="bg-arena-3 py-3 text-center text-sm text-tinta-apagada">
        {copys.pie.copyright}
      </div>
    </footer>
  );
}
