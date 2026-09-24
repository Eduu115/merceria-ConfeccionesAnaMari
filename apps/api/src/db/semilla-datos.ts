import type { GrupoPregunta } from '@anamari/compartido';

export const CATEGORIAS = [
  {
    slug: 'mujer',
    nombre: 'Mujer',
    tipo: 'ropa' as const,
    descripcion: 'Batas, camisones, vestidos y prendas cómodas para el día a día.',
    orden: 1,
  },
  {
    slug: 'mujer-lenceria',
    nombre: 'Lencería',
    tipo: 'ropa' as const,
    descripcion: 'Camisones, batas y pijamas.',
    orden: 1,
    padre: 'mujer',
  },
  {
    slug: 'mujer-ropa',
    nombre: 'Ropa',
    tipo: 'ropa' as const,
    descripcion: 'Vestidos, faldas, blusas, pantalones y punto.',
    orden: 2,
    padre: 'mujer',
  },
  {
    slug: 'mujer-ropa-interior',
    nombre: 'Ropa interior',
    tipo: 'ropa' as const,
    descripcion: 'Ropa interior de mujer.',
    orden: 3,
    padre: 'mujer',
  },
  {
    slug: 'hombre',
    nombre: 'Hombre',
    tipo: 'ropa' as const,
    descripcion: 'Camisas, pantalones y prendas cómodas para el día a día.',
    orden: 2,
  },
  {
    slug: 'hombre-ropa',
    nombre: 'Ropa',
    tipo: 'ropa' as const,
    descripcion: 'Camisas, pantalones y punto.',
    orden: 1,
    padre: 'hombre',
  },
  {
    slug: 'hombre-ropa-interior',
    nombre: 'Ropa interior',
    tipo: 'ropa' as const,
    descripcion: 'Calzoncillos y camisetas interiores.',
    orden: 2,
    padre: 'hombre',
  },
  {
    slug: 'ninos',
    nombre: 'Niños',
    tipo: 'ropa' as const,
    descripcion: 'Ropa para los más pequeños y bebés, y arreglos si hace falta.',
    orden: 3,
  },
  {
    slug: 'merceria-y-costura',
    nombre: 'Mercería y costura',
    tipo: 'merceria' as const,
    descripcion: 'Hilos, cremalleras, botones, cintas y todo para coser.',
    orden: 4,
  },
];

export const TIPOS_MERCERIA = [
  { slug: 'hilos-y-lanas', nombre: 'Hilos y lanas', orden: 1 },
  { slug: 'cremalleras', nombre: 'Cremalleras', orden: 2 },
  { slug: 'cintas-y-gomas', nombre: 'Cintas y gomas', orden: 3 },
  { slug: 'botones-y-broches', nombre: 'Botones y broches', orden: 4 },
  { slug: 'agujas-y-accesorios', nombre: 'Agujas y accesorios', orden: 5 },
];

export const COLORES = [
  { slug: 'negro', nombre: 'Negro', hex: '#1a1a1a', orden: 1 },
  { slug: 'blanco', nombre: 'Blanco', hex: '#f5f2ea', orden: 2 },
  { slug: 'crudo', nombre: 'Crudo', hex: '#e6dcc8', orden: 3 },
  { slug: 'azul', nombre: 'Azul', hex: '#2f5d8c', orden: 4 },
  { slug: 'granate', nombre: 'Granate', hex: '#6b2a32', orden: 5 },
  { slug: 'verde', nombre: 'Verde', hex: '#3d5c45', orden: 6 },
  { slug: 'varios', nombre: 'Varios colores', hex: null, orden: 7 },
];

const TALLAS = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

type RopaSemilla = {
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  composicion: string;
  colores: string;
  destacado?: boolean;
  agotado?: boolean;
  sinS?: boolean;
  sin3xl?: boolean;
};

