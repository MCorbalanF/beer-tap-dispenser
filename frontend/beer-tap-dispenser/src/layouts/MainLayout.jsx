import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div>
      <nav>Navbar</nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}