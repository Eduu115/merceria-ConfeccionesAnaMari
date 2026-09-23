/** Valor de color en producto: hex #RRGGBB o tokens especiales. */
export type ValorColor = string | null;

export const COLOR_MULTICOLOR = 'multicolor';
export const COLOR_TRANSPARENTE = 'transparente';

export type MuestraColor = { valor: string; nombre: string };

/** Paleta predeterminada para mercería / ropa de barrio. */
export const COLORES_PREDETERMINADOS: MuestraColor[] = [
  { valor: '#1a1a1a', nombre: 'Negro' },
  { valor: '#f5f2ea', nombre: 'Blanco' },
  { valor: '#e6dcc8', nombre: 'Crudo' },
  { valor: '#2f5d8c', nombre: 'Azul' },
  { valor: '#6b2a32', nombre: 'Granate' },
  { valor: '#3d5c45', nombre: 'Verde' },
  { valor: '#c45c26', nombre: 'Terracota' },
  { valor: '#8b7355', nombre: 'Beige' },
  { valor: '#d4a017', nombre: 'Mostaza' },
  { valor: '#5c4a7a', nombre: 'Morado' },
  { valor: '#b85c8a', nombre: 'Rosa' },
  { valor: '#4a7c8c', nombre: 'Turquesa' },
];

const CLAVE_RECIENTES = 'anamari-colores-recientes';
const MAX_RECIENTES = 10;

export function esHex(valor: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(valor);
}

export function esTokenEspecial(valor: string): boolean {
  return valor === COLOR_MULTICOLOR || valor === COLOR_TRANSPARENTE;
}

export function etiquetaColor(valor: string | null | undefined): string {
  if (!valor) return 'Sin color';
  if (valor === COLOR_MULTICOLOR) return 'Multicolor';
  if (valor === COLOR_TRANSPARENTE) return 'Transparente';
  const pred = COLORES_PREDETERMINADOS.find((c) => c.valor.toLowerCase() === valor.toLowerCase());
  if (pred) return pred.nombre;
  return valor.toUpperCase();
}

export function textoColoresProducto(
  primario: string | null,
  secundario: string | null,
  terciario: string | null,
): string | null {
  const partes = [primario, secundario, terciario]
    .filter((v): v is string => Boolean(v))
    .map((v) => etiquetaColor(v));
  return partes.length ? partes.join(', ') : null;
}

export function leerRecientes(): string[] {
  try {
    const raw = localStorage.getItem(CLAVE_RECIENTES);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string' && esHex(v)).slice(0, MAX_RECIENTES);
  } catch {
    return [];
  }
}

export function recordarColor(valor: string) {
  if (!esHex(valor)) return;
  const normalizado = valor.toLowerCase();
  const prev = leerRecientes().filter((c) => c.toLowerCase() !== normalizado);
  localStorage.setItem(CLAVE_RECIENTES, JSON.stringify([normalizado, ...prev].slice(0, MAX_RECIENTES)));
}

export function hexAHsv(hex: string): { h: number; s: number; v: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

export function hsvAHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}
