const CLAVE = 'anamari-tema';

export type Tema = 'claro' | 'oscuro';

export function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === 'oscuro' || guardado === 'claro') return guardado;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'oscuro';
  }
  return 'claro';
}

export function aplicarTema(tema: Tema) {
  const raiz = document.documentElement;
  raiz.classList.toggle('oscuro', tema === 'oscuro');
  raiz.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tema === 'oscuro' ? '#1a1814' : '#fbf9f4');
  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    /* ignore */
  }
}

export function alternarTema(): Tema {
  const siguiente: Tema = document.documentElement.classList.contains('oscuro') ? 'claro' : 'oscuro';
  aplicarTema(siguiente);
  return siguiente;
}
