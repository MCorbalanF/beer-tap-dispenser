import { Link } from 'react-router-dom'
import s from './not-found.module.css'

export default function NotFoundPage() {
  return (
    <div className={s.page}>
      <div className={s.bgText} aria-hidden="true">404</div>
      <div className={s.content}>
        <p className={s.eyebrow}>TAP NOT FOUND</p>
        <h1 className={s.title}>This keg<br />is empty.</h1>
        <p className={s.subtitle}>
          The page you're looking for has been tapped dry.
        </p>
        <Link to="/dispensers" className={s.btn}>
          Back to the bar →
        </Link>
      </div>
    </div>
  )
}
