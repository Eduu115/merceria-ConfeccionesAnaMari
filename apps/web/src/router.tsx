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
]);
