TRUNCATE preguntas RESTART IDENTITY;

INSERT INTO preguntas (grupo, pregunta, respuesta, orden) VALUES
(
  'tienda',
  '¿Qué tipo de productos venden?',
  'En Confecciones Ana Mari nos especializamos en lencería femenina, incluyendo brasieres, panties, conjuntos, bodys, pijamas sensuales y más. Trabajamos con materiales de calidad que garantizan comodidad y estilo.',
  1
),
(
  'tienda',
  '¿Cómo puedo contactar al equipo de atención al cliente?',
  'Puedes escribirnos al correo anamariconfecciones@gmail.com o al teléfono 615 644 940. Horario: lunes a viernes de 10:15 a 14:00 y de 17:30 a 20:00; sábados de 10:15 a 14:00.',
  2
),
(
  'comprar',
  '¿Cómo sé cuál es mi talla?',
  'Contamos con una guía de tallas en cada producto para ayudarte a elegir la talla adecuada. Si aún tienes dudas, puedes escribirnos y con gusto te orientamos.',
  1
),
(
  'comprar',
  '¿Hacen envíos a todo el país?',
  'Realizamos envíos únicamente a la Península. Los tiempos de entrega varían según tu ubicación, pero normalmente tardan entre 2 y 5 días hábiles.',
  2
),
(
  'comprar',
  '¿Puedo cambiar o devolver un producto?',
  'Sí, aceptamos cambios y devoluciones dentro de los 7 días posteriores a la recepción, siempre que el producto esté en su empaque original, sin uso y con etiquetas. Consulta nuestra política de cambios para más detalles.',
  3
),
(
  'comprar',
  '¿Cuáles son los métodos de pago aceptados?',
  'Aceptamos pagos con tarjetas de crédito, débito, transferencias bancarias y pagos a través de plataformas como Stripe o PayPal.',
  4
),
(
  'comprar',
  '¿Es seguro comprar en su sitio?',
  'Sí. Utilizamos conexiones cifradas (SSL) y plataformas de pago seguras para proteger tus datos personales y bancarios.',
  5
),
(
  'comprar',
  '¿Puedo hacer un pedido personalizado?',
  'Sí, dependiendo del producto. Escríbenos por WhatsApp o correo electrónico y revisaremos la disponibilidad y los tiempos de entrega.',
  6
);
