/** @Service.Effect.Skills */

import { Effect } from "effect"
import type { Skill, SkillMatch } from "../../schemas/skills/SkillSchema"

/** @Constant.Skills.Registry */
const SKILL_REGISTRY: readonly Skill[] = [
  {
    name: "restaurants",
    description: "Recomendaciones de restaurantes y gastronomía en Puerto Rico",
    instructions: "Enfócate en cuisine local, ambiente, rango de precios y ubicación. Recomienda mofongo, lechón, lugares de seafood. Incluye horarios y consejos de reservación.",
    category: "dining",
    keywords: ["restaurante", "comida", "comer", "restaurant", "food", "eat", "dining", "mofongo", "lechón", "cena", "almuerzo", "breakfast", "lunch", "dinner"]
  },
  {
    name: "beaches",
    description: "Descubrimiento y recomendaciones de playas",
    instructions: "Recomienda playas por actividad (snorkeling, surfing, familiar). Incluye accesibilidad, estacionamiento, servicios. Destaca Flamenco, Luquillo, Condado, Crash Boat.",
    category: "tourism",
    keywords: ["playa", "beach", "surf", "snorkel", "nadar", "swim", "arena", "sand", "mar", "ocean", "costa"]
  },
  {
    name: "events",
    description: "Eventos, festivales y vida nocturna",
    instructions: "Cubre festivales de música, eventos culturales, vida nocturna. Incluye clubes de salsa, bomba y plena, Fiestas de la Calle San Sebastián, Fiestas Patronales.",
    category: "events",
    keywords: ["evento", "festival", "fiesta", "event", "concert", "music", "nightlife", "salsa", "bomba", "plena", "club", "bar"]
  },
  {
    name: "weather",
    description: "Clima y mejores épocas para visitar",
    instructions: "Proporciona información seasonal, temporada de huracanes (junio-noviembre), períodos lluviosos vs secos. Mejores meses: diciembre-abril. Consejos de equipaje.",
    category: "general",
    keywords: ["clima", "weather", "lluvia", "rain", "sol", "sun", "temperatura", "temperature", "hurricane", "huracán", "temporada"]
  },
  {
    name: "itinerary",
    description: "Planificación de viajes y construcción de itinerarios",
    instructions: "Construye itinerarios día a día según duración, intereses y presupuesto. Incluye transporte entre ubicaciones. Sugiere actividades de mañana/tarde/noche.",
    category: "tourism",
    keywords: ["itinerario", "plan", "trip", "viaje", "días", "days", "agenda", "schedule", "ruta", "route"]
  },
  {
    name: "emergency",
    description: "Contactos de emergencia e información de seguridad",
    instructions: "Siempre comienza con 911. Incluye ubicaciones de hospitales, cadenas de farmacias (Walgreens, CVS). Policía turística: 787-726-7015. Información de embajada/consulado para visitantes internacionales.",
    category: "safety",
    keywords: ["emergencia", "emergency", "hospital", "policía", "police", "seguridad", "safety", "farmacia", "pharmacy", "doctor", "help", "ayuda", "911"]
  },
  {
    name: "transport",
    description: "Transporte y movilización",
    instructions: "Cubre alquiler de carros, disponibilidad de Uber/Lyft, sistema de público, ferry a Vieques/Culebra. Logística del aeropuerto SJU. Consejos de estacionamiento en Old San Juan.",
    category: "transport",
    keywords: ["transporte", "transport", "carro", "car", "uber", "taxi", "ferry", "aeropuerto", "airport", "bus", "público", "rental", "alquiler"]
  }
] as const

/** @Service.Effect.Skills.Class */
export class SkillsService extends Effect.Service<SkillsService>()("Skills", {
  effect: Effect.gen(function* () {
    const matchSkill = (
      userMessage: string
    ): Effect.Effect<SkillMatch | null> =>
      Effect.sync(() => {
        const lower = userMessage.toLowerCase()
        let bestMatch: SkillMatch | null = null

        for (const skill of SKILL_REGISTRY) {
          const matchCount = skill.keywords.filter((kw) => lower.includes(kw)).length
          if (matchCount === 0) continue

          const score = matchCount / skill.keywords.length
          if (!bestMatch || score > bestMatch.relevanceScore) {
            bestMatch = { skill: { ...skill }, relevanceScore: score }
          }
        }

        return bestMatch
      })

    const getSkillInstructions = (
      skillName: string
    ): Effect.Effect<string | null> =>
      Effect.sync(() => {
        const skill = SKILL_REGISTRY.find((s) => s.name === skillName)
        return skill?.instructions ?? null
      })

    const getAllSkills = (): Effect.Effect<readonly Skill[]> =>
      Effect.sync(() => SKILL_REGISTRY)

    const buildSkillPrompt = (match: SkillMatch): string =>
      `<active_skill name="${match.skill.name}">\n${match.skill.instructions}\n</active_skill>`

    return { matchSkill, getSkillInstructions, getAllSkills, buildSkillPrompt } as const
  })
}) {}
