import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedLayout from "./pages/ProtectedLayout"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import './App.css'
import Profile from "./components/Profile"
import PostsFeed from "./components/PostsFeed"
import RepostsFeed from "./components/RepostsFeed"
import Explore from "./components/Explore"

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<ProtectedLayout />}>
                <Route  element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="/profile" element={<Profile />}>
                        <Route index element={<PostsFeed />} />
                        <Route path="reposts" element={<RepostsFeed />} />
                    </Route>
                </Route>
            </Route>
            <Route path="signup" element={<Signup />}/>
            <Route path="login" element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App