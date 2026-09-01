type Props = {
  etiqueta: string;
  ayuda?: string;
  checked: boolean;
  onChange: (valor: boolean) => void;
};

export function ToggleAdmin({ etiqueta, ayuda, checked, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-admin-borde-campo bg-white px-3.5 py-3 text-left"
    >
      <span className="flex flex-col">
        <span className="text-[0.9rem] font-medium text-admin-texto">{etiqueta}</span>
        {ayuda && <span className="text-[0.78rem] text-admin-texto-tenue">{ayuda}</span>}
      </span>
      <span
        className={`relative h-6 w-11 flex-none rounded-full transition-colors ${
          checked ? 'bg-admin-acento' : 'bg-admin-borde-campo'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}
