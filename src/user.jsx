import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const COOKIE_NAME = 'user'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export const USERS = [
  { id: 'antonio', name: 'Antonio', bodyWeightKg: 75, heightCm: 189 },
  { id: 'mara', name: 'Mara', bodyWeightKg: 60, heightCm: 165 },
]

const DEFAULT_USER = 'antonio'

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function detectUser() {
  const stored = readCookie(COOKIE_NAME)
  if (stored && USERS.some(u => u.id === stored)) return stored
  return DEFAULT_USER
}

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(detectUser)

  const setUserId = useCallback((next) => {
    if (!USERS.some(u => u.id === next)) return
    writeCookie(COOKIE_NAME, next)
    setUserIdState(next)
  }, [])

  const value = useMemo(() => {
    const profile = USERS.find(u => u.id === userId) ?? USERS[0]
    return { userId, setUserId, profile, users: USERS }
  }, [userId, setUserId])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>')
  return ctx
}
