import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import s from './Admin.module.css'

import  DispensersTab  from '../../components/admin/tabs/dispenser_tab'
import  DrinksTab  from '../../components/admin/tabs/drinks_tab'


// ── Main Admin page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('dispensers')

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Festival Control</h1>
          <p className={s.pageSub}>Logged in as {user?.email}</p>
        </div>
        <button className={s.logoutBtn} onClick={logout}>Log out</button>
      </div>

      {/* Tabs */}
      <div className={s.tabs}>
        <button
          className={`${s.tab} ${tab === 'dispensers' ? s.tabActive : ''}`}
          onClick={() => setTab('dispensers')}
        >
          🍺 Dispensers
        </button>
        <button
          className={`${s.tab} ${tab === 'drinks' ? s.tabActive : ''}`}
          onClick={() => setTab('drinks')}
        >
          🥤 Drinks
        </button>
      </div>

      {/* Tab content */}
      {tab === 'dispensers' && <DispensersTab />}
      {tab === 'drinks' && <DrinksTab />}
    </div>
  )
}
