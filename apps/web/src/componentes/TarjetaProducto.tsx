import { Link } from 'react-router-dom';
import type { ProductoTarjeta } from '@anamari/compartido';
import { MarcadorSinFoto } from './MarcadorSinFoto';
import { copys } from '../lib/copys';
import { cx } from '../lib/cx';

export function TarjetaProducto({ producto }: { producto: ProductoTarjeta }) {
  return (
    <Link to={`/producto/${producto.slug}`} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden border border-borde">
        {producto.imagen ? (
          <img
            src={producto.imagen.ruta}
            alt={producto.imagen.alt}
            width={producto.imagen.ancho ?? 600}
            height={producto.imagen.alto ?? 800}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <MarcadorSinFoto etiqueta="" className="h-full border-0" />
        )}
        {producto.agotado && (
          <span className="absolute left-0 top-0 bg-boton px-2 py-1 text-xs font-semibold text-white">
            {copys.agotado}
          </span>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 min-h-[2.6em] font-cuerpo text-[0.95rem] font-semibold leading-snug text-tinta group-hover:text-acento">
        {producto.nombre}
      </h3>
      {producto.tipo === 'ropa' ? (
        <p className="mt-1.5 flex flex-wrap gap-1 text-xs text-tinta-apagada">
          {producto.tallas
            .filter((t) => t.disponible)
            .map((t) => (
              <span key={t.talla} className="border border-[#cfc9be] px-1.5 py-0.5 font-semibold">
                {t.talla}
              </span>
            ))}
        </p>
      ) : (
        <p className="mt-1.5 text-sm text-tinta-apagada">{producto.caracteristica}</p>
      )}
      <div className="h-5" aria-hidden />
    </Link>
  );
}

export function RejillaProductos({
  productos,
  className,
}: {
  productos: ProductoTarjeta[];
  className?: string;
}) {
  return (
    <div className={cx('grid min-h-[28rem] grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4', className)}>
      {productos.map((p) => (
        <TarjetaProducto key={p.slug} producto={p} />
      ))}
    </div>
  );
}
