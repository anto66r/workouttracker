const CARDIO_TYPES = ['rowing', 'running', 'elliptical', 'bike']

const KCAL_PER_M = {
  rowing: 0.15,     // 2000m ≈ 300 kcal
  running: 0.08,    // 10km ≈ 800 kcal
  elliptical: 0.065,
  bike: 0.04,
}

// Returns { kcal, estimated } or null if no data to work with
export function estimateCalories(workout) {
  const { type, details } = workout

  if (CARDIO_TYPES.includes(type)) {
    if (details.calories) return { kcal: Number(details.calories), estimated: false }
    if (details.distance) {
      const rate = KCAL_PER_M[type] ?? 0.08
      return { kcal: Math.round(Number(details.distance) * rate), estimated: true }
    }
    return null
  }

  // Strength: estimate from sets × reps × weight
  const series = details.series ?? []
  if (!series.length) return null

  let total = 0
  for (const s of series) {
    const reps = Number(s.reps) || 0
    const weight = Number(s.weight) || 0
    // ~6 kcal base per set + rep factor + weight factor
    total += 6 + reps * 0.2 + weight * reps * 0.005
  }

  return { kcal: Math.round(total), estimated: true }
}

// Returns { [YYYY-MM-DD]: { kcal, hasEstimated, hasActual } }
export function dailyCalories(workouts) {
  const map = {}

  for (const w of workouts) {
    const day = w.datetime.slice(0, 10)
    const result = estimateCalories(w)
    if (!result) continue

    if (!map[day]) map[day] = { kcal: 0, hasEstimated: false, hasActual: false }
    map[day].kcal += result.kcal
    if (result.estimated) map[day].hasEstimated = true
    else map[day].hasActual = true
  }

  return map
}
