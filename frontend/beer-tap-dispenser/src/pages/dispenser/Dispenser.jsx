import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { dispensersApi } from '../../api/api'
import s from './Dispenser.module.css'
import BeerGlass from '../../components/dispensers/details/beer_glass'
import LivePrice from '../../components/dispensers/details/live_price'
import UsageHistory from '../../components/dispensers/details/usage_history'
import { useAuth } from '../../contexts/AuthContext'

export default function DispenserPage() {
  const { id } = useParams()
  const { isAdmin } = useAuth()

  const [dispenser, setDispenser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toggling, setToggling] = useState(false)
  const [fillLevel, setFillLevel] = useState(0)
  const [lastUsage, setLastUsage] = useState(null)
  const [showClosed, setShowClosed] = useState(false)
  const [closedPrice, setClosedPrice] = useState(null)
  const fillRef = useRef(null)
  const [showMoreMetrics, setShowMoreMetrics] = useState(false)
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
      setFillLevel(0);
      return
    };
    setFillLevel(0.05);
    fillRef.current = setInterval(() => {
      setFillLevel(prev => Math.min(prev + 0.005, 0.95))
    }, 200);
    return () => clearInterval(fillRef.current);
  }, [dispenser?.is_open]);

  async function handleToggle() {
    if (toggling || !dispenser) return
    setToggling(true);
    try {
      const result = await dispensersApi.toggle(id);

      if (result.status === 'closed' && result.usage) {
        setLastUsage(result.usage)
        setClosedPrice(result.usage.total_price ? parseFloat(result.usage.total_price) : 0)
        setShowClosed(true)
        setTimeout(() => setShowClosed(false), 100000)
      } else {
        setLastUsage(null);
        setClosedPrice(null);
        setShowClosed(false);
      };

      await fetchDispenser();

    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    };

  };

  // ── Derived data (safe defaults for future backend fields)
  // TODO: expand with more fields from backend as they become available
  const drink = dispenser?.drink || null
  const isOpen = dispenser?.is_open || false
  const flowVolume = dispenser?.flow_volume || 0.5
  const openedAt = dispenser?.current_usage_opened_at || null  // ready for future backend field
  const totalUsages = dispenser?.metrics?.total_sessions || null           // ready for future backend field
  const totalLiters = dispenser?.metrics?.total_liters || null           // ready for future backend field
  const totalRevenue = dispenser?.metrics?.total_revenue || null           // ready for future backend field
  const averageLitersPerSessions = dispenser?.metrics?.average_liters_per_session || null           // ready for future backend field
  const averageRevenuePerSessions = dispenser?.metrics?.average_revenue_per_session || null           // ready for future backend field
  const longestSession = dispenser?.metrics?.longest_session || null           // ready for future backend field
  const shortestSession = dispenser?.metrics?.shortest_session || null           // ready for future backend field
  const averagePricePerLiter = dispenser?.metrics?.average_price_per_liter || null           // ready for future backend field

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

          {/* Status note */}
          <p className={s.statusNote}>
            Status: <strong className={isOpen ? s.textOpen : s.textClosed}>
              {isOpen ? 'Open — currently serving' : 'Closed — ready to serve'}
            </strong>
          </p>
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
                    {parseFloat(lastUsage.total_price || 0)}€
                  </span>
                  <span className={s.closedStatLabel}>Total</span>
                </div>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className={s.infoGrid}>
            <InfoRow label="Drink" value={drink?.name || '—'} />
            <InfoRow label="Price / liter" value={drink ? `${drink.price_per_liter}€` : '—'} />
           {isAdmin && (
              <InfoRow label="Flow rate" value={`${flowVolume} L/s`} />
            )}
            {drink?.description && (
              <InfoRow label="Description" value={drink.description} />
            )}

            {/* Future metrics — placeholders ready */
            isAdmin &&<>
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
              value={totalRevenue != null ? `${parseFloat(totalRevenue).toFixed(2)}€` : '—'}
              muted={totalRevenue == null}
            />
            </>}
            {isAdmin && showMoreMetrics && <>
              <InfoRow
                label="Average Liters per session"
                value={averageLitersPerSessions != null ? `${parseFloat(averageLitersPerSessions).toFixed(1)}L` : '—'}
                muted={averageLitersPerSessions == null}
              />
              <InfoRow
                label="Average Revenue per session"
                value={averageRevenuePerSessions != null ? `${parseFloat(averageRevenuePerSessions).toFixed(2)}€` : '—'}
                muted={averageRevenuePerSessions == null}
              />

              <InfoRow
                label="Longest session"
                value={longestSession != null ? `${parseFloat(longestSession).toFixed(1)}s` : '—'}
                muted={longestSession == null}
              />
              <InfoRow
                label="Shortest session"
                value={shortestSession != null ? `${parseFloat(shortestSession).toFixed(1)}s` : '—'}
                muted={shortestSession == null}
              />
              <InfoRow
                label="Average price per liter"
                value={averagePricePerLiter != null ? `${parseFloat(averagePricePerLiter).toFixed(2)}€` : '—'}
                muted={averagePricePerLiter == null}
              />
            </> 
            }

          </div>
            {isAdmin &&
            <div className={s.showMoreWrapper}>
              <button className={s.showMoreBtn} onClick={() => setShowMoreMetrics(!showMoreMetrics)}>
               {!showMoreMetrics ? 'Showing all metrics' : 'Hide metrics'}
              </button>
            </div>}
          <UsageHistory usages={dispenser?.usages || []} />
        </div>
      </div>
    </div>
  );
};


function InfoRow({ label, value, muted = false }) {
  return (
    <div className={s.infoRow}>
      <span className={s.infoLabel}>{label}</span>
      <span className={`${s.infoValue} ${muted ? s.infoValueMuted : ''}`}>{value}</span>
    </div>
  )
}
