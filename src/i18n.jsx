import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const COOKIE_NAME = 'lang'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export const LANGUAGES = [
  { code: 'en', label: 'English', locale: 'en-GB' },
  { code: 'es', label: 'Español', locale: 'es-ES' },
]

const DEFAULT_LANG = 'en'

const translations = {
  en: {
    'app.title': 'Workout Tracker',
    'app.language': 'Language',

    'tab.history': 'History',
    'tab.stats': 'Stats',

    'error.load': 'Failed to load workouts',
    'error.save': 'Failed to save workout',
    'error.cardioEmpty': 'Enter at least distance or calories.',
    'error.timeEmpty': 'Add at least one set with a duration.',
    'error.repsEmpty': 'Add at least one set with reps.',
    'error.repsWeightEmpty': 'Add at least one set with reps or weight.',

    'form.title': 'Log Workout',
    'form.type': 'Type',
    'form.datetime': 'Date & Time',
    'form.distance': 'Distance (m)',
    'form.calories': 'Calories',
    'form.sets': 'Sets',
    'form.reps': 'Reps',
    'form.weight': 'Weight (kg)',
    'form.duration': 'Duration (s)',
    'form.addSet': '+ Add Set',
    'form.removeSet': 'Remove set',
    'form.submit': 'Log Workout',
    'form.saving': 'Saving…',
    'form.placeholderDistance': 'e.g. 2000',
    'form.placeholderCalories': 'e.g. 300',

    'group.cardio': 'Cardio',
    'group.strength': 'Strength',
    'group.bodyweight': 'Bodyweight',
    'group.timed': 'Timed',

    'list.empty': 'No workouts logged yet.',
    'list.today': 'Today',
    'list.yesterday': 'Yesterday',
    'list.delete': 'Delete',

    'stats.totalWorkouts': 'Total Workouts',
    'stats.kcal14': 'kcal (14 days)',
    'stats.activeDays': 'Active Days',
    'stats.chartTitle': 'Daily Calorie Burn — last 14 days',
    'stats.legendLogged': 'Logged calories',
    'stats.legendCalculated': 'Calculated',
    'stats.tipLogged': '{n} logged',
    'stats.tipEstimated': '{n} est.',

    'exercise.bike': 'Bike',
    'exercise.elliptical': 'Elliptical',
    'exercise.rowing': 'Rowing',
    'exercise.running': 'Running',
    'exercise.abs': 'Abs',
    'exercise.back': 'Back',
    'exercise.biceps': 'Biceps',
    'exercise.calves': 'Calves',
    'exercise.chest': 'Chest',
    'exercise.forearms': 'Forearms',
    'exercise.glutes': 'Glutes',
    'exercise.hamstrings': 'Hamstrings',
    'exercise.lats': 'Lats',
    'exercise.quads': 'Quads',
    'exercise.shoulders': 'Shoulders',
    'exercise.triceps': 'Triceps',
    'exercise.crunches': 'Crunches',
    'exercise.plank': 'Plank',

    'hint.bike': 'Steady spin — keep the cadence high.',
    'hint.elliptical': 'Full stride, push and pull with the handles.',
    'hint.rowing': 'Legs, then back, then arms.',
    'hint.running': 'Land under your hips, relax the shoulders.',
    'hint.abs': 'Curl the ribs down, do not pull the neck.',
    'hint.back': 'Pull with the elbows, squeeze at the top.',
    'hint.biceps': 'Elbows pinned to your sides.',
    'hint.calves': 'Full stretch at the bottom, pause at the top.',
    'hint.chest': 'Shoulder blades back, control the descent.',
    'hint.forearms': 'Slow grip work, full range.',
    'hint.glutes': 'Drive through the heels, lock out the hips.',
    'hint.hamstrings': 'Control the curl, no swinging.',
    'hint.lats': 'Chest to the bar, shoulders down.',
    'hint.quads': 'Extend fully, pause for a beat.',
    'hint.shoulders': 'Press overhead, ribs down.',
    'hint.triceps': 'Elbows still, extend all the way.',
    'hint.crunches': 'Short range, constant tension.',
    'hint.plank': 'Straight line from head to heels.',
  },

  es: {
    'app.title': 'Registro de Entrenamientos',
    'app.language': 'Idioma',

    'tab.history': 'Historial',
    'tab.stats': 'Estadísticas',

    'error.load': 'No se han podido cargar los entrenamientos',
    'error.save': 'No se ha podido guardar el entrenamiento',
    'error.cardioEmpty': 'Introduce al menos la distancia o las calorías.',
    'error.timeEmpty': 'Añade al menos una serie con duración.',
    'error.repsEmpty': 'Añade al menos una serie con repeticiones.',
    'error.repsWeightEmpty': 'Añade al menos una serie con repeticiones o peso.',

    'form.title': 'Registrar entrenamiento',
    'form.type': 'Tipo',
    'form.datetime': 'Fecha y hora',
    'form.distance': 'Distancia (m)',
    'form.calories': 'Calorías',
    'form.sets': 'Series',
    'form.reps': 'Repeticiones',
    'form.weight': 'Peso (kg)',
    'form.duration': 'Duración (s)',
    'form.addSet': '+ Añadir serie',
    'form.removeSet': 'Eliminar serie',
    'form.submit': 'Registrar entrenamiento',
    'form.saving': 'Guardando…',
    'form.placeholderDistance': 'p. ej. 2000',
    'form.placeholderCalories': 'p. ej. 300',

    'group.cardio': 'Cardio',
    'group.strength': 'Fuerza',
    'group.bodyweight': 'Peso corporal',
    'group.timed': 'Por tiempo',

    'list.empty': 'Aún no has registrado ningún entrenamiento.',
    'list.today': 'Hoy',
    'list.yesterday': 'Ayer',
    'list.delete': 'Eliminar',

    'stats.totalWorkouts': 'Entrenamientos totales',
    'stats.kcal14': 'kcal (14 días)',
    'stats.activeDays': 'Días activos',
    'stats.chartTitle': 'Calorías quemadas al día — últimos 14 días',
    'stats.legendLogged': 'Calorías registradas',
    'stats.legendCalculated': 'Calculadas',
    'stats.tipLogged': '{n} registradas',
    'stats.tipEstimated': '{n} est.',

    'exercise.bike': 'Bicicleta',
    'exercise.elliptical': 'Elíptica',
    'exercise.rowing': 'Remo',
    'exercise.running': 'Correr',
    'exercise.abs': 'Abdominales',
    'exercise.back': 'Espalda',
    'exercise.biceps': 'Bíceps',
    'exercise.calves': 'Gemelos',
    'exercise.chest': 'Pecho',
    'exercise.forearms': 'Antebrazos',
    'exercise.glutes': 'Glúteos',
    'exercise.hamstrings': 'Isquiotibiales',
    'exercise.lats': 'Dorsales',
    'exercise.quads': 'Cuádriceps',
    'exercise.shoulders': 'Hombros',
    'exercise.triceps': 'Tríceps',
    'exercise.crunches': 'Encogimientos',
    'exercise.plank': 'Plancha',

    'hint.bike': 'Ritmo constante: mantén una cadencia alta.',
    'hint.elliptical': 'Zancada completa, empuja y tira de las agarraderas.',
    'hint.rowing': 'Primero piernas, luego espalda y por último brazos.',
    'hint.running': 'Pisa bajo la cadera y relaja los hombros.',
    'hint.abs': 'Acerca las costillas a la cadera; no tires del cuello.',
    'hint.back': 'Tira con los codos y aprieta arriba.',
    'hint.biceps': 'Codos pegados al cuerpo.',
    'hint.calves': 'Estira abajo del todo y aguanta arriba.',
    'hint.chest': 'Escápulas atrás y baja con control.',
    'hint.forearms': 'Trabajo de agarre lento y recorrido completo.',
    'hint.glutes': 'Empuja con los talones y bloquea la cadera.',
    'hint.hamstrings': 'Controla el curl, sin impulso.',
    'hint.lats': 'Pecho a la barra y hombros abajo.',
    'hint.quads': 'Extiende del todo y aguanta un instante.',
    'hint.shoulders': 'Empuja por encima de la cabeza, costillas abajo.',
    'hint.triceps': 'Codos quietos, extiende hasta el final.',
    'hint.crunches': 'Recorrido corto y tensión constante.',
    'hint.plank': 'Línea recta de la cabeza a los talones.',
  },
}

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function detectLang() {
  const stored = readCookie(COOKIE_NAME)
  if (stored && translations[stored]) return stored
  const browser = typeof navigator !== 'undefined' ? navigator.language : ''
  if (browser && browser.toLowerCase().startsWith('es')) return 'es'
  return DEFAULT_LANG
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    if (!translations[next]) return
    writeCookie(COOKIE_NAME, next)
    setLangState(next)
  }, [])

  const value = useMemo(() => {
    const dict = translations[lang] ?? translations[DEFAULT_LANG]
    const fallback = translations[DEFAULT_LANG]
    const t = (key, vars) => {
      let str = dict[key] ?? fallback[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v)
      }
      return str
    }
    const locale = LANGUAGES.find(l => l.code === lang)?.locale ?? 'en-GB'
    return { lang, setLang, t, locale, exerciseName: (type) => t(`exercise.${type}`) }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
