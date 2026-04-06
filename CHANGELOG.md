# Changelog

## 2026-04-06

Mejoramos significativamente la estabilidad del servicio. Reestructuramos la gestión de uso y costos de la API para garantizar disponibilidad continua, incluso en horas de alta demanda.

Los usuarios del plan Pro ahora pueden consultar su consumo diario desde la página de Uso, con total visibilidad sobre su presupuesto. También optimizamos la presentación de fuentes: en lugar de mostrar múltiples enlaces individuales, ahora se agrupan en un solo elemento que abre el panel completo al interactuar con él.

Un ajuste importante: la inteligencia artificial ahora conoce la fecha actual al realizar búsquedas, lo que elimina respuestas con fechas incorrectas cuando se consulta por eventos del día.

A nivel interno, implementamos protecciones automáticas para que las conversaciones extensas se compacten en el momento adecuado y el servicio pueda escalar sin interrupciones.

## 2026-04-05

Incorporamos la búsqueda web en tiempo real. La inteligencia artificial ahora puede consultar internet cuando se trata de eventos actuales, precios, horarios o cualquier información que requiera datos actualizados. Existe un nuevo botón en el chat para activar esta función según sea necesario.

También mejoramos la experiencia visual durante el procesamiento: en lugar de una animación genérica, ahora se muestran mensajes descriptivos en tiempo real que indican qué operación se está ejecutando.

Las conversaciones ahora generan títulos automáticos después del primer intercambio, y realizamos correcciones internas para optimizar el rendimiento general.

## 2026-04-03

La actualización más significativa del motor de inteligencia artificial hasta la fecha. Rediseñamos el procesamiento de solicitudes con un nuevo flujo de análisis previo que se ejecuta antes de cada respuesta. El sistema ahora comprende el contexto de búsqueda: puede extraer filtros como fecha, ubicación y presupuesto de tus mensajes y aplicarlos automáticamente. También reformula consultas ambiguas utilizando el historial de conversación.

Agregamos un sistema de puntuación de relevancia que evalúa los resultados y descarta información irrelevante. Después de cada respuesta, la IA genera sugerencias de seguimiento con acciones naturales para continuar explorando.

Las conversaciones extensas ahora se compactan automáticamente en resúmenes concisos para que la IA nunca pierda el contexto. Las preferencias y datos compartidos durante las conversaciones se recuerdan entre sesiones: menciona una alergia, restricción alimentaria, presupuesto o compañeros de viaje una vez, y el sistema lo recordará la próxima vez.

También incorporamos una herramienta para que la IA guarde explícitamente información importante que compartas, y localizamos todas las descripciones de herramientas al español para un comportamiento más consistente.

## 2026-04-02

Estabilizamos el ciclo de procesamiento con lógica de reintentos para límites de tasa de la API. Migramos el manejo de excepciones y la visualización de sugerencias al estado de Redux para mayor consistencia. Ampliamos los patrones de extracción de memoria para capturar más casos como "soy alérgico a los mariscos". Apuntamos el cliente de OpenRouter a la puerta de enlace interna segura.

## 2026-04-01

Un día fundacional. Implementamos la capacidad de ejecutar herramientas para que la IA pueda buscar playas, restaurantes, hoteles, eventos, clima y transporte en Puerto Rico. Agregamos servicios de estimación de tokens y seguimiento de costos. Construimos el sistema de compactación de contexto para conversaciones largas. Sentamos las bases para la memoria de sesión y la extracción de habilidades. Incorporamos un sistema de coordinación y alertas proactivas. Conectamos el entorno de ejecución Effect con inyección de dependencias en todos los servicios. Iniciamos la persistencia de memoria en Supabase con directrices mejoradas.

## 2026-03-31

Agregamos sugerencias de seguimiento: la IA ahora genera preguntas que puedes seleccionar para continuar la conversación. Esto incluye la lógica principal, el hook de React y la integración visual.

## 2026-03-30

Incorporamos retroalimentación háptica para interacciones móviles, de modo que tocar botones como Enviar, el micrófono, sugerencias y elementos de la barra lateral se siente más receptivo. También estandarizamos los comentarios del código en formato JSDoc y consolidamos valores dispersos en un archivo central para mantener el código limpio y mantenible.

## 2026-03-28

Un día importante para la estabilidad y la experiencia de usuario. Resolvimos llamadas duplicadas de la API en desarrollo, agregamos limitación de tasa apropiada y creamos una página de estado donde puedes verificar el funcionamiento de nuestros servicios principales. También realizamos mejoras significativas en accesibilidad, fortalecimos la seguridad con mejor protección contra ataques XSS y optimizamos el manejo de sesiones para funciones en tiempo real.

En cuanto a funcionalidades, introdujimos el seguimiento de uso con planes Gratuito y Pro, incluyendo límites diarios y mensuales con barras de progreso. Además, lanzamos el sistema completo de Personalización. Ahora puedes ajustar cómo se comunica la IA contigo: eligiendo estilos como Profesional, Amigable, Peculiar o Cínico, y ajustando calidez, entusiasmo, uso de emojis y más. Hay una página dedicada de Personalización para que la IA se sienta verdaderamente tuya.

## 2026-03-27

Nos enfocamos en mejorar la precisión de la IA, especialmente en temas de turismo en Puerto Rico. También resolvimos algunos problemas menores de usabilidad que aparecían durante la transmisión de mensajes.

## 2026-03-26

Resolvimos un problema frustrante que causaba la pérdida de mensajes al archivar o restaurar conversaciones. También agregamos mejor monitoreo interno y rastreo para mantener todo funcionando sin problemas.

## 2026-03-25

Lanzamos el sistema completo de Reportes de Problemas, un sistema de notificaciones con indicadores de no leídos, búsqueda de usuarios y herramientas de administración. Reportar errores y sugerir funciones ahora es más sencillo y mejor organizado.

## 2026-03-24

Agregamos una sección de Notas de Versión adecuada y resolvimos varios problemas con el inicio de sesión de Google para que sea más confiable en todos los flujos.

## 2026-03-23

Una limpieza importante detrás de escena. Mejoramos la validación, el manejo de errores y la arquitectura general en toda la aplicación. Muchos comportamientos de la API son ahora más limpios y consistentes, y agregamos mejoras importantes en seguridad y confiabilidad.

## 2026-03-22

Mejoramos significativamente los mensajes de error con notificaciones más amigables. Agregamos un sitemap dinámico y robots.txt para mejor posicionamiento en buscadores, resolvimos múltiples vulnerabilidades de seguridad y eliminamos código y dependencias antiguas sin uso.

## 2026-03-21

Dos funcionalidades que nos entusiasman mucho. Ahora puedes editar mensajes anteriores en una conversación y hacer que la IA continúe desde la versión editada, estilo viaje en el tiempo. También agregamos un botón de detener funcional durante las respuestas en transmisión.

También introdujimos el Panel de Fuentes, que muestra referencias y enlaces en tiempo real mientras la IA responde, facilitando la verificación de información.

## 2026-03-20

Renovamos la apariencia de la aplicación con un fondo negro profundo y acentos en ámbar cálido. Mejoramos la navegación móvil, el desplazamiento y la fluidez general. También reestructuramos nuestras instrucciones internas para respuestas de mayor calidad, más seguras y consistentes.

## 2026-03-19

Lanzamiento oficial de PR/AI, el primer asistente de turismo de Puerto Rico impulsado por inteligencia artificial. Una experiencia inteligente, bilingüe (español e inglés) y enriquecida con medios, diseñada para ayudar a explorar y disfrutar la isla.
