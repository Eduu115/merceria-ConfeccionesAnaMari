export type Apartado = { id: string; titulo: string; html: string };

export function partirMarkdown(md: string): Apartado[] {
  const bloques = md.split(/\n(?=## )/);
  return bloques
    .map((b, i) => {
      const lineas = b.trim().split('\n');
      const primera = lineas[0] ?? '';
      const titulo = primera.replace(/^##\s+/, '');
      const cuerpo = lineas.slice(primera.startsWith('##') ? 1 : 0).join('\n').trim();
      return {
        id: `apartado-${i + 1}`,
        titulo,
        html: markdownAHtml(cuerpo),
      };
    })
    .filter((a) => a.titulo);
}

export function markdownAHtml(texto: string): string {
  const escapar = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lineas = texto.split('\n');
  const out: string[] = [];
  let lista: string[] = [];
  const vaciarLista = () => {
    if (!lista.length) return;
    out.push(`<ul>${lista.map((li) => `<li>${li}</li>`).join('')}</ul>`);
    lista = [];
  };
  for (const linea of lineas) {
    const item = linea.match(/^[-*]\s+(.+)/);
    if (item) {
      lista.push(enriquecer(escapar(item[1])));
      continue;
    }
    vaciarLista();
    if (!linea.trim()) continue;
    out.push(`<p>${enriquecer(escapar(linea))}</p>`);
  }
  vaciarLista();
  return out.join('');
}

function enriquecer(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
