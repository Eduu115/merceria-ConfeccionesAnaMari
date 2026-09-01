import { Search } from 'lucide-react';
import { Boton, BotonWhatsApp } from './Boton';

export function EstadoVacio({
  titulo,
  texto,
  primario,
  secundario,
}: {
  titulo: string;
  texto: string;
  primario: { href: string; label: string; aria?: string };
  secundario: { to: string; label: string };
}) {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-4 py-16 text-center">
      <Search className="mb-4 h-10 w-10 text-tinta-tenue" aria-hidden />
      <h2 className="font-titular text-2xl text-tinta">{titulo}</h2>
      <p className="mt-3 max-w-md text-tinta-3">{texto}</p>
      <div className="mt-6 flex w-full max-w-md flex-col gap-3">
        <BotonWhatsApp href={primario.href} aria-label={primario.aria ?? primario.label}>
          {primario.label}
        </BotonWhatsApp>
        <Boton variante="secundario" to={secundario.to}>
          {secundario.label}
        </Boton>
      </div>
    </div>
  );
}
