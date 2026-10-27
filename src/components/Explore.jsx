import { useState } from "react"
import StatsForNerds from "./StatsForNerds"


function Explore({stats}) {
    const[searchTweets,setSearchTweets]=useState([])
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState("")
     

  return (
    <div>
        <StatsForNerds stats={stats} />
    </div>
  )
}

export default Explore