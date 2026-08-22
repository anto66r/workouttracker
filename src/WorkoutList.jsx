import { useI18n } from './i18n'
import ExerciseArt from './ExerciseArt'

const CARDIO_TYPES = ['rowing', 'running', 'elliptical', 'bike']
const TIMED_TYPES = ['plank']

function dayLabel(iso, locale, t) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return t('list.today')
  if (d.toDateString() === yesterday.toDateString()) return t('list.yesterday')
  return d.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' })
}

function timeLabel(iso, locale) {
  return new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

function summarize(type, details, locale) {
  if (CARDIO_TYPES.includes(type)) {
    const parts = []
    if (details.distance) parts.push(`${Number(details.distance).toLocaleString(locale)} m`)
    if (details.calories) parts.push(`${details.calories} kcal`)
    return parts.join(' · ') || '—'
  }
  const series = details.series ?? []
  if (!series.length) return '—'
  if (TIMED_TYPES.includes(type)) {
    const uniqueTimes = [...new Set(series.map(s => s.time).filter(Boolean))]
    if (uniqueTimes.length <= 1) {
      return `${series.length} × ${uniqueTimes[0] ?? '—'}s`
    }
    return series.map(s => `${s.time ?? '—'}s`).join(', ')
  }
  const uniqueWeights = [...new Set(series.map(s => s.weight).filter(Boolean))]
  const uniqueReps = [...new Set(series.map(s => s.reps).filter(Boolean))]
  if (uniqueWeights.length <= 1 && uniqueReps.length <= 1) {
    const r = uniqueReps[0] ?? '—'
    const w = uniqueWeights[0]
    return w ? `${series.length} × ${r} @ ${w} kg` : `${series.length} × ${r}`
  }
  return series.map(s => {
    const r = s.reps ?? '—'
    return s.weight ? `${r}@${s.weight}kg` : r
  }).join(', ')
}

export default function WorkoutList({ workouts, onDelete }) {
  const { t, locale } = useI18n()

  if (!workouts.length) {
    return (
      <div className="history">
        <div className="empty">{t('list.empty')}</div>
      </div>
    )
  }

  const grouped = workouts.reduce((acc, w) => {
    const key = new Date(w.datetime).toDateString()
    ;(acc[key] ??= []).push(w)
    return acc
  }, {})

  return (
    <div className="history">
      {Object.entries(grouped).map(([day, items]) => (
        <div className="day-group" key={day}>
          <div className="day-header">{dayLabel(items[0].datetime, locale, t)}</div>
          {items.map(w => (
            <div className="workout-row" key={w.id}>
              <span className="wt-time">{timeLabel(w.datetime, locale)}</span>
              <ExerciseArt type={w.type} className="wt-art" />
              <span className="wt-type">{t(`exercise.${w.type}`)}</span>
              <span className="wt-summary">{summarize(w.type, w.details, locale)}</span>
              <button
                className="btn-del"
                onClick={() => onDelete(w.id)}
                title={t('list.delete')}
                aria-label={t('list.delete')}
              >×</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
