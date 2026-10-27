import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import {  db } from "../../firebase"
import { doc,  onSnapshot } from "firebase/firestore"


function useUser() {
    const[loggedUser,setLoggedUser]=useState(null)
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(true)

  
    
    const auth = getAuth();

    useEffect(() => {
        let unSubUser;
        const unSubAuth = onAuthStateChanged(auth, (user) => {
            if (unSubUser) unSubUser();

            if (!user) {
            setLoggedUser(null);
            setLoading(false);
            return;
            }

            unSubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
            setLoggedUser(snap.exists() ? { id: snap.id, ...snap.data() } : null);
            setLoading(false);
            });
        },(err)=>{
            setError(err.message)
        });

    return () => {
        unSubAuth();
        if (unSubUser) unSubUser();
    };
    }, [auth]);


   
  return { loggedUser,error,loading}
}

export default useUser
