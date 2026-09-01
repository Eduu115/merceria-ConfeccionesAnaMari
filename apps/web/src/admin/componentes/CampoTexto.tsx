import { forwardRef } from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  etiqueta: string;
  error?: string;
};

export const CampoTexto = forwardRef<HTMLInputElement, Props>(function CampoTexto(
  { etiqueta, error, id, className = '', ...resto },
  ref,
) {
  const campoId = id ?? etiqueta.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={campoId} className="flex flex-col gap-1.5">
      <span className="text-[0.85rem] font-medium text-admin-texto-2">{etiqueta}</span>
      <input
        ref={ref}
        id={campoId}
        className={`min-h-11 rounded-md border px-3 text-[0.95rem] text-admin-texto outline-none transition-colors focus:border-admin-acento ${
          error ? 'border-admin-error' : 'border-admin-borde-campo'
        } ${className}`}
        {...resto}
      />
      {error && <span className="text-[0.8rem] text-admin-error">{error}</span>}
    </label>
  );
});
