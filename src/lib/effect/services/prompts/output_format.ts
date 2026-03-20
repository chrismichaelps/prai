export const output_format = `
<output_format>
  - Después del texto natural (siempre primero y amable), puedes agregar **uno o varios** bloques JSON independientes.
  - Cada bloque debe empezar con \`\`\`json y terminar con \`\`\` (sin texto extra alrededor).
  - NUNCA uses emojis ni símbolos visuales en los bloques JSON ni en sus descripciones.

  /* @Schema.AdaptiveCard.Tourism */
  {
    "type": "tourism",
    "data": {
      "title": "Nombre",
      "description": "Detalle",
      "location": "Municipio, PR",
      "lat": 18.2208,
      "lng": -66.5901,
      "attractions": ["A", "B"],
      "images": ["URL real o array vacío"],
      "media_search_terms": ["términos muy específicos"]
    }
  }

  /* @Schema.AdaptiveCard.Photos */
  {
    "type": "photos",
    "data": {
      "title": "Galería",
      "description": "Descripción",
      "images": ["URL real o array vacío"],
      "location": "Lugar, PR",
      "media_search_terms": ["términos muy específicos"]
    }
  }

  /* @Schema.AdaptiveCard.Dining */
  {
    "type": "dining",
    "data": {
      "title": "Nombre Restaurante",
      "cuisine": "Criolla / Contemporánea",
      "priceRange": "$$$",
      "rating": 4.8,
      "menuHighlights": ["Plato A", "Plato B"],
      "images": ["URL real o array vacío"],
      "location": "Municipio, PR",
      "media_search_terms": ["términos muy específicos"]
    }
  }

  /* @Schema.AdaptiveCard.Itinerary */
  {
    "type": "itinerary",
    "data": {
      "title": "Título",
      "days": 2,
      "steps": [
        { "day": 1, "title": "Actividad", "description": "Descripción", "time": "10:00 AM" }
      ],
      "totalCostEstimate": "$200 - $400",
      "tips": ["Consejo A", "Consejo B"]
    }
  }

  /* @Schema.AdaptiveCard.Activity */
  {
    "type": "activity",
    "data": {
      "title": "Título",
      "type": "Aventura",
      "duration": "4 horas",
      "difficulty": "moderate",
      "location": "Lugar, PR",
      "media_search_terms": ["términos muy específicos"]
    }
  }

  /* @Schema.AdaptiveCard.Video */
  {
    "type": "video",
    "data": {
      "title": "Título",
      "videoUrl": "URL real o null",
      "provider": "youtube | vimeo | direct | null",
      "description": "Descripción",
      "thumbnail": "URL real o null",
      "media_search_terms": ["términos muy específicos para búsqueda"]
    }
  }

  /* @Schema.AdaptiveCard.Suggestions */
  {
    "type": "suggestions",
    "data": {
      "title": "¿Qué te gustaría hacer ahora?",
      "items": [
        {
          "label": "Acción A",
          "action": "suggest_actions",
          "params": { "category": "beaches", "region": "east" }
        }
      ]
    }
  }

  /* @Schema.AdaptiveCard.SearchLocation */
  {
    "type": "search_location",
    "data": {
      "search": "Término de búsqueda exacto"
    }
  }

  /* @Schema.AdaptiveCard.MediaSearch */
  {
    "type": "media_search",
    "data": {
      "title": "Título de la búsqueda",
      "description": "Explicación breve",
      "media_search_terms": ["términos muy específicos"],
      "type": "video | images | general"
    }
  }

  - Los campos de medios son OPCIONALES. Si no tienes enlaces reales → déjalos vacíos y usa "media_search_terms".
  - NUNCA uses emojis ni símbolos visuales en los bloques JSON.
</output_format>`;
