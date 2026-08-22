import { useState, useEffect, useMemo } from 'react'
import { useI18n } from './i18n'
import ExerciseArt from './ExerciseArt'

const CARDIO_TYPES = ['bike', 'elliptical', 'rowing', 'running']
const STRENGTH_TYPES = [
  'abs', 'back', 'biceps', 'calves', 'chest',
  'forearms', 'glutes', 'hamstrings', 'lateralraise', 'lats', 'quads', 'seatedrow', 'shoulders', 'triceps',
]
const BODYWEIGHT_TYPES = ['crunches', 'zancadas', 'squats']
const TIMED_TYPES = ['plank']

const ALL_TYPES = [...CARDIO_TYPES, ...STRENGTH_TYPES, ...BODYWEIGHT_TYPES, ...TIMED_TYPES]

const emptyCardio = { distance: '', calories: '' }
const emptySeries = { reps: '', weight: '' }
const emptyBodyweightSeries = { reps: '' }
const emptyTimedSeries = { time: '' }

function nowLocalDatetime() {
  const d = new Date()
  d.setSeconds(0, 0)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

export default function WorkoutForm({ onAdd, workouts, copySource }) {
  const { t, locale } = useI18n()
  const [type, setType] = useState(ALL_TYPES[0])
  const [datetime, setDatetime] = useState(nowLocalDatetime)
  const [cardio, setCardio] = useState(emptyCardio)
  const [series, setSeries] = useState([{ ...emptySeries }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  const isCardio = CARDIO_TYPES.includes(type)
  const isBodyweight = BODYWEIGHT_TYPES.includes(type)
  const isTimed = TIMED_TYPES.includes(type)

  // Option labels are translated, so the alphabetical order is locale-dependent
  const groups = useMemo(() => {
    const sorted = (types) =>
      [...types].sort((a, b) => t(`exercise.${a}`).localeCompare(t(`exercise.${b}`), locale))
    return [
      { label: t('group.cardio'), types: sorted(CARDIO_TYPES) },
      { label: t('group.strength'), types: sorted(STRENGTH_TYPES) },
      { label: t('group.bodyweight'), types: sorted(BODYWEIGHT_TYPES) },
      { label: t('group.timed'), types: sorted(TIMED_TYPES) },
    ]
  }, [t, locale])

  function emptySeriesForType(ex) {
    if (TIMED_TYPES.includes(ex)) return { ...emptyTimedSeries }
    if (BODYWEIGHT_TYPES.includes(ex)) return { ...emptyBodyweightSeries }
    return { ...emptySeries }
  }

  function applyLastWorkout(ex, wks) {
    const last = wks.find(w => w.type === ex)
    if (!last) {
      setCardio(emptyCardio)
      setSeries([emptySeriesForType(ex)])
      return
    }
    const d = last.details
    if (CARDIO_TYPES.includes(ex)) {
      setCardio({ distance: d.distance ?? '', calories: d.calories ?? '' })
    } else {
      const allSets = d.series ?? []
      const lastSet = allSets[allSets.length - 1]
      if (!lastSet) {
        setSeries([emptySeriesForType(ex)])
      } else if (TIMED_TYPES.includes(ex)) {
        setSeries([{ time: lastSet.time ?? '' }])
      } else if (BODYWEIGHT_TYPES.includes(ex)) {
        setSeries([{ reps: lastSet.reps ?? '' }])
      } else {
        setSeries([{ reps: lastSet.reps ?? '', weight: lastSet.weight ?? '' }])
      }
    }
  }

  useEffect(() => {
    if (!initialized && workouts.length > 0) {
      applyLastWorkout(type, workouts)
      setInitialized(true)
    }
  }, [workouts, initialized])

  // Copy a specific workout from history into the form, full set list included.
  useEffect(() => {
    if (!copySource) return
    const ex = copySource.type
    setType(ex)
    const d = copySource.details
    if (CARDIO_TYPES.includes(ex)) {
      setCardio({ distance: d.distance ?? '', calories: d.calories ?? '' })
    } else {
      const allSets = d.series ?? []
      if (!allSets.length) {
        setSeries([emptySeriesForType(ex)])
      } else if (TIMED_TYPES.includes(ex)) {
        setSeries(allSets.map(s => ({ time: s.time ?? '' })))
      } else if (BODYWEIGHT_TYPES.includes(ex)) {
        setSeries(allSets.map(s => ({ reps: s.reps ?? '' })))
      } else {
        setSeries(allSets.map(s => ({ reps: s.reps ?? '', weight: s.weight ?? '' })))
      }
    }
    setDatetime(nowLocalDatetime())
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [copySource])

  const handleTypeChange = (e) => {
    const ex = e.target.value
    setType(ex)
    applyLastWorkout(ex, workouts)
    setDatetime(nowLocalDatetime())
    setError(null)
  }

  const addSeries = () => {
    setDatetime(nowLocalDatetime())
    setSeries(s => [...s, { ...s[s.length - 1] }])
  }
  const removeSeries = (i) => {
    setDatetime(nowLocalDatetime())
    setSeries(s => s.filter((_, idx) => idx !== i))
  }
  const updateSeries = (i, field, val) =>
    setSeries(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    let details
    if (isCardio) {
      if (!cardio.distance && !cardio.calories) {
        setError('error.cardioEmpty')
        return
      }
      details = { distance: cardio.distance || null, calories: cardio.calories || null }
    } else if (isTimed) {
      const valid = series.filter(s => s.time)
      if (!valid.length) {
        setError('error.timeEmpty')
        return
      }
      details = { series: valid.map((s, i) => ({ set: i + 1, time: s.time || null })) }
    } else if (isBodyweight) {
      const valid = series.filter(s => s.reps)
      if (!valid.length) {
        setError('error.repsEmpty')
        return
      }
      details = { series: valid.map((s, i) => ({ set: i + 1, reps: s.reps || null })) }
    } else {
      const valid = series.filter(s => s.reps || s.weight)
      if (!valid.length) {
        setError('error.repsWeightEmpty')
        return
      }
      details = { series: valid.map((s, i) => ({ set: i + 1, reps: s.reps || null, weight: s.weight || null })) }
    }

    setSaving(true)
    try {
      await onAdd({ type, datetime, details })
      setCardio(emptyCardio)
      setSeries([emptySeriesForType(type)])
      setDatetime(nowLocalDatetime())
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h2>{t('form.title')}</h2>
      {error && <div className="error">{t(error)}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row row-2">
          <div>
            <label>{t('form.type')}</label>
            <select value={type} onChange={handleTypeChange}>
              {groups.map(g => (
                <optgroup key={g.label} label={g.label}>
                  {g.types.map(ex => (
                    <option key={ex} value={ex}>{t(`exercise.${ex}`)}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label>{t('form.datetime')}</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
            />
          </div>
        </div>

        {isCardio ? (
          <div className="row row-2">
            <div>
              <label>{t('form.distance')}</label>
              <input
                type="number"
                min="0"
                placeholder={t('form.placeholderDistance')}
                value={cardio.distance}
                onChange={e => setCardio(c => ({ ...c, distance: e.target.value }))}
              />
            </div>
            <div>
              <label>{t('form.calories')}</label>
              <input
                type="number"
                min="0"
                placeholder={t('form.placeholderCalories')}
                value={cardio.calories}
                onChange={e => setCardio(c => ({ ...c, calories: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="exercise-detail">
              <ExerciseArt type={type} className="exercise-art" />
              <div className="exercise-detail-text">
                <div className="exercise-detail-name">{t(`exercise.${type}`)}</div>
                <div className="exercise-detail-hint">{t(`hint.${type}`)}</div>
              </div>
            </div>
            <div className="series-header">
              <span>{t('form.sets')}</span>
              <div className="series-header-inputs">
                {isTimed ? (
                  <span>{t('form.duration')}</span>
                ) : (
                  <>
                    <span>{t('form.reps')}</span>
                    {!isBodyweight && <span>{t('form.weight')}</span>}
                  </>
                )}
              </div>
            </div>
            {series.map((s, i) => (
              <div className="series-row" key={i}>
                <div className="set-num">
                  <div className="set-num-badge">{i + 1}</div>
                </div>
                <div className="series-inputs">
                  {isTimed ? (
                    <input
                      type="number"
                      min="0"
                      placeholder={t('form.duration')}
                      value={s.time}
                      onChange={e => updateSeries(i, 'time', e.target.value)}
                    />
                  ) : (
                    <>
                      <input
                        type="number"
                        min="0"
                        placeholder={t('form.reps')}
                        value={s.reps}
                        onChange={e => updateSeries(i, 'reps', e.target.value)}
                      />
                      {!isBodyweight && (
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder={t('form.weight')}
                          value={s.weight}
                          onChange={e => updateSeries(i, 'weight', e.target.value)}
                        />
                      )}
                    </>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeSeries(i)}
                  disabled={series.length === 1}
                  title={t('form.removeSet')}
                  aria-label={t('form.removeSet')}
                >×</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addSeries}>{t('form.addSet')}</button>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? t('form.saving') : t('form.submit')}
        </button>
      </form>
    </div>
  )
}
