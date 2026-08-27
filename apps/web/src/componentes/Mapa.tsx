import { useState } from 'react';
import { copys } from '../lib/copys';

export function Mapa({ url, titulo }: { url: string; titulo: string }) {
  const [ok, setOk] = useState(false);
  if (!url) return null;
  if (!ok) {
    return (
      <button
        type="button"
        onClick={() => setOk(true)}
        className="flex min-h-[200px] w-full items-center justify-center border border-borde bg-crema text-tinta"
      >
        {copys.verMapa}
      </button>
    );
  }
  return (
    <iframe
      src={url}
      title={titulo}
      loading="lazy"
      className="min-h-[200px] w-full border-0"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
