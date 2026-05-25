import { useState } from 'react'
import s from './usage_history.module.css'
import { useAuth } from '../../../contexts/AuthContext'

export default function UsageHistory({ usages = [] }) {
  const {isAdmin} = useAuth()
  if (!isAdmin) return null
  
  const [historyOpen, setHistoryOpen] = useState(false)
  const [openId, setOpenId] = useState(null)

  function toggleUsage(id) {
    setOpenId(prev => prev === id ? null : id)
  }

  function formatDuration(duration) {

    if (!duration) return 'Active'

    const parts = duration.split(':')

    const seconds = parseFloat(parts[2] || 0)

    return `${seconds.toFixed(1)}s`
  }

  function formatDate(date) {

    if (!date) return '—'

    return new Date(date).toLocaleString()
  }

  return (
    <div className={s.wrapper}>

      {/* MAIN ACCORDION */}
      <button
        className={s.mainAccordion}
        onClick={() => setHistoryOpen(prev => !prev)}
      >

        <div>
          <p className={s.mainTitle}>
            Usage History
          </p>

          <p className={s.mainSubtitle}>
            {usages.length} sessions recorded
          </p>
        </div>

        <span className={`${s.chevron} ${historyOpen ? s.chevronOpen : ''}`}>
          ▼
        </span>

      </button>

      {/* HISTORY CONTENT */}
      <div className={`${s.historyContent} ${historyOpen ? s.historyContentOpen : ''}`}>

        <div className={s.list}>

          {usages.map((usage) => {

            const isOpen = openId === usage.id
            const active = !usage.closed_at

            return (
              <div
                key={usage.id}
                className={`${s.card} ${active ? s.cardActive : ''}`}
              >

                <button
                  className={s.summary}
                  onClick={() => toggleUsage(usage.id)}
                >

                  <div className={s.summaryLeft}>

                    <div className={`${s.statusDot} ${active ? s.statusOpen : s.statusClosed}`} />

                    <div>
                      <p className={s.sessionTitle}>
                        Session #{usage.id}
                      </p>

                      <p className={s.sessionDate}>
                        {formatDate(usage.opened_at)}
                      </p>
                    </div>

                  </div>

                  <div className={s.summaryRight}>

                    <span className={s.price}>
                      {parseFloat(usage.total_price || 0).toFixed(2)}€
                    </span>

                    <span className={`${s.chevron} ${isOpen ? s.chevronOpen : ''}`}>
                      ▼
                    </span>

                  </div>

                </button>

                <div className={`${s.content} ${isOpen ? s.contentOpen : ''}`}>

                  <div className={s.metricsGrid}>

                    <Metric
                      label="Duration"
                      value={formatDuration(usage.duration_seconds)}
                    />

                    <Metric
                      label="Liters"
                      value={`${parseFloat(usage.liters_served || 0).toFixed(2)}L`}
                    />

                    <Metric
                      label="Revenue"
                      value={`${parseFloat(usage.total_price || 0).toFixed(2)}€`}
                    />

                    <Metric
                      label="Opened"
                      value={formatDate(usage.opened_at)}
                    />

                    <Metric
                      label="Closed"
                      value={formatDate(usage.closed_at)}
                    />

                    <Metric
                      label="Status"
                      value={active ? 'Pouring' : 'Completed'}
                    />

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className={s.metric}>
      <span className={s.metricLabel}>{label}</span>
      <span className={s.metricValue}>{value}</span>
    </div>
  )
}