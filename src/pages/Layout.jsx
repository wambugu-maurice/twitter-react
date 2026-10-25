import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function Layout() {
  return (
    <div className="layoutDiv">
      <Sidebar />
      <main className="mainDiv">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout