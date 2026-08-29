import { cx } from '../lib/cx';

export function Mapa({ url, titulo, className }: { url: string; titulo: string; className?: string }) {
  if (!url) return null;
  return (
    <iframe
      src={url}
      title={titulo}
      loading="lazy"
      className={cx('min-h-[200px] w-full border-0', className)}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
