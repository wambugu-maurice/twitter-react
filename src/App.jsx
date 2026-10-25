import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedLayout from "./pages/ProtectedLayout"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import './App.css'
import Profile from "./components/Profile"

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<ProtectedLayout />}>
                <Route  element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Route>
            <Route path="signup" element={<Signup />}/>
            <Route path="login" element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App