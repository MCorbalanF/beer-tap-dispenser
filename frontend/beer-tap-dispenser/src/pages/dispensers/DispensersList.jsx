import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dispensersApi } from '../../api/api'
import s from './DispensersList.module.css'
import DispenserCard from '../../components/dispensers/list/card'


export default function DispensersList() {
  const [dispensers, setDispensers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const marquee = ['HOPS', '♪', 'DROPS', '♫', 'COLD BEER', '★', 'LIVE POUR', '♪', 'TAPFEST', '♫']
  const repeatedMarquee = [...marquee, ...marquee, ...marquee, ...marquee] // Repetir para efecto continuo
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
          <h1 className={s.heroTitle}>BEER TAP LINEUP</h1>
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
      <div className={s.footer}>


        <div className={s.festivalStrip} aria-hidden="true">
          {repeatedMarquee.map(
            (w, i) => <span key={i}>{w}</span>
          )}
        </div>
      </div>
    </div>
  )
}
