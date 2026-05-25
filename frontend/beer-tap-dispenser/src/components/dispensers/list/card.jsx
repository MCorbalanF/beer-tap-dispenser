import { useAuth } from '../../../contexts/AuthContext';
import s from '../../../pages/dispensers/DispensersList.module.css'

function StatusDot({ isOpen }) {
  return (
    <span className={`${s.dot} ${isOpen ? s.dotOpen : s.dotClosed}`} aria-hidden="true" />
  );
};

function DispenserCard({ dispenser, onClick }) {
  const { name, drink, is_open, flow_volume } = dispenser
  const { isAdmin } = useAuth()
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

      {/* Flow rate */
        isAdmin &&
        <div className={s.flowRow}>
          <span className={s.flowLabel}>Flow rate</span>
          <span className={s.flowValue}>{flow_volume} L/s</span>
        </div>
      }
      {/* CTA */}
      <div className={s.cta}>
        {is_open ? 'See live →' : 'Open tap →'}
      </div>
    </button>
  );
};

export default DispenserCard