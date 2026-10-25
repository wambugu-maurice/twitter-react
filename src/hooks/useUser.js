import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "../../firebase"
import {  doc, getDoc } from "firebase/firestore"


function useUser() {
    const[loggedUser,setLoggedUser]=useState(null)
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(true)


    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,async(user)=>{
            if(!user) return null
            const userRef = doc(db,"users",user.uid)
            const snap = await getDoc(userRef)
            setLoggedUser( snap.exists() ? snap.data() : null)
            setLoading(false)
        },(err)=>{
            setError(err.message)
        })
        return ()=> unsub()
    },[])
  return { loggedUser,error,loading}
}

export default useUser