TRUNCATE preguntas RESTART IDENTITY;

INSERT INTO preguntas (grupo, pregunta, respuesta, orden) VALUES
(
  'tienda',
  '¿Dónde estáis y cuál es el horario?',
  'Calle Almagro 15, Getafe. L–V 10:15–14:00 y 17:30–20:00; sábados de 10:15 a 14:00. Domingo cerrado.',
  1
),
(
  'tienda',
  '¿Cómo puedo contactar al equipo de atención al cliente?',
  'Puedes escribirnos al correo anamariconfecciones@gmail.com o al teléfono 615 644 940. Horario: lunes a viernes de 10:15 a 14:00 y de 17:30 a 20:00; sábados de 10:15 a 14:00.',
  2
),
(
  'tienda',
  '¿Qué vendéis?',
  'Ropa cómoda de mujer, interior e infantil (batas, camisones, pijamas…), de la S a la 3XL, y mercería: hilos, lanas, cremalleras, cintas, botones y más.',
  3
),
(
  'arreglos',
  '¿Hace falta pedir cita?',
  'No hace falta. Trae la prenda en horario de tienda y te atendemos.',
  1
),
(
  'arreglos',
  '¿Cuánto tarda un arreglo?',
  'Entre 24 y 72 horas según la prenda y la carga de trabajo.',
  2
),
(
  'arreglos',
  '¿Puedo saber el precio antes de dejar la prenda?',
  'Sí: el diagnóstico es gratuito y te damos el presupuesto en el momento.',
  3
),
(
  'comprar',
  '¿Puedo comprar por la web?',
  'No: la web es un escaparate. Pregúntanos por WhatsApp o pásate por la tienda.',
  1
);
