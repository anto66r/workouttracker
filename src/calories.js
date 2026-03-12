const CARDIO_TYPES = ['rowing', 'running', 'elliptical', 'bike']
const TIMED_TYPES = ['plank']

// User profile — used to scale calorie estimates
const BODY_WEIGHT_KG = 75
const HEIGHT_CM = 189

// kcal per metre per kg of body weight (derived from standard MET values)
const KCAL_PER_M_PER_KG = {
  rowing:    0.057 / 70,   // ~0.000814
  running:   0.080 / 70,   // ~0.001143  (≈1 kcal/kg/km)
  elliptical: 0.065 / 70,  // ~0.000929
  bike:      0.040 / 70,   // ~0.000571
}

// MET values for timed bodyweight exercises
const MET = {
  plank: 3.8,
  crunches: 3.8,
}

// Returns { kcal, estimated } or null if no data to work with
export function estimateCalories(workout) {
  const { type, details } = workout

  if (CARDIO_TYPES.includes(type)) {
    if (details.calories) return { kcal: Number(details.calories), estimated: false }
    if (details.distance) {
      const rate = (KCAL_PER_M_PER_KG[type] ?? KCAL_PER_M_PER_KG.running) * BODY_WEIGHT_KG
      return { kcal: Math.round(Number(details.distance) * rate), estimated: true }
    }
    return null
  }

  const series = details.series ?? []
  if (!series.length) return null

  if (TIMED_TYPES.includes(type)) {
    // MET-based: kcal = MET × weight_kg × hours
    const met = MET[type] ?? 3.8
    let total = 0
    for (const s of series) {
      const secs = Number(s.time) || 0
      total += met * BODY_WEIGHT_KG * (secs / 3600)
    }
    return { kcal: Math.round(total), estimated: true }
  }

  if (type === 'crunches') {
    // ~0.35 kcal per rep at 70 kg, scaled to body weight
    let total = 0
    for (const s of series) {
      const reps = Number(s.reps) || 0
      total += reps * 0.35 * (BODY_WEIGHT_KG / 70)
    }
    return { kcal: Math.round(total), estimated: true }
  }

  // Strength: base per-set cost scaled by body weight
  let total = 0
  for (const s of series) {
    const reps = Number(s.reps) || 0
    const weight = Number(s.weight) || 0
    const base = 6 + reps * 0.2 + weight * reps * 0.005
    total += base * (BODY_WEIGHT_KG / 70)
  }

  return { kcal: Math.round(total), estimated: true }
}

// Returns { [YYYY-MM-DD]: { kcal, actualKcal, estimatedKcal } }
export function dailyCalories(workouts) {
  const map = {}

  for (const w of workouts) {
    const day = w.datetime.slice(0, 10)
    const result = estimateCalories(w)
    if (!result) continue

    if (!map[day]) map[day] = { kcal: 0, actualKcal: 0, estimatedKcal: 0 }
    map[day].kcal += result.kcal
    if (result.estimated) map[day].estimatedKcal += result.kcal
    else map[day].actualKcal += result.kcal
  }

  return map
}
