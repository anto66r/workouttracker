const CARDIO_TYPES = ['rowing', 'running', 'elliptical', 'bike']
const TIMED_TYPES = ['plank']

function dayLabel(iso) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
}

function timeLabel(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function summarize(type, details) {
  if (CARDIO_TYPES.includes(type)) {
    const parts = []
    if (details.distance) parts.push(`${Number(details.distance).toLocaleString()} m`)
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
  if (!workouts.length) {
    return (
      <div className="history">
        <div className="empty">No workouts logged yet.</div>
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
          <div className="day-header">{dayLabel(items[0].datetime)}</div>
          {items.map(w => (
            <div className="workout-row" key={w.id}>
              <span className="wt-time">{timeLabel(w.datetime)}</span>
              <span className="wt-type">{w.type}</span>
              <span className="wt-summary">{summarize(w.type, w.details)}</span>
              <button className="btn-del" onClick={() => onDelete(w.id)} title="Delete">×</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
