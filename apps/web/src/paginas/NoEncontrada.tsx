import { MarcadorSinFoto } from '../componentes/MarcadorSinFoto';
import { Boton } from '../componentes/Boton';
import { copys } from '../lib/copys';
import { usarSeo } from '../lib/seo';
import { Link } from 'react-router-dom';

export function NoEncontrada() {
  usarSeo('Página no encontrada · Confecciones Ana Mari', copys.error404.texto);
  return (
    <section className="grid min-h-[340px] md:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-center bg-crema px-4 py-10 md:px-10">
        <p className="text-rotulo font-semibold uppercase tracking-[0.2em] text-tinta-apagada">
          {copys.error404.rotulo}
        </p>
        <h1 className="mt-3 font-titular text-3xl text-tinta md:text-4xl">{copys.error404.titular}</h1>
        <p className="mt-4 max-w-md text-tinta-3">{copys.error404.texto}</p>
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <Boton to="/">{copys.botones.volverInicio}</Boton>
          <Boton variante="secundario" to="/catalogo">
            {copys.botones.verCatalogo}
          </Boton>
        </div>
        <div className="mt-8 border-t border-borde pt-6">
          <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
            {copys.error404.quizas}
          </p>
          <ul className="space-y-1">
            {copys.error404.enlaces.map((e) => (
              <li key={e.href}>
                <Link className="text-acento underline" to={e.href}>
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden md:block">
        <MarcadorSinFoto className="h-full min-h-[340px] border-0" />
      </div>
    </section>
  );
}
