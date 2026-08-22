import { useState, useEffect, useCallback } from 'react'
import WorkoutForm from './WorkoutForm'
import WorkoutList from './WorkoutList'
import StatsTab from './StatsTab'
import LanguageSelector from './LanguageSelector'
import UserSelector from './UserSelector'
import { useI18n } from './i18n'
import { useUser } from './user'

const API = '/api/workouts.php'

export default function App() {
  const { t } = useI18n()
  const { userId } = useUser()
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('history')

  const fetchWorkouts = useCallback(async () => {
    try {
      const res = await fetch(`${API}?user=${userId}`)
      if (!res.ok) throw new Error('error.load')
      setWorkouts(await res.json())
    } catch (e) {
      setError(e.message)
    }
  }, [userId])

  useEffect(() => {
    setWorkouts([])
    fetchWorkouts()
  }, [fetchWorkouts])

  const addWorkout = async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user: userId }),
    })
    if (!res.ok) throw new Error('error.save')
    await fetchWorkouts()
  }

  const deleteWorkout = async (id) => {
    await fetch(`${API}?id=${id}&user=${userId}`, { method: 'DELETE' })
    setWorkouts(w => w.filter(x => x.id !== id))
  }

  return (
    <div>
      <header className="app-header">
        <h1>{t('app.title')}</h1>
      </header>
      <div className="header-controls">
        <UserSelector />
        <LanguageSelector />
      </div>
      {error && <div className="error">{t(error)}</div>}
      <WorkoutForm onAdd={addWorkout} workouts={workouts} />
      <div className="tabs">
        <button
          className={`tab-btn${tab === 'history' ? ' active' : ''}`}
          onClick={() => setTab('history')}
        >
          {t('tab.history')}
        </button>
        <button
          className={`tab-btn${tab === 'stats' ? ' active' : ''}`}
          onClick={() => setTab('stats')}
        >
          {t('tab.stats')}
        </button>
      </div>
      {tab === 'history'
        ? <WorkoutList workouts={workouts} onDelete={deleteWorkout} />
        : <StatsTab workouts={workouts} />
      }
    </div>
  )
}