export const ROPA: RopaSemilla[] = [
  {
    slug: 'bata-abotonada-manga-larga',
    nombre: 'Bata abotonada de manga larga en algodón, con bolsillos laterales',
    categoria: 'mujer-lenceria',
    descripcion:
      'Bata de casa de algodón, abotonada, con bolsillos laterales. Cae suave y cubre bien. Pregunta talla y color en tienda o por WhatsApp.',
    composicion: '100 % algodón',
    colores: 'Azul, granate, crudo',
    destacado: true,
  },
  {
    slug: 'camison-manga-corta',
    nombre: 'Camisón de manga corta',
    categoria: 'mujer-lenceria',
    descripcion: 'Camisón fresco de manga corta, corte holgado. Ideal para dormir con calor.',
    composicion: '100 % algodón',
    colores: 'Rosa, azul, blanco',
    destacado: true,
  },
  {
    slug: 'pijama-algodon-dos-piezas',
    nombre: 'Pijama de algodón dos piezas',
    categoria: 'mujer-lenceria',
    descripcion: 'Pijama de chaqueta y pantalón, tejido de algodón que aguanta lavados.',
    composicion: '100 % algodón',
    colores: 'Rayas azul, liso crudo',
    destacado: true,
  },
  {
    slug: 'falda-plisada-tejido-fino',
    nombre: 'Falda plisada de tejido fino',
    categoria: 'mujer-ropa',
    descripcion: 'Falda plisada ligera, cintura elástica. Cae por debajo de la rodilla.',
    composicion: 'Poliéster',
    colores: 'Negro, marino',
  },
  {
    slug: 'vestido-camisero-estampado',
    nombre: 'Vestido camisero estampado de media manga',
    categoria: 'mujer-ropa',
    descripcion: 'Vestido camisero de media manga, botones delanteros y estampado suave.',
    composicion: 'Algodón y viscosa',
    colores: 'Estampado floral',
    destacado: true,
    sinS: true,
  },
  {
    slug: 'rebeca-punto-botones',
    nombre: 'Rebeca de punto con botones',
    categoria: 'mujer-ropa',
    descripcion: 'Rebeca de punto medio, con botones. Para casa o encima de un camisón.',
    composicion: 'Acrílico',
    colores: 'Beige, gris, azul',
    destacado: true,
  },
  {
    slug: 'pantalon-cintura-elastica',
    nombre: 'Pantalón de cintura elástica',
    categoria: 'mujer-ropa',
    descripcion: 'Pantalón cómodo de cintura elástica, sin pretina dura.',
    composicion: 'Algodón con elastano',
    colores: 'Negro, marino, beige',
  },
  {
    slug: 'blusa-manga-tres-cuartos',
    nombre: 'Blusa de manga tres cuartos',
    categoria: 'mujer-ropa',
    descripcion: 'Blusa lisa de manga tres cuartos, cuello redondo. Corte amplio.',
    composicion: 'Viscosa',
    colores: 'Blanco, azul, granate',
  },
  {
    slug: 'bata-cruzada-rizo',
    nombre: 'Bata cruzada de rizo',
    categoria: 'mujer-lenceria',
    descripcion: 'Bata de rizo cruzada, con cinturón. Absorbe y abriga al salir de la ducha.',
    composicion: '100 % algodón rizo',
    colores: 'Blanco, rosa, azul',
  },
  {
    slug: 'camison-largo-invierno',
    nombre: 'Camisón largo de invierno',
    categoria: 'mujer-lenceria',
    descripcion: 'Camisón largo de tejido de invierno, manga larga.',
    composicion: 'Algodón y poliéster',
    colores: 'Burdeos, azul oscuro',
    agotado: true,
  },
  {
    slug: 'pijama-polar',
    nombre: 'Pijama de polar',
    categoria: 'mujer-lenceria',
    descripcion: 'Pijama de polar de dos piezas para los meses fríos.',
    composicion: 'Poliéster polar',
    colores: 'Gris, rosa empolvado',
  },
  {
    slug: 'vestido-punto',
    nombre: 'Vestido de punto',
    categoria: 'mujer-ropa',
    descripcion: 'Vestido de punto de corte recto, manga larga.',
    composicion: 'Acrílico y lana',
    colores: 'Negro, camel',
    sin3xl: true,
  },
  {
    slug: 'camiseta-algodon-mujer',
    nombre: 'Camiseta de algodón de manga corta',
    categoria: 'mujer-ropa',
    descripcion: 'Camiseta básica de algodón, cuello redondo.',
    composicion: '100 % algodón',
    colores: 'Blanco, negro, crudo',
    destacado: true,
  },
  {
    slug: 'leggings-talle-alto',
    nombre: 'Leggings de talle alto',
    categoria: 'mujer-ropa',
    descripcion: 'Leggings opacos de talle alto, cintura ancha.',
    composicion: 'Algodón con elastano',
    colores: 'Negro',
  },
  {
    slug: 'calzon-corto-hombre',
    nombre: 'Calzón corto',
    categoria: 'hombre-ropa-interior',
    descripcion: 'Calzoncillo corto de algodón, tejido de punto. Talla amplia; pregunta en tienda.',
    composicion: '100 % algodón',
    colores: 'Blanco, crudo',
    destacado: true,
  },
  {
    slug: 'calzon-largo-hombre',
    nombre: 'Calzón largo',
    categoria: 'hombre-ropa-interior',
    descripcion: 'Calzoncillo largo de algodón, ajustado. Para el frío, tejido de invierno.',
    composicion: '100 % algodón',
    colores: 'Blanco, crudo',
  },
  {
    slug: 'body-bebe',
    nombre: 'Body de bebé',
    categoria: 'ninos',
    descripcion: 'Body de algodón para bebé, broches en la entrepierna.',
    composicion: '100 % algodón',
    colores: 'Blanco, azul, rosa',
  },
  {
    slug: 'pelele-algodon',
    nombre: 'Pelele de algodón',
    categoria: 'ninos',
    descripcion: 'Pelele de una pieza, tejido suave.',
    composicion: '100 % algodón',
    colores: 'Celeste, rosa, crudo',
  },
  {
    slug: 'pijama-infantil',
    nombre: 'Pijama infantil de dos piezas',
    categoria: 'ninos',
    descripcion: 'Pijama de niño o niña, dos piezas, algodón.',
    composicion: '100 % algodón',
    colores: 'Estampados varios',
    destacado: true,
  },
  {
    slug: 'ranita-bebe',
    nombre: 'Ranita de bebé',
    categoria: 'ninos',
    descripcion: 'Ranita corta de algodón, con tirantes.',
    composicion: '100 % algodón',
    colores: 'Blanco, rayas',
  },
  {
    slug: 'camiseta-nina',
    nombre: 'Camiseta de niña',
    categoria: 'ninos',
    descripcion: 'Camiseta de manga corta para niña.',
    composicion: '100 % algodón',
    colores: 'Blanco, rosa, estampado',
  },
  {
    slug: 'pantalon-chandal-infantil',
    nombre: 'Pantalón de chándal infantil',
    categoria: 'ninos',
    descripcion: 'Pantalón de chándal con cintura elástica.',
    composicion: 'Algodón y poliéster',
    colores: 'Gris, marino',
    sin3xl: true,
  },
];

