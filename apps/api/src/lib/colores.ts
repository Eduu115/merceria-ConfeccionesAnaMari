/** Etiquetas de color en servidor (espejo ligero del admin). */
const ETIQUETAS: Record<string, string> = {
  multicolor: 'Multicolor',
  transparente: 'Transparente',
  '#1a1a1a': 'Negro',
  '#f5f2ea': 'Blanco',
  '#e6dcc8': 'Crudo',
  '#2f5d8c': 'Azul',
  '#6b2a32': 'Granate',
  '#3d5c45': 'Verde',
  '#c45c26': 'Terracota',
  '#8b7355': 'Beige',
  '#d4a017': 'Mostaza',
  '#5c4a7a': 'Morado',
  '#b85c8a': 'Rosa',
  '#4a7c8c': 'Turquesa',
};

export function etiquetaValorColor(valor: string): string {
  const key = valor.startsWith('#') ? valor.toLowerCase() : valor;
  return ETIQUETAS[key] ?? (valor.startsWith('#') ? valor.toUpperCase() : valor);
}
