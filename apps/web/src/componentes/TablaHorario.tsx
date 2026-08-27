import type { DiaHorario } from '@anamari/compartido';

const NOMBRES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function celda(d: DiaHorario): string {
  if (d.cerrado) return 'Cerrado';
  const partes = [];
  if (d.manana_abre && d.manana_cierra) partes.push(`${d.manana_abre}–${d.manana_cierra}`);
  if (d.tarde_abre && d.tarde_cierra) partes.push(`${d.tarde_abre}–${d.tarde_cierra}`);
  return partes.join(' y ') || 'Cerrado';
}

export function TablaHorario({ dias }: { dias: DiaHorario[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <caption className="sr-only">Horario de la tienda</caption>
      <tbody>
        {dias.map((d, i) => (
          <tr
            key={d.dia}
            className={
              d.cerrado
                ? 'text-tinta-tenue'
                : i === 0
                  ? 'bg-crema'
                  : undefined
            }
          >
            <th scope="row" className="border-b border-borde py-2 pr-4 text-left font-medium">
              {NOMBRES[d.dia]}
            </th>
            <td className="border-b border-borde py-2 text-right">{celda(d)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
