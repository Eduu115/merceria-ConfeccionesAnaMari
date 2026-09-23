import { useEffect } from 'react';

const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

function asegurarMeta(attr: 'name' | 'property', key: string, content: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function asegurarLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/** Título, description y tags de compartir (OG/Twitter) por ruta. */
export function usarSeo(title: string, description: string, opts?: { imagen?: string; ruta?: string }) {
  useEffect(() => {
    document.title = title;
    asegurarMeta('name', 'description', description);
    asegurarMeta('property', 'og:title', title);
    asegurarMeta('property', 'og:description', description);
    asegurarMeta('name', 'twitter:title', title);
    asegurarMeta('name', 'twitter:description', description);

    const origen = SITE || window.location.origin;
    const ruta = opts?.ruta ?? `${window.location.pathname}${window.location.search}`;
    const url = `${origen}${ruta.startsWith('/') ? ruta : `/${ruta}`}`;
    asegurarMeta('property', 'og:url', url);
    asegurarLink('canonical', url);

    const imagen = opts?.imagen
      ? opts.imagen.startsWith('http')
        ? opts.imagen
        : `${origen}${opts.imagen.startsWith('/') ? opts.imagen : `/${opts.imagen}`}`
      : `${origen}/og.png`;
    asegurarMeta('property', 'og:image', imagen);
    asegurarMeta('property', 'og:image:secure_url', imagen);
    asegurarMeta('name', 'twitter:image', imagen);
  }, [title, description, opts?.imagen, opts?.ruta]);
}

export function usarRobotsNoindex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => meta?.setAttribute('content', 'index, follow');
  }, []);
}

export function JsonLd({ datos }: { datos: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}

export const sitioUrl = SITE;
