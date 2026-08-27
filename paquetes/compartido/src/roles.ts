export const ROLES_USUARIO = ['admin_web', 'propietario', 'cliente'] as const;

export type RolUsuario = (typeof ROLES_USUARIO)[number];

export const TIPOS_CATALOGO = ['ropa', 'merceria'] as const;

export type TipoCatalogo = (typeof TIPOS_CATALOGO)[number];

export const ORDENES_PRODUCTO = ['novedades', 'az', 'za'] as const;

export type OrdenProducto = (typeof ORDENES_PRODUCTO)[number];

export const GRUPOS_PREGUNTA = ['tienda', 'arreglos', 'comprar'] as const;

export type GrupoPregunta = (typeof GRUPOS_PREGUNTA)[number];

export const FAMILIAS_ATRIBUTO = ['tipo_merceria', 'color'] as const;

export type FamiliaAtributo = (typeof FAMILIAS_ATRIBUTO)[number];

export function puedeAdministrarSitio(rol: RolUsuario): boolean {
  return rol === 'admin_web' || rol === 'propietario';
}
