import { cx } from '../lib/cx';

type Props = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
};

export function ImagenDemo({ src, alt, className, loading = 'lazy' }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={cx('h-full w-full object-cover', className)}
    />
  );
}
