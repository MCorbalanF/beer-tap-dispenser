import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
