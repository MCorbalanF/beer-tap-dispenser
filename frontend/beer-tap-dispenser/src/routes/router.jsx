import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'

import DispensersList from '../pages/dispensers/DispensersList'
import DispenserPage  from '../pages/dispenser/Dispenser'
import LoginPage      from '../pages/login/Login'
import AdminPage      from '../pages/admin/Admin'
import NotFoundPage   from '../pages/not-found/not-found'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Redirect root → dispensers list
      { index: true, element: <Navigate to="/dispensers" replace /> },

      // Public
      { path: 'dispensers',     element: <DispensersList /> },
      { path: 'dispensers/:id', element: <DispenserPage /> },
      { path: 'login',          element: <LoginPage /> },

      // Admin (protected)
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router
