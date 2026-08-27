import { cx } from '../lib/cx';

export function Paginacion({
  pagina,
  paginas,
  total,
  onCambiar,
}: {
  pagina: number;
  paginas: number;
  total: number;
  onCambiar: (p: number) => void;
}) {
  if (paginas <= 0) return null;
  const nums = Array.from({ length: paginas }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <nav className="flex items-center gap-2" aria-label="Paginación">
        <BotonPagina disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)} aria-label="Anterior">
          ‹
        </BotonPagina>
        {nums.map((n) => (
          <BotonPagina key={n} actual={n === pagina} onClick={() => onCambiar(n)}>
            {n}
          </BotonPagina>
        ))}
        <BotonPagina
          disabled={pagina >= paginas}
          onClick={() => onCambiar(pagina + 1)}
          aria-label="Siguiente"
        >
          ›
        </BotonPagina>
      </nav>
      <p className="text-sm text-tinta-apagada">
        Página {pagina} de {paginas} · {total} productos
      </p>
    </div>
  );
}

function BotonPagina({
  children,
  actual,
  disabled,
  onClick,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  actual?: boolean;
  disabled?: boolean;
  onClick: () => void;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={actual ? 'page' : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cx(
        'grid h-11 w-11 place-items-center border text-sm md:h-[34px] md:w-[34px]',
        actual && 'border-acento bg-acento text-white',
        !actual && 'border-borde bg-white text-tinta',
        disabled && 'opacity-40',
      )}
    >
      {children}
    </button>
  );
}
