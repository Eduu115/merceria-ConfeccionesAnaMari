-- Textos legales alineados con el sitio real (catálogo, contacto, sesión admin, mapa, Cloudflare).

UPDATE paginas
SET titulo = 'Aviso legal',
    contenido = '## 1. Datos identificativos

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

Este aviso se rige por la legislación española. Para controversias con consumidores, se estará a lo que disponga la normativa de consumidores y usuarios. En los demás casos, con renuncia a cualquier otro fuero que pudiera corresponder, las partes se someten a los juzgados y tribunales de Madrid capital, salvo norma imperativa en contrario.',
    actualizado_en = now()
WHERE slug = 'aviso-legal';

UPDATE paginas
SET titulo = 'Política de privacidad',
    contenido = '## 1. Responsable del tratamiento

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

Podemos actualizar esta política para reflejar cambios del sitio o de la normativa. La fecha de actualización aparece en la cabecera de esta página. El uso continuado del sitio tras un cambio relevante implica el conocimiento de la versión vigente.',
    actualizado_en = now()
WHERE slug = 'privacidad';

UPDATE paginas
SET titulo = 'Política de cookies',
    contenido = '## 1. Qué son las cookies y tecnologías similares

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

Si en el futuro añadimos analítica, publicidad u otras cookies no esenciales, lo reflejaremos aquí y, cuando la ley lo exija, pediremos tu consentimiento antes de instalarlas.',
    actualizado_en = now()
WHERE slug = 'cookies';
