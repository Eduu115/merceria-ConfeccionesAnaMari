UPDATE paginas
SET contenido = replace(contenido, 'hola@confeccionesanamari.es', 'anamariconfecciones@gmail.com'),
    actualizado_en = now()
WHERE contenido LIKE '%hola@confeccionesanamari.es%';
