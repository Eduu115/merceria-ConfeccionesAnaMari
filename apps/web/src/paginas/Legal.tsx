import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { copys, metas } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { CabeceraDePagina } from '../componentes/CabeceraDePagina';
import { partirMarkdown } from '../lib/markdown';
import { cx } from '../lib/cx';

const SLUGS = ['aviso-legal', 'privacidad', 'cookies'] as const;
const TITULOS: Record<string, string> = {
  'aviso-legal': 'Aviso legal',
  privacidad: 'Política de privacidad',
  cookies: 'Política de cookies',
};

export function Legal() {
  const slug = useLocation().pathname.replace(/^\//, '');
  const meta = metas[`/${slug}`] ?? metas['/aviso-legal'];
  usarSeo(meta.title, meta.description);
  const { data } = useQuery({
    queryKey: ['pagina', slug],
    queryFn: () => api.pagina(slug),
  });
  const [activo, setActivo] = useState('apartado-1');

  const apartados = data ? partirMarkdown(data.contenido) : [];

  useEffect(() => {
    if (!apartados.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target.id) setActivo(vis.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 1] },
    );
    for (const a of apartados) {
      const el = document.getElementById(a.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [apartados]);

  if (!data) return <div className="envoltorio py-16">Cargando…</div>;
  const fecha = new Date(data.actualizado_en).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const otras = SLUGS.filter((s) => s !== slug);

  const indice = (
    <nav aria-label={copys.legal.indice}>
      <p className="mb-3 text-rotulo font-semibold uppercase text-tinta-apagada">
        {copys.legal.indice}
      </p>
      <ul className="space-y-1">
        {apartados.map((a) => (
          <li key={a.id}>
            <a
              href={`#${a.id}`}
              className={cx(
                'block border-l-2 py-1 pl-3 text-sm',
                activo === a.id ? 'border-acento text-tinta' : 'border-transparent text-tinta-3',
              )}
            >
              {a.titulo}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <CabeceraDePagina
        migas={[{ href: '/', label: 'Inicio' }, { label: TITULOS[slug] ?? data.titulo }]}
        titulo={data.titulo}
        fecha={`${copys.legal.actualizacion}: ${fecha}`}
      />
      <div className="envoltorio grid gap-10 py-10 md:grid-cols-[0.42fr_1fr]">
        <details className="md:hidden">
          <summary className="min-h-11 cursor-pointer font-medium">{copys.legal.indiceMovil}</summary>
          <div className="pt-3">{indice}</div>
        </details>
        <aside className="sticky top-24 hidden self-start md:block">{indice}</aside>
        <article className="max-w-medida">
          {apartados.map((a) => (
            <section key={a.id} id={a.id} className="mb-10 scroll-mt-28">
              <h2 className="mb-3 font-titular text-xl text-tinta">{a.titulo}</h2>
              <div
                className="space-y-3 text-tinta-3 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: a.html }}
              />
            </section>
          ))}
          <div className="border-t border-borde pt-6">
            <p className="mb-2 font-medium text-tinta">{copys.legal.otras}</p>
            <ul className="space-y-1">
              {otras.map((s) => (
                <li key={s}>
                  <Link className="text-acento underline" to={`/${s}`}>
                    {TITULOS[s]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}
