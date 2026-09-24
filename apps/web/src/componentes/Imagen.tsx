import { cx } from '../lib/cx';

type Props = {
  src: string;
  alt: string;
  /** Clases del hueco: tamaño, proporción, borde. */
  className?: string;
  loading?: 'lazy' | 'eager';
};

export function Imagen({ src, alt, className, loading = 'lazy' }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={cx('w-full bg-arena object-cover', className)}
    />
  );
}
