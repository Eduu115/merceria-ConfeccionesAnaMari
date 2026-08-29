import { Link } from 'react-router-dom';
import { cx } from '../lib/cx';

type Miga = { href?: string; label: string };

export function CabeceraDePagina({
  migas,
  titulo,
  intro,
  fecha,
}: {
  migas: Miga[];
  titulo: string;
  intro?: string;
  fecha?: string;
}) {
  return (
    <header className="border-b border-borde bg-crema">
      <div className="envoltorio py-6 md:py-8">
        <nav aria-label="Migas de pan" className="mb-3 text-sm text-tinta-apagada">
          {migas.map((m, i) => (
            <span key={`${m.label}-${i}`}>
              {i > 0 && <span className="mx-1.5">·</span>}
              {m.href ? (
                <Link to={m.href} className="hover:text-acento hover:underline">
                  {m.label}
                </Link>
              ) : (
                <span className="text-tinta-3">{m.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-titular text-[2.15rem] font-semibold leading-[1.15] text-tinta md:text-[2.5rem]">
          {titulo}
        </h1>
        {fecha && <p className="mt-2 text-sm text-tinta-tenue">{fecha}</p>}
        {intro && <p className={cx('mt-3 max-w-2xl text-tinta-3')}>{intro}</p>}
      </div>
    </header>
  );
}
