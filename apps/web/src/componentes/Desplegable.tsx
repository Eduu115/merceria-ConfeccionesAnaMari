import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';
import { usarEsMovil } from '../hooks/usar-movil';

export type Opcion = { valor: string; etiqueta: string };

type Props = {
  rotulo: string;
  valor: string | string[];
  opciones: Opcion[];
  abierto: boolean;
  onToggle: () => void;
  onCerrar: () => void;
  onCambiar: (valor: string) => void;
  multiple?: boolean;
};

export function Desplegable({
  rotulo,
  valor,
  opciones,
  abierto,
  onToggle,
  onCerrar,
  onCambiar,
  multiple,
}: Props) {
  const movil = usarEsMovil();
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const valores = Array.isArray(valor) ? valor : valor ? [valor] : [];
  const activo = multiple ? valores.length > 0 : Boolean(valor);
  const etiquetaValor = multiple
    ? valores.length
      ? opciones
          .filter((o) => valores.includes(o.valor))
          .map((o) => o.etiqueta)
          .join(', ')
      : 'Todas'
    : (opciones.find((o) => o.valor === valor)?.etiqueta ?? opciones[0]?.etiqueta);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    const onClick = (e: MouseEvent) => {
      if (!movil && ref.current && !ref.current.contains(e.target as Node)) onCerrar();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [abierto, movil, onCerrar]);

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <p className="mb-1 text-rotulo font-semibold uppercase text-tinta-apagada">{rotulo}</p>
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={onToggle}
        className={cx(
          'flex min-h-11 w-full items-center justify-between border bg-crema px-3 text-left text-sm',
          activo ? 'border-[1.5px] border-acento font-semibold' : 'border-borde-fuerte',
        )}
      >
        <span className="truncate">{etiquetaValor}</span>
        <span aria-hidden className="ml-2 text-tinta-apagada">
          {abierto ? '▴' : '▾'}
        </span>
      </button>

      {abierto && !movil && (
        <ul
          id={id}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto border-[1.5px] border-acento bg-crema shadow-panel"
        >
          {opciones.map((o) => {
            const sel = valores.includes(o.valor);
            return (
              <li key={o.valor}>
                <button
                  type="button"
                  role="option"
                  aria-selected={sel}
                  className={cx(
                    'flex min-h-10 w-full items-center justify-between px-3 text-left text-sm',
                    sel && 'bg-acento-fondo',
                  )}
                  onClick={() => onCambiar(o.valor)}
                >
                  <span className="flex items-center gap-2">
                    {multiple && (
                      <span
                        className={cx(
                          'inline-block h-[15px] w-[15px] border border-borde-fuerte',
                          sel && 'bg-acento border-acento',
                        )}
                      />
                    )}
                    {o.etiqueta}
                  </span>
                  {sel && !multiple && <span className="text-acento">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {abierto && movil && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Cerrar"
            onClick={onCerrar}
          />
          <div
            id={id}
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-auto bg-crema shadow-panel"
          >
            <div className="flex items-center justify-between border-b border-borde px-4 py-3">
              <p className="font-semibold text-tinta">{rotulo}</p>
              <button type="button" className="grid h-11 w-11 place-items-center" onClick={onCerrar} aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul>
              {opciones.map((o) => {
                const sel = valores.includes(o.valor);
                return (
                  <li key={o.valor}>
                    <button
                      type="button"
                      className={cx(
                        'flex min-h-[46px] w-full items-center justify-between px-4 text-left',
                        sel && 'bg-acento-fondo',
                      )}
                      onClick={() => onCambiar(o.valor)}
                    >
                      <span className="flex items-center gap-2">
                        {multiple && (
                          <span
                            className={cx(
                              'inline-block h-[15px] w-[15px] border border-borde-fuerte',
                              sel && 'bg-acento border-acento',
                            )}
                          />
                        )}
                        {o.etiqueta}
                      </span>
                      {sel && <span className="text-acento">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
