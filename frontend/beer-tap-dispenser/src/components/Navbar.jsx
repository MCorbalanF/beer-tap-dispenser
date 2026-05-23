import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logoLink}>
          <Logo size={36} showText={true} />
        </Link>

        <div className={styles.links}>
          <Link
            to="/dispensers"
            className={`${styles.link} ${isActive('/dispensers') ? styles.linkActive : ''}`}
          >
            Dispensers
          </Link>

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`${styles.link} ${isActive('/admin') ? styles.linkActive : ''}`}
              >
                Admin
              </Link>
              <button className={styles.logoutBtn} onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`${styles.link} ${isActive('/login') ? styles.linkActive : ''}`}
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
