export const copys = {
  negocio: 'Confecciones Ana Mari',
  menu: {
    inicio: 'Inicio',
    catalogo: 'Catálogo',
    arreglos: 'Arreglos',
    nosotros: 'Nosotros',
    contacto: 'Contacto',
  },
  catalogoBloques: {
    ropa: 'Ropa',
    merceria: 'Mercería',
  },
  pie: {
    informacion: 'Información',
    faq: 'Preguntas frecuentes',
    comoLlegar: 'Cómo llegar',
    aviso: 'Aviso legal',
    privacidad: 'Política de privacidad',
    cookies: 'Política de cookies',
    copyright: '© 2026 Confecciones Ana Mari',
  },
  botones: {
    whatsapp: 'WhatsApp',
    escribenos: 'Escríbenos por WhatsApp',
    verCatalogo: 'Ver catálogo',
    consultanos: 'Consúltanos por WhatsApp',
    conocenos: 'Conócenos',
    comoLlegar: 'Cómo llegar',
    llamar: 'Llamar',
    enviar: 'Enviar',
    volverInicio: 'Volver al inicio',
  },
  inicio: {
    queEncontraras: 'Qué encontrarás',
    seleccion: 'Selección de productos',
    verTodo: 'Ver todo el catálogo →',
    donde: 'Dónde estamos',
    arreglosTitular: '¿Se te ha roto una cremallera? Tiene arreglo.',
    pasos: [
      { n: '1', titulo: 'Diagnóstico gratuito' },
      { n: '2', titulo: 'Presupuesto en el momento' },
      { n: '3', titulo: 'Reparación profesional' },
      { n: '4', titulo: 'Listo en 24–72 h' },
    ],
    sobreTitular: 'Ana, 30 años detrás del mostrador',
  },
  arreglos: {
    migas: 'Arreglos',
    titular: 'Tráenos tu prenda',
    queHacemos: 'Qué hacemos',
    servicio: 'Servicio',
    incluye: 'Qué incluye',
    nota: 'Te damos el presupuesto exacto en el momento, sin compromiso.',
    como: 'Cómo funciona',
    pasos: [
      { n: '1', titulo: 'Diagnóstico', texto: 'Traes la prenda y valoramos el daño, gratis.' },
      { n: '2', titulo: 'Presupuesto', texto: 'Te decimos coste y plazo antes de empezar.' },
      { n: '3', titulo: 'Reparación', texto: 'Herramienta y repuestos de calidad.' },
      { n: '4', titulo: 'Entrega', texto: 'Listo en 24 a 72 horas.' },
    ],
    cierre: 'No deseches tu ropa, déjala en nuestras manos.',
  },
  nosotros: {
    titulo: 'Sobre nosotros',
    local: 'El local',
    pies: ['Fachada', 'Interior', 'Mostrador', 'Hilos'],
    cierre: 'Pásate por la tienda o escríbenos: te atendemos nosotras mismas.',
  },
  contacto: {
    titulo: 'Contacto',
    formTitulo: 'Escríbenos un mensaje',
    formIntro:
      'Te respondemos en horario de tienda. Si tienes prisa, escríbenos por WhatsApp.',
    nombre: 'Nombre',
    email: 'Email',
    mensaje: 'Mensaje',
    exitoTitulo: 'Mensaje enviado',
    exitoTexto:
      'Te contestamos en horario de tienda. Si es urgente, escríbenos por WhatsApp.',
  },
  faq: {
    titulo: 'Preguntas frecuentes',
    grupos: { tienda: 'La tienda', arreglos: 'Arreglos', comprar: 'Comprar' },
    cierre: '¿No encuentras tu respuesta?',
  },
  catalogo: {
    tituloRopa: 'Catálogo de ropa',
    tituloMerceria: 'Mercería y costura',
    categoria: 'Categoría',
    orden: 'Orden',
    tipo: 'Tipo de producto',
    color: 'Color',
    todas: 'Todas las prendas',
    novedades: 'Novedades',
    az: 'Alfabético A-Z',
    za: 'Alfabético Z-A',
    quitarTodo: 'Quitar todo',
    quitar: 'Quitar',
    vacioTitulo: 'Aquí todavía no hay nada',
    vacioRopa:
      'Puede que sí lo tengamos en tienda: el catálogo de la web es solo una parte de lo que hay en la mercería.',
    vacioRopaCta:
      '¿No encuentras lo que buscas? Pregúntanos, quizá lo tengamos en tienda',
    verTodas: 'Ver todas las prendas',
    vacioMerceria:
      'En la tienda hay mucho más de lo que cabe en la web: hilos, botones y cintas que aún no están subidos.',
    vacioMerceriaCta: 'Dinos qué necesitas y te lo miramos',
    verTodaMerceria: 'Ver toda la mercería',
  },
  ficha: {
    tallas: 'Tallas disponibles',
    caracteristicas: 'Características',
    carta: 'Carta de colores',
    detalles: 'Detalles',
    categoria: 'Categoría',
    composicion: 'Composición',
    colores: 'Colores',
    tambien: 'También en',
  },
  error404: {
    rotulo: 'Error 404',
    titular: 'Esta página se ha descosido',
    texto:
      'La dirección que has abierto ya no existe o está mal escrita. Vuelve al inicio o mira el catálogo; y si buscabas algo concreto, pregúntanos.',
    quizas: 'Quizá buscabas',
    enlaces: [
      { href: '/arreglos', label: 'Arreglos de ropa' },
      { href: '/catalogo/merceria', label: 'Mercería y costura' },
      { href: '/contacto', label: 'Horario y cómo llegar' },
    ],
  },
  legal: {
    indice: 'En esta página',
    indiceMovil: 'Índice de la página',
    actualizacion: 'Última actualización',
    otras: 'Otras páginas legales',
  },
  sinFoto: 'Sin foto todavía',
  sinFotoFicha: 'Pregúntanos y te la enviamos por WhatsApp',
  agotado: 'Agotado',
  verMapa: 'Ver el mapa',
} as const;