export function tallasDe(producto: RopaSemilla): { talla: string; disponible: boolean; orden: number }[] {
  return TALLAS.map((talla, orden) => {
    let disponible = true;
    if (producto.sinS && talla === 'S') disponible = false;
    if (producto.sin3xl && talla === '3XL') disponible = false;
    if (producto.agotado) disponible = false;
    if (producto.slug === 'bata-abotonada-manga-larga' && talla === 'S') disponible = false;
    return { talla, disponible, orden };
  });
}

type MerceriaSemilla = {
  slug: string;
  nombre: string;
  descripcion: string;
  caracteristica: string;
  composicion?: string;
  colores: string;
  tipo: string;
  color: string;
  destacado?: boolean;
  agotado?: boolean;
};

export const MERCERIA: MerceriaSemilla[] = [
  {
    slug: 'hilo-coser-poliester-100m',
    nombre: 'Hilo de coser poliéster',
    descripcion: 'Hilo de coser de poliéster, bobina de 100 metros, grosor 50. Carta amplia de colores en tienda.',
    caracteristica: '100 m · grosor 50',
    composicion: 'Poliéster',
    colores: 'Carta de 28 colores',
    tipo: 'hilos-y-lanas',
    color: 'varios',
    destacado: true,
  },
  {
    slug: 'ovillo-lana-fina-50g',
    nombre: 'Ovillo de lana fina',
    descripcion: 'Ovillo de lana fina de 50 g, varios colores. Para agujas delgadas.',
    caracteristica: '50 g · varios colores',
    composicion: 'Acrílico',
    colores: 'Varios',
    tipo: 'hilos-y-lanas',
    color: 'varios',
    destacado: true,
  },
  {
    slug: 'hilo-bordar-madeja',
    nombre: 'Hilo de bordar en madeja',
    descripcion: 'Madeja de hilo de bordar de 8 m. Hay unos 30 colores en tienda.',
    caracteristica: '8 m · 30 colores',
    composicion: 'Algodón mercerizado',
    colores: '30 colores',
    tipo: 'hilos-y-lanas',
    color: 'varios',
  },
  {
    slug: 'lana-gruesa-agujas-8',
    nombre: 'Lana gruesa para agujas del 8',
    descripcion: 'Ovillo de 100 g de lana gruesa, color crudo. Para agujas del 8.',
    caracteristica: '100 g · crudo',
    composicion: 'Acrílico',
    colores: 'Crudo',
    tipo: 'hilos-y-lanas',
    color: 'crudo',
  },
  {
    slug: 'hilo-nailon-transparente',
    nombre: 'Hilo de nailon transparente',
    descripcion: 'Hilo de nailon transparente, bobina de 50 m. Para dobladillos invisibles.',
    caracteristica: '50 m',
    composicion: 'Nailon',
    colores: 'Transparente',
    tipo: 'hilos-y-lanas',
    color: 'blanco',
  },
  {
    slug: 'hilo-grueso-tapiceria',
    nombre: 'Hilo grueso para tapicería',
    descripcion: 'Hilo grueso de tapicería, 30 m, grosor 20.',
    caracteristica: '30 m · grosor 20',
    composicion: 'Poliéster',
    colores: 'Crudo, negro',
    tipo: 'hilos-y-lanas',
    color: 'crudo',
  },
  {
    slug: 'ovillo-algodon-ganchillo',
    nombre: 'Ovillo de algodón para ganchillo',
    descripcion: 'Ovillo de algodón de 50 g para ganchillo. Doce colores en tienda.',
    caracteristica: '50 g · 12 colores',
    composicion: '100 % algodón',
    colores: '12 colores',
    tipo: 'hilos-y-lanas',
    color: 'varios',
  },
  {
    slug: 'hilo-elastico-negro',
    nombre: 'Hilo elástico',
    descripcion: 'Hilo elástico negro, 20 m. Para nidos de abeja y cinturas.',
    caracteristica: '20 m · negro',
    composicion: 'Elastano recubierto',
    colores: 'Negro',
    tipo: 'hilos-y-lanas',
    color: 'negro',
  },
  {
    slug: 'cremallera-metalica-20cm',
    nombre: 'Cremallera metálica',
    descripcion: 'Cremallera metálica de 20 cm, cursor incluido. Negra.',
    caracteristica: '20 cm · negra',
    colores: 'Negro',
    tipo: 'cremalleras',
    color: 'negro',
    destacado: true,
  },
  {
    slug: 'cremallera-nylon-40cm',
    nombre: 'Cremallera de nailon',
    descripcion: 'Cremallera de nailon separable, 40 cm.',
    caracteristica: '40 cm · separable',
    colores: 'Negro, blanco, marino',
    tipo: 'cremalleras',
    color: 'negro',
  },
  {
    slug: 'cremallera-invisible-20cm',
    nombre: 'Cremallera invisible',
    descripcion: 'Cremallera invisible de 20 cm, para faldas y vestidos.',
    caracteristica: '20 cm · invisible',
    colores: 'Negro, blanco, crudo',
    tipo: 'cremalleras',
    color: 'negro',
    agotado: true,
  },
  {
    slug: 'cinta-elastica-3m',
    nombre: 'Cinta elástica',
    descripcion: 'Cinta elástica de 20 mm de ancho, rollo de 3 m.',
    caracteristica: '3 m · 20 mm de ancho',
    colores: 'Blanco, negro',
    tipo: 'cintas-y-gomas',
    color: 'blanco',
    destacado: true,
  },
  {
    slug: 'cinta-bies',
    nombre: 'Cinta de bies',
    descripcion: 'Cinta de bies de algodón, 20 mm, varios colores.',
    caracteristica: '3 m · 20 mm',
    composicion: 'Algodón',
    colores: 'Varios',
    tipo: 'cintas-y-gomas',
    color: 'varios',
  },
  {
    slug: 'goma-ropa',
    nombre: 'Goma para ropa',
    descripcion: 'Goma plana para cinturas y puños, 10 mm.',
    caracteristica: '5 m · 10 mm',
    colores: 'Blanco',
    tipo: 'cintas-y-gomas',
    color: 'blanco',
  },
  {
    slug: 'botones-nacar',
    nombre: 'Botones de nácar',
    descripcion: 'Botones de nácar de 15 mm, bolsa de 6 unidades.',
    caracteristica: '15 mm · 6 uds.',
    colores: 'Crudo',
    tipo: 'botones-y-broches',
    color: 'crudo',
  },
  {
    slug: 'broches-presion',
    nombre: 'Broches de presión',
    descripcion: 'Broches de presión metálicos, varios tamaños. Se colocan en el taller.',
    caracteristica: 'Surtido · metálicos',
    colores: 'Plateado, negro',
    tipo: 'botones-y-broches',
    color: 'negro',
  },
  {
    slug: 'agujas-coser',
    nombre: 'Agujas de coser',
    descripcion: 'Sobre de agujas de coser de varios grosores.',
    caracteristica: 'Surtido · mano',
    colores: '—',
    tipo: 'agujas-y-accesorios',
    color: 'varios',
  },
  {
    slug: 'alfileres-cabeza-cristal',
    nombre: 'Alfileres de cabeza de cristal',
    descripcion: 'Caja de alfileres con cabeza de cristal, 0,60 × 30 mm.',
    caracteristica: 'Caja · 30 mm',
    colores: 'Surtido',
    tipo: 'agujas-y-accesorios',
    color: 'varios',
  },
];

