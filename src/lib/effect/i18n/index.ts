import { Effect, Layer, Ref } from "effect"
import { I18n, type Locale } from "../services/I18n"

/** @Logic.I18n.Dictionary */
const dictionary: Record<Locale, Record<string, string>> = {
  es: {
    // Brand & General
    "brand.name": "PR\\AI",
    "brand.slogan": "Inteligencia Artificial de PR.",
    "brand.tagline": "Te ayudamos a descubrir todo sobre Puerto Rico con inteligencia artificial — playas, road trips, gastronomía, eventos y mucho más.",

    // Header & Nav
    "nav.about": "Sobre PR\\AI",
    "nav.contact": "Contacto",
    "nav.open_chat": "Abrir Chat",
    "nav.initial_chat": "Chat Inicial",
    "nav.export": "Exporta",
    "nav.share": "Compartir",
    "nav.menu": "Menú",
    "nav.actions": "Explora",

    // Hero
    "hero.cta_chat": "Empezar a chatear",
    "hero.alt_mountains": "Montañas de Puerto Rico al atardecer",
    "hero.alt_condado": "Agua del océano en Condado",

    // Chat
    "chat.placeholder": "Pregunta sobre turismo, gastronomía o cultura local...",
    "chat.loading": "AI analizando",
    "chat.discovering": "Descubriendo tesoros para ti...",
    "chat.copy": "Copiar",
    "chat.copied": "Copiado",
    "chat.videos_found": "videos analizados",
    "chat.web_pages": "Páginas web analizadas",
    "chat.sources": "Fuentes",
    "chat.search_context": "Contexto de búsqueda",
    "chat.no_sources": "No se encontraron fuentes adicionales",
    "chat.visit_source": "Visitar fuente",
    "chat.close_sidebar": "Cerrar fuentes",
    "chat.view_all_sources": "Ver todas las fuentes",
    "chat.view_more_results": "Ver más resultados",
    "chat.thinking": "Pensando...",
    "chat.no_image": "Sin imagen disponible",
    "chat.no_video": "Sin video disponible",
    "chat.google_search_hint": "Prueba buscar en Google con estos términos:",
    "chat.menu_highlights": "Imperdibles del Menú",
    "chat.duration": "Duración",
    "chat.difficulty": "Dificultad",
    "chat.date": "Fecha",
    "chat.open_maps": "Abrir en Google Maps",
    "chat.view_menu": "Ver Menú y Ubicación",
    "chat.how_to_get_there": "¿Cómo puedo llegar?",
    "chat.search_for": "Buscar",
    "chat.edited": "editado",
    "chat.edit": "Editar",
    "chat.save": "Guardar",
    "chat.cancel": "Cancelar",

    // Auth
    "auth.sign_in": "Iniciar sesión",
    "auth.sign_in_title": "Inicia sesión para continuar",
    "auth.sign_in_with_google": "Continuar con Google",
    "auth.sign_out": "Cerrar sesión",
    "auth.welcome": "Bienvenido",
    "auth.terms_notice": "Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.",
    "auth.profile": "Perfil",
    "auth.explorer": "Explorador",
    "auth.loading": "Cargando...",

    // Profile
    "profile.title": "Mi Perfil",
    "profile.edit_title": "Editar Perfil",
    "profile.display_name": "Nombre",
    "profile.email": "Correo electrónico",
    "profile.bio": "Biografía",
    "profile.bio_placeholder": "Cuéntanos sobre ti...",
    "profile.no_bio": "Sin biografía",
    "profile.save": "Guardar",
    "profile.saved": "Perfil guardado exitosamente",
    "profile.save_error": "Error al guardar el perfil",
    "profile.avatar_hint": "Avatar de Google",

    // Thinking Statuses (Internal)
    "chat.thinking.analyzing": "Analizando la consulta...",
    "chat.thinking.searching": "Buscando la mejor respuesta...",
    "chat.thinking.structuring": "Estructurando la información...",
    "chat.thinking.refining": "Refinando los detalles...",
    "chat.thinking.finalizing": "Finalizando el razonamiento...",
    "chat.thinking.prefix": "Pensando...",
    "chat.thinking.completed": "Pensado durante",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.legal": "Documentación Legal",
    "footer.terms": "Términos",
    "footer.privacy": "Privacidad",
    "footer.cookies": "Cookies",
    "footer.description": "PR\\AI es tu asistente inteligente para descubrir lo mejor de Puerto Rico. Desde playas escondidas hasta la mejor gastronomía local.",
    "footer.home": "Inicio",
    "footer.chat": "Chat",
    "footer.explore": "Explorar",

    // Cookies
    "cookies.title": "Control de Cookies",
    "cookies.desc": "Utilizamos cookies para mejorar tu experiencia de navegación y analizar nuestro tráfico. Tú decides qué permites.",
    "cookies.accept": "Aceptar",
    "cookies.decline": "Rechazar",
    "cookies.view": "Ver Política de Cookies",

    // Legal - Privacy
    "privacy.title": "Privacidad PR\\AI.",
    "privacy.subtitle": "Cómo protegemos tus datos y aseguramos una exploración segura de nuestra Isla.",
    "privacy.s1.title": "Recolección de Datos",
    "privacy.s1.desc": "Recopilamos información que usted nos proporciona directamente cuando interactúa con nuestro chat, como sus preferencias de viaje, consultas gastronómicas y feedback de usuario.",
    "privacy.s2.title": "Uso de la Información",
    "privacy.s2.desc": "Utilizamos su información para personalizar su experiencia, mejorar nuestros modelos de IA, y proporcionarle recomendaciones más precisas sobre lugares y eventos en Puerto Rico. Nunca venderemos su información personal a terceros.",
    "privacy.s3.title": "Seguridad de Datos",
    "privacy.s3.desc": "Implementamos medidas de seguridad de vanguardia para proteger sus datos. Sin embargo, ningún método de transmisión por Internet es 100% seguro. Nos esforzamos por proteger su información personal.",
    "privacy.cookies.title": "Cookies",
    "privacy.cookies.desc": "Utilizamos cookies para recordar sus preferencias y sesiones de exploración. Puede configurar su navegador para rechazar todas las cookies, pero esto podría afectar algunas funcionalidades del servicio.",

    // Legal - Terms
    "terms.title": "Términos de Servicio.",
    "terms.subtitle": "Nuestras reglas para asegurar una experiencia transparente y segura al explorar Puerto Rico con PR\\AI.",
    "terms.s1.title": "Aceptación de los Términos",
    "terms.s1.desc": "Al acceder y utilizar PR\\AI, usted acepta cumplir y estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestro servicio.",
    "terms.s2.title": "Descripción del Servicio",
    "terms.s2.desc": "PR\\AI es una plataforma impulsada por inteligencia artificial diseñada para proporcionar información, recomendaciones y asistencia personalizada sobre Puerto Rico. El servicio se proporciona 'tal cual' y está sujeto a cambios en cualquier momento.",
    "terms.s3.title": "Uso Aceptable",
    "terms.s3.desc": "Usted se compromete a no utilizar PR\\AI para ningún propósito ilegal o prohibido por estos términos. No deberá interferir con el funcionamiento normal del servicio ni intentar acceder a datos no autorizados.",
    "terms.note.title": "Nota Importante",
    "terms.note.desc": "PR\\AI utiliza modelos de lenguaje avanzados. Aunque nos esforzamos por la precisión, la información proporcionada puede contener errores. Siempre verifique información crítica con fuentes oficiales directamente.",

    // Legal - Cookies
    "legal.cookies.title": "Política de Cookies.",
    "legal.cookies.subtitle": "Transparencia total sobre cómo utilizamos la tecnología para mejorar tu exploración de Puerto Rico.",
    "legal.cookies.s1.title": "¿Qué son las Cookies?",
    "legal.cookies.s1.desc": "Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Nos permiten reconocer su navegador y recordar cierta información sobre su visita.",
    "legal.cookies.s2.title": "Tipos de Cookies",
    "legal.cookies.s2.desc": "Utilizamos cookies esenciales para el funcionamiento del chat, y cookies de análisis para entender qué partes de PR\\AI son las más populares. Nunca rastreamos su actividad fuera de nuestra plataforma.",
    "legal.cookies.note.title": "Control Total",
    "legal.cookies.note.desc": "Usted tiene el control. Puede borrar o bloquear las cookies en cualquier momento desde la configuración de su navegador. Tenga en cuenta que esto podría limitar su experiencia interactiva.",

    // 404
    "404.title": "Te perdiste en el Morro.",
    "404.desc": "Parece que esta ruta no existe. No te preocupes, hasta los mejores exploradores necesitan un guía de vez en cuando.",
    "404.back": "Volver al Inicio",
    "404.ask": "Preguntarle a PR\\AI",
    "404.alt": "Garita en el Viejo San Juan al atardecer",

    "locale.es": "es",
    "locale.en": "en",

    // Model Info Toast
    "info.title": "Transparencia en Inteligencia Artificial",
    "info.description": "En PR\\AI estamos comprometidos con el acceso abierto. Utilizamos el enrutador gratuito de OpenRouter, un sistema inteligente que selecciona dinámicamente entre los modelos más avanzados de la industria (como Trinity de Arcee, Step 3.5 de Stepfun o Nemotron de NVIDIA) para ofrecerte capacidades de visión, análisis y razonamiento complejo sin costo.",
    "info.limitation": "Nota: Sujeto a disponibilidad y latencia variable según la demanda global de OpenRouter.",

    // About Page
    "about.title": "Sobre PR\\AI",
    "about.subtitle": "Un experimento Boricua que une tecnología de punta con el corazón de nuestra isla.",
    "about.description.p1": "PR\\AI nace con el propósito de democratizar el acceso a la información sobre Puerto Rico utilizando los modelos de lenguaje más avanzados del mundo. Este proyecto busca que cada rincón de nuestra isla —desde las playas más escondidas hasta los tesoros gastronómicos del interior— sea fácil de descubrir para locales y visitantes por igual.",
    "about.description.p2": "Creemos en la transparencia y en el poder de la comunidad, por lo que PR\\AI es un proyecto de código abierto. Invitamos a desarrolladores, apasionados de la tecnología y a toda la comunidad Boricua a colaborar en su desarrollo. Al ser un experimento en constante evolución, probamos las capacidades de los modelos multimodales en contextos locales, siempre con la meta de mejorar la precisión y utilidad de cada respuesta.",
    "about.description.p3": "Es importante recordar que PR\\AI es una herramienta en etapa experimental. Aunque nos esforzamos por la excelencia técnica, las respuestas son generadas por inteligencia artificial y pueden contener imprecisiones. Te invitamos a explorar con curiosidad y a ser parte de este viaje tecnológico hecho 'de la isla, para el mundo'.",

    // API Errors
    "error.api.title": "Error de API",
    "error.api.400": "Solicitud inválida. Verifica los parámetros e intenta de nuevo.",
    "error.api.401": "Credenciales inválidas. Verifica tu API key.",
    "error.api.402": "Créditos insuficientes.",
    "error.api.403": "Tu contenido fue marcado por moderación.",
    "error.api.408": "Tiempo de espera agotado. Intenta de nuevo.",
    "error.api.429": "Demasiadas solicitudes. Espera un momento e intenta de nuevo.",
    "error.api.500": "Error interno del servidor. Intenta de nuevo en unos minutos.",
    "error.api.502": "El modelo seleccionado no está disponible. Intenta con otro.",
    "error.api.503": "No hay proveedores disponibles. Intenta más tarde.",
    "error.api.unknown": "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
    "error.api.close": "Cerrar"
  },
  en: {
    // Brand & General
    "brand.name": "PR\\AI",
    "brand.slogan": "AI for PR.",
    "brand.tagline": "We help you discover everything about Puerto Rico with artificial intelligence — beaches, road trips, gastronomy, events and much more.",

    // Header & Nav
    "nav.about": "About PR\\AI",
    "nav.contact": "Contact",
    "nav.open_chat": "Open Chat",
    "nav.initial_chat": "Initial Chat",
    "nav.export": "Export",
    "nav.share": "Share",
    "nav.menu": "Menu",
    "nav.actions": "Explore",

    // Hero
    "hero.cta_chat": "Start chatting",
    "hero.alt_mountains": "Puerto Rico mountains at sunset",
    "hero.alt_condado": "Condado Ocean Water",
    "hero.alt_logo": "PR\\AI Logo",

    // Chat
    "chat.placeholder": "Ask about tourism, gastronomy or local culture...",
    "chat.loading": "AI analyzing",
    "chat.discovering": "Discovering treasures for you...",
    "chat.copy": "Copy",
    "chat.copied": "Copied",
    "chat.videos_found": "analyzed videos",
    "chat.web_pages": "Analyzed Web Pages",
    "chat.sources": "Sources",
    "chat.search_context": "Search Context",
    "chat.no_sources": "No additional sources found",
    "chat.visit_source": "Visit Source",
    "chat.close_sidebar": "Close Sources",
    "chat.view_all_sources": "View all sources",
    "chat.view_more_results": "View more results",
    "chat.google_search_hint": "Try searching Google with these terms:",
    "chat.menu_highlights": "Menu Highlights",
    "chat.duration": "Duration",
    "chat.difficulty": "Difficulty",
    "chat.date": "Date",
    "chat.open_maps": "Open in Google Maps",
    "chat.view_menu": "View Menu and Location",
    "chat.how_to_get_there": "How do I get there?",
    "chat.search_for": "Search for",
    "chat.edited": "edited",
    "chat.edit": "Edit",
    "chat.save": "Save",
    "chat.cancel": "Cancel",
 
    // Auth
    "auth.sign_in": "Sign in",
    "auth.sign_in_title": "Sign in to continue",
    "auth.sign_in_with_google": "Continue with Google",
    "auth.sign_out": "Sign out",
    "auth.explorer": "Explorer",
    "auth.welcome": "Welcome",
    "auth.terms_notice": "By signing in, you agree to our terms of service and privacy policy.",
    "auth.profile": "Profile",
    "auth.loading": "Loading...",

    // Profile
    "profile.title": "My Profile",
    "profile.edit_title": "Edit Profile",
    "profile.display_name": "Name",
    "profile.email": "Email",
    "profile.bio": "Bio",
    "profile.bio_placeholder": "Tell us about yourself...",
    "profile.no_bio": "No bio",
    "profile.save": "Save",
    "profile.saved": "Profile saved successfully",
    "profile.save_error": "Error saving profile",
    "profile.avatar_hint": "Google avatar",


    // Thinking Statuses (Internal)
    "chat.thinking.analyzing": "Analyzing query...",
    "chat.thinking.searching": "Searching for the best answer...",
    "chat.thinking.structuring": "Structuring information...",
    "chat.thinking.refining": "Refining details...",
    "chat.thinking.finalizing": "Finalizing reasoning...",
    "chat.thinking.prefix": "Thinking...",
    "chat.thinking.completed": "Thought for",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.legal": "Legal Documentation",
    "footer.terms": "Terms",
    "footer.privacy": "Privacy",
    "footer.cookies": "Cookies",
    "footer.description": "PR\\AI is your intelligent assistant to discover the best of Puerto Rico. From hidden beaches to the finest local gastronomy.",
    "footer.home": "Home",
    "footer.chat": "Chat",
    "footer.explore": "Explore",

    // Cookies
    "cookies.title": "Cookie Settings",
    "cookies.desc": "We use cookies to enhance your browsing experience and analyze our traffic. You decide what to allow.",
    "cookies.accept": "Accept",
    "cookies.decline": "Decline",
    "cookies.view": "View Cookies Policy",

    // Legal - Privacy
    "privacy.title": "Privacy PR\\AI.",
    "privacy.subtitle": "How we protect your data and ensure a safe exploration of our Island.",
    "privacy.s1.title": "Data Collection",
    "privacy.s1.desc": "We collect information you provide directly when interacting with our chat, such as travel preferences, culinary inquiries, and user feedback.",
    "privacy.s2.title": "Use of Information",
    "privacy.s2.desc": "We use your information to personalize your experience, improve our AI models, and provide more accurate recommendations about places and events in Puerto Rico. We will never sell your personal information to third parties.",
    "privacy.s3.title": "Data Security",
    "privacy.s3.desc": "We implement state-of-the-art security measures to protect your data. However, no method of internet transmission is 100% secure. We strive to protect your personal information.",
    "privacy.cookies.title": "Cookies",
    "privacy.cookies.desc": "We use cookies to remember your preferences and browsing sessions. You can configure your browser to reject all cookies, but this could affect some features of the service.",

    // Legal - Terms
    "terms.title": "Terms of Service.",
    "terms.subtitle": "Our rules to ensure a transparent and safe experience when exploring Puerto Rico with PR\\AI.",
    "terms.s1.title": "Acceptance of Terms",
    "terms.s1.desc": "By accessing and using PR\\AI, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our service.",
    "terms.s2.title": "Service Description",
    "terms.s2.desc": "PR\\AI is an AI-powered platform designed to provide information, recommendations, and personalized assistance about Puerto Rico. The service is provided 'as is' and is subject to change at any time.",
    "terms.s3.title": "Acceptable Use",
    "terms.s3.desc": "You agree not to use PR\\AI for any illegal or prohibited purpose. You shall not interfere with the normal operation of the service or attempt to access unauthorized data.",
    "terms.note.title": "Important Note",
    "terms.note.desc": "PR\\AI uses advanced language models. While we strive for accuracy, the information provided may contain errors. Always verify critical information with official sources directly.",

    // Legal - Cookies
    "legal.cookies.title": "Cookie Policy.",
    "legal.cookies.subtitle": "Total transparency on how we use technology to improve your exploration of Puerto Rico.",
    "legal.cookies.s1.title": "What are Cookies?",
    "legal.cookies.s1.desc": "Cookies are small text files stored on your device when you visit a website. They allow us to recognize your browser and remember certain information about your visit.",
    "legal.cookies.s2.title": "Types of Cookies",
    "legal.cookies.s2.desc": "We use essential cookies for the chat to function, and analytics cookies to understand which parts of PR\\AI are most popular. We never track your activity outside our platform.",
    "legal.cookies.note.title": "Total Control",
    "legal.cookies.note.desc": "You are in control. You can delete or block cookies at any time from your browser settings. Please note that this may limit your interactive experience.",

    // 404
    "404.title": "You got lost in El Morro.",
    "404.desc": "It seems this route doesn't exist. Don't worry, even the best explorers need a guide every now and then.",
    "404.back": "Back Home",
    "404.ask": "Ask PR\\AI",
    "404.alt": "Garita in Old San Juan at sunset",

    "locale.es": "es",
    "locale.en": "en",

    // Model Info Toast
    "info.title": "AI Model Transparency",
    "info.description": "At PR\\AI, we believe in open access. We utilize OpenRouter's free model router, an intelligent system that dynamically selects from the industry's most advanced models (such as Arcee's Trinity, Stepfun's Step 3.5, or NVIDIA's Nemotron) to provide you with vision, analysis, and complex reasoning capabilities free of charge.",
    "info.limitation": "Note: Subject to availability and variable latency based on OpenRouter's global demand.",

    // About Page
    "about.title": "About PR\\AI",
    "about.subtitle": "A Boricua experiment merging cutting-edge technology with the heart of our island.",
    "about.description.p1": "PR\\AI was born with the purpose of democratizing access to information about Puerto Rico using the most advanced language models in the world. This project seeks to make every corner of our island —from hidden beaches to the gastronomic treasures of the interior— easy to discover for locals and visitors alike.",
    "about.description.p2": "We believe in transparency and the power of the community, which is why PR\\AI is an open-source project. We invite developers, tech enthusiasts, and the entire Boricua community to collaborate on its development. As a constantly evolving experiment, we test the capabilities of multimodal models in local contexts, always with the goal of improving the accuracy and usefulness of every response.",
    "about.description.p3": "It is important to remember that PR\\AI is a tool in its experimental stage. While we strive for technical excellence, responses are generated by artificial intelligence and may contain inaccuracies. We invite you to explore with curiosity and be part of this technological journey made 'from the island, for the world'.",

    // API Errors
    "error.api.title": "API Error",
    "error.api.400": "Invalid request. Check parameters and try again.",
    "error.api.401": "Invalid credentials. Check your API key.",
    "error.api.402": "Insufficient credits.",
    "error.api.403": "Your content was flagged by moderation.",
    "error.api.408": "Request timed out. Try again.",
    "error.api.429": "Too many requests. Wait a moment and try again.",
    "error.api.500": "Internal server error. Try again in a few minutes.",
    "error.api.502": "Selected model is unavailable. Try another.",
    "error.api.503": "No providers available. Try again later.",
    "error.api.unknown": "An unexpected error occurred. Please try again.",
    "error.api.close": "Close"
  }
}

/** @Logic.I18n.Live */
export const I18nLive = Layer.effect(
  I18n,
  Effect.gen(function* () {
    // Standard Next.js cookie: NEXT_LOCALE
    const getLocaleFromCookie = () => {
      if (typeof document === "undefined") return "es"
      const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
      return (match?.[1] as Locale) || "es"
    }

    const initialLocale = getLocaleFromCookie()
    const currentLocale = yield* Ref.make<Locale>(initialLocale)

    return {
      t: (_key: string) => "", // Placeholder, used by Provider.translate
      locale: Ref.get(currentLocale),
      setLocale: (locale: Locale) =>
        Effect.gen(function* () {
          yield* Ref.set(currentLocale, locale)
          if (typeof document !== "undefined") {
            // Set cookie for Next.js i18n compatibility
            document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
          }
        })
    }
  })
)

/** @Logic.I18n.Translate */
export const translate = (locale: Locale, key: string): string => {
  return dictionary[locale]?.[key] || key
}
