import { createBrowserRouter } from 'react-router-dom';
import { LayoutPublico } from './layouts/LayoutPublico';
import { Inicio } from './paginas/Inicio';
import { NoEncontrada } from './paginas/NoEncontrada';

export const router = createBrowserRouter([
  {
    element: <LayoutPublico />,
    children: [
      { path: '/', element: <Inicio /> },
      {
        path: '/arreglos',
        lazy: async () => {
          const { Arreglos } = await import('./paginas/Arreglos');
          return { Component: Arreglos };
        },
      },
      {
        path: '/nosotros',
        lazy: async () => {
          const { Nosotros } = await import('./paginas/Nosotros');
          return { Component: Nosotros };
        },
      },
      {
        path: '/contacto',
        lazy: async () => {
          const { Contacto } = await import('./paginas/Contacto');
          return { Component: Contacto };
        },
      },
      {
        path: '/preguntas-frecuentes',
        lazy: async () => {
          const { PreguntasFrecuentes } = await import('./paginas/PreguntasFrecuentes');
          return { Component: PreguntasFrecuentes };
        },
      },
      {
        path: '/catalogo',
        lazy: async () => {
          const { CatalogoRopa } = await import('./paginas/CatalogoRopa');
          return { Component: CatalogoRopa };
        },
      },
      {
        path: '/catalogo/merceria',
        lazy: async () => {
          const { CatalogoMerceria } = await import('./paginas/CatalogoMerceria');
          return { Component: CatalogoMerceria };
        },
      },
      {
        path: '/producto/:slug',
        lazy: async () => {
          const { FichaProducto } = await import('./paginas/FichaProducto');
          return { Component: FichaProducto };
        },
      },
      {
        path: '/aviso-legal',
        lazy: async () => {
          const { Legal } = await import('./paginas/Legal');
          return { Component: Legal };
        },
        handle: { legal: true },
      },
      {
        path: '/privacidad',
        lazy: async () => {
          const { Legal } = await import('./paginas/Legal');
          return { Component: Legal };
        },
        handle: { legal: true },
      },
      {
        path: '/cookies',
        lazy: async () => {
          const { Legal } = await import('./paginas/Legal');
          return { Component: Legal };
        },
        handle: { legal: true },
      },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
  {
    path: '/admin',
    children: [
      {
        lazy: async () => {
          const { GuardiaAdmin } = await import('./admin/GuardiaAdmin');
          return { Component: GuardiaAdmin };
        },
        children: [
          {
            lazy: async () => {
              const { LayoutAdmin } = await import('./admin/layouts/LayoutAdmin');
              return { Component: LayoutAdmin };
            },
            children: [
              {
                index: true,
                lazy: async () => {
                  const { Listado } = await import('./admin/paginas/Listado');
                  return { Component: Listado };
                },
              },
              {
                path: 'productos/nuevo',
                lazy: async () => {
                  const { Nuevo } = await import('./admin/paginas/Nuevo');
                  return { Component: Nuevo };
                },
              },
              {
                path: 'productos/:id',
                lazy: async () => {
                  const { Editar } = await import('./admin/paginas/Editar');
                  return { Component: Editar };
                },
              },
              {
                path: 'cuenta',
                lazy: async () => {
                  const { Cuenta } = await import('./admin/paginas/Cuenta');
                  return { Component: Cuenta };
                },
              },
              {
                lazy: async () => {
                  const { GuardiaGestionUsuarios } = await import('./admin/GuardiaGestionUsuarios');
                  return { Component: GuardiaGestionUsuarios };
                },
                children: [
                  {
                    path: 'usuarios',
                    lazy: async () => {
                      const { Usuarios } = await import('./admin/paginas/Usuarios');
                      return { Component: Usuarios };
                    },
                  },
                  {
                    path: 'usuarios/nuevo',
                    lazy: async () => {
                      const { UsuarioNuevo } = await import('./admin/paginas/UsuarioNuevo');
                      return { Component: UsuarioNuevo };
                    },
                  },
                  {
                    path: 'usuarios/:id',
                    lazy: async () => {
                      const { UsuarioEditar } = await import('./admin/paginas/UsuarioEditar');
                      return { Component: UsuarioEditar };
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        lazy: async () => {
          const { LayoutAdminAuth } = await import('./admin/layouts/LayoutAdminAuth');
          return { Component: LayoutAdminAuth };
        },
        children: [
          {
            lazy: async () => {
              const { GuardiaInvitado } = await import('./admin/GuardiaInvitado');
              return { Component: GuardiaInvitado };
            },
            children: [
              {
                path: 'entrar',
                lazy: async () => {
                  const { Acceso } = await import('./admin/paginas/Acceso');
                  return { Component: Acceso };
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);
