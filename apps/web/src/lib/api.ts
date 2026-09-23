import type {
  AjustesPublicos,
  AtributoPublico,
  CategoriaPublica,
  HorarioPublico,
  InicioPublico,
  ListadoProductos,
  PaginaPublica,
  PreguntaPublica,
  ProductoFicha,
  ServicioPublico,
} from '@anamari/compartido';

/** Origen de la API. Vacío = misma origen (proxy de Vite en local). */
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function urlApi(ruta: string): string {
  if (!ruta || /^https?:\/\//i.test(ruta)) return ruta;
  const path = ruta.startsWith('/') ? ruta : `/${ruta}`;
  return `${API_URL}${path}`;
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const res = await fetch(urlApi(ruta), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    const error = Object.assign(new Error('Error de red'), { status: res.status, cuerpo });
    throw error;
  }
  return res.json() as Promise<T>;
}

export const api = {
  inicio: () => pedir<InicioPublico>('/api/inicio'),
  ajustes: () => pedir<AjustesPublicos>('/api/ajustes'),
  horario: () => pedir<HorarioPublico>('/api/horario'),
  categorias: (tipo?: 'ropa' | 'merceria') =>
    pedir<CategoriaPublica[]>(`/api/categorias${tipo ? `?tipo=${tipo}` : ''}`),
  servicios: () => pedir<ServicioPublico[]>('/api/servicios'),
  preguntas: () => pedir<PreguntaPublica[]>('/api/preguntas'),
  pagina: (slug: string) => pedir<PaginaPublica>(`/api/paginas/${slug}`),
  productos: (qs: string) => pedir<ListadoProductos>(`/api/productos?${qs}`),
  producto: (slug: string) => pedir<ProductoFicha>(`/api/productos/${slug}`),
  atributos: (familia: 'tipo_merceria' | 'color') =>
    pedir<AtributoPublico[]>(`/api/atributos?familia=${familia}`),
  contacto: (cuerpo: { nombre: string; email: string; mensaje: string; sitio?: string }) =>
    pedir<{ ok: true }>('/api/contacto', { method: 'POST', body: JSON.stringify(cuerpo) }),
};
