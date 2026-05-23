import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tapfest_token'))
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('tapfest_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authApi.login(email, password)
      localStorage.setItem('tapfest_token', data.token)
      localStorage.setItem('tapfest_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.data?.detail || 'Credenciales incorrectas')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('tapfest_token')
    localStorage.removeItem('tapfest_user')
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin = Boolean(token && user?.role === 'admin')

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
