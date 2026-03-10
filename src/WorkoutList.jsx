const CARDIO_TYPES = ['rowing', 'running', 'elliptical', 'bike']

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function CardioDetails({ details }) {
  const parts = []
  if (details.distance) parts.push(`${Number(details.distance).toLocaleString()} m`)
  if (details.calories) parts.push(`${details.calories} kcal`)
  return <div className="workout-details">{parts.join(' · ') || '—'}</div>
}

function StrengthDetails({ details }) {
  const series = details.series ?? []
  return (
    <div className="workout-details">
      {series.map((s, i) => {
        const parts = []
        if (s.reps) parts.push(`${s.reps} reps`)
        if (s.weight) parts.push(`${s.weight} kg`)
        return (
          <span key={i} className="tag">Set {s.set}: {parts.join(' @ ') || '—'}</span>
        )
      })}
      {series.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
          {series.length} set{series.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default function WorkoutList({ workouts, onDelete }) {
  if (!workouts.length) {
    return (
      <div>
        <h2>History</h2>
        <div className="empty">No workouts logged yet.</div>
      </div>
    )
  }

  return (
    <div>
      <h2>History</h2>
      {workouts.map(w => (
        <div className="workout-item" key={w.id}>
          <div className="workout-info">
            <div className="workout-type">{w.type}</div>
            <div className="workout-time">{formatDate(w.datetime)}</div>
            {CARDIO_TYPES.includes(w.type)
              ? <CardioDetails details={w.details} />
              : <StrengthDetails details={w.details} />}
          </div>
          <button
            className="btn-danger"
            onClick={() => onDelete(w.id)}
            title="Delete"
          >×</button>
        </div>
      ))}
    </div>
  )
}
