import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Pipette, X } from 'lucide-react';
import {
  COLORES_PREDETERMINADOS,
  COLOR_MULTICOLOR,
  COLOR_TRANSPARENTE,
  esHex,
  etiquetaColor,
  hexAHsv,
  hsvAHex,
  leerRecientes,
  recordarColor,
  type ValorColor,
} from '../lib/colores';

type Props = {
  etiqueta: string;
  valor: ValorColor;
  onChange: (valor: ValorColor) => void;
};

const estiloTransparente: React.CSSProperties = {
  backgroundColor: '#fff',
  backgroundImage:
    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
};

function estiloValor(valor: string | null): React.CSSProperties {
  if (!valor) return { background: 'transparent' };
  if (valor === COLOR_MULTICOLOR) {
    return { background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' };
  }
  if (valor === COLOR_TRANSPARENTE) return estiloTransparente;
  return { background: valor };
}

function MuestraSwatch({
  valor,
  seleccionado,
  titulo,
  onClick,
}: {
  valor: string;
  seleccionado: boolean;
  titulo: string;
  onClick: () => void;
}) {
  const claro = valor === '#f5f2ea' || valor === '#e6dcc8' || valor === COLOR_TRANSPARENTE;
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-pressed={seleccionado}
      onClick={onClick}
      className={`relative h-7 w-7 shrink-0 rounded-full border transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-acento ${
        seleccionado ? 'border-admin-acento ring-2 ring-admin-acento/25' : 'border-admin-borde'
      }`}
      style={estiloValor(valor)}
    >
      {seleccionado && (
        <Check
          className={`absolute inset-0 m-auto h-3.5 w-3.5 drop-shadow ${claro ? 'text-admin-texto' : 'text-white'}`}
          aria-hidden
        />
      )}
    </button>
  );
}

/** Rango con thumb propio; evita el anillo azul nativo del navegador. */
function RangoHue({
  valor,
  onChange,
  etiqueta,
}: {
  valor: number;
  onChange: (n: number) => void;
  etiqueta: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.72rem] font-medium text-admin-texto-tenue">{etiqueta}</span>
      <input
        type="range"
        min={0}
        max={360}
        value={Math.round(valor)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={etiqueta}
        className="h-3 w-full cursor-pointer appearance-none rounded-full border-0 outline-none [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-admin-acento [&::-moz-range-thumb]:shadow [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-admin-acento [&::-webkit-slider-thumb]:shadow"
        style={{
          background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
        }}
      />
    </label>
  );
}

