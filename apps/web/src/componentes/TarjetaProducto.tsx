import { Link } from 'react-router-dom';
import type { ProductoTarjeta } from '@anamari/compartido';
import { MarcadorSinFoto } from './MarcadorSinFoto';
import { copys } from '../lib/copys';
import { cx } from '../lib/cx';

export function TarjetaProducto({ producto }: { producto: ProductoTarjeta }) {
  return (
    <Link
      to={`/producto/${producto.slug}`}
      className="group flex flex-col border border-borde bg-white"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-crema">
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
          <MarcadorSinFoto />
        )}
        {producto.agotado && (
          <span className="absolute left-0 top-0 bg-boton px-2 py-1 text-xs font-semibold text-white">
            {copys.agotado}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 min-h-[2.8em] font-medium leading-snug text-tinta group-hover:text-acento">
          {producto.nombre}
        </h3>
        {producto.tipo === 'ropa' ? (
          <p className="flex flex-wrap gap-1 text-xs text-tinta-apagada">
            {producto.tallas
              .filter((t) => t.disponible)
              .map((t) => (
                <span key={t.talla} className="border border-borde px-1.5 py-0.5">
                  {t.talla}
                </span>
              ))}
          </p>
        ) : (
          <p className="text-sm text-tinta-apagada">{producto.caracteristica}</p>
        )}
        <div className="h-5" aria-hidden />
      </div>
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
