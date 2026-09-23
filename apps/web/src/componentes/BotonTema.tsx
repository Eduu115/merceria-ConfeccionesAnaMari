import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { alternarTema, aplicarTema, leerTema, type Tema } from '../lib/tema';
import { cx } from '../lib/cx';

export function BotonTema({ className }: { className?: string }) {
  const [tema, setTema] = useState<Tema>('claro');

  useEffect(() => {
    const actual = leerTema();
    aplicarTema(actual);
    setTema(actual);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setTema(alternarTema())}
      aria-label={tema === 'oscuro' ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
      className={cx(
        'grid h-10 w-10 place-items-center rounded-md text-tinta transition-colors hover:bg-arena-2',
        className,
      )}
    >
      {tema === 'oscuro' ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
