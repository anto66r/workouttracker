import { useState } from 'react'

const CARDIO_TYPES = ['rowing', 'running', 'elliptical', 'bike']
const STRENGTH_TYPES = [
  'biceps', 'triceps', 'chest', 'back', 'shoulders',
  'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'forearms',
]

const ALL_TYPES = [...CARDIO_TYPES, ...STRENGTH_TYPES]

const emptyCardio = { distance: '', calories: '' }
const emptySeries = { reps: '', weight: '' }

function nowLocalDatetime() {
  const d = new Date()
  d.setSeconds(0, 0)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

export default function WorkoutForm({ onAdd }) {
  const [type, setType] = useState(ALL_TYPES[0])
  const [datetime, setDatetime] = useState(nowLocalDatetime)
  const [cardio, setCardio] = useState(emptyCardio)
  const [series, setSeries] = useState([{ ...emptySeries }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isCardio = CARDIO_TYPES.includes(type)

  const handleTypeChange = (e) => {
    setType(e.target.value)
    setCardio(emptyCardio)
    setSeries([{ ...emptySeries }])
    setError(null)
  }

  const addSeries = () => setSeries(s => [...s, { ...emptySeries }])
  const removeSeries = (i) => setSeries(s => s.filter((_, idx) => idx !== i))
  const updateSeries = (i, field, val) =>
    setSeries(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    let details
    if (isCardio) {
      if (!cardio.distance && !cardio.calories) {
        setError('Enter at least distance or calories.')
        return
      }
      details = { distance: cardio.distance || null, calories: cardio.calories || null }
    } else {
      const valid = series.filter(s => s.reps || s.weight)
      if (!valid.length) {
        setError('Add at least one set with reps or weight.')
        return
      }
      details = { series: valid.map((s, i) => ({ set: i + 1, reps: s.reps || null, weight: s.weight || null })) }
    }

    setSaving(true)
    try {
      await onAdd({ type, datetime, details })
      setCardio(emptyCardio)
      setSeries([{ ...emptySeries }])
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h2>Log Workout</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Type</label>
        <select value={type} onChange={handleTypeChange}>
          <optgroup label="Cardio">
            {CARDIO_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </optgroup>
          <optgroup label="Strength">
            {STRENGTH_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </optgroup>
        </select>

        <label style={{ marginTop: '0.75rem' }}>Date & Time</label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={e => setDatetime(e.target.value)}
        />

        {isCardio ? (
          <div className="row row-2" style={{ marginTop: '0.75rem' }}>
            <div>
              <label>Distance (m)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2000"
                value={cardio.distance}
                onChange={e => setCardio(c => ({ ...c, distance: e.target.value }))}
              />
            </div>
            <div>
              <label>Calories</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 300"
                value={cardio.calories}
                onChange={e => setCardio(c => ({ ...c, calories: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '0.75rem' }}>
            <label>Sets</label>
            {series.map((s, i) => (
              <div className="series-row" key={i}>
                <div>
                  <label style={{ marginTop: 0 }}>Set {i + 1}</label>
                  <input disabled value={i + 1} style={{ textAlign: 'center', color: '#64748b' }} />
                </div>
                <div>
                  <label style={{ marginTop: 0 }}>Reps</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="12"
                    value={s.reps}
                    onChange={e => updateSeries(i, 'reps', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ marginTop: 0 }}>Weight (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="20"
                    value={s.weight}
                    onChange={e => updateSeries(i, 'weight', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeSeries(i)}
                  disabled={series.length === 1}
                  title="Remove set"
                >×</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addSeries}>+ Add Set</button>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Log Workout'}
        </button>
      </form>
    </div>
  )
}
