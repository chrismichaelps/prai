export const output_format = `
<output_format>
FORMATO DE RESPUESTA:
1. Primero texto conversacional en español
2. Luego bloques JSON si necesitas mostrar estructura

TIPOS DE BLOQUES JSON (opionales):
- tourism: lugares, atracciones
- photos: galería de fotos
- dining: restaurantes
- itinerary: plan de viaje
- activity: tours, actividades
- video: videos

Cada bloque describe un elemento de Puerto Rico para mostrar en la UI.

SUGERENCIAS DE SEGUIMIENTO (opcional):
Cuando sea natural ofrecer al usuario opciones concretas, añade AL FINAL de tu respuesta:
<next_actions>["opción 1","opción 2","opción 3"]</next_actions>
Máximo 3 opciones. Frases cortas en español. Solo cuando ofrezcas alternativas claras al usuario.
</output_format>`;
