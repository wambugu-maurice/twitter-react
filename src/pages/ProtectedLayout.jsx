import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Loader from "../components/Loader"

function ProtectedLayout() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const auth = getAuth()
  useEffect(() => {
    const unsub = onAuthStateChanged(auth,(user) => {
        setUser(!!user)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [auth])

  if (loading) return <Loader />
  if (error) return <p className="errMsg">{error}</p>
  if (!user) return <Navigate to="/login" replace />

  return <Outlet context={user} /> };



export default ProtectedLayout