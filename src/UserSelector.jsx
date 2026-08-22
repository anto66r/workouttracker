import { useUser } from './user'
import { useI18n } from './i18n'

export default function UserSelector() {
  const { userId, setUserId, users } = useUser()
  const { t } = useI18n()

  return (
    <div className="user-switch" role="group" aria-label={t('app.user')}>
      {users.map(u => (
        <button
          key={u.id}
          type="button"
          className={`user-btn${userId === u.id ? ' active' : ''}`}
          aria-pressed={userId === u.id}
          onClick={() => setUserId(u.id)}
        >
          {u.name}
        </button>
      ))}
    </div>
  )
}
