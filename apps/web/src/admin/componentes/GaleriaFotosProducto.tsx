import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { puedeGestionarFotos } from '@anamari/compartido';
import { copysAdmin } from '../lib/copys-admin';
import { urlApi } from '../../lib/api';
import { apiAdmin, type ImagenAdmin } from '../lib/api-admin';
import { usarSesionAdmin } from '../hooks/usar-sesion-admin';
import { Imagen } from '../../componentes/Imagen';

const MAX = 8;
const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

type Props = {
  productoId: number | null;
  imagenes: ImagenAdmin[];
};

export function GaleriaFotosProducto({ productoId, imagenes }: Props) {
  const c = copysAdmin.formulario;
  const { data: sesion } = usarSesionAdmin();
  const cliente = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [arrastrando, setArrastrando] = useState(false);

  const puede = sesion ? puedeGestionarFotos(sesion.rol) : false;
  const completo = imagenes.length >= MAX;

  async function refrescar() {
    if (!productoId) return;
    await cliente.invalidateQueries({ queryKey: ['admin', 'producto', productoId] });
  }

  async function subirArchivos(lista: FileList | File[]) {
    if (!productoId || !puede || completo) return;
    const archivos = [...lista].filter((f) => TIPOS.includes(f.type));
    if (!archivos.length) {
      setError('Usa JPG, PNG o WebP.');
      return;
    }
    setError('');
    setSubiendo(true);
    try {
      let quedan = MAX - imagenes.length;
      for (const archivo of archivos) {
        if (quedan <= 0) break;
        if (archivo.size > 5 * 1024 * 1024) {
          setError('Alguna foto supera 5 MB.');
          continue;
        }
        await apiAdmin.imagenes.subir(productoId, archivo, { principal: imagenes.length === 0 });
        quedan -= 1;
      }
      await refrescar();
    } catch (err) {
      const cuerpo = err && typeof err === 'object' && 'cuerpo' in err ? (err as { cuerpo?: { error?: string } }).cuerpo : null;
      setError(cuerpo?.error ?? c.fotosError);
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function borrar(id: number) {
    if (!puede) return;
    setError('');
    try {
      await apiAdmin.imagenes.borrar(id);
      await refrescar();
    } catch {
      setError(c.fotosError);
    }
  }

  async function principal(id: number) {
    if (!puede) return;
    setError('');
    try {
      await apiAdmin.imagenes.marcarPrincipal(id);
      await refrescar();
    } catch {
      setError(c.fotosError);
    }
  }

  if (!productoId) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionFotos}</h2>
        <p className="rounded-md border border-dashed border-admin-borde-campo bg-admin-fondo px-3 py-4 text-[0.85rem] text-admin-texto-tenue">
          {c.fotosGuardaPrimero}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-cuerpo text-[0.9rem] font-semibold text-admin-texto">{c.seccionFotos}</h2>
        <p className="mt-0.5 text-[0.78rem] text-admin-texto-tenue">{c.fotosLimite}</p>
      </div>

      {!puede && (
        <p className="rounded-md border border-admin-borde bg-admin-fondo px-3 py-2 text-[0.82rem] text-admin-texto-3">
          {c.fotosSoloPropietaria}
        </p>
      )}

      {imagenes.length === 0 ? (
        <p className="text-[0.85rem] text-admin-texto-tenue">{c.fotosVacio}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {imagenes.map((img) => (
            <li key={img.id} className="relative overflow-hidden rounded-md border border-admin-borde bg-admin-fondo">
              <Imagen src={urlApi(img.ruta)} alt={img.alt} className="aspect-[3/4] w-full" />
              {img.principal && (
                <span className="absolute left-2 top-2 rounded bg-admin-acento px-1.5 py-0.5 text-[0.7rem] font-semibold text-white">
                  {c.fotosPrincipal}
                </span>
              )}
              {puede && (
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/70 to-transparent p-2">
                  {!img.principal && (
                    <button
                      type="button"
                      onClick={() => principal(img.id)}
                      className="flex flex-1 items-center justify-center gap-1 rounded bg-white/90 px-1 py-1 text-[0.7rem] font-semibold text-admin-texto"
                    >
                      <Star className="h-3 w-3" aria-hidden />
                      {c.fotosMarcarPrincipal}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => borrar(img.id)}
                    aria-label={c.fotosBorrar}
                    className="grid h-8 w-8 place-items-center rounded bg-white/90 text-admin-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {puede && !completo && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            if (e.dataTransfer.files?.length) void subirArchivos(e.dataTransfer.files);
          }}
          className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 text-center transition-colors ${
            arrastrando
              ? 'border-admin-acento bg-admin-acento-fondo'
              : 'border-admin-borde-campo-2 bg-superficie hover:border-admin-acento'
          }`}
        >
          <ImagePlus className="h-6 w-6 text-admin-texto-tenue" aria-hidden />
          <span className="text-[0.9rem] font-medium text-admin-texto">
            {subiendo ? c.fotosSubiendo : c.fotosArrastra}
          </span>
          <span className="text-[0.82rem] text-admin-texto-tenue">{c.fotosPulsa}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={subiendo}
            onChange={(e) => {
              if (e.target.files?.length) void subirArchivos(e.target.files);
            }}
          />
        </div>
      )}

      {error && <p className="text-[0.85rem] text-admin-error">{error}</p>}
    </section>
  );
}
