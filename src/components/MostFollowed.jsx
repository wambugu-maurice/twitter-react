import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"


function MostFollowed() {
    const[mostFollowed,setMostFollowed]=useState(null)
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState("")

   useEffect(()=>{
    setError("")
    setLoading(true)

    const q = query(collection(db,"users"),orderBy("followersCount","desc"),limit(1));
    const unsub = onSnapshot(q,(snap)=>{
        if(!snap.empty){
            const results =  snap.docs[0]
            setMostFollowed({ id: results.id,...results.data()})}
        setLoading(false)
    },(err)=>{
        setError(err.message)
        setLoading(false)
    })

    return ()=> unsub()
   },[])
  return (
    <div className="stats">
        <div className="statsCard">
            { loading && <p>Fetching...</p>}
            { error && <p  className="errMsg">{error}</p>}
            <h2><strong>Most followed creator</strong></h2>
            { mostFollowed && (
                <div>
                    <p>@{mostFollowed.name}</p>
                     <p>Followers {mostFollowed.followersCount}</p>
                </div>
            )
              
            }
        </div>
    </div>
  )
}

export default MostFollowed