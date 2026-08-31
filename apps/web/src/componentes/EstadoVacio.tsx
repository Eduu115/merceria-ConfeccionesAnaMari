import { Search } from 'lucide-react';
import { Boton } from './Boton';
import { IconoWhatsApp } from './BurbujaWhatsApp';

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
        <Boton
          variante="whatsapp"
          href={primario.href}
          externo
          aria-label={primario.aria ?? primario.label}
        >
          <IconoWhatsApp className="h-4 w-4" />
          {primario.label}
        </Boton>
        <Boton variante="secundario" to={secundario.to}>
          {secundario.label}
        </Boton>
      </div>
    </div>
  );
}
