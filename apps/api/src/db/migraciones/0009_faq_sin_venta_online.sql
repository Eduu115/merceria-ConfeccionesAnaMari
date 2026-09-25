-- Quita FAQs de escaparate e-commerce (envíos, devoluciones, pago online, etc.)
-- y la de «solo lencería», que no encaja con mercería/arreglos.
DELETE FROM preguntas
WHERE pregunta IN (
  '¿Qué tipo de productos venden?',
  '¿Cómo sé cuál es mi talla?',
  '¿Hacen envíos a todo el país?',
  '¿Puedo cambiar o devolver un producto?',
  '¿Cuáles son los métodos de pago aceptados?',
  '¿Es seguro comprar en su sitio?',
  '¿Puedo hacer un pedido personalizado?'
);

UPDATE preguntas
SET orden = 1
WHERE pregunta = '¿Cómo puedo contactar al equipo de atención al cliente?';
