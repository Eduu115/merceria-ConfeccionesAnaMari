import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type FotoVisor = { src: string; alt: string; pie?: string };

type Props = {
  fotos: readonly FotoVisor[];
  /** Índice abierto, o null si el visor está cerrado. */
  indice: number | null;
  onCerrar: () => void;
  onIr: (indice: number) => void;
};

export function VisorFotos({ fotos, indice, onCerrar, onIr }: Props) {
  const abierto = indice !== null;
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const devolverFocoA = useRef<HTMLElement | null>(null);

  const anterior = useCallback(() => {
    if (indice === null) return;
    onIr((indice - 1 + fotos.length) % fotos.length);
  }, [indice, fotos.length, onIr]);

  const siguiente = useCallback(() => {
    if (indice === null) return;
    onIr((indice + 1) % fotos.length);
  }, [indice, fotos.length, onIr]);

  // Teclado: Escape cierra, flechas navegan.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
      else if (e.key === 'ArrowLeft') anterior();
      else if (e.key === 'ArrowRight') siguiente();
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [abierto, onCerrar, anterior, siguiente]);

  // Bloquea el scroll del fondo y devuelve el foco al cerrar.
  useEffect(() => {
    if (!abierto) return;
    devolverFocoA.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cerrarRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      devolverFocoA.current?.focus();
    };
  }, [abierto]);

  if (indice === null) return null;
  const foto = fotos[indice];
  if (!foto) return null;
  const varias = fotos.length > 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={foto.pie ?? foto.alt}
      className="fixed inset-0 z-[60] flex flex-col bg-black/85 p-4 md:p-8"
      onClick={onCerrar}
    >
      <div className="flex shrink-0 items-center justify-between text-white">
        <p className="text-sm">
          {varias && `${indice + 1} / ${fotos.length}`}
        </p>
        <button
          ref={cerrarRef}
          type="button"
          aria-label="Cerrar"
          className="grid h-11 w-11 place-items-center rounded-md hover:bg-white/15"
          onClick={onCerrar}
        >
          <X className="h-7 w-7" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 md:gap-4">
        {varias && (
          <BotonPaso etiqueta="Foto anterior" onClick={anterior}>
            <ChevronLeft className="h-7 w-7" />
          </BotonPaso>
        )}
        <img
          src={foto.src}
          alt={foto.alt}
          className="max-h-full min-h-0 max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {varias && (
          <BotonPaso etiqueta="Foto siguiente" onClick={siguiente}>
            <ChevronRight className="h-7 w-7" />
          </BotonPaso>
        )}
      </div>

      {foto.pie && (
        <p className="shrink-0 pt-3 text-center font-cuerpo text-sm text-white/80">{foto.pie}</p>
      )}
    </div>,
    document.body,
  );
}

function BotonPaso({
  etiqueta,
  onClick,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}
