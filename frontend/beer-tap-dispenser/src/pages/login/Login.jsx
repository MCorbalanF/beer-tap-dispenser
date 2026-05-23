import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../../components/Logo'
import s from './Login.module.css'

export default function LoginPage() {
  const { login, loading, error, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAdmin) navigate(from, { replace: true })
  }, [isAdmin, from, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <div className={s.page}>
      {/* Background decorative text */}
      <div className={s.bgText} aria-hidden="true">TAPFEST</div>

      <div className={s.card}>
        <div className={s.logoWrap}>
          <Logo size={48} showText={true} />
        </div>

        <div className={s.header}>
          <h1 className={s.title}>Admin Access</h1>
          <p className={s.subtitle}>Festival staff only — enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className={s.form} noValidate>
          <div className={s.field}>
            <label className={s.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={s.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@festival.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={s.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className={s.errorMsg} role="alert">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className={s.submitBtn}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <span className={s.spinner} aria-hidden="true" />
            ) : (
              'Enter festival control'
            )}
          </button>
        </form>

        <div className={s.footer}>
          <Link to="/dispensers" className={s.backLink}>
            ← Back to dispensers
          </Link>
        </div>
      </div>
    </div>
  )
}
