/** A partir de `/subidas/…-800.webp` genera srcset 400/800/1200 (si existen en disco). */
export function srcsetSubidas(ruta: string): string | undefined {
  const m = ruta.match(/^(.*\/subidas\/.+)-(\d+)\.webp(\?.*)?$/i);
  if (!m) return undefined;
  const base = m[1]!;
  const query = m[3] ?? '';
  return [400, 800, 1200].map((w) => `${base}-${w}.webp${query} ${w}w`).join(', ');
}
