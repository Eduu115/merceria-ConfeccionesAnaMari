import { useId, useState } from 'react';
import { cx } from '../lib/cx';

export function Acordeon({
  grupos,
}: {
  grupos: { titulo: string; items: { pregunta: string; respuesta: string }[] }[];
}) {
  return (
    <div className="mx-auto w-full max-w-[26.25rem]">
      {grupos.map((g) => (
        <Grupo key={g.titulo} titulo={g.titulo} items={g.items} />
      ))}
    </div>
  );
}

function Grupo({
  titulo,
  items,
}: {
  titulo: string;
  items: { pregunta: string; respuesta: string }[];
}) {
  const [abiertos, setAbiertos] = useState<Set<number>>(() => new Set([0]));
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-titular text-xl text-tinta">{titulo}</h2>
      <div className="divide-y divide-borde border-y border-borde">
        {items.map((item, i) => {
          const abierto = abiertos.has(i);
          return (
            <Fila
              key={item.pregunta}
              item={item}
              abierto={abierto}
              onToggle={() => {
                setAbiertos((prev) => {
                  const n = new Set(prev);
                  if (n.has(i)) n.delete(i);
                  else n.add(i);
                  return n;
                });
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

function Fila({
  item,
  abierto,
  onToggle,
}: {
  item: { pregunta: string; respuesta: string };
  abierto: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          onClick={onToggle}
          className="flex min-h-12 w-full items-center justify-between gap-3 py-3 text-left font-medium text-tinta"
        >
          <span>{item.pregunta}</span>
          <span className={cx('text-xl', abierto ? 'text-acento' : 'text-tinta-apagada')} aria-hidden>
            {abierto ? '–' : '+'}
          </span>
        </button>
      </h3>
      <div
        id={id}
        className={cx(
          'grid transition-[grid-template-rows] duration-[180ms] ease-out',
          abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-3 text-tinta-3">{item.respuesta}</p>
        </div>
      </div>
    </div>
  );
}
