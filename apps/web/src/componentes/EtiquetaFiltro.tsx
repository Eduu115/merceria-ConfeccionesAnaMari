import { X } from 'lucide-react';
import { copys } from '../lib/copys';
import { usarEsMovil } from '../hooks/usar-movil';

export function EtiquetaFiltro({
  texto,
  onQuitar,
}: {
  texto: string;
  onQuitar: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 border border-borde px-2 py-1 text-sm">
      {texto}
      <button type="button" className="grid h-8 w-8 place-items-center md:h-6 md:w-6" onClick={onQuitar} aria-label={`Quitar ${texto}`}>
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export function QuitarFiltros({ onClick }: { onClick: () => void }) {
  const movil = usarEsMovil();
  return (
    <button type="button" className="text-sm text-tinta underline underline-offset-2" onClick={onClick}>
      {movil ? copys.catalogo.quitar : copys.catalogo.quitarTodo}
    </button>
  );
}
