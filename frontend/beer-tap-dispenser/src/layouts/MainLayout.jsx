import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{
        borderTop: '1px solid rgba(245,158,11,0.08)',
        padding: '20px 32px',
        textAlign: 'center',
        fontFamily: 'DM Mono, monospace',
        fontSize: '11px',
        letterSpacing: '0.1em',
        color: '#3a3528',
      }}>
        TAPFEST © {new Date().getFullYear()} — BEER TAP DISPENSER SYSTEM
      </footer>
    </div>
  )
}
