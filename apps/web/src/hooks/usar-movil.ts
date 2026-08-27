import { useEffect, useState } from 'react';

export function usarEsMovil(): boolean {
  const [movil, setMovil] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const aplicar = () => setMovil(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);
  return movil;
}