function PickerPersonalizado({
  valorInicial,
  onElegir,
  onVolver,
}: {
  valorInicial: string;
  onElegir: (hex: string) => void;
  onVolver: () => void;
}) {
  const inicial = esHex(valorInicial) ? valorInicial : '#2f5d8c';
  const hsv0 = hexAHsv(inicial);
  const [h, setH] = useState(hsv0.h);
  const [s, setS] = useState(hsv0.s);
  const [v, setV] = useState(hsv0.v);
  const [hexTexto, setHexTexto] = useState(inicial);
  const areaRef = useRef<HTMLDivElement>(null);

  const hex = hsvAHex(h, s, v);

  useEffect(() => {
    setHexTexto(hex);
  }, [hex]);

  function aplicarDesdePuntero(clientX: number, clientY: number) {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    setS(x);
    setV(1 - y);
  }

  function alPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    aplicarDesdePuntero(e.clientX, e.clientY);
  }

  function alPointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;
    aplicarDesdePuntero(e.clientX, e.clientY);
  }

  function aplicarHexTexto(raw: string) {
    const limpio = raw.startsWith('#') ? raw : `#${raw}`;
    setHexTexto(limpio);
    if (esHex(limpio)) {
      const hsv = hexAHsv(limpio);
      setH(hsv.h);
      setS(hsv.s);
      setV(hsv.v);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={onVolver}
        className="flex min-h-8 items-center gap-1.5 self-start text-[0.82rem] font-semibold text-admin-texto-2 hover:text-admin-acento"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Volver a la paleta
      </button>

      {/* El cuadrado cubre saturación (eje X) e intensidad/brillo (eje Y). */}
      <div
        ref={areaRef}
        className="relative h-28 w-full cursor-crosshair touch-none rounded-md border border-admin-borde"
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, hsl(${h} 100% 50%))
          `,
        }}
        onPointerDown={alPointerDown}
        onPointerMove={alPointerMove}
        role="slider"
        aria-label="Saturación e intensidad"
        aria-valuetext={hex}
      >
        <span
          className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, background: hex }}
        />
      </div>

      <RangoHue valor={h} onChange={setH} etiqueta="Tono (arcoíris)" />

      <div className="flex items-center gap-2">
        <span className="h-9 w-9 shrink-0 rounded-md border border-admin-borde" style={{ background: hex }} />
        <input
          value={hexTexto}
          onChange={(e) => aplicarHexTexto(e.target.value)}
          className="min-h-9 min-w-0 flex-1 rounded-md border border-admin-borde-campo px-2 font-mono text-[0.85rem] uppercase outline-none focus:border-admin-acento"
          aria-label="Código hexadecimal"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => onElegir(hex)}
          className="min-h-9 shrink-0 rounded-md bg-admin-acento px-3 text-[0.85rem] font-semibold text-white hover:opacity-95"
        >
          Usar
        </button>
      </div>
    </div>
  );
}

export function SelectorColor({ etiqueta, valor, onChange }: Props) {
  const id = useId();
  const [abierto, setAbierto] = useState(false);
  const [masColores, setMasColores] = useState(false);
  const [recientes, setRecientes] = useState<string[]>([]);
  const [panelEstilo, setPanelEstilo] = useState<React.CSSProperties>({});
  const raizRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto) setRecientes(leerRecientes());
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    function fuera(e: MouseEvent) {
      if (raizRef.current && !raizRef.current.contains(e.target as Node)) {
        setAbierto(false);
        setMasColores(false);
      }
    }
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (masColores) setMasColores(false);
        else setAbierto(false);
      }
    }
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', escape);
    };
  }, [abierto, masColores]);

  useLayoutEffect(() => {
    if (!abierto) return;

    function colocar() {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const margen = 8;
      const rect = trigger.getBoundingClientRect();
      const ancho = Math.max(rect.width, 260);
      const altoPanel = panel.offsetHeight;
      const espacioAbajo = window.innerHeight - rect.bottom - margen;
      const espacioArriba = rect.top - margen;

      let top: number;
      if (espacioAbajo >= altoPanel || espacioAbajo >= espacioArriba) {
        top = rect.bottom + margen;
        if (top + altoPanel > window.innerHeight - margen) {
          top = Math.max(margen, window.innerHeight - margen - altoPanel);
        }
      } else {
        top = rect.top - margen - altoPanel;
        if (top < margen) top = margen;
      }

      let left = rect.left;
      if (left + ancho > window.innerWidth - margen) {
        left = Math.max(margen, window.innerWidth - margen - ancho);
      }

      setPanelEstilo({
        position: 'fixed',
        top,
        left,
        width: ancho,
        maxHeight: `calc(100vh - ${margen * 2}px)`,
        zIndex: 60,
      });
    }

    colocar();
    // Reubicar tras cambiar de vista (paleta ↔ personalizado).
    const idRaf = requestAnimationFrame(colocar);
    window.addEventListener('resize', colocar);
    window.addEventListener('scroll', colocar, true);
    return () => {
      cancelAnimationFrame(idRaf);
      window.removeEventListener('resize', colocar);
      window.removeEventListener('scroll', colocar, true);
    };
  }, [abierto, masColores, recientes.length]);

  function elegir(siguiente: ValorColor) {
    if (siguiente && esHex(siguiente)) recordarColor(siguiente);
    onChange(siguiente);
    setAbierto(false);
    setMasColores(false);
  }

  return (
    <div ref={raizRef} className="relative flex min-w-0 flex-col gap-1.5">
      <span id={id} className="text-[0.9rem] font-semibold text-admin-texto">
        {etiqueta}
        <span className="ml-1 font-normal text-admin-texto-tenue">(opcional)</span>
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={id}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        onClick={() => {
          setAbierto((v) => !v);
          setMasColores(false);
        }}
        className="flex min-h-11 w-full min-w-0 items-center gap-3 rounded-md border border-admin-borde-campo bg-white px-3 text-left transition-colors hover:border-admin-acento"
      >
        <span
          className={`h-7 w-7 shrink-0 rounded-full border border-admin-borde ${!valor ? 'border-dashed bg-admin-fondo' : ''}`}
          style={estiloValor(valor)}
        />
        <span className="min-w-0 flex-1 truncate text-[0.9rem] text-admin-texto-2">{etiquetaColor(valor)}</span>
        {valor && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Quitar color"
            className="rounded p-1 text-admin-texto-tenue hover:bg-admin-borde-2 hover:text-admin-texto"
            onClick={(e) => {
              e.stopPropagation();
              elegir(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                elegir(null);
              }
            }}
          >
            <X className="h-4 w-4" aria-hidden />
          </span>
        )}
      </button>

      {abierto && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={`Elegir ${etiqueta.toLowerCase()}`}
          style={panelEstilo}
          className="overflow-y-auto rounded-lg border border-admin-borde bg-white p-3 shadow-lg"
        >
          {masColores ? (
            <PickerPersonalizado
              valorInicial={valor && esHex(valor) ? valor : '#2f5d8c'}
              onElegir={elegir}
              onVolver={() => setMasColores(false)}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-admin-texto-tenue">
                  Predeterminados
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {COLORES_PREDETERMINADOS.map((c) => (
                    <MuestraSwatch
                      key={c.valor}
                      valor={c.valor}
                      titulo={c.nombre}
                      seleccionado={valor?.toLowerCase() === c.valor.toLowerCase()}
                      onClick={() => elegir(c.valor)}
                    />
                  ))}
                </div>
              </div>

              {recientes.length > 0 && (
                <div>
                  <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-admin-texto-tenue">
                    Recientes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recientes.map((hex) => (
                      <MuestraSwatch
                        key={hex}
                        valor={hex}
                        titulo={hex.toUpperCase()}
                        seleccionado={valor?.toLowerCase() === hex.toLowerCase()}
                        onClick={() => elegir(hex)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => elegir(COLOR_MULTICOLOR)}
                  className={`flex min-h-9 items-center justify-center gap-2 rounded-md border px-2 text-[0.8rem] font-medium ${
                    valor === COLOR_MULTICOLOR
                      ? 'border-admin-acento bg-admin-acento-fondo text-admin-acento'
                      : 'border-admin-borde-campo text-admin-texto-2'
                  }`}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-admin-borde"
                    style={estiloValor(COLOR_MULTICOLOR)}
                  />
                  Multicolor
                </button>
                <button
                  type="button"
                  onClick={() => elegir(COLOR_TRANSPARENTE)}
                  className={`flex min-h-9 items-center justify-center gap-2 rounded-md border px-2 text-[0.8rem] font-medium ${
                    valor === COLOR_TRANSPARENTE
                      ? 'border-admin-acento bg-admin-acento-fondo text-admin-acento'
                      : 'border-admin-borde-campo text-admin-texto-2'
                  }`}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-admin-borde"
                    style={estiloValor(COLOR_TRANSPARENTE)}
                  />
                  Transparente
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMasColores(true)}
                className="flex min-h-9 w-full items-center justify-center gap-2 rounded-md border border-admin-borde-campo text-[0.85rem] font-semibold text-admin-texto-2 hover:border-admin-acento hover:text-admin-acento"
              >
                <Pipette className="h-4 w-4" aria-hidden />
                Más colores…
              </button>

              {valor && (
                <button
                  type="button"
                  onClick={() => elegir(null)}
                  className="text-center text-[0.78rem] text-admin-texto-tenue hover:text-admin-texto"
                >
                  Quitar color
                </button>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
