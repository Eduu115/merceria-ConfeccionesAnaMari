import type { GrupoPregunta } from '@anamari/compartido';

export const CATEGORIAS = [
  {
    slug: 'ropa-de-mujer',
    nombre: 'Ropa de mujer',
    tipo: 'ropa' as const,
    descripcion: 'Batas, camisones, vestidos y prendas cómodas para el día a día.',
    orden: 1,
  },
  {
    slug: 'ropa-de-hombre',
    nombre: 'Ropa de hombre',
    tipo: 'ropa' as const,
    descripcion: 'Camisas, pantalones y prendas cómodas para el día a día.',
    orden: 2,
  },
  {
    slug: 'infantil-y-bebe',
    nombre: 'Infantil y bebé',
    tipo: 'ropa' as const,
    descripcion: 'Ropa para los más pequeños, y arreglos si hace falta.',
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
    categoria: 'ropa-de-mujer',
    descripcion:
      'Bata de casa de algodón, abotonada, con bolsillos laterales. Cae suave y cubre bien. Pregunta talla y color en tienda o por WhatsApp.',
    composicion: '100 % algodón',
    colores: 'Azul, granate, crudo',
    destacado: true,
  },
  {
    slug: 'camison-manga-corta',
    nombre: 'Camisón de manga corta',
    categoria: 'ropa-de-mujer',
    descripcion: 'Camisón fresco de manga corta, corte holgado. Ideal para dormir con calor.',
    composicion: '100 % algodón',
    colores: 'Rosa, azul, blanco',
    destacado: true,
  },
  {
    slug: 'pijama-algodon-dos-piezas',
    nombre: 'Pijama de algodón dos piezas',
    categoria: 'ropa-de-mujer',
    descripcion: 'Pijama de chaqueta y pantalón, tejido de algodón que aguanta lavados.',
    composicion: '100 % algodón',
    colores: 'Rayas azul, liso crudo',
    destacado: true,
  },
  {
    slug: 'falda-plisada-tejido-fino',
    nombre: 'Falda plisada de tejido fino',
    categoria: 'ropa-de-mujer',
    descripcion: 'Falda plisada ligera, cintura elástica. Cae por debajo de la rodilla.',
    composicion: 'Poliéster',
    colores: 'Negro, marino',
  },
  {
    slug: 'vestido-camisero-estampado',
    nombre: 'Vestido camisero estampado de media manga',
    categoria: 'ropa-de-mujer',
    descripcion: 'Vestido camisero de media manga, botones delanteros y estampado suave.',
    composicion: 'Algodón y viscosa',
    colores: 'Estampado floral',
    destacado: true,
    sinS: true,
  },
  {
    slug: 'rebeca-punto-botones',
    nombre: 'Rebeca de punto con botones',
    categoria: 'ropa-de-mujer',
    descripcion: 'Rebeca de punto medio, con botones. Para casa o encima de un camisón.',
    composicion: 'Acrílico',
    colores: 'Beige, gris, azul',
    destacado: true,
  },
  {
    slug: 'pantalon-cintura-elastica',
    nombre: 'Pantalón de cintura elástica',
    categoria: 'ropa-de-mujer',
    descripcion: 'Pantalón cómodo de cintura elástica, sin pretina dura.',
    composicion: 'Algodón con elastano',
    colores: 'Negro, marino, beige',
  },
  {
    slug: 'blusa-manga-tres-cuartos',
    nombre: 'Blusa de manga tres cuartos',
    categoria: 'ropa-de-mujer',
    descripcion: 'Blusa lisa de manga tres cuartos, cuello redondo. Corte amplio.',
    composicion: 'Viscosa',
    colores: 'Blanco, azul, granate',
  },
  {
    slug: 'bata-cruzada-rizo',
    nombre: 'Bata cruzada de rizo',
    categoria: 'ropa-de-mujer',
    descripcion: 'Bata de rizo cruzada, con cinturón. Absorbe y abriga al salir de la ducha.',
    composicion: '100 % algodón rizo',
    colores: 'Blanco, rosa, azul',
  },
  {
    slug: 'camison-largo-invierno',
    nombre: 'Camisón largo de invierno',
    categoria: 'ropa-de-mujer',
    descripcion: 'Camisón largo de tejido de invierno, manga larga.',
    composicion: 'Algodón y poliéster',
    colores: 'Burdeos, azul oscuro',
    agotado: true,
  },
  {
    slug: 'pijama-polar',
    nombre: 'Pijama de polar',
    categoria: 'ropa-de-mujer',
    descripcion: 'Pijama de polar de dos piezas para los meses fríos.',
    composicion: 'Poliéster polar',
    colores: 'Gris, rosa empolvado',
  },
  {
    slug: 'vestido-punto',
    nombre: 'Vestido de punto',
    categoria: 'ropa-de-mujer',
    descripcion: 'Vestido de punto de corte recto, manga larga.',
    composicion: 'Acrílico y lana',
    colores: 'Negro, camel',
    sin3xl: true,
  },
  {
    slug: 'camiseta-algodon-mujer',
    nombre: 'Camiseta de algodón de manga corta',
    categoria: 'ropa-de-mujer',
    descripcion: 'Camiseta básica de algodón, cuello redondo.',
    composicion: '100 % algodón',
    colores: 'Blanco, negro, crudo',
    destacado: true,
  },
  {
    slug: 'leggings-talle-alto',
    nombre: 'Leggings de talle alto',
    categoria: 'ropa-de-mujer',
    descripcion: 'Leggings opacos de talle alto, cintura ancha.',
    composicion: 'Algodón con elastano',
    colores: 'Negro',
  },
  {
    slug: 'calzon-corto-hombre',
    nombre: 'Calzón corto',
    categoria: 'ropa-de-hombre',
    descripcion: 'Calzoncillo corto de algodón, tejido de punto. Talla amplia; pregunta en tienda.',
    composicion: '100 % algodón',
    colores: 'Blanco, crudo',
    destacado: true,
  },
  {
    slug: 'calzon-largo-hombre',
    nombre: 'Calzón largo',
    categoria: 'ropa-de-hombre',
    descripcion: 'Calzoncillo largo de algodón, ajustado. Para el frío, tejido de invierno.',
    composicion: '100 % algodón',
    colores: 'Blanco, crudo',
  },
  {
    slug: 'body-bebe',
    nombre: 'Body de bebé',
    categoria: 'infantil-y-bebe',
    descripcion: 'Body de algodón para bebé, broches en la entrepierna.',
    composicion: '100 % algodón',
    colores: 'Blanco, azul, rosa',
  },
  {
    slug: 'pelele-algodon',
    nombre: 'Pelele de algodón',
    categoria: 'infantil-y-bebe',
    descripcion: 'Pelele de una pieza, tejido suave.',
    composicion: '100 % algodón',
    colores: 'Celeste, rosa, crudo',
  },
  {
    slug: 'pijama-infantil',
    nombre: 'Pijama infantil de dos piezas',
    categoria: 'infantil-y-bebe',
    descripcion: 'Pijama de niño o niña, dos piezas, algodón.',
    composicion: '100 % algodón',
    colores: 'Estampados varios',
    destacado: true,
  },
  {
    slug: 'ranita-bebe',
    nombre: 'Ranita de bebé',
    categoria: 'infantil-y-bebe',
    descripcion: 'Ranita corta de algodón, con tirantes.',
    composicion: '100 % algodón',
    colores: 'Blanco, rayas',
  },
  {
    slug: 'camiseta-nina',
    nombre: 'Camiseta de niña',
    categoria: 'infantil-y-bebe',
    descripcion: 'Camiseta de manga corta para niña.',
    composicion: '100 % algodón',
    colores: 'Blanco, rosa, estampado',
  },
  {
    slug: 'pantalon-chandal-infantil',
    nombre: 'Pantalón de chándal infantil',
    categoria: 'infantil-y-bebe',
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
      pregunta: '¿Dónde estáis y cuál es el horario?',
      respuesta:
        'Calle Almagro 15, Getafe. L–V 10:15–14:00 y 17:30–20:00; sábados de 10:15 a 14:00. Domingo cerrado.',
      orden: 1,
    },
    {
      grupo: 'tienda',
      pregunta: '¿Qué tipo de ropa vendéis?',
      respuesta:
        'Ropa cómoda de mujer, interior e infantil: batas, camisones, pijamas y prendas de diario en todas las tallas.',
      orden: 2,
    },
    {
      grupo: 'tienda',
      pregunta: '¿Hasta qué talla trabajáis?',
      respuesta:
        'Trabajamos de la S a la 3XL. Si no ves tu talla en la web, pregúntanos: en tienda hay más.',
      orden: 3,
    },
    {
      grupo: 'tienda',
      pregunta: '¿Vendéis también material de costura?',
      respuesta: 'Sí: hilos, lanas, cremalleras, cintas, botones, agujas y el resto de mercería.',
      orden: 4,
    },
    {
      grupo: 'arreglos',
      pregunta: '¿Hace falta pedir cita?',
      respuesta: 'No hace falta. Trae la prenda en horario de tienda y te atendemos.',
      orden: 1,
    },
    {
      grupo: 'arreglos',
      pregunta: '¿Cuánto tarda un arreglo?',
      respuesta: 'Entre 24 y 72 horas según la prenda y la carga de trabajo.',
      orden: 2,
    },
    {
      grupo: 'arreglos',
      pregunta: '¿Puedo saber el precio antes de dejar la prenda?',
      respuesta: 'Sí: el diagnóstico es gratuito y te damos el presupuesto en el momento.',
      orden: 3,
    },
    {
      grupo: 'arreglos',
      pregunta: '¿Arregláis prendas compradas en otro sitio?',
      respuesta: 'Sí. Da igual dónde la compraras: si se puede arreglar, lo hacemos.',
      orden: 4,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Puedo comprar por la web?',
      respuesta:
        'No: la web es un escaparate. Pregúntanos por WhatsApp o pásate por la tienda.',
      orden: 1,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Cómo sé si tenéis mi talla disponible?',
      respuesta:
        'En la ficha verás las tallas que hay. Las tachadas están agotadas. Si dudas, escríbenos o ven a la tienda.',
      orden: 2,
    },
    {
      grupo: 'comprar',
      pregunta: '¿Hacéis encargos o pedidos especiales?',
      respuesta: 'Sí, para algunas prendas. Pregúntanos por WhatsApp o en el mostrador.',
      orden: 3,
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

Este sitio web pertenece a Confecciones Ana Mari, con domicilio en Calle Almagro, 15, 28904 Getafe (Madrid). Correo: hola@confeccionesanamari.es. Teléfono: 615 644 940.

El texto de esta página está pendiente de revisión jurídica. Sustitúyelo por el que redacte quien lleve la parte legal del negocio.

## 2. Objeto

El sitio es un escaparate de catálogo y un canal de contacto. No es una tienda en línea: no se formalizan compras ni pagos a través de estas páginas.

## 3. Propiedad intelectual

Los textos, fotografías y marcas que aparecen en el sitio pertenecen a Confecciones Ana Mari o se usan con autorización. No está permitida su reproducción sin permiso.

## 4. Responsabilidad

Nos esforzamos en mantener la información al día. El catálogo es una muestra y puede no coincidir con el stock del mostrador. Para disponibilidad, pregunta en tienda o por WhatsApp.

## 5. Enlaces

Los enlaces a mapas u otras webs de terceros se ofrecen para facilitar la visita. No nos hacemos cargo de sus contenidos.

## 6. Legislación

Para cualquier controversia se aplica la legislación española y los juzgados de Madrid, salvo que una norma de protección de consumidores disponga otra cosa.`,
  },
  {
    slug: 'privacidad',
    titulo: 'Política de privacidad',
    contenido: `## 1. Responsable

Confecciones Ana Mari, Calle Almagro, 15, 28904 Getafe (Madrid). Correo: hola@confeccionesanamari.es.

Este texto es un borrador de trabajo, pendiente de revisión jurídica.

## 2. Qué datos recogemos

A través del formulario de contacto: nombre, correo electrónico y el mensaje que nos escribas. También podemos tratar el número de teléfono si nos escribes por WhatsApp.

## 3. Para qué los usamos

Solo para responderte y, si procede, atender un arreglo o una consulta sobre una prenda. No vendemos datos ni hacemos perfiles comerciales.

## 4. Conservación

Los mensajes se guardan el tiempo necesario para gestionar la consulta y las obligaciones legales. Puedes pedir que los borremos escribiendo al correo del responsable.

## 5. Destinatarios

No cedemos tus datos a terceros, salvo obligación legal o proveedores técnicos imprescindibles (alojamiento, correo). WhatsApp es un servicio de Meta; si nos escribes por ahí, rige su propia política.

## 6. Derechos

Puedes solicitar acceso, rectificación, supresión, limitación y oposición dirigiéndote al responsable. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).

## 7. Base jurídica

El tratamiento se basa en tu consentimiento al enviar el formulario o el mensaje, y en la ejecución de medidas precontractuales si preguntas por un servicio.`,
  },
  {
    slug: 'cookies',
    titulo: 'Política de cookies',
    contenido: `## 1. Qué son las cookies

Las cookies son pequeños ficheros que el navegador guarda para que un sitio recuerde datos técnicos. Este texto es un borrador, pendiente de revisión jurídica.

## 2. Qué usamos aquí

De entrada, el sitio no instala cookies de analítica ni de publicidad. Puede usarse una cookie técnica de sesión si alguien entra en el área privada de gestión.

## 3. Mapa

El mapa de «Dónde estamos» no se carga hasta que pulsas «Ver el mapa». Al hacerlo, el proveedor del mapa (Google) puede instalar cookies propias. Si no lo pulsas, no se cargan.

## 4. Cómo desactivarlas

Puedes borrar o bloquear cookies desde la configuración de tu navegador. Si bloqueas las técnicas, puede dejar de funcionar el acceso al área de gestión.

## 5. Actualización

Si en el futuro se añade analítica sin cookies (por ejemplo Plausible) o un servicio de terceros, se declarará en esta página.`,
  },
];
