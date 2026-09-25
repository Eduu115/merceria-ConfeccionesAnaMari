import { cx } from '../lib/cx';
import { srcsetSubidas } from '../lib/imagenes';

type Props = {
  src: string;
  alt: string;
  /** Clases del hueco: tamaño, proporción, borde. */
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Prioridad de descarga (LCP). */
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  width?: number;
  height?: number;
};

export function Imagen({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority,
  sizes,
  width,
  height,
}: Props) {
  const srcSet = srcsetSubidas(src);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? '(max-width: 768px) 50vw, 25vw') : undefined}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={loading === 'eager' ? 'sync' : 'async'}
      width={width}
      height={height}
      className={cx('w-full bg-arena object-cover', className)}
    />
  );
}
