const categoryTranslations: Record<string, string> = {
  parks: "parques familiares",
  beaches: "playas",
  dining: "restaurantes",
  restaurants: "restaurantes",
  activity: "actividades",
  activities: "actividades",
  events: "eventos",
  itinerary: "itinerarios",
  hotels: "hoteles",
  tours: "tours guiados",
  museums: "museos",
  adventures: "aventuras familiares",
};

const featureTranslations: Record<string, string> = {
  beach_nearby: "cerca de la playa",
  family_friendly: "aptas para familias",
  wheelchair: "accesibles en silla de ruedas",
  pet_friendly: "pet-friendly",
  kids: "ideales para niños pequeños",
  free: "gratuitas",
  indoor: "techadas (por si llueve)",
  outdoor: "al aire libre",
};

const regionTranslations: Record<string, string> = {
  east: "este",
  west: "oeste",
  north: "norte",
  south: "sur",
  central: "centro",
  metro: "área metropolitana",
};

export function actionToNaturalMessage(
  action: string,
  params: Record<string, string | string[]> = {}
): string {
  if (Object.keys(params).length === 0) {
    return `Quiero más información sobre ${action.replace(/_/g, " ")}.`;
  }

  const parts: string[] = ["Muéstrame"];

  if (params.category) {
    const catVal = Array.isArray(params.category) ? params.category[0] : params.category
    const cat = catVal ? (categoryTranslations[catVal] || catVal) : ''
    if (cat) parts.push(cat)
  } else if (params.type) {
    const typeVal = Array.isArray(params.type) ? params.type[0] : params.type
    const typ = typeVal ? (categoryTranslations[typeVal] || typeVal) : ''
    if (typ) parts.push(typ)
  }

  if (params.region) {
    const regVal = Array.isArray(params.region) ? params.region[0] : params.region
    const reg = regVal ? (regionTranslations[regVal] || regVal) : ''
    if (reg) parts.push(`en la región ${reg}`)
  }

  if (params.feature || params.features) {
    const rawFeatures = params.feature || params.features
    const features = Array.isArray(rawFeatures)
      ? rawFeatures
      : [rawFeatures]

    const translatedFeatures = features
      .filter((f): f is string => typeof f === 'string')
      .map((f) => featureTranslations[f] || f.replace(/_/g, " "))
      .filter(Boolean)

    if (translatedFeatures.length > 0) {
      parts.push(`que sean ${translatedFeatures.join(" y ")}`);
    }
  }

  if (params.price || params.priceRange) {
    const price = String(params.price ?? params.priceRange);
    parts.push(`en rango de precio ${price}`);
  }

  if (params.location) {
    parts.push(`en ${String(params.location)}`);
  }

  if (params.locations && Array.isArray(params.locations) && params.locations.length > 1) {
    parts.push(`comparando ${params.locations.join(" y ")}`);
  }

  if (params.from && params.to) {
    parts.push(`cómo llegar de ${String(params.from)} a ${String(params.to)}`);
  }

  if (parts.length <= 1) {
    return `Muéstrame más sobre ${action.replace(/_/g, " ")} con estos criterios.`;
  }

  return parts.join(" ") + ".";
}