export const SERVICIOS = [
  {
    slug: 'cremalleras',
    nombre: 'Cremalleras',
    incluye:
      'Sustitución completa o reparación del deslizador en chaquetas, pantalones, vestidos y bolsos',
    orden: 1,
  },
  {
    slug: 'ojetes',
    nombre: 'Ojetes',
    incluye: 'Colocación y sustitución en ropa, calzado, bolsos, mochilas y cortinas',
    orden: 2,
  },
  {
    slug: 'broches-de-presion',
    nombre: 'Broches de presión',
    incluye: 'Reparación y colocación en ropa infantil, deportiva y de casa',
    orden: 3,
  },
  {
    slug: 'dobladillos-y-ajustes',
    nombre: 'Dobladillos y ajustes',
    incluye: 'Acortar, estrechar y adaptar prendas a medida',
    orden: 4,
  },
];

export const PREGUNTAS: { grupo: GrupoPregunta; pregunta: string; respuesta: string; orden: number }[] =
  [
    {
      grupo: 'tienda',
      pregunta: '¿Qué tipo de productos venden?',
      respuesta:
        'En Confecciones Ana Mari nos especializamos en lencería femenina, incluyendo brasieres, panties, conjuntos, bodys, pijamas sensuales y más. Trabajamos con materiales de calidad que garantizan comodidad y estilo.',
      orden: 1,
    },
    {
      grupo: 'tienda',
      pregunta: '¿Cómo puedo contactar al equipo de atención al cliente?',
      respuesta:
        'Puedes escribirnos al correo anamariconfecciones@gmail.com o al teléfono 615 644 940. Horario: lunes a viernes de 10:15 a 14:00 y de 17:30 a 20:00; sábados de 10:15 a 14:00.',
      orden: 2,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Cómo sé cuál es mi talla?',
      respuesta:
        'Contamos con una guía de tallas en cada producto para ayudarte a elegir la talla adecuada. Si aún tienes dudas, puedes escribirnos y con gusto te orientamos.',
      orden: 1,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Hacen envíos a todo el país?',
      respuesta:
        'Realizamos envíos únicamente a la Península. Los tiempos de entrega varían según tu ubicación, pero normalmente tardan entre 2 y 5 días hábiles.',
      orden: 2,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Puedo cambiar o devolver un producto?',
      respuesta:
        'Sí, aceptamos cambios y devoluciones dentro de los 7 días posteriores a la recepción, siempre que el producto esté en su empaque original, sin uso y con etiquetas. Consulta nuestra política de cambios para más detalles.',
      orden: 3,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Cuáles son los métodos de pago aceptados?',
      respuesta:
        'Aceptamos pagos con tarjetas de crédito, débito, transferencias bancarias y pagos a través de plataformas como Stripe o PayPal.',
      orden: 4,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Es seguro comprar en su sitio?',
      respuesta:
        'Sí. Utilizamos conexiones cifradas (SSL) y plataformas de pago seguras para proteger tus datos personales y bancarios.',
      orden: 5,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Puedo hacer un pedido personalizado?',
      respuesta:
        'Sí, dependiendo del producto. Escríbenos por WhatsApp o correo electrónico y revisaremos la disponibilidad y los tiempos de entrega.',
      orden: 6,
    },
  ];

