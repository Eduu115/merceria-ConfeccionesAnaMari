import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      md: '768px',
      lg: '1024px',
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
      },
      fontFamily: {
        titular: ['Caveat', 'cursive'],
        cuerpo: ['Archivo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        cuerpo: ['1.0625rem', { lineHeight: '1.55' }],
        rotulo: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.06em' }],
      },
      maxWidth: {
        contenido: '1200px',
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
