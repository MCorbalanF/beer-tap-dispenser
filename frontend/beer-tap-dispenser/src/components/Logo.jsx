export default function Logo({ size = 40, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      {/* Beer tap icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow */}
        <ellipse cx="24" cy="24" rx="20" ry="20" fill="rgba(245,158,11,0.08)" />

        {/* Tap body */}
        <rect x="19" y="6" width="10" height="20" rx="5" fill="#f59e0b" />

        {/* Tap handle arm */}
        <rect x="17" y="16" width="14" height="5" rx="2.5" fill="#d97706" />

        {/* Handle knob */}
        <circle cx="31" cy="18.5" r="4" fill="#fbbf24" />
        <circle cx="31" cy="18.5" r="2" fill="#f59e0b" />

        {/* Beer stream */}
        <rect x="21" y="26" width="6" height="14" rx="3" fill="#fbbf24" opacity="0.9" />

        {/* Bubbles */}
        <circle cx="22" cy="30" r="1" fill="white" opacity="0.6" />
        <circle cx="25" cy="33" r="0.8" fill="white" opacity="0.5" />
        <circle cx="23" cy="36" r="0.6" fill="white" opacity="0.4" />

        {/* Music note decoration */}
        <text x="5" y="14" fontSize="8" fill="#ff6b35" opacity="0.9">♪</text>
        <text x="36" y="30" fontSize="6" fill="#ff6b35" opacity="0.7">♫</text>
      </svg>

      {showText && (
        <div style={{ lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: size * 0.7,
              letterSpacing: '0.06em',
              color: '#f59e0b',
              display: 'block',
            }}
          >
            TAPFEST
          </span>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: size * 0.22,
              letterSpacing: '0.18em',
              color: '#6b6248',
              textTransform: 'uppercase',
              display: 'block',
              marginTop: '-2px',
            }}
          >
            BEER FESTIVAL
          </span>
        </div>
      )}
    </div>
  )
}
