import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { dispensersApi } from '../../api/api'
import s from './Dispenser.module.css'

// ── Animated Beer Glass ──────────────────────────────────────────────────────

function BeerGlass({ isOpen, fillLevel = 0 }) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${s.glass} ${isOpen ? s.glassFilling : ''}`}
      aria-hidden="true"
    >
      {/* Glass outline */}
      <path
        d="M20 20 L10 170 L110 170 L100 20 Z"
        stroke="rgba(245,158,11,0.4)"
        strokeWidth="3"
        fill="rgba(255,255,255,0.02)"
      />

      {/* Beer fill (dynamic height) */}
      <clipPath id="glassClip">
        <path d="M20 20 L10 170 L110 170 L100 20 Z" />
      </clipPath>
      <g clipPath="url(#glassClip)">
        <rect
          x="0"
          y={170 - fillLevel * 150}
          width="120"
          height={fillLevel * 150}
          fill="url(#beerGradient)"
          style={{ transition: 'y 0.3s ease, height 0.3s ease' }}
        />
        {/* Foam */}
        {fillLevel > 0.1 && (
          <ellipse
            cx="60"
            cy={170 - fillLevel * 150}
            rx="48"
            ry="10"
            fill="rgba(255,255,255,0.85)"
          />
        )}
        {/* Bubbles */}
        {isOpen && (
          <>
            <circle cx="40" cy={150} r="2.5" fill="rgba(255,255,255,0.3)" className={s.bubble} style={{ '--delay': '0s' }} />
            <circle cx="60" cy={130} r="2" fill="rgba(255,255,255,0.25)" className={s.bubble} style={{ '--delay': '0.4s' }} />
            <circle cx="75" cy={145} r="3" fill="rgba(255,255,255,0.2)" className={s.bubble} style={{ '--delay': '0.8s' }} />
            <circle cx="50" cy={115} r="1.5" fill="rgba(255,255,255,0.2)" className={s.bubble} style={{ '--delay': '1.2s' }} />
          </>
        )}
      </g>

      {/* Stream from top when open */}
      {isOpen && (
        <rect
          x="55"
          y="0"
          width="10"
          height="25"
          rx="5"
          fill="#fbbf24"
          opacity="0.7"
          className={s.stream}
        />
      )}

      {/* Gradients */}
      <defs>
        <linearGradient id="beerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Price Counter ─────────────────────────────────────────────────────────────

function LivePrice({ isOpen, openedAt, pricePerLiter, flowVolume, closedPrice }) {
  const [price, setPrice] = useState(closedPrice || 0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !openedAt || !pricePerLiter || !flowVolume) {
      if (closedPrice !== undefined) setPrice(closedPrice)
      return
    }

    function tick() {
      const elapsed = (Date.now() - new Date(openedAt).getTime()) / 1000
      const liters = elapsed * parseFloat(flowVolume)
      setPrice(liters * parseFloat(pricePerLiter))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isOpen, openedAt, pricePerLiter, flowVolume, closedPrice])

  return (
    <div className={`${s.priceDisplay} ${isOpen ? s.priceActive : ''}`}>
      <span className={s.priceCurrency}>€</span>
      <span className={s.priceValue}>{price.toFixed(2)}</span>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DispenserPage() {
  const { id } = useParams()

  const [dispenser, setDispenser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toggling, setToggling] = useState(false)
  const [fillLevel, setFillLevel] = useState(0)
  const [lastUsage, setLastUsage] = useState(null)
  const [showClosed, setShowClosed] = useState(false)
  const [closedPrice, setClosedPrice] = useState(null)
  const fillRef = useRef(null)

  const fetchDispenser = useCallback(() => {
    return dispensersApi.get(id)
      .then(data => {
        setDispenser(data)
        setError(null)
        return data
      })
      .catch(err => {
        setError(err.message)
      })
  }, [id])

  useEffect(() => {
    setLoading(true)
    fetchDispenser().finally(() => setLoading(false))
  }, [fetchDispenser])

  // Animate fill level while open
  useEffect(() => {
    if (!dispenser?.is_open) {
      setFillLevel(0)
      return
    }
    setFillLevel(0.05)
    fillRef.current = setInterval(() => {
      setFillLevel(prev => Math.min(prev + 0.005, 0.95))
    }, 200)
    return () => clearInterval(fillRef.current)
  }, [dispenser?.is_open])

  async function handleToggle() {
    if (toggling || !dispenser) return
    setToggling(true)
    try {
      const result = await dispensersApi.toggle(id)

      if (result.status === 'closed' && result.usage) {
        setLastUsage(result.usage)
        setClosedPrice(result.usage.total_price ? parseFloat(result.usage.total_price) : 0)
        setShowClosed(true)
        setTimeout(() => setShowClosed(false), 4000)
      } else {
        setLastUsage(null)
        setClosedPrice(null)
        setShowClosed(false)
      }

      await fetchDispenser()
    } catch (err) {
      setError(err.message)
    } finally {
      setToggling(false)
    }
  }

  // ── Derived data (safe defaults for future backend fields)
  // TODO: expand with more fields from backend as they become available
  const drink = dispenser?.drink || null
  const isOpen = dispenser?.is_open || false
  const flowVolume = dispenser?.flow_volume || 0.5
  const openedAt = dispenser?.current_usage_opened_at || null  // ready for future backend field
  const totalUsages = dispenser?.total_usages || null           // ready for future backend field
  const totalLiters = dispenser?.total_liters || null           // ready for future backend field
  const totalRevenue = dispenser?.total_revenue || null           // ready for future backend field

  if (loading) {
    return (
      <div className={s.loadingPage}>
        <div className={s.loadingSpinner} />
        <p className={s.loadingText}>Loading dispenser…</p>
      </div>
    )
  }

  if (error && !dispenser) {
    return (
      <div className={s.errorPage}>
        <p className={s.errorText}>⚠ {error}</p>
        <button className={s.retryBtn} onClick={() => fetchDispenser()}>Retry</button>
        <Link to="/dispensers" className={s.backLink}>← All dispensers</Link>
      </div>
    )
  }

  return (
    <div className={s.page}>
      {/* Back link */}
      <div className={s.topBar}>
        <Link to="/dispensers" className={s.backLink}>← All dispensers</Link>
        <span className={s.dispenserId}>#{String(dispenser?.id || 0).padStart(2, '0')}</span>
      </div>

      <div className={s.layout}>
        {/* Left: glass + controls */}
        <div className={s.leftCol}>
          {/* Status badge */}
          <div className={`${s.statusBadge} ${isOpen ? s.statusBadgeOpen : s.statusBadgeClosed}`}>
            <span className={`${s.statusDot} ${isOpen ? s.dotOpen : ''}`} />
            {isOpen ? 'POURING NOW' : 'IDLE'}
          </div>

          {/* Beer glass animation */}
          <div className={s.glassWrap}>
            <BeerGlass isOpen={isOpen} fillLevel={fillLevel} />
          </div>

          {/* Toggle button */}
          <button
            className={`${s.tapBtn} ${isOpen ? s.tapBtnOpen : s.tapBtnClosed} ${toggling ? s.tapBtnLoading : ''}`}
            onClick={handleToggle}
            disabled={toggling || !drink}
            title={!drink ? 'No drink assigned to this dispenser' : undefined}
          >
            {toggling ? (
              <span className={s.btnSpinner} />
            ) : isOpen ? (
              <>
                <span className={s.btnIcon}>⏹</span>
                <span className={s.btnLabel}>CLOSE TAP</span>
              </>
            ) : (
              <>
                <span className={s.btnIcon}>▶</span>
                <span className={s.btnLabel}>OPEN TAP</span>
              </>
            )}
          </button>

          {!drink && (
            <p className={s.noDrinkWarning}>No drink assigned — ask the admin.</p>
          )}
        </div>

        {/* Right: info panel */}
        <div className={s.rightCol}>
          {/* Dispenser name */}
          <div className={s.nameBlock}>
            <h1 className={s.dispenserName}>{dispenser?.name || 'Dispenser'}</h1>
            {drink && <p className={s.drinkLabel}>{drink.name}</p>}
          </div>

          {/* Live price counter */}
          <div className={s.priceBlock}>
            <p className={s.priceLabel}>
              {isOpen ? 'Running total' : showClosed ? 'Session total' : 'Last total'}
            </p>
            <LivePrice
              isOpen={isOpen}
              openedAt={openedAt}
              pricePerLiter={drink?.price_per_liter}
              flowVolume={flowVolume}
              closedPrice={closedPrice ?? lastUsage?.total_price ?? 0}
            />
            {isOpen && (
              <p className={s.priceNote}>Live calculation • updates in real time</p>
            )}
          </div>

          {/* Closed celebration */}
          {showClosed && lastUsage && (
            <div className={s.closedCard}>
              <p className={s.closedTitle}>Session closed 🍺</p>
              <div className={s.closedStats}>
                <div className={s.closedStat}>
                  <span className={s.closedStatValue}>
                    {lastUsage.duration_seconds}s
                  </span>
                  <span className={s.closedStatLabel}>Duration</span>
                </div>
                <div className={s.closedStat}>
                  <span className={s.closedStatValue}>
                    {lastUsage.liters_served}L
                  </span>
                  <span className={s.closedStatLabel}>Served</span>
                </div>
                <div className={s.closedStat}>
                  <span className={s.closedStatValue}>
                    €{parseFloat(lastUsage.total_price || 0)}
                  </span>
                  <span className={s.closedStatLabel}>Total</span>
                </div>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className={s.infoGrid}>
            <InfoRow label="Drink" value={drink?.name || '—'} />
            <InfoRow label="Price / liter" value={drink ? `€${drink.price_per_liter}` : '—'} />
            <InfoRow label="Flow rate" value={`${flowVolume} L/s`} />
            {drink?.description && (
              <InfoRow label="Description" value={drink.description} />
            )}

            {/* Future metrics — placeholders ready */}
            <div className={s.infoSeparator} />
            <InfoRow
              label="Total sessions"
              value={totalUsages != null ? totalUsages : '—'}
              muted={totalUsages == null}
            />
            <InfoRow
              label="Total liters served"
              value={totalLiters != null ? `${parseFloat(totalLiters).toFixed(1)}L` : '—'}
              muted={totalLiters == null}
            />
            <InfoRow
              label="Total revenue"
              value={totalRevenue != null ? `€${parseFloat(totalRevenue).toFixed(2)}` : '—'}
              muted={totalRevenue == null}
            />
          </div>

          {/* Status note */}
          <p className={s.statusNote}>
            Status: <strong className={isOpen ? s.textOpen : s.textClosed}>
              {isOpen ? 'Open — currently serving' : 'Closed — ready to serve'}
            </strong>
          </p>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, muted = false }) {
  return (
    <div className={s.infoRow}>
      <span className={s.infoLabel}>{label}</span>
      <span className={`${s.infoValue} ${muted ? s.infoValueMuted : ''}`}>{value}</span>
    </div>
  )
}
