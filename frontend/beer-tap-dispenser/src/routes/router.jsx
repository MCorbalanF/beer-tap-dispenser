import {
  createBrowserRouter,
} from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

import LandingPage from "../pages/landing/landing"
import AdminPage from "../pages/admin/admin"
import DispenserPage from "../pages/dispenser/dispenser"
import NotFoundPage from "../pages/not-found/not-found"




 const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "admin",
        element: <AdminPage />
      },
      {
        path: "dispenser",
        element: <DispenserPage />
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
])

export default router