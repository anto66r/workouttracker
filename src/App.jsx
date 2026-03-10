import { useState, useEffect, useCallback } from 'react'
import WorkoutForm from './WorkoutForm'
import WorkoutList from './WorkoutList'
import StatsTab from './StatsTab'

const API = '/api/workouts.php'

export default function App() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('history')

  const fetchWorkouts = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Failed to load workouts')
      setWorkouts(await res.json())
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { fetchWorkouts() }, [fetchWorkouts])

  const addWorkout = async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to save workout')
    await fetchWorkouts()
  }

  const deleteWorkout = async (id) => {
    await fetch(`${API}?id=${id}`, { method: 'DELETE' })
    setWorkouts(w => w.filter(x => x.id !== id))
  }

  return (
    <div>
      <h1>Workout Tracker</h1>
      {error && <div className="error">{error}</div>}
      <WorkoutForm onAdd={addWorkout} />
      <div className="tabs">
        <button
          className={`tab-btn${tab === 'history' ? ' active' : ''}`}
          onClick={() => setTab('history')}
        >
          History
        </button>
        <button
          className={`tab-btn${tab === 'stats' ? ' active' : ''}`}
          onClick={() => setTab('stats')}
        >
          Stats
        </button>
      </div>
      {tab === 'history'
        ? <WorkoutList workouts={workouts} onDelete={deleteWorkout} />
        : <StatsTab workouts={workouts} />
      }
    </div>
  )
}