export const HORARIO = [
  { dia: 0, cerrado: false, manana_abre: '10:15', manana_cierra: '14:00', tarde_abre: '17:30', tarde_cierra: '20:00' },
  { dia: 1, cerrado: false, manana_abre: '10:15', manana_cierra: '14:00', tarde_abre: '17:30', tarde_cierra: '20:00' },
  { dia: 2, cerrado: false, manana_abre: '10:15', manana_cierra: '14:00', tarde_abre: '17:30', tarde_cierra: '20:00' },
  { dia: 3, cerrado: false, manana_abre: '10:15', manana_cierra: '14:00', tarde_abre: '17:30', tarde_cierra: '20:00' },
  { dia: 4, cerrado: false, manana_abre: '10:15', manana_cierra: '14:00', tarde_abre: '17:30', tarde_cierra: '20:00' },
  { dia: 5, cerrado: false, manana_abre: '10:15', manana_cierra: '14:00', tarde_abre: null, tarde_cierra: null },
  { dia: 6, cerrado: true, manana_abre: null, manana_cierra: null, tarde_abre: null, tarde_cierra: null },
];

export function ajustesIniciales(opts: {
  whatsapp: string;
  mapa: string;
  email: string;
}): Record<string, string> {
  return {
    negocio_descripcion:
      'Mercería, ropa cómoda y taller de arreglos en el barrio de La Alhóndiga, Getafe.',
    direccion: 'Calle Almagro, 15',
    poblacion: '28904 Getafe, Madrid',
    telefono: '615 644 940',
    email: opts.email,
    whatsapp_telefono: opts.whatsapp,
    mapa_embed_url: opts.mapa,
    redes_facebook: '',
    redes_instagram: '',
    inicio_titular: 'Ropa cómoda en todas las tallas y arreglos de confianza en Getafe',
    inicio_subtitulo:
      'Tallas de la S a la 3XL, ropa interior e infantil. Los arreglos se hacen aquí mismo, en el taller de la tienda.',
    arreglos_intro:
      'Cremalleras, ojetes, broches y dobladillos. Diagnóstico gratuito y presupuesto en el momento, sin compromiso.',
    nosotros_titular: 'Más de 30 años cosiendo en La Alhóndiga',
    nosotros_p1:
      'Abrimos el taller en el barrio de La Alhóndiga hace más de treinta años. Desde entonces, Ana está detrás del mostrador: vende ropa cómoda, mercería y arregla lo que se rompe.',
    nosotros_p2:
      'El barrio ha cambiado, pero el oficio no. Seguimos cortando, cosiendo y escuchando lo que cada prenda necesita, sin prisas y sin mandar la ropa a otro sitio.',
    nosotros_p3:
      'Venimos a trabajar con lo que hay: una cremallera, un dobladillo, una bata de casa. Si pasas, te atendemos nosotras mismas.',
    catalogo_intro:
      'Una muestra de lo que hay en la tienda. Sin precios en la web: pregunta por WhatsApp o pásate y te lo enseñamos.',
  };
}

