/** @Const.Command.Figures */

/** @Const.Command.TeardropAsterisk */
export const TEARDROP_ASTERISK = '✻'

/** @Const.Command.SpinnerVerbs */
export const SPINNER_VERBS: string[] = [
  'Explorando',
  'Descubriendo',
  'Trazando',
  'Rastreando',
  'Mapeando',
  'Curado',
  'Recorriendo',
  'Navegando',
  'Consultando',
  'Ensamblando',
  'Organizando',
  'Recopilando',
  'Buscando',
  'Ordenando',
  'Tejiendo',
  'Calibrando',
  'Destilando',
  'Componiendo',
  'Ajustando',
  'Elaborando',
  'Orientando',
  'Sintonizando',
  'Verificando',
  'Preparando',
  'Analizando',
  'Procesando',
  'Localizando',
  'Catalogando',
  'Filtrando',
  'Configurando',
]


/** @Const.Command.CompletionVerbs */
export const COMPLETION_VERBS: string[] = [
  'Explorado',
  'Descubierto',
  'Trazado',
  'Rastreado',
  'Mapeado',
  'Ensamblado',
  'Filtrado',
  'Configurado',
]

/** @Const.Command.PipelineIcons */
export const PIPE_PENDING = '□'   // squareSmall
export const PIPE_RUNNING = '▪'   // squareSmallFilled
export const PIPE_DONE = '✓'   // tick
export const PIPE_ERROR = '✗'   // cross

/** @Const.Command.SpinnerFrames */
export const SPINNER_FRAMES = ['·', '✢', '✳', '✶', '✻', '✽']

/** @Const.Command.PromptChar */
export const PROMPT_CHAR = '❯'

/** @Const.Command.CategoryIcons */
export const COMMAND_CATEGORY_ICONS: Record<string, string> = {
  persona: '✦',   // U+2726 BLACK FOUR POINTED STAR
  mode: '✶',   // U+2736 SIX POINTED BLACK STAR
  content: '✺',   // U+273A TEN POINTED ASTERISK
  history: '✵',   // U+2735 EIGHT POINTED PINWHEEL STAR
  system: '✸',   // U+2738 HEAVY EIGHT POINTED RECTILINEAR BLACK STAR
  navigation: '›',   // U+203A SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
}

/** @Const.Command.FeedbackSymbols */
export const FB_OK = '✓'   // U+2713 CHECK MARK
export const FB_ERR = '✗'   // U+2717 BALLOT X
export const FB_INFO = '·'   // U+00B7 MIDDLE DOT
export const FB_NAV = '›'   // U+203A directional arrow

/** @Const.Command.SpinnerTiming */
export const SPINNER_FRAME_INTERVAL_MS = 120
export const SWEEP_DURATION_MS = 1500
export const SWEEP_COUNT = 2
export const TOTAL_ANIMATION_MS = SWEEP_DURATION_MS * SWEEP_COUNT

/** @Const.Command.SettledGrey */
export const SETTLED_GREY = 'rgb(153, 153, 153)'

/** @Logic.Command.HueToRgb */
export function hueToRgb(hue: number): string {
  const h = ((hue % 360) + 360) % 360
  const s = 0.7
  const l = 0.6
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`
}
