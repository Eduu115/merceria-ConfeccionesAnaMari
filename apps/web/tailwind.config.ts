import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '.oscuro'],
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
        crema: 'var(--color-crema)',
        arena: 'var(--color-arena)',
        'arena-2': 'var(--color-arena-2)',
        'arena-3': 'var(--color-arena-3)',
        borde: 'var(--color-borde)',
        'borde-fuerte': 'var(--color-borde-fuerte)',
        tinta: 'var(--color-tinta)',
        'tinta-2': 'var(--color-tinta-2)',
        'tinta-3': 'var(--color-tinta-3)',
        'tinta-apagada': 'var(--color-tinta-apagada)',
        'tinta-tenue': 'var(--color-tinta-tenue)',
        acento: 'var(--color-acento)',
        'acento-fondo': 'var(--color-acento-fondo)',
        boton: 'var(--color-boton)',
        error: 'var(--color-error)',
        superficie: 'var(--color-superficie)',
        whatsapp: '#25D366',
        'whatsapp-oscuro': '#1ea952',
        'admin-fondo': 'var(--color-admin-fondo)',
        'admin-borde': 'var(--color-admin-borde)',
        'admin-borde-2': 'var(--color-admin-borde-2)',
        'admin-borde-campo': 'var(--color-admin-borde-campo)',
        'admin-borde-campo-2': 'var(--color-admin-borde-campo-2)',
        'admin-texto': 'var(--color-admin-texto)',
        'admin-texto-2': 'var(--color-admin-texto-2)',
        'admin-texto-3': 'var(--color-admin-texto-3)',
        'admin-texto-tenue': 'var(--color-admin-texto-tenue)',
        'admin-acento': 'var(--color-admin-acento)',
        'admin-acento-fondo': 'var(--color-admin-acento-fondo)',
        'admin-error': 'var(--color-admin-error)',
        'admin-error-fondo': 'var(--color-admin-error-fondo)',
        'admin-exito': 'var(--color-admin-exito)',
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
