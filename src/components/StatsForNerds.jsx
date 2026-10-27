import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"


function StatsForNerds() {
    const[stats,setStats]=useState(null)
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState("")

    useEffect(()=>{
        async function mostLiked() {
            setError("")
            setLoading(true)
            try {
                const q = query(collection(db,"tweets"),orderBy("likes","desc"),limit(1))
                const snap = await getDocs(q)
                if(snap.empty) return null
                const results = snap.docs[0]
                setStats({ id: results.id,...results.data()})
                
            } catch (err) {
                setError(err.message)   
            }finally{
                setLoading(false)
            }
            
        }
        mostLiked()
    },[])
  return (
    <div className="stats">
        <div className="mostLiked">
            { loading && <p>Fetching...</p>}
            { error && <p  className="errMsg">{error}</p>}
            <h2>Most liked tweet</h2>
            { stats && (
                <div>
                    <p>{stats.tweet}</p>
                    <p>likes {stats.likes}</p>
                </div>
            )
              
            }
        </div>
    </div>
  )
}

export default StatsForNerds