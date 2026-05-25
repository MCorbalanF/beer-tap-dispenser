import { useState, useEffect, useRef } from 'react'
import s from '../../../pages/dispenser/Dispenser.module.css'


// ── Price Counter ─────────────────────────────────────────────────────────────

export default function LivePrice({ isOpen, openedAt, pricePerLiter, flowVolume, closedPrice }) {
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
