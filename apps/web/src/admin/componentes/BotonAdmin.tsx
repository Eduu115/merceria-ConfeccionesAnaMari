type Props = {
  variante?: 'primario' | 'secundario' | 'peligro';
  type?: 'button' | 'submit';
  form?: string;
  disabled?: boolean;
  cargando?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function BotonAdmin({
  variante = 'primario',
  type = 'button',
  form,
  disabled,
  cargando,
  className = '',
  children,
  onClick,
}: Props) {
  const base =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-[0.9rem] font-medium transition-colors disabled:pointer-events-none disabled:opacity-60';
  const variantes = {
    primario: 'bg-admin-acento text-white hover:bg-[#264c73]',
    secundario: 'border border-admin-borde-campo bg-white text-admin-texto-2 hover:bg-admin-fondo',
    peligro: 'border border-admin-error text-admin-error hover:bg-admin-error-fondo',
  };
  return (
    <button
      type={type}
      form={form}
      disabled={disabled || cargando}
      onClick={onClick}
      className={`${base} ${variantes[variante]} ${className}`}
    >
      {children}
    </button>
  );
}