export const PAGINAS = [
  {
    slug: 'aviso-legal',
    titulo: 'Aviso legal',
    contenido: `## 1. Datos identificativos

Titular del sitio web: Confecciones Ana Mari (nombre comercial), con establecimiento abierto al público en Calle Almagro, 15, 28904 Getafe (Madrid), España.

- Teléfono: 615 644 940
- Correo electrónico: hola@confeccionesanamari.es
- Dominio: confemerana.es (y www.confemerana.es)

Los datos de identificación fiscal del titular están disponibles en el establecimiento o se facilitarán bajo petición razonable al correo indicado.

## 2. Objeto del sitio

Este sitio es un escaparate digital de catálogo, información de servicios (mercería y arreglos de ropa) y canal de contacto. No es una tienda en línea: no se formalizan compras, pedidos de pago ni contratos de compraventa a través de estas páginas. La disponibilidad de productos y precios se confirman en tienda o por WhatsApp/teléfono.

## 3. Condiciones de uso

El acceso y uso del sitio implica la aceptación de este aviso. El usuario se compromete a no emplear el sitio de forma ilícita, a no introducir contenidos ofensivos o maliciosos y a no intentar acceder a zonas restringidas (área de administración) sin autorización.

## 4. Propiedad intelectual e industrial

Los textos, fotografías, logotipos, diseño y demás contenidos del sitio pertenecen a Confecciones Ana Mari o se utilizan con autorización de sus titulares. Queda prohibida su reproducción, distribución o transformación sin permiso escrito, salvo usos permitidos por la ley (por ejemplo, el derecho de cita).

## 5. Exactitud de la información

Nos esforzamos en mantener la información actualizada. El catálogo publicado es una muestra orientativa y puede no coincidir con el stock del mostrador. Las imágenes pueden ser ilustrativas. Si detectas un error, puedes avisarnos por correo o WhatsApp.

## 6. Enlaces y servicios de terceros

El sitio puede incluir enlaces o integraciones a servicios de terceros (por ejemplo, mapas o WhatsApp). Esos servicios tienen sus propias condiciones y políticas. Confecciones Ana Mari no controla ni responde del contenido o del tratamiento de datos que realicen esos terceros fuera de lo indicado en nuestra política de privacidad.

## 7. Limitación de responsabilidad

No garantizamos la disponibilidad ininterrumpida del sitio. Dentro de los límites legales, no respondemos de daños derivados del uso indebido del sitio, de fallos técnicos ajenos a nuestro control o de la información publicada por terceros enlazados.

## 8. Legislación y fuero

Este aviso se rige por la legislación española. Para controversias con consumidores, se estará a lo que disponga la normativa de consumidores y usuarios. En los demás casos, con renuncia a cualquier otro fuero que pudiera corresponder, las partes se someten a los juzgados y tribunales de Madrid capital, salvo norma imperativa en contrario.`,
  },
  {
    slug: 'privacidad',
    titulo: 'Política de privacidad',
    contenido: `## 1. Responsable del tratamiento

Responsable: Confecciones Ana Mari, Calle Almagro, 15, 28904 Getafe (Madrid). Correo de contacto en materia de privacidad: hola@confeccionesanamari.es. Teléfono: 615 644 940.

## 2. Alcance

Esta política describe cómo tratamos los datos personales de quienes visitan confemerana.es, usan el formulario de contacto, nos escriben por WhatsApp o teléfono, o (solo personal autorizado) acceden al área de administración del sitio.

## 3. Qué datos tratamos y de dónde salen

- Formulario de contacto: nombre, correo electrónico y el contenido del mensaje. También se registra la dirección IP de forma técnica (limitar abusos).
- WhatsApp o teléfono: el número y el contenido de la conversación que tú inicies.
- Área de administración (solo personal de la tienda): correo electrónico, nombre y datos de sesión necesarios para el acceso.
- Datos de navegación técnicos: los que generan el servidor, la red de entrega (Cloudflare) o el navegador para mostrar el sitio con seguridad (por ejemplo, logs de acceso). No usamos perfiles publicitarios.

No pedimos datos especiales (salud, ideología, etc.) ni datos de menores de forma deliberada. Si eres menor de 14 años, no uses el formulario sin consentimiento de tus padres o tutores.

## 4. Finalidades y base jurídica

- Atender consultas, presupuestos de arreglos o información sobre productos (interés legítimo y, cuando envías el formulario, tu consentimiento; si la consulta es previa a un servicio, también medidas precontractuales).
- Gestionar la relación comercial o de servicio cuando pasas por la tienda o encargas un arreglo (ejecución de medidas precontractuales o del contrato).
- Mantener la seguridad del sitio y prevenir spam o usos abusivos del formulario (interés legítimo).
- Permitir el acceso del personal autorizado al panel de gestión (relación laboral o contractual / interés legítimo).

No elaboramos perfiles comerciales ni tomamos decisiones automatizadas con efectos jurídicos sobre ti.

## 5. Conservación

Los mensajes del formulario se conservan el tiempo necesario para responderte y, en su caso, el exigido por obligaciones legales o posibles reclamaciones. Las conversaciones de WhatsApp dependen de tu dispositivo y de la política de Meta. Los registros técnicos de seguridad se guardan de forma limitada. Las sesiones del área privada caducan (del orden de días) y puedes cerrarlas.

Puedes pedir la supresión de tus datos de contacto cuando ya no sean necesarios, escribiendo a hola@confeccionesanamari.es.

## 6. Destinatarios y encargados

No vendemos tus datos. Pueden acceder a ellos, solo en la medida necesaria:

- Proveedores técnicos de alojamiento, correo electrónico y seguridad/CDN (por ejemplo, servicios de hosting y Cloudflare para publicar el sitio).
- Meta Platforms, si nos escribes por WhatsApp (WhatsApp Business / aplicación): aplica su propia política de privacidad.
- Google, si cargas el mapa embebido de Google Maps en las páginas donde se muestra (pueden tratarse datos técnicos de conexión). Detalle en la política de cookies.
- Autoridades públicas, cuando exista obligación legal.

No están previstas transferencias internacionales de tus datos de contacto por nuestra parte más allá de las que realicen esos proveedores con garantías adecuadas (por ejemplo, cláusulas contractuales tipo o decisiones de adecuación de la UE, según el caso).

## 7. Derechos

Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad (cuando proceda) escribiendo a hola@confeccionesanamari.es, indicando «Protección de datos» y acreditando tu identidad si hace falta. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).

## 8. Seguridad

Aplicamos medidas técnicas y organizativas razonables (conexión HTTPS, control de acceso al panel, limitación de envíos del formulario). Ningún sistema es 100 % seguro; si detectas un incidente que afecte a tus datos, te lo comunicaremos cuando la ley lo exija.

## 9. Actualizaciones

Podemos actualizar esta política para reflejar cambios del sitio o de la normativa. La fecha de actualización aparece en la cabecera de esta página. El uso continuado del sitio tras un cambio relevante implica el conocimiento de la versión vigente.`,
  },
  {
    slug: 'cookies',
    titulo: 'Política de cookies',
    contenido: `## 1. Qué son las cookies y tecnologías similares

Las cookies son pequeños ficheros que el navegador guarda al visitar un sitio. También pueden usarse almacenes locales del navegador (localStorage) o recursos de terceros (fuentes, mapas) que, sin ser siempre «cookies» propias, implican tratamiento técnico de datos de conexión.

## 2. Quién es el responsable

Confecciones Ana Mari, Calle Almagro, 15, 28904 Getafe (Madrid). Correo: hola@confeccionesanamari.es. Más detalle en la política de privacidad.

## 3. Qué utilizamos en este sitio

### Cookies técnicas propias (necesarias)

| Nombre | Quién | Finalidad | Duración orientativa |
| --- | --- | --- | --- |
| sesion | Confecciones Ana Mari (servidor del sitio) | Mantener la sesión iniciada en el área de administración. HttpOnly; no la usa el catálogo público. | Hasta 7 días o hasta cerrar sesión |

Sin esta cookie, el personal no puede entrar al panel de gestión. No requiere consentimiento por ser estrictamente necesaria para un servicio solicitado por el usuario autorizado (art. 22.2 LSSI y directrices sobre cookies técnicas).

### Almacenamiento local del navegador (no es cookie HTTP)

| Clave | Finalidad |
| --- | --- |
| anamari-tema | Recordar si prefieres el modo claro u oscuro de la interfaz. |
| anamari-colores-recientes | Solo en el panel de administración: recordar colores usados al editar productos. |

Puedes borrar estos datos desde la configuración del navegador (datos del sitio / almacenamiento local).

### Cookies o tecnologías de terceros

- Google Fonts: al cargar el tipografiado desde servidores de Google, Google puede recibir tu IP y datos técnicos de la petición.
- Google Maps (iframe): en páginas como Inicio o Contacto, si se muestra el mapa embebido, Google puede instalar cookies o tecnologías propias y tratar datos de uso del mapa según su política.
- Cloudflare: la publicación del sitio puede pasar por la red de Cloudflare (seguridad y rendimiento). Puede generar cookies o identificadores técnicos propios de esa red.
- WhatsApp: al pulsar un enlace a WhatsApp se abre el servicio de Meta; no instalamos nosotros su cookie, pero Meta tratará los datos según sus condiciones.

No instalamos cookies propias de analítica, publicidad o redes sociales de seguimiento.

## 4. Base jurídica

Las cookies y medios estrictamente técnicos necesarios se basan en el interés legítimo / prestación del servicio solicitado. Los recursos de terceros (fuentes, mapa) forman parte del funcionamiento del sitio; si no deseas que carguen, puedes bloquear dominios de terceros o el contenido embebido en tu navegador, o no visitar las secciones con mapa.

## 5. Cómo gestionarlas

Puedes borrar o bloquear cookies y datos del sitio desde la configuración de tu navegador (Chrome, Firefox, Safari, Edge, Brave, etc.). Si bloqueas la cookie «sesion», el área de administración dejará de funcionar. Herramientas del navegador o extensiones también permiten limitar rastreadores de terceros.

Enlaces orientativos de ayuda de navegadores habituales están en las páginas de soporte de cada fabricante (busca «borrar cookies» o «bloquear cookies»).

## 6. Actualizaciones

Si en el futuro añadimos analítica, publicidad u otras cookies no esenciales, lo reflejaremos aquí y, cuando la ley lo exija, pediremos tu consentimiento antes de instalarlas.`,
  },
];
