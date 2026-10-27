import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import toast from "react-hot-toast"
import SearchResults from "./SearchResults"

function Search() {
    const[searchQuery,setSearchQuery]=useState("")
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(false)
    const[results,setResults]=useState([])

    useEffect(()=>{
      if(!searchQuery.startsWith("@")){
        setResults([])
        return
      }
      const searchName = searchQuery.slice(1).trim()
      if(!searchName){
        setResults([])
        return
      }
      setLoading(true)
      setError("")

      const timer = setTimeout(async()=>{
        try {
          const q = query(collection(db,"users"),where("name",">=",searchName),
                                                where("name","<=",searchName + '\uf8ff'))
          const snap = await getDocs(q)
          const snapshot = snap.docs.map((doc)=>({id:doc.id,...doc.data()}))
          setResults(snapshot)
          
        } catch (err) {
          setError(err.message)
          toast.error("No results for" + searchQuery)
        }finally{
          setLoading(false)
        }
      },500)
      return ()=> clearTimeout(timer)
    },[searchQuery])




  return (
    <div className="searchBox">
      <input placeholder="type to search" type="search" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
      <SearchResults  results={results}/>
      { error && <p className="errMsg">{error}</p>}
      { loading && <p>searching...</p>}
    </div>
  )
}

export default Search