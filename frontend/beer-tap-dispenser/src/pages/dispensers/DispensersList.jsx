import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dispensersApi } from '../../api/api'
import s from './DispensersList.module.css'

function StatusDot({ isOpen }) {
  return (
    <span className={`${s.dot} ${isOpen ? s.dotOpen : s.dotClosed}`} aria-hidden="true" />
  )
}

function DispenserCard({ dispenser, onClick }) {
  const { name, drink, is_open, flow_volume } = dispenser

  return (
    <button className={`${s.card} ${is_open ? s.cardOpen : ''}`} onClick={onClick}>
      {/* Glow effect when open */}
      {is_open && <div className={s.cardGlow} />}

      {/* Card number / ID */}
      <span className={s.cardId}>#{String(dispenser.id).padStart(2, '0')}</span>

      {/* Status */}
      <div className={s.statusRow}>
        <StatusDot isOpen={is_open} />
        <span className={`${s.statusText} ${is_open ? s.statusOpen : s.statusClosed}`}>
          {is_open ? 'POURING' : 'IDLE'}
        </span>
      </div>

      {/* Beer tap SVG */}
      <div className={s.tapIcon}>
        <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="60">
          <rect x="14" y="0" width="12" height="28" rx="6" fill={is_open ? '#f59e0b' : '#3a3528'} />
          <rect x="10" y="16" width="20" height="7" rx="3.5"
            fill={is_open ? '#d97706' : '#2a2418'} />
          <circle cx="30" cy="19.5" r="6" fill={is_open ? '#fbbf24' : '#2a2418'} />
          <circle cx="30" cy="19.5" r="3" fill={is_open ? '#f59e0b' : '#1a1610'} />
          {is_open && (
            <>
              <rect x="16" y="28" width="8" height="30" rx="4" fill="#fbbf24" opacity="0.85" />
              <circle cx="18" cy="36" r="1.5" fill="white" opacity="0.5" />
              <circle cx="22" cy="43" r="1" fill="white" opacity="0.4" />
              <circle cx="19" cy="50" r="0.8" fill="white" opacity="0.3" />
            </>
          )}
          {!is_open && (
            <rect x="17" y="28" width="6" height="6" rx="3" fill="#2a2418" opacity="0.6" />
          )}
        </svg>
      </div>

      {/* Dispenser name */}
      <h2 className={s.cardName}>{name}</h2>

      {/* Drink info */}
      {drink ? (
        <div className={s.drinkInfo}>
          <span className={s.drinkName}>{drink.name}</span>
          <span className={s.drinkPrice}>{drink.price_per_liter}€/L</span>
        </div>
      ) : (
        <div className={s.drinkInfo}>
          <span className={s.drinkName} style={{ opacity: 0.4 }}>No drink assigned</span>
        </div>
      )}

      {/* Flow rate */}
      <div className={s.flowRow}>
        <span className={s.flowLabel}>Flow rate</span>
        <span className={s.flowValue}>{flow_volume} L/s</span>
      </div>

      {/* CTA */}
      <div className={s.cta}>
        {is_open ? 'See live →' : 'Open tap →'}
      </div>
    </button>
  )
}

export default function DispensersList() {
  const [dispensers, setDispensers] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    dispensersApi.list()
      .then(data => setDispensers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const openCount = dispensers.filter(d => d.is_open).length

  return (
    <div className={s.page}>
      {/* Festival hero banner */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <p className={s.heroEyebrow}>FESTIVAL SEASON 2025</p>
          <h1 className={s.heroTitle}>BEER TAP<br />LINEUP</h1>
          <div className={s.heroMeta}>
            <span className={s.heroBadge}>
              <span className={s.liveIndicator} />
              {openCount > 0 ? `${openCount} active` : 'All idle'}
            </span>
            <span className={s.heroSeparator}>·</span>
            <span className={s.heroCount}>{dispensers.length} dispensers</span>
          </div>
        </div>

        {/* Decorative stage lights */}
        <div className={s.stageLights} aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={s.stageLight} style={{ '--i': i }} />
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={s.loadingWrap}>
          <div className={s.loadingBeer}>
            <div className={s.loadingFill} />
          </div>
          <p className={s.loadingText}>Loading dispensers…</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className={s.errorWrap}>
          <p className={s.errorText}>⚠ Could not connect to the backend</p>
          <p className={s.errorSub}>{error}</p>
          <button className={s.retryBtn} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Dispensers horizontal lineup */}
      {!loading && !error && dispensers.length === 0 && (
        <div className={s.emptyWrap}>
          <p className={s.emptyText}>No dispensers configured yet.</p>
          <p className={s.emptySub}>Ask the admin to add some!</p>
        </div>
      )}

      {!loading && !error && dispensers.length > 0 && (
        <div className={s.lineupSection}>
          <div className={s.lineupTrack}>
            {dispensers.map((d, idx) => (
              <DispenserCard
                key={d.id}
                dispenser={d}
                onClick={() => navigate(`/dispensers/${d.id}`)}
                style={{ '--card-index': idx }}
              />
            ))}
            {/* Spacer at end */}
            <div style={{ minWidth: '32px', flexShrink: 0 }} />
          </div>

          {/* Scroll hint */}
          {dispensers.length > 3 && (
            <p className={s.scrollHint}>← Scroll to see all dispensers →</p>
          )}
        </div>
      )}

      {/* Festival footer strip */}
      <div className={s.festivalStrip} aria-hidden="true">
        {['HOPS', '♪', 'DROPS', '♫', 'COLD BEER', '★', 'LIVE POUR', '♪', 'TAPFEST', '♫'].map(
          (w, i) => <span key={i}>{w}</span>
        )}
      </div>
    </div>
  )
}
