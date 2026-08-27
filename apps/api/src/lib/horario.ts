import type { DiaHorario, HorarioPublico } from '@anamari/compartido';

const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function franja(abre: string | null, cierra: string | null): string | null {
  if (!abre || !cierra) return null;
  return `${abre}–${cierra}`;
}

export function formatearDia(dia: DiaHorario): string {
  if (dia.cerrado) return 'Cerrado';
  const partes = [
    franja(dia.manana_abre, dia.manana_cierra),
    franja(dia.tarde_abre, dia.tarde_cierra),
  ].filter(Boolean);
  return partes.join(' y ') || 'Cerrado';
}

export function lineaHorario(dias: DiaHorario[]): string {
  const lv = dias.slice(0, 5);
  const sab = dias[5];
  const dom = dias[6];
  const lvTexto = lv[0] ? formatearDia(lv[0]) : '';
  const s = sab ? formatearDia(sab) : '';
  const d = dom ? formatearDia(dom).toLowerCase() : 'cerrado';
  return `L–V ${lvTexto} · S ${s} · D ${d}`;
}

function minutosDesdeMedianoche(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function calcularAbiertoAhora(dias: DiaHorario[]): boolean {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const mapa = Object.fromEntries(partes.map((p) => [p.type, p.value]));
  const semana: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const idx = semana[mapa.weekday] ?? 0;
  const dia = dias.find((d) => d.dia === idx);
  if (!dia || dia.cerrado) return false;

  const ahora = Number(mapa.hour) * 60 + Number(mapa.minute);
  const en = (abre: string | null, cierra: string | null) => {
    if (!abre || !cierra) return false;
    return ahora >= minutosDesdeMedianoche(abre) && ahora < minutosDesdeMedianoche(cierra);
  };
  return en(dia.manana_abre, dia.manana_cierra) || en(dia.tarde_abre, dia.tarde_cierra);
}

export function horarioPublico(dias: DiaHorario[]): HorarioPublico {
  return {
    dias,
    abierto_ahora: calcularAbiertoAhora(dias),
    linea: lineaHorario(dias),
  };
}

export function nombreDia(dia: number): string {
  return NOMBRES_DIA[dia] ?? '';
}
