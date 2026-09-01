import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        crema: '#fbf9f4',
        arena: '#dfdacf',
        'arena-2': '#e8e4dc',
        'arena-3': '#e0dbd1',
        borde: '#ddd8ce',
        'borde-fuerte': '#b8b2a6',
        tinta: '#2a2620',
        'tinta-2': '#3a352e',
        'tinta-3': '#5c564a',
        'tinta-apagada': '#6b6559',
        'tinta-tenue': '#8a8578',
        acento: '#2f5d8c',
        'acento-fondo': '#eef2f6',
        boton: '#3a3a3a',
        error: '#a6432f',
        whatsapp: '#25D366',
        'whatsapp-oscuro': '#1ea952',
        // Panel de administración: piel de herramienta propia, no comparte tokens con la web pública.
        'admin-fondo': '#f5f5f4',
        'admin-borde': '#e0dedb',
        'admin-borde-2': '#f0efec',
        'admin-borde-campo': '#c9c6c0',
        'admin-borde-campo-2': '#d4d1cc',
        'admin-texto': '#1f1f1e',
        'admin-texto-2': '#3a3934',
        'admin-texto-3': '#6b6a66',
        'admin-texto-tenue': '#98968f',
        'admin-acento': '#2f5d8c',
        'admin-acento-fondo': '#eef2f6',
        'admin-error': '#a6432f',
        'admin-error-fondo': '#fbeeea',
        'admin-exito': '#2f7a52',
      },
      fontFamily: {
        titular: ['Caveat', 'cursive'],
        cuerpo: ['Archivo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        cuerpo: ['1.125rem', { lineHeight: '1.6' }],
        rotulo: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.06em' }],
      },
      maxWidth: {
        contenido: '88rem',
        medida: '42rem',
      },
      boxShadow: {
        panel: '0 4px 10px rgba(0,0,0,.08)',
      },
      spacing: {
        4.5: '1.125rem',
      },
    },
  },
  plugins: [],
};

export default config;
