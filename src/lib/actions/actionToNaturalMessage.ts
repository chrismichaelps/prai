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
  params: Record<string, any> = {}
): string {
  if (Object.keys(params).length === 0) {
    return `Quiero más información sobre ${action.replace(/_/g, " ")}.`;
  }

  const parts: string[] = ["Muéstrame"];

  if (params.category) {
    const cat = categoryTranslations[params.category] || params.category;
    parts.push(cat);
  } else if (params.type) {
    const typ = categoryTranslations[params.type] || params.type;
    parts.push(typ);
  }

  if (params.region) {
    const reg = regionTranslations[params.region] || params.region;
    parts.push(`en la región ${reg}`);
  }

  if (params.feature || params.features) {
    const features = Array.isArray(params.feature || params.features)
      ? (params.feature || params.features)
      : [params.feature || params.features];

    const translatedFeatures = features
      .map((f: string) => featureTranslations[f] || f.replace(/_/g, " "))
      .filter(Boolean);

    if (translatedFeatures.length > 0) {
      parts.push(`que sean ${translatedFeatures.join(" y ")}`);
    }
  }

  if (params.price || params.priceRange) {
    const price = params.price || params.priceRange;
    parts.push(`en rango de precio ${price}`);
  }

  if (params.location) {
    parts.push(`en ${params.location}`);
  }

  if (params.locations && Array.isArray(params.locations) && params.locations.length > 1) {
    parts.push(`comparando ${params.locations.join(" y ")}`);
  }

  if (params.from && params.to) {
    parts.push(`cómo llegar de ${params.from} a ${params.to}`);
  }

  if (parts.length <= 1) {
    return `Muéstrame más sobre ${action.replace(/_/g, " ")} con estos criterios.`;
  }

  return parts.join(" ") + ".";
}
