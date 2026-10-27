import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Search from "../components/Search"

function Layout() {
  return (
    <div className="layoutDiv">
      <Sidebar />
      <main className="mainDiv">
        <div className="outlet">
            <Outlet />
          </div> 
        <div className="search">
            <Search />
          </div>
      </main>
    </div>
  )
}

export default Layout