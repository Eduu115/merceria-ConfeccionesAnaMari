import { createBrowserRouter } from 'react-router-dom';
import { LayoutPublico } from './layouts/LayoutPublico';
import { Inicio } from './paginas/Inicio';
import { Arreglos } from './paginas/Arreglos';
import { Nosotros } from './paginas/Nosotros';
import { Contacto } from './paginas/Contacto';
import { PreguntasFrecuentes } from './paginas/PreguntasFrecuentes';
import { Legal } from './paginas/Legal';
import { CatalogoRopa } from './paginas/CatalogoRopa';
import { CatalogoMerceria } from './paginas/CatalogoMerceria';
import { FichaProducto } from './paginas/FichaProducto';
import { NoEncontrada } from './paginas/NoEncontrada';

export const router = createBrowserRouter([
  {
    element: <LayoutPublico />,
    children: [
      { path: '/', element: <Inicio /> },
      { path: '/arreglos', element: <Arreglos /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/contacto', element: <Contacto /> },
      { path: '/preguntas-frecuentes', element: <PreguntasFrecuentes /> },
      { path: '/catalogo', element: <CatalogoRopa /> },
      { path: '/catalogo/merceria', element: <CatalogoMerceria /> },
      { path: '/producto/:slug', element: <FichaProducto /> },
      { path: '/aviso-legal', element: <Legal />, handle: { legal: true } },
      { path: '/privacidad', element: <Legal />, handle: { legal: true } },
      { path: '/cookies', element: <Legal />, handle: { legal: true } },
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
