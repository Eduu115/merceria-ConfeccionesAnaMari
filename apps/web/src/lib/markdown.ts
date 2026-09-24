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
  let tabla: string[][] = [];

  const vaciarLista = () => {
    if (!lista.length) return;
    out.push(`<ul>${lista.map((li) => `<li>${li}</li>`).join('')}</ul>`);
    lista = [];
  };

  const vaciarTabla = () => {
    if (!tabla.length) return;
    const [cabecera, ...filas] = tabla;
    const thead = `<thead><tr>${cabecera.map((c) => `<th>${enriquecer(escapar(c))}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${filas
      .map((fila) => `<tr>${fila.map((c) => `<td>${enriquecer(escapar(c))}</td>`).join('')}</tr>`)
      .join('')}</tbody>`;
    out.push(`<div class="desborde-x"><table>${thead}${tbody}</table></div>`);
    tabla = [];
  };

  const celdas = (linea: string) =>
    linea
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  const esSeparador = (linea: string) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(linea.trim());

  for (const linea of lineas) {
    if (linea.trim().startsWith('|')) {
      vaciarLista();
      if (esSeparador(linea)) continue;
      tabla.push(celdas(linea));
      continue;
    }
    vaciarTabla();

    const h3 = linea.match(/^###\s+(.+)/);
    if (h3) {
      vaciarLista();
      out.push(`<h3>${enriquecer(escapar(h3[1]))}</h3>`);
      continue;
    }

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
  vaciarTabla();
  return out.join('');
}

function enriquecer(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
