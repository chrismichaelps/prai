/** @Constant.SessionMemory.Patterns */

export type MemoryPattern = {
  pattern: RegExp
  key: string
  valueExtractor?: RegExp
  category?: string
  priority?: number
}

export const MEMORY_PATTERNS: MemoryPattern[] = [
  /** @Constant.SessionMemory.Patterns.Food.Preferences */
  { pattern: /(?:prefiero|me\s+gusta(?:\s+mucho)?|me\s+encanta|favorito|adoro|\bamo\b|quiero\s+probar|me\s+fascina)\s+(?:comer|probar|platos?|cocina|comida|bebidas?|postres?)?\s*(.+?)(?:\.|,|$)/i, key: "food_preference", valueExtractor: /(?:prefiero|me\s+gusta|me\s+encanta)\s+(?:comer|probar)?\s*(.+?)(?:\.|,|$)/i, category: "preferences", priority: 10 },
  { pattern: /(?:mi\s+plato\s+favorito|mi\s+comida\s+favorita|lo\s+que\s+más\s+(?:me\s+gusta|disfruto)\s+comer)\s+(?:es|son)\s+(.+?)(?:\.|,|$)/i, key: "food_preference", valueExtractor: /(?:es|son)\s+(.+?)(?:\.|,|$)/i, category: "preferences", priority: 10 },
  { pattern: /(?:me\s+muero\s+por\s+comer|tengo\s+antojo\s+de|se\s+me\s+antoja)\s+(.+?)(?:\.|,|$)/i, key: "food_craving", valueExtractor: /(?:por\s+comer|antojo\s+de|antoja)\s+(.+?)(?:\.|,|$)/i, category: "preferences", priority: 10 },
  { pattern: /(?:comida\s+(?:casera|tradicional|de\s+abuela|artesanal|callejera|street\s+food|de\s+kiosco))/i, key: "food_style", category: "preferences" },
  { pattern: /(?:sushi|ramen|pho|pad\s+thai|tacos?|ceviche|paella|risotto|pasta|pizza|arepas?|pabellón|bandeja\s+paisa)/i, key: "dish_preference", category: "preferences" },
  { pattern: /(?:comida\s+(?:asiática|japonesa|coreana|tailandesa|india|peruana|mexicana|italiana|francesa|española|árabe|cubana|dominicana|colombiana))/i, key: "cuisine_type", category: "preferences" },
  { pattern: /(?:orgánico|sin\s+pesticidas|farm\s+to\s+table|local\s+y\s+fresco|de\s+temporada|mercado\s+de\s+agricultores)/i, key: "organic_preference", category: "preferences" },
  { pattern: /(?:picante|spicy|habanero|sriracha|me\s+gusta\s+picante|no\s+muy\s+picante|sin\s+picante)/i, key: "spice_preference", category: "preferences" },
  { pattern: /(?:postres?|dulces?|helado|repostería|bizcocho|flan|tembleque|pudín)/i, key: "dessert_preference", category: "preferences" },
  { pattern: /(?:desayuno\s+(?:americano|continental|típico|completo|ligero)|huevos|pancakes|waffles?)/i, key: "breakfast_preference", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Food.Dislikes */
  { pattern: /(?:no\s+me\s+gusta|odio|detesto|evito|no\s+como|me\s+disgusta|no\s+tolero|me\s+cae\s+mal)\s+(?:comer|probar)?\s*(.+?)(?:\.|,|$)/i, key: "food_dislike", valueExtractor: /(?:no\s+me\s+gusta|odio|detesto)\s+(?:comer)?\s*(.+?)(?:\.|,|$)/i, category: "dislikes", priority: 10 },
  { pattern: /(?:no\s+soporto|me\s+da\s+asco|me\s+revuelve\s+el\s+estómago|me\s+cae\s+pesado)\s+(?:la\s+|el\s+|los?\s+|las?\s+)?(.+?)(?:\.|,|$)/i, key: "food_dislike", valueExtractor: /(?:asco|estómago|pesado)\s+(?:la\s+|el\s+|los?\s+|las?\s+)?(.+?)(?:\.|,|$)/i, category: "dislikes", priority: 10 },
  { pattern: /(?:no\s+como\s+(?:carne\s+roja|cerdo|pollo|mariscos?|pescado|vísceras?|hígado|mondongo))/i, key: "food_dislike", category: "dislikes", priority: 10 },
  { pattern: /(?:no\s+me\s+gustan?\s+(?:los?\s+sabores?\s+(?:muy\s+)?(?:dulces?|salados?|amargos?|ácidos?)|sabores?\s+fuertes?))/i, key: "flavor_dislike", category: "dislikes" },
  { pattern: /(?:textura\s+que\s+no\s+me\s+gusta|no\s+me\s+gusta\s+la\s+textura\s+de)\s+(.+?)(?:\.|,|$)/i, key: "texture_dislike", valueExtractor: /(?:textura\s+de)\s+(.+?)(?:\.|,|$)/i, category: "dislikes" },

  /** @Constant.SessionMemory.Patterns.Food.LocalCuisine */
  { pattern: /(?:mofongo|pasteles|arroz\s+con\s+gandules|lechón|empanadillas|alcapurrias|bacalaítos|asopao|mondongo|tripleta|coquito|mallorca|habichuelas|guineos|amarillos|chicharrones|yuca|tembleque|flan|tres\s+leches|sorullitos|tostones|maduros|pinchos|pernil|frituras|pana|sofrito|adobo|sazón|recao|gandinga|rellenos\s+de\s+papa|pionono|carne\s+guisada|jibarito|ajilimójili)/i, key: "pr_food_preference", category: "preferences" },
  { pattern: /(?:piña\s+colada|coquito|medalla|don\s+q|ron\s+del\s+barrilito|palo\s+viejo|ron\s+llave|cafecito|café\s+de\s+puerto\s+rico|café\s+yauco|colao|cortado)/i, key: "pr_drink_preference", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Food.Dining */
  { pattern: /(?:restaurante(?:s)?\s+(?:romántico|familiar|casual|fino|elegante|local|al\s+aire\s+libre|con\s+vista|tranquilo|animado|de\s+lujo))/i, key: "restaurant_vibe", category: "preferences" },
  { pattern: /(?:food\s+truck|chiringuito|kiosco|comedor|lonchera|mesón|bodegón|panadería|bistro|buffet|omakase|pop.?up|mercado\s+gastronómico)/i, key: "dining_format", category: "preferences" },
  { pattern: /(?:con\s+música\s+en\s+vivo|con\s+vista\s+al\s+mar|al\s+aire\s+libre|en\s+la\s+playa|beachfront\s+dining|rooftop\s+restaurant)/i, key: "dining_ambiance", category: "preferences" },
  { pattern: /(?:menú\s+de\s+degustación|chef\s+table|fine\s+dining|restaurante\s+con\s+estrella|michelin)/i, key: "fine_dining", category: "preferences" },
  { pattern: /(?:reserva\s+para\s+cenar|quiero\s+reservar\s+(?:una\s+)?mesa|necesito\s+reservación)/i, key: "restaurant_reservation", category: "itinerary" },
  { pattern: /(?:desayuno|almuerzo|cena|merienda|brunch)\s+(?:temprano|tarde|a\s+las?\s+\d+|ligero|abundante)/i, key: "meal_timing", category: "preferences" },
  { pattern: /(?:prefiero\s+cenar|quiero\s+desayunar|me\s+gusta\s+almorzar)\s+(.+?)(?:\.|,|$)/i, key: "meal_timing", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Drinks */
  { pattern: /(?:tomo|bebo|me\s+gusta(?:n)?\s+(?:los?\s+|las?\s+)?(?:vinos?|cervezas?|cócteles?|jugos?|café|ron|whisky|champán|refrescos?|kombucha|matcha|cold\s+brew|espresso|cappuccino|latte|sangría|mojito|daiquiri|margarita|cerveza\s+artesanal|IPA))/i, key: "drink_preference", category: "preferences" },
  { pattern: /(?:no\s+tomo|no\s+bebo|no\s+consumo|evito\s+el?|no\s+me\s+gusta\s+el?)\s+(?:alcohol|cerveza|vino|licor|café|cafeína|azúcar|refrescos?|bebidas?\s+energéticas?)/i, key: "drink_dislike", category: "dislikes" },
  { pattern: /(?:bebida\s+favorita|trago\s+favorito|prefiero\s+tomar)\s+(.+?)(?:\.|,|$)/i, key: "drink_preference", valueExtractor: /(?:favorita|favorito|tomar)\s+(.+?)(?:\.|,|$)/i, category: "preferences" },
  { pattern: /(?:soy\s+sommelier|conocedor\s+de\s+(?:vinos?|rones?|cervezas?)|entiendo\s+de\s+vinos?)/i, key: "drink_expertise", category: "preferences" },
  { pattern: /(?:ron\s+añejo|ron\s+blanco|ron\s+especial|ron\s+caribeño|ron\s+premium|cata\s+de\s+ron|rum\s+tasting)/i, key: "rum_preference", category: "preferences" },
  { pattern: /(?:café\s+negro|cafecito|colao|cortado|café\s+con\s+leche|cold\s+brew|café\s+de\s+especialidad|single\s+origin)/i, key: "coffee_preference", category: "preferences" },
  { pattern: /(?:sin\s+alcohol|mocktail|virgin|bebida\s+sin\s+alcohol|no\s+tomo\s+alcohol|soy\s+abstemio)/i, key: "no_alcohol", category: "preferences", priority: 10 },
  { pattern: /(?:hora\s+feliz|happy\s+hour|2x1|dos\s+por\s+uno|open\s+bar|barra\s+libre)/i, key: "drink_deals", category: "budget" },
  { pattern: /(?:agua\s+(?:de\s+coco|de\s+pipa|mineral|con\s+gas|sin\s+gas)|jugos?\s+naturales?|batidos?|smoothies?)/i, key: "healthy_drinks", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.DietaryAllergies */
  { pattern: /(?:vegetariano|vegano|pescetariano|keto|paleo|low\s+carb|sin\s+carne|plant\s+based|sin\s+gluten|celíaco|halal|kosher|intolerante|alérgico|alergia)/i, key: "dietary", category: "preferences" },
  { pattern: /(?:soy\s+)?alérgico(?:\s+a)?\s+(?:los?\s+)?(.+?)(?:\.|,|$)/i, key: "allergy", valueExtractor: /alérgico(?:\s+a)?\s+(.+?)(?:\.|,|$)/i, category: "allergies", priority: 10 },
  { pattern: /(?:tengo\s+)?alergia\s+(?:a|al)\s+(.+?)(?:\.|,|$)/i, key: "allergy", valueExtractor: /alergia\s+(?:a|al)\s+(.+?)(?:\.|,|$)/i, category: "allergies", priority: 10 },
  { pattern: /(?:no\s+puedo\s+comer|me\s+causa\s+(?:alergia|problema|reacción))\s+(.+?)(?:\.|,|$)/i, key: "allergy", category: "allergies" },
  { pattern: /(?:intolerante\s+(?:a\s+la?\s+)?(?:lactosa|gluten|fructosa|histamina|sorbitol|FODMAP))/i, key: "intolerance", category: "allergies", priority: 10 },
  { pattern: /(?:sin\s+mariscos?|sin\s+nueces?|sin\s+frutos?\s+secos?|sin\s+lácteos?|sin\s+huevo|sin\s+soya|sin\s+cerdo|sin\s+res|sin\s+ajo|sin\s+cebolla|sin\s+picante)/i, key: "allergy", category: "allergies" },
  { pattern: /(?:dieta\s+(?:mediterránea|dash|baja\s+en\s+sodio|baja\s+en\s+grasa|alta\s+en\s+proteína|sin\s+azúcar|diabética|renal))/i, key: "dietary_plan", category: "preferences" },
  { pattern: /(?:tengo\s+(?:diabetes|hipertensión|colesterol\s+alto|problemas?\s+renales?|úlcera)\s+y\s+no\s+puedo)/i, key: "medical_diet", category: "allergies", priority: 15 },
  { pattern: /(?:ayuno\s+intermitente|intermittent\s+fasting|no\s+como\s+antes\s+de\s+las?\s+\d+|solo\s+como\s+entre\s+las?)/i, key: "fasting", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Budget */
  { pattern: /(?:presupuesto|budget|gastar|hasta|máximo|quiero\s+gastar|gasto\s+máximo|aprox|barato|low\s+cost|lujo|luxury|5\s+estrellas|vip|sin\s+límite|económico)/i, key: "budget", category: "budget" },
  { pattern: /(?:pago\s+con|prefiero\s+pagar|solo\s+tengo|necesito\s+(?:efectivo|tarjeta|cash|dólares|paypal|venmo|atm|cajero))/i, key: "payment_method", category: "budget" },
  { pattern: /(?:\$\s*\d+|\d+\s*dólares|\d+\s*USD|\d+\s*por\s+(?:noche|persona|día|semana))/i, key: "budget_amount", category: "budget", priority: 10 },
  { pattern: /(?:no\s+quiero\s+gastar\s+más\s+de|mi\s+límite\s+es|viajando\s+con\s+poco\s+dinero|mochilero|backpacker)/i, key: "budget_limit", category: "budget", priority: 10 },
  { pattern: /(?:todo\s+incluido|all\s+inclusive|con\s+comida\s+incluida|con\s+desayuno\s+incluido|media\s+pensión|pensión\s+completa)/i, key: "meal_plan", category: "accommodation" },
  { pattern: /(?:puntos?\s+de\s+(?:hotel|viaje|aerolínea)|millas?|programa\s+de\s+lealtad|hilton\s+honors|marriott\s+bonvoy|world\s+of\s+hyatt|IHG)/i, key: "loyalty_program", category: "budget" },
  { pattern: /(?:propina|tip|cuánto\s+se\s+deja\s+de\s+propina|es\s+obligatorio\s+dejar\s+propina)/i, key: "tipping_question", category: "budget" },
  { pattern: /(?:descuento|oferta|promoción|deal|coupon|cupón|precio\s+de\s+temporada\s+baja|precio\s+de\s+grupo)/i, key: "discount_seeking", category: "budget" },
  { pattern: /(?:en\s+efectivo|solo\s+acepta\s+efectivo|¿aceptan\s+tarjeta|sin\s+ATM|necesito\s+cajero)/i, key: "cash_question", category: "budget" },
  { pattern: /(?:precio\s+por\s+(?:persona|adulto|niño|pareja)|precio\s+de\s+entrada|costo\s+de\s+admisión|¿cuánto\s+cuesta)/i, key: "price_inquiry", category: "budget" },

  /** @Constant.SessionMemory.Patterns.TripDates */
  { pattern: /(?:llego|llegamos|arribo)\s+(?:el\s+)?\d{1,2}(?:\s+de\s+\w+)?|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?/i, key: "arrival_date", category: "itinerary", priority: 10 },
  { pattern: /(?:salgo|salimos|me\s+voy|nos\s+vamos|vuelo\s+de\s+regreso|checkout)\s+(?:el\s+)?\d{1,2}(?:\s+de\s+\w+)?/i, key: "departure_date", category: "itinerary", priority: 10 },
  { pattern: /(?:estaré|estaremos|me\s+quedo|nos\s+quedamos)\s+(?:aquí\s+)?(?:por\s+)?(\d+)\s+(?:días?|noches?|semanas?)/i, key: "trip_duration", valueExtractor: /(\d+)\s+(?:días?|noches?|semanas?)/, category: "itinerary", priority: 10 },
  { pattern: /(?:un\s+fin\s+de\s+semana|long\s+weekend|semana\s+completa|dos\s+semanas|una\s+semana|10\s+días?|tres\s+noches?|cuatro\s+noches?)/i, key: "trip_duration", category: "itinerary" },
  { pattern: /(?:en\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|el\s+próximo\s+(?:mes|año)|esta\s+(?:navidad|semana\s+santa)|temporada\s+alta|temporada\s+baja)/i, key: "travel_month", category: "itinerary" },
  { pattern: /(?:vuelo\s+de\s+(?:las?\s+)?\d+(?::\d+)?(?:\s+[ap]m)?|llego\s+a\s+(?:las?\s+)?\d+|aterrizamos?\s+a\s+(?:las?\s+)?\d+)/i, key: "flight_time", category: "itinerary" },
  { pattern: /(?:check.?in\s+a\s+(?:las?\s+)?\d+|checkout\s+a\s+(?:las?\s+)?\d+|early\s+check.?in|late\s+checkout)/i, key: "checkin_time", category: "accommodation" },
  { pattern: /(?:viaje\s+de\s+último\s+minuto|last\s+minute|reservé\s+hoy|salgo\s+mañana|salgo\s+esta\s+semana)/i, key: "last_minute", category: "itinerary", priority: 10 },
  { pattern: /(?:viaje\s+planeado\s+con\s+tiempo|reservé\s+con\s+\d+\s+meses?\s+de\s+anticipación|planeando\s+con\s+anticipación)/i, key: "advance_planning", category: "itinerary" },
  { pattern: /(?:temporada\s+de\s+(?:lluvia|huracanes?|seca|alta|baja)|época\s+lluviosa|época\s+seca)/i, key: "season_awareness", category: "itinerary" },

  /** @Constant.SessionMemory.Patterns.TravelGroup */
  { pattern: /(?:viajo|voy|viaje|estoy)\s+con\s+(?:mi\s+)?(?:familia|pareja|esposa|esposo|novia|novio|amigos?|hermanos?|padres?|niños?|hijos?|bebés?|solo|sola)/i, key: "travel_group", category: "family" },
  { pattern: /(?:solo|sola|viajero\s+solo|viajera\s+sola)/i, key: "solo_traveler", category: "personal_info" },
  { pattern: /(?:somos|venimos)\s+(\d+)\s+(?:personas?|adultos?|amigos?|familiares?)/i, key: "group_size", valueExtractor: /(\d+)\s+(?:personas?|adultos?|amigos?)/, category: "family", priority: 10 },
  { pattern: /(?:tengo|mi\s+pareja\s+tiene)\s+(\d{1,2})\s+años/i, key: "traveler_age", valueExtractor: /(\d{1,2})\s+años/, category: "personal_info" },
  { pattern: /(?:niños?|hijos?|bebés?)\s+(?:de\s+)?\d+\s+(?:años?|meses?)|niño\s+pequeño|bebé\s+de\s+pecho|en\s+carreola|toddler/i, key: "children_ages", category: "family" },
  { pattern: /(?:adulto\s+mayor|tercera\s+edad|abuela|abuelo|jubilado|pensionado)/i, key: "senior_traveler", category: "family" },
  { pattern: /(?:despedida\s+de\s+soltero|despedida\s+de\s+soltera|bachelorette|bachelor|grupo\s+de\s+(?:chicos?|chicas?|amigos?|amigas?))/i, key: "group_type", category: "family" },
  { pattern: /(?:viaje\s+corporativo|con\s+colegas?|compañeros?\s+de\s+trabajo|team\s+building|offsite|retreat\s+corporativo)/i, key: "corporate_group", category: "family" },
  { pattern: /(?:recién\s+casados?|luna\s+de\s+miel|honeymoon|aniversario\s+de\s+boda)/i, key: "couple_occasion", category: "family", priority: 10 },
  { pattern: /(?:viaje\s+de\s+graduación|viaje\s+de\s+quinceañera|viaje\s+de\s+cumpleaños\s+(?:especial|\d+))/i, key: "celebration_trip", category: "family", priority: 10 },
  { pattern: /(?:familia\s+(?:grande|numerosa|extendida)|varias\s+generaciones|abuelos?\s+y\s+nietos?|multigeneracional)/i, key: "multigenerational", category: "family" },

  /** @Constant.SessionMemory.Patterns.KidsAndFamily */
  { pattern: /(?:juegos?|parque\s+de\s+diversiones?|piscina\s+para\s+niños|actividades\s+para\s+niños|kid.?friendly|apto\s+para\s+niños|actividades\s+familiares)/i, key: "kids_activities", category: "preferences" },
  { pattern: /(?:menú\s+infantil|opciones\s+para\s+niños|silla\s+alta|high\s+chair|cambiador|lactancia|carreola\s+friendly)/i, key: "baby_needs", category: "family" },
  { pattern: /(?:museos?\s+interactivos?|acuario|zoológico|granja|taller\s+para\s+niños|espacio\s+de\s+juegos?)/i, key: "educational_activities", category: "preferences" },
  { pattern: /(?:playa\s+(?:tranquila|sin\s+olas|con\s+aguas?\s+calmas?|apta\s+para\s+niños|poco\s+profunda))/i, key: "family_beach", category: "preferences" },
  { pattern: /(?:nap\s+time|hora\s+de\s+dormir\s+del\s+bebé|el\s+bebé\s+duerme\s+a\s+las?|necesito\s+regresar\s+temprano\s+por\s+los?\s+niños?)/i, key: "baby_schedule", category: "family", priority: 10 },
  { pattern: /(?:coche\s+de\s+bebé|carreola|stroller|portabebés|baby\s+carrier|silla\s+de\s+auto|car\s+seat)/i, key: "baby_gear", category: "family" },

  /** @Constant.SessionMemory.Patterns.Locations.PR */
  { pattern: /(?:san\s+juan|viejo\s+san\s+juan|condado|isla\s+verde|miramar|ocean\s+park|ponce|arecibo|rincon|cabo\s+rojo|fajardo|luquillo|vieques|culebra|aguadilla|mayaguez|guayama|humacao|manati|dorado|isabela|camuy|el\s+yunque|boquerón|crash\s+boat|flamenco\s+beach|sun\s+bay|playa\s+sucia|balneario\s+de\s+carolina|seven\s+seas|buyé|media\s+luna|playa\s+negra|playa\s+rosada|playa\s+brava|la\s+parguera|phosphorescent\s+bay|bio\s+bay)/i, key: "location_preference", category: "preferences" },
  { pattern: /(?:quiero\s+quedarme\s+en|prefiero\s+hospedarme\s+en|me\s+quedo\s+en)\s+(?:el\s+|la\s+)?(.+?)(?:\.|,|$)/i, key: "preferred_area", valueExtractor: /(?:quedarme\s+en|hospedarme\s+en|quedo\s+en)\s+(?:el\s+|la\s+)?(.+?)(?:\.|,|$)/i, category: "accommodation" },
  { pattern: /(?:lejos\s+de\s+turistas|lugares\s+locales|como\s+un\s+local|off\s+the\s+beaten\s+path|lugares\s+secretos|hidden\s+gems|gemas\s+ocultas)/i, key: "off_beaten_path", category: "preferences" },
  { pattern: /(?:cerca\s+de\s+(?:la\s+playa|el\s+aeropuerto|el\s+centro|restaurantes?)|a\s+pocos?\s+minutos?\s+(?:de|del))/i, key: "location_proximity", category: "preferences" },
  { pattern: /(?:zona\s+(?:tranquila|residencial|comercial|histórica|turística)|barrio\s+(?:bonito|seguro|local|tranquilo))/i, key: "neighborhood_type", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Locations.Origin */
  { pattern: /(?:vengo\s+de|soy\s+de|viajo\s+desde|llego\s+desde|vuelo\s+desde)\s+(.+?)(?:\.|,|$)/i, key: "origin_city", valueExtractor: /(?:vengo\s+de|soy\s+de|viajo\s+desde|llego\s+desde|vuelo\s+desde)\s+(.+?)(?:\.|,|$)/i, category: "personal_info", priority: 10 },
  { pattern: /(?:ya\s+(?:he\s+)?(?:estado|visitado|ido)|no\s+es\s+mi\s+primera\s+vez|conozco\s+(?:pr|puerto\s+rico)|volví|regresé)/i, key: "repeat_visitor", category: "personal_info" },
  { pattern: /(?:primera\s+vez\s+(?:en|que\s+visito)|nunca\s+(?:he\s+)?(?:estado|ido|visitado)|primera\s+visita)/i, key: "first_time_visitor", category: "personal_info" },
  { pattern: /(?:residente|vivo\s+aquí|soy\s+de\s+(?:pr|puerto\s+rico)|soy\s+puertorriqueño|soy\s+boricua)/i, key: "local_resident", category: "personal_info", priority: 10 },

  /** @Constant.SessionMemory.Patterns.NatureActivities */
  { pattern: /(?:playa|playas|biobay|bahía\s+bioluminiscente|el\s+yunque|rainforest|bosque|montaña|hiking|senderismo|surf|kayak|snorkel|buceo|paddleboard|jet\s+ski|zip\s+line|canopy|atv|cueva|caverna|horseback\s+riding|whale\s+watching)/i, key: "nature_activities", category: "preferences" },
  { pattern: /(?:surfing|longboard|bodyboard|windsurf|kitesurf|deep\s+sea\s+fishing|pesca|velero|yate|catamarán|chárter|sunset\s+cruise|snuba|parasailing|flyboard)/i, key: "water_sports", category: "preferences" },
  { pattern: /(?:sunrise|amanecer\s+en\s+la\s+playa|atardecer\s+en\s+la\s+playa|stargazing|observar\s+estrellas|luna\s+llena\s+en\s+la\s+playa)/i, key: "nature_experiences", category: "preferences" },
  { pattern: /(?:avistamiento\s+de\s+aves|bird\s+watching|tortugas?\s+marinas?|delfines?|manatíes?|fauna\s+local|vida\s+silvestre|wildlife)/i, key: "wildlife", category: "preferences" },
  { pattern: /(?:cascada|waterfall|lago|laguna|río|cañon|cueva|caverna|caving|spelunking|rappel|abseiling)/i, key: "adventure_nature", category: "preferences" },
  { pattern: /(?:parque\s+nacional|reserva\s+natural|área\s+protegida|bosque\s+estatal|refugio\s+de\s+vida\s+silvestre)/i, key: "protected_areas", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.CultureActivities */
  { pattern: /(?:salsa|reggaeton|bomba|plena|fiesta|festival|casino|nightlife|vida\s+nocturna|rum\s+tasting|historia|cultura|castillo|fortaleza|iglesia|plaza|old\s+san\s+juan)/i, key: "cultural_activities", category: "preferences" },
  { pattern: /(?:museo|galería\s+de\s+arte|exposición|arte\s+(?:callejero|contemporáneo|colonial)|grafiti|murales?|instalación\s+de\s+arte)/i, key: "art_culture", category: "preferences" },
  { pattern: /(?:tour\s+(?:a\s+pie|en\s+bicicleta|histórico|gastronómico|cultural|de\s+ron|de\s+café|de\s+arte|nocturno)|walking\s+tour|food\s+tour)/i, key: "tours", category: "preferences" },
  { pattern: /(?:concierto|show\s+en\s+vivo|música\s+en\s+vivo|teatro|obra\s+de\s+teatro|ballet|comedia|stand\s+up|jazz\s+bar|live\s+music)/i, key: "live_entertainment", category: "preferences" },
  { pattern: /(?:arquitectura\s+(?:colonial|moderna|art\s+deco|española)|edificios?\s+históricos?|patrimonio\s+(?:cultural|histórico)|UNESCO)/i, key: "architecture", category: "preferences" },
  { pattern: /(?:clases?\s+de\s+(?:salsa|bomba|plena|cocina\s+puertorriqueña|español|surf|buceo|fotografía)|taller\s+de|workshop)/i, key: "classes", category: "preferences" },
  { pattern: /(?:voluntariado|trabajo\s+comunitario|turismo\s+social|impacto\s+local|apoyar\s+locales|negocios\s+locales)/i, key: "social_impact", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Nightlife */
  { pattern: /(?:bares?|clubs?|discoteca|vida\s+nocturna\s+activa|salir\s+de\s+noche|tragos?|reggaeton\s+bar|rooftop|lounge|after\s+hours|karaoke|bar\s+de\s+vinos?)/i, key: "nightlife", category: "preferences" },
  { pattern: /(?:no\s+(?:quiero|busco|me\s+interesa)\s+(?:vida\s+nocturna|bares?|discotecas?|clubs?)|prefiero\s+acostarme\s+temprano|sin\s+vida\s+nocturna)/i, key: "nightlife_dislike", category: "dislikes" },
  { pattern: /(?:shows?\s+de\s+drag|drag\s+show|burlesque|comedy\s+club|open\s+mic|trivia\s+night|pub\s+quiz)/i, key: "nightlife_shows", category: "preferences" },
  { pattern: /(?:free\s+cover|sin\s+cover|entrada\s+gratis\s+a\s+club|lista\s+de\s+invitados?|guest\s+list)/i, key: "nightlife_deals", category: "budget" },
  { pattern: /(?:quiero\s+conocer\s+la\s+escena\s+(?:gay|LGBT|queer)|ambiente\s+gay.?friendly|bares?\s+gay|pride)/i, key: "lgbtq_nightlife", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Wellness */
  { pattern: /(?:spa|masaje|yoga|meditación|bienestar|wellness|retiro|pilates|detox|jacuzzi|sauna|sound\s+bath|reiki|flotation\s+tank)/i, key: "wellness", category: "preferences" },
  { pattern: /(?:masaje\s+(?:tailandés|de\s+piedras\s+calientes|deportivo|relajante|prenatal|sueco|de\s+tejido\s+profundo)|masaje\s+de\s+pareja)/i, key: "massage_type", category: "preferences" },
  { pattern: /(?:yoga\s+(?:en\s+la\s+playa|al\s+amanecer|aéreo|hot\s+yoga|yin|hatha|vinyasa|kundalini))/i, key: "yoga_type", category: "preferences" },
  { pattern: /(?:retiro\s+de\s+(?:yoga|meditación|bienestar|silencio|desintoxicación\s+digital|digital\s+detox))/i, key: "retreat_type", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Sports */
  { pattern: /(?:golf|tenis|pickleball|ciclismo|bicicleta|mtb|correr|running|yoga\s+en\s+la\s+playa|crossfit|boxeo|escalada|bouldering)/i, key: "sports_activities", category: "preferences" },
  { pattern: /(?:maratón|carrera\s+de\s+5k|10k|triatlón|ironman|tour\s+en\s+bicicleta\s+de\s+montaña|MTB\s+trail)/i, key: "endurance_sports", category: "preferences" },
  { pattern: /(?:espectador|ver\s+deportes|estadio|partido\s+de\s+(?:béisbol|baloncesto|fútbol|volleyball|boxeo))/i, key: "sports_spectator", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Photography */
  { pattern: /(?:fotos?|fotografía|instagram|contenido|tiktok|golden\s+hour|amanecer|atardecer|miradores?|sesión\s+de\s+fotos|drone|cinematic|reel)/i, key: "photography", category: "preferences" },
  { pattern: /(?:mejor\s+spot\s+para\s+fotos?|lugares?\s+(?:fotogénico|instagrameable|para\s+fotos?)|foto\s+spot|fotogénico)/i, key: "photo_spots", category: "preferences" },
  { pattern: /(?:tengo\s+(?:una\s+)?cámara|soy\s+fotógrafo|fotografía\s+(?:profesional|de\s+naturaleza|submarina|aérea|callejera|de\s+vida\s+silvestre))/i, key: "photography_level", category: "preferences" },
  { pattern: /(?:selfie|autofoto|foto\s+de\s+pareja|sesión\s+de\s+fotos?\s+profesional|fotógrafo\s+de\s+viaje|photographer)/i, key: "photo_session", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Shopping */
  { pattern: /(?:shopping|compras|souvenirs|artesanías|rum|cafe|joyería|outlet|mercado\s+de\s+artesanías|galería\s+de\s+arte|tiendas\s+locales|diseñadores\s+locales)/i, key: "shopping", category: "preferences" },
  { pattern: /(?:mercado\s+(?:local|de\s+pulgas|de\s+agricultores|de\s+artesanos?)|feria\s+de\s+artesanías|artesanía\s+puertorriqueña)/i, key: "local_market", category: "preferences" },
  { pattern: /(?:ropa\s+de\s+diseñador|moda\s+local|tienda\s+boutique|segunda\s+mano|thrift\s+store|vintage)/i, key: "fashion_shopping", category: "preferences" },
  { pattern: /(?:farmacia|medicamentos?|protector\s+solar|sunscreen|insect\s+repellent|repelente)/i, key: "pharmacy_needs", category: "personal_info" },
  { pattern: /(?:¿dónde\s+comprar|dónde\s+puedo\s+conseguir|dónde\s+venden)\s+(.+?)(?:\.|,|$)/i, key: "shopping_inquiry", valueExtractor: /(?:comprar|conseguir|venden)\s+(.+?)(?:\.|,|$)/i, category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Accommodation */
  { pattern: /(?:hotel|resort|airbnb|casa|apartamento|villa|parador|posada|glamping|eco\s+lodge|boutique|all\s+inclusive|todo\s+incluido|hostel|bed\s+and\s+breakfast|vacation\s+rental)/i, key: "accommodation_type", category: "accommodation" },
  { pattern: /(?:piscina|gym|gimnasio|estacionamiento|parking|cocina\s+equipada|kitchenette|balcón|terraza|vista\s+al\s+mar|beachfront|frente\s+al\s+mar|cerca\s+de\s+la\s+playa|kids\s+club)/i, key: "accommodation_amenities", category: "accommodation" },
  { pattern: /(?:ya\s+(?:tengo|reservé|reservamos|pagué)|tengo\s+(?:hotel|airbnb|reserva|vuelo)\s+(?:hecho|ya|reservado)|ya\s+tengo\s+donde\s+quedarme)/i, key: "already_booked", category: "itinerary" },
  { pattern: /(?:habitación\s+(?:doble|sencilla|suite|king|queen|twin|familiar|con\s+vista|con\s+balcón|accesible))/i, key: "room_type", category: "accommodation" },
  { pattern: /(?:hotel\s+(?:boutique|de\s+lujo|de\s+diseño|histórico|moderno|minimalista|con\s+encanto)|design\s+hotel)/i, key: "hotel_style", category: "accommodation" },
  { pattern: /(?:no\s+necesito\s+lujo|hostel\s+está\s+bien|dormitorio\s+compartido|dorm\s+room|bunk\s+bed|cama\s+en\s+dormitorio)/i, key: "budget_accommodation", category: "budget" },
  { pattern: /(?:con\s+cocina|quiero\s+cocinar|necesito\s+cocina\s+(?:completa|equipada)|airbnb\s+con\s+cocina)/i, key: "kitchen_needed", category: "accommodation" },
  { pattern: /(?:pet\s+friendly\s+hotel|acepta\s+mascotas|hotel\s+que\s+permita\s+perros?|gatos?\s+en\s+el\s+hotel)/i, key: "pet_friendly_accommodation", category: "family" },
  { pattern: /(?:cancelación\s+gratuita|free\s+cancellation|política\s+de\s+cancelación|reembolso|no\s+refundable)/i, key: "cancellation_policy", category: "accommodation" },

  /** @Constant.SessionMemory.Patterns.Transport */
  { pattern: /(?:carro|coche|jeep|uber|taxi|guagua|ferry|catamarán|avión|helicóptero|no\s+tengo\s+carro|no\s+quiero\s+alquilar|no\s+conduzco|prefiero\s+no\s+manejar)/i, key: "transport", category: "transport" },
  { pattern: /(?:¿hay\s+estacionamiento|sin\s+peajes?|con\s+peajes?|mucho\s+tráfico|evitar\s+tráfico)/i, key: "parking_tolls", category: "transport" },
  { pattern: /(?:crucero|cruise\s+ship|puerto\s+de\s+cruceros|muelle|day\s+tripper|excursión\s+de\s+crucero|tengo\s+pocas\s+horas)/i, key: "cruise_passenger", category: "transport", priority: 10 },
  { pattern: /(?:alquiler\s+de\s+carro|rent\s+a\s+car|car\s+rental|scooter|moto|bicicleta\s+de\s+alquiler|e-bike|vespa|golf\s+cart)/i, key: "rental_vehicle", category: "transport" },
  { pattern: /(?:sin\s+licencia\s+de\s+conducir|no\s+sé\s+manejar|no\s+tengo\s+licencia)/i, key: "no_license", category: "transport", priority: 10 },
  { pattern: /(?:clase\s+(?:ejecutiva|business|primera|turista|económica)|business\s+class|first\s+class|premium\s+economy)/i, key: "flight_class", category: "transport" },
  { pattern: /(?:vuelo\s+directo|escala|conexión\s+en|layover|vuelo\s+sin\s+escalas?)/i, key: "flight_preference", category: "transport" },
  { pattern: /(?:aeropuerto\s+(?:SJU|LMM|BQN|SIG|PSE|FAJ)|aeropuerto\s+(?:de\s+)?(?:San\s+Juan|Aguadilla|Ponce|Fajardo|Isla\s+Grande))/i, key: "airport", category: "transport" },
  { pattern: /(?:traslado\s+al\s+aeropuerto|airport\s+transfer|pickup\s+del\s+aeropuerto|shuttle|van\s+compartida)/i, key: "airport_transfer", category: "transport" },
  { pattern: /(?:carro\s+de\s+7\s+plazas?|minivan|van|SUV|4x4|jeep\s+para\s+playa|vehículo\s+grande)/i, key: "vehicle_size", category: "transport" },

  /** @Constant.SessionMemory.Patterns.TripStyle */
  { pattern: /(?:luna\s+de\s+miel|romántico|aventura|relax|relajado|foodie|gastronómico|ecoturismo|sostenible|slow\s+travel|aventurero|negocios|cumpleaños|aniversario)/i, key: "trip_type", category: "preferences" },
  { pattern: /(?:ritmo|pace)\s+(?:tranquilo|relajado|calmo|rápido|intenso|aventurero|slow|packed)/i, key: "trip_pace", category: "preferences" },
  { pattern: /(?:bachelorette|despedida\s+de\s+soltero|graduación|quinceañera|retiro\s+corporativo|team\s+building|reunión\s+familiar|reencuentro)/i, key: "trip_purpose", category: "preferences" },
  { pattern: /(?:trabajo\s+remoto|digital\s+nomad|nómada\s+digital|necesito\s+wifi|coworking|laptop\s+friendly|remote\s+work)/i, key: "remote_work", category: "preferences" },
  { pattern: /(?:viaje\s+de\s+estudios|intercambio\s+estudiantil|año\s+sabático|gap\s+year)/i, key: "study_trip", category: "preferences" },
  { pattern: /(?:turismo\s+médico|medical\s+tourism|tratamiento\s+médico|cirugía|recuperación)/i, key: "medical_tourism", category: "personal_info" },
  { pattern: /(?:viaje\s+espiritual|retiro\s+espiritual|peregrinación|meditación\s+en\s+retiro)/i, key: "spiritual_trip", category: "preferences" },
  { pattern: /(?:mochila\s+(?:solamente|al\s+hombro|de\s+mano)|voy\s+ligero|solo\s+carry.?on|sin\s+maleta\s+grande)/i, key: "light_packer", category: "preferences" },
  { pattern: /(?:voy\s+con\s+mucho\s+equipaje|necesito\s+bodega|maletas?\s+grandes?|overweight\s+luggage)/i, key: "heavy_luggage", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.SpecialNeeds */
  { pattern: /(?:pet\s+friendly|mascota|perro|gato|viajo\s+con\s+mascota|dog\s+friendly)/i, key: "pets", category: "family" },
  { pattern: /(?:no\s+fumo|no\s+fumador|alérgico\s+al\s+humo|sin\s+humo|smoke.?free)/i, key: "smoking", category: "preferences" },
  { pattern: /(?:accesibilidad|silla\s+de\s+ruedas|movilidad\s+reducida|discapacidad|necesito\s+rampa|ADA\s+accessible|accessible\s+room)/i, key: "accessibility", category: "personal_info" },
  { pattern: /(?:hablo\s+español|hablo\s+inglés|prefiero\s+español|necesito\s+traductor|no\s+hablo\s+español|solo\s+hablo)/i, key: "language", category: "personal_info" },
  { pattern: /(?:seguridad|zonas\s+peligrosas|evitar\s+crimen|me\s+siento\s+inseguro|barrios\s+peligrosos|¿es\s+seguro)/i, key: "safety_concern", category: "personal_info" },
  { pattern: /(?:médico|condición|diabetes|asma|hipertensión|medicamentos?|hospital\s+cercano|cobertura\s+médica|seguro\s+de\s+viaje)/i, key: "medical_needs", category: "personal_info" },
  { pattern: /(?:eco.?friendly|sostenible|no\s+plástico|conservación|medio\s+ambiente|carbon\s+footprint|zero\s+waste|turismo\s+sostenible)/i, key: "sustainability", category: "preferences" },
  { pattern: /(?:flexible|último\s+minuto|espontáneo|abierto\s+a\s+cambios|sin\s+plan\s+fijo|improvisando)/i, key: "flexibility", category: "preferences" },
  { pattern: /(?:sin\s+muchas\s+escaleras|rutas\s+planas|no\s+puedo\s+caminar\s+mucho|silla\s+de\s+ruedas|andador|bastón|movilidad\s+limitada)/i, key: "mobility", category: "personal_info" },
  { pattern: /(?:miedo\s+a\s+(?:las\s+alturas|el\s+agua|volar|los\s+espacios\s+cerrados|los\s+animales?)|claustrofóbico|vértigo|fobia)/i, key: "phobia", category: "personal_info" },
  { pattern: /(?:embarazada|embarazo|gestación|primer\s+trimestre|segundo\s+trimestre|tercer\s+trimestre|recién\s+parida)/i, key: "pregnancy", category: "personal_info", priority: 10 },
  { pattern: /(?:LGBTQ|gay\s+friendly|queer\s+friendly|inclusivo|rainbow|ambientes?\s+seguros?\s+para\s+la\s+comunidad)/i, key: "lgbtq_friendly", category: "personal_info" },
  { pattern: /(?:me\s+marea\s+el\s+barco|mareo\s+en\s+barco|sea\s+sick|prefiero\s+no\s+tomar\s+barco)/i, key: "sea_sickness", category: "personal_info" },
  { pattern: /(?:no\s+sé\s+nadar|no\s+nado|no\s+me\s+meto\s+al\s+agua\s+profunda|miedo\s+al\s+agua)/i, key: "no_swimming", category: "personal_info" },
  { pattern: /(?:mucho\s+calor|no\s+soporto\s+el\s+calor|sensible\s+al\s+calor|prefiero\s+temperaturas\s+frescas)/i, key: "heat_sensitivity", category: "personal_info" },
  { pattern: /(?:tatoo|piercing|estudio\s+de\s+tatuajes|¿dónde\s+puedo\s+hacerme\s+un\s+tatuaje)/i, key: "tattoo", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.WeatherSeason */
  { pattern: /(?:prefiero|evitar|mejor|peor)\s+(?:lluvia|huracán|verano|invierno|navidad|calor\s+extremo|alta\s+humedad|tormentas|huracanes)/i, key: "season_preference", category: "itinerary" },
  { pattern: /(?:¿está\s+lloviendo|¿cómo\s+está\s+el\s+clima|¿qué\s+tiempo\s+hace|¿va\s+a\s+llover|¿habrá\s+lluvia)/i, key: "weather_inquiry", category: "itinerary" },
  { pattern: /(?:traje\s+de\s+baño|ropa\s+ligera|ropa\s+de\s+playa|chanclas?|sandalias?|ropa\s+de\s+lluvia|paraguas|impermeable)/i, key: "clothing_packing", category: "itinerary" },
  { pattern: /(?:protector\s+solar|bloqueador\s+solar|sunscreen|SPF|repelente\s+de\s+mosquitos|bug\s+spray|deet)/i, key: "sun_protection", category: "personal_info" },

  /** @Constant.SessionMemory.Patterns.FestivalsEvents */
  { pattern: /(?:fiestas\s+patronales|sanjuanero|bomba|plena|carnaval|navidad|reyes|halloween|thanksgiving|san\s+sebastián|festivales|parrandas|casitas|luminarias)/i, key: "festival_interest", category: "preferences" },
  { pattern: /(?:quiero\s+asistir\s+a|voy\s+para\s+(?:el|la)|viajo\s+específicamente\s+para)\s+(.+?)(?:\.|,|$)/i, key: "event_specific", valueExtractor: /(?:asistir\s+a|para\s+(?:el|la)|para)\s+(.+?)(?:\.|,|$)/i, category: "itinerary", priority: 10 },
  { pattern: /(?:semana\s+santa|easter|año\s+nuevo|new\s+year|4\s+de\s+julio|independence\s+day|día\s+de\s+acción\s+de\s+gracias)/i, key: "holiday_travel", category: "itinerary" },
  { pattern: /(?:marcha\s+del\s+orgullo|pride\s+parade|gay\s+pride|pride\s+month|desfile\s+de\s+(?:reyes|navidad|carnaval))/i, key: "parade_interest", category: "preferences" },

  /** @Constant.SessionMemory.Patterns.Discomforts */
  { pattern: /(?:evitar|no\s+quiero|me\s+da\s+miedo|no\s+me\s+gusta|detesto)\s+(?:multitudes|turistas|ruido|calor|lluvia|insectos|mosquitos|tráfico|ferry|avión)/i, key: "dislikes", category: "dislikes" },
  { pattern: /(?:no\s+(?:quiero|me\s+interesa)\s+(?:lugares?\s+muy\s+turísticos?|trampa\s+para\s+turistas?|tourist\s+trap|masificado|lleno\s+de\s+turistas?))/i, key: "avoid_touristy", category: "dislikes" },
  { pattern: /(?:no\s+me\s+gustan?\s+(?:los?\s+museos?|tours?\s+guiados?|excursiones?)|prefiero\s+explorar\s+solo)/i, key: "no_guided_tours", category: "dislikes" },
  { pattern: /(?:no\s+quiero\s+(?:gastar\s+en|ir\s+a)\s+lugares?\s+(?:muy\s+caros?|overpriced|sobrevalorados?|overhyped))/i, key: "avoid_overpriced", category: "dislikes" },
  { pattern: /(?:me\s+canso\s+rápido|no\s+tengo\s+mucha\s+energía|necesito\s+descansar\s+seguido|no\s+puedo\s+caminar\s+mucho)/i, key: "low_energy", category: "personal_info" },
  { pattern: /(?:no\s+me\s+gusta\s+madrugar|no\s+soy\s+mañanero|prefiero\s+las\s+mañanas|soy\s+madrugador)/i, key: "morning_preference", category: "personal_info" },

  /** @Constant.SessionMemory.Patterns.NegativeFeedback */
  { pattern: /(?:no\s+me\s+(?:gustó|gustaron|pareció\s+bien)|malísimo|pésimo|muy\s+caro|muy\s+lejos|muy\s+ruidoso|muy\s+sucio|no\s+lo\s+recomiendo|mala\s+experiencia|decepcionante|overrated|sobrevalorado)\s*(.+?)(?:\.|,|$)/i, key: "negative_feedback", valueExtractor: /(?:malísimo|pésimo|no\s+lo\s+recomiendo)\s+(.+?)(?:\.|,|$)/i, category: "dislikes", priority: 10 },
  { pattern: /(?:ese\s+lugar|ese\s+restaurante|ese\s+hotel|esa\s+playa|ese\s+sitio)\s+(?:no\s+me\s+gustó|fue\s+horrible|fue\s+una\s+decepción|no\s+vale\s+la\s+pena)/i, key: "place_dislike", category: "dislikes", priority: 10 },
  { pattern: /(?:la\s+última\s+vez\s+que\s+fui\s+a|cuando\s+fui\s+a)\s+(.+?)\s+(?:fue\s+(?:horrible|pésimo|decepcionante)|no\s+me\s+gustó)/i, key: "past_bad_experience", valueExtractor: /(?:fui\s+a)\s+(.+?)\s+(?:fue|no)/, category: "dislikes", priority: 10 },

  /** @Constant.SessionMemory.Patterns.PositiveFeedback */
  { pattern: /(?:me\s+encantó|estuvo\s+increíble|fue\s+genial|lo\s+amé|estuvo\s+delicioso|muy\s+bueno|excelente|espectacular|chévere)\s+(.+?)(?:\.|,|$)/i, key: "positive_feedback", valueExtractor: /(?:me\s+encantó|estuvo\s+increíble|fue\s+genial|lo\s+amé)\s+(.+?)(?:\.|,|$)/i, category: "preferences", priority: 10 },
  { pattern: /(?:quiero\s+volver\s+a|regresaré\s+a|definitivamente\s+vuelvo\s+a)\s+(.+?)(?:\.|,|$)/i, key: "want_to_return", valueExtractor: /(?:volver\s+a|regresar\s+a|regresaré\s+a)\s+(.+?)(?:\.|,|$)/i, category: "preferences" },
  { pattern: /(?:lo\s+mejor\s+que\s+he\s+(?:comido|probado|visitado|hecho)|lo\s+más\s+rico\s+que\s+he\s+comido|el\s+mejor\s+restaurante)\s+(.+?)(?:\.|,|$)/i, key: "best_ever", category: "preferences", priority: 10 },

  /** @Constant.SessionMemory.Patterns.Corrections */
  { pattern: /(?:en\s+realidad|te\s+corrijo|no\s+dije\s+eso|me\s+confundí|quise\s+decir|corrijo|actualiza|cambia\s+eso\s+a|no\s+es\s+correcto|me\s+equivoqué)/i, key: "correction", category: "correction", priority: 20 },
  { pattern: /(?:olvida\s+(?:lo\s+que\s+dije|eso|lo\s+anterior)|ignora\s+(?:eso|lo\s+que\s+dije)|borra\s+eso|ya\s+no\s+aplica)/i, key: "retraction", category: "correction", priority: 20 },
  { pattern: /(?:actualiza\s+mi\s+(?:perfil|preferencia|información)|cambia\s+lo\s+que\s+sabes\s+de\s+mí|ahora\s+prefiero)/i, key: "update_preference", category: "correction", priority: 15 },

  /** @Constant.SessionMemory.Patterns.PersonalInfo */
  { pattern: /(?:mi\s+nombre\s+es|me\s+llamo)\s+(.+?)(?:\.|,|$)/i, key: "user_name", valueExtractor: /(?:mi\s+nombre\s+es|me\s+llamo)\s+(.+?)(?:\.|,|$)/i, category: "personal_info", priority: 15 },
  { pattern: /(?:soy\s+(?:de|originalmente\s+de|nacido\s+en|criado\s+en))\s+(.+?)(?:\.|,|$)/i, key: "user_origin", valueExtractor: /(?:de|originalmente\s+de|nacido\s+en)\s+(.+?)(?:\.|,|$)/i, category: "personal_info" },
  { pattern: /(?:trabajo\s+(?:como|de|en)|soy\s+(?:médico|enfermero|maestro|abogado|ingeniero|chef|fotógrafo|artista|músico|programador|diseñador|escritor|periodista|empresario))/i, key: "profession", category: "personal_info" },
  { pattern: /(?:tengo\s+\d+\s+años|voy\s+a\s+cumplir\s+\d+|acabo\s+de\s+cumplir\s+\d+|soy\s+(?:millennial|gen\s+z|boomer))/i, key: "age_range", category: "personal_info" },
  { pattern: /(?:mi\s+correo|mi\s+email|mi\s+teléfono|mi\s+número\s+es|puedes\s+contactarme\s+en)/i, key: "contact_info", category: "contact", priority: 15 },
  { pattern: /(?:soy\s+introvertido|soy\s+extrovertido|necesito\s+tiempo\s+solo|me\s+gusta\s+socializar|disfruto\s+conocer\s+personas)/i, key: "social_style", category: "personal_info" },
  { pattern: /(?:hablo\s+(?:inglés|francés|alemán|portugués|italiano|mandarín|japonés|árabe)\s+(?:bien|fluido|un\s+poco|básico))/i, key: "languages_spoken", category: "personal_info" },
]

/** @Constant.SessionMemory.Categories */
export const MEMORY_CATEGORIES = {
  PREFERENCE: "preference",
  FACT: "fact",
  ITINERARY: "itinerary",
  CONTACT: "contact",
  ALLERGY: "allergy",
  FAMILY: "family",
  BUDGET: "budget",
  TRANSPORT: "transport",
  ACCOMMODATION: "accommodation",
  DISLIKES: "dislikes",
  CORRECTION: "correction",
  PERSONAL_INFO: "personal_info",
  NIGHTLIFE: "nightlife",
  WELLNESS: "wellness",
  PHOTOGRAPHY: "photography",
} as const