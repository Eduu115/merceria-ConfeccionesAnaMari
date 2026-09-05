export type UsuarioAdmin = {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin_web' | 'propietario' | 'cliente';
};

export type CategoriaAdmin = {
  id: number;
  slug: string;
  nombre: string;
  tipo: 'ropa' | 'merceria';
  padreId: number | null;
  orden: number;
  visible: boolean;
};

export type AtributoAdmin = {
  id: number;
  familia: 'tipo_merceria' | 'color';
  slug: string;
  nombre: string;
  hex: string | null;
  orden: number;
};

export type ImagenAdmin = {
  id: number;
  productoId: number | null;
  ruta: string;
  alt: string;
  principal: boolean;
  orden: number;
};

export type ProductoListado = {
  id: number;
  slug: string;
  nombre: string;
  tipo: 'ropa' | 'merceria';
  categoria: string;
  visible: boolean;
  agotado: boolean;
  destacado: boolean;
  precio_centimos: number | null;
};

export type ProductoDetalle = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: number;
  tipo: 'ropa' | 'merceria';
  composicion: string | null;
  colores: string | null;
  caracteristica: string | null;
  agotado: boolean;
  destacado: boolean;
  visible: boolean;
  precio_centimos: number | null;
  tallas: { talla: string; disponible: boolean }[];
  atributos: number[];
  imagenes: ImagenAdmin[];
};

export type ProductoEntrada = {
  nombre: string;
  tipo: 'ropa' | 'merceria';
  categoria_id: number;
  descripcion?: string | null;
  composicion?: string | null;
  colores?: string | null;
  caracteristica?: string | null;
  precio_centimos?: number | null;
  agotado?: boolean;
  destacado?: boolean;
  visible?: boolean;
  tallas?: { talla: string; disponible?: boolean }[];
  atributos?: number[];
};

export type UsuarioGestionado = {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin_web' | 'propietario' | 'cliente';
  activo: boolean;
  creadoEn: string;
};

export type UsuarioEntrada = {
  nombre: string;
  rol: 'admin_web' | 'propietario' | 'cliente';
  activo: boolean;
  password?: string;
};

export type UsuarioNuevoEntrada = {
  email: string;
  nombre: string;
  rol: 'admin_web' | 'propietario' | 'cliente';
  password: string;
};

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const res = await fetch(ruta, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    const error = Object.assign(new Error('Error de red'), { status: res.status, cuerpo });
    throw error;
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiAdmin = {
  yo: () => pedir<UsuarioAdmin>('/api/admin/yo'),
  entrar: (cuerpo: { email: string; password: string }) =>
    pedir<UsuarioAdmin>('/api/admin/sesion', { method: 'POST', body: JSON.stringify(cuerpo) }),
  salir: () => pedir<void>('/api/admin/sesion', { method: 'DELETE' }),
  cambiarContrasena: (actual: string, nueva: string) =>
    pedir<{ ok: true }>('/api/admin/yo/contrasena', { method: 'PUT', body: JSON.stringify({ actual, nueva }) }),

  categorias: (tipo?: 'ropa' | 'merceria') =>
    pedir<CategoriaAdmin[]>(`/api/admin/categorias${tipo ? `?tipo=${tipo}` : ''}`),
  atributos: (familia: 'tipo_merceria' | 'color') =>
    pedir<AtributoAdmin[]>(`/api/admin/atributos?familia=${familia}`),

  productos: {
    listar: (tipo?: 'ropa' | 'merceria') =>
      pedir<ProductoListado[]>(`/api/admin/productos${tipo ? `?tipo=${tipo}` : ''}`),
    obtener: (id: number) => pedir<ProductoDetalle>(`/api/admin/productos/${id}`),
    crear: (datos: ProductoEntrada) =>
      pedir<{ id: number; slug: string }>('/api/admin/productos', { method: 'POST', body: JSON.stringify(datos) }),
    actualizar: (id: number, datos: ProductoEntrada) =>
      pedir<{ id: number; slug: string }>(`/api/admin/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
    borrar: (id: number) => pedir<void>(`/api/admin/productos/${id}`, { method: 'DELETE' }),
  },

  usuarios: {
    listar: () => pedir<UsuarioGestionado[]>('/api/admin/usuarios'),
    obtener: (id: number) => pedir<UsuarioGestionado>(`/api/admin/usuarios/${id}`),
    crear: (datos: UsuarioNuevoEntrada) =>
      pedir<UsuarioGestionado>('/api/admin/usuarios', { method: 'POST', body: JSON.stringify(datos) }),
    actualizar: (id: number, datos: UsuarioEntrada) =>
      pedir<UsuarioGestionado>(`/api/admin/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
    borrar: (id: number) => pedir<void>(`/api/admin/usuarios/${id}`, { method: 'DELETE' }),
  },
};
