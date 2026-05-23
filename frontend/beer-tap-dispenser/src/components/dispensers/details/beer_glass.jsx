import s from '../../../pages/dispenser/Dispenser.module.css'

// ── Animated Beer Glass ──────────────────────────────────────────────────────

export default function BeerGlass({ isOpen, fillLevel = 0 }) {
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
                d="M10 20 L20 170 L100 170 L110 20 Z"
                stroke="rgba(245,158,11,0.4)"
                strokeWidth="3"
                fill="rgba(255,255,255,0.02)"
            />

            {/* Beer fill (dynamic height) */}
            <clipPath id="glassClip">
                <path d="M10 20 L20 170 L100 170 L110 20 Z" />
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
    );
};