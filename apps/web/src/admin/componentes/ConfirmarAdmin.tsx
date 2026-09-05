type Props = {
  abierto: boolean;
  titulo: string;
  descripcion: React.ReactNode;
  textoConfirmar: string;
  textoCancelar?: string;
  variante?: 'peligro' | 'primario';
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export function ConfirmarAdmin({
  abierto,
  titulo,
  descripcion,
  textoConfirmar,
  textoCancelar = 'Cancelar',
  variante = 'peligro',
  cargando,
  onConfirmar,
  onCancelar,
}: Props) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirmar-admin-titulo"
      onClick={onCancelar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-xl"
      >
        <h2 id="confirmar-admin-titulo" className="font-cuerpo text-[1.05rem] font-bold text-admin-texto">
          {titulo}
        </h2>
        <div className="mt-1.5 text-[0.9rem] leading-snug text-admin-texto-3">{descripcion}</div>
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            disabled={cargando}
            onClick={onConfirmar}
            className={`min-h-11 rounded-lg text-[0.95rem] font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60 ${
              variante === 'peligro' ? 'bg-admin-error hover:bg-[#8a3826]' : 'bg-admin-acento hover:bg-[#264c73]'
            }`}
          >
            {textoConfirmar}
          </button>
          <button
            type="button"
            disabled={cargando}
            onClick={onCancelar}
            className="min-h-11 rounded-lg border border-admin-borde-campo bg-white text-[0.95rem] font-medium text-admin-texto-2 disabled:pointer-events-none disabled:opacity-60"
          >
            {textoCancelar}
          </button>
        </div>
      </div>
    </div>
  );
}