export const metas: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Confecciones Ana Mari · Mercería y arreglos de ropa en Getafe',
    description:
      'Ropa cómoda en todas las tallas, mercería y arreglos de confianza en Getafe. Más de 30 años en La Alhóndiga.',
  },
  '/arreglos': {
    title: 'Arreglos de ropa en Getafe · Confecciones Ana Mari',
    description:
      'Cremalleras, ojetes, broches y dobladillos. Diagnóstico gratuito, presupuesto en el momento y entrega en 24–72 h.',
  },
  '/nosotros': {
    title: 'Sobre nosotros · Confecciones Ana Mari',
    description: 'Más de 30 años cosiendo en el barrio de La Alhóndiga, Getafe.',
  },
  '/contacto': {
    title: 'Contacto y horario · Confecciones Ana Mari',
    description: 'Calle Almagro 15, Getafe. Teléfono, WhatsApp, horario y cómo llegar.',
  },
  '/preguntas-frecuentes': {
    title: 'Preguntas frecuentes · Confecciones Ana Mari',
    description: 'Dudas sobre la tienda, los arreglos y cómo comprar.',
  },
  '/catalogo': {
    title: 'Catálogo de ropa · Confecciones Ana Mari',
    description: 'Ropa de mujer, ropa interior e infantil en todas las tallas.',
  },
  '/catalogo/merceria': {
    title: 'Mercería y costura · Confecciones Ana Mari',
    description: 'Hilos, lanas, cremalleras, cintas, botones y accesorios de costura.',
  },
  '/aviso-legal': {
    title: 'Aviso legal · Confecciones Ana Mari',
    description: 'Aviso legal de Confecciones Ana Mari.',
  },
  '/privacidad': {
    title: 'Política de privacidad · Confecciones Ana Mari',
    description: 'Política de privacidad de Confecciones Ana Mari.',
  },
  '/cookies': {
    title: 'Política de cookies · Confecciones Ana Mari',
    description: 'Política de cookies de Confecciones Ana Mari.',
  },
};
