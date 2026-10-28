import { useEffect, useState } from "react"
import { auth, db } from "../../firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import TweetCard from "./TweetCard"
import useTweetActions from "../hooks/useTweetActions"


function RepostsFeed({isLoading}) {
  const[tweets,setTweets]=useState([])
    const[error,setError]=useState("")
    const userId = auth.currentUser.uid
    const { handleFollow, handleLikeTweet, handleRepost } = useTweetActions()

    useEffect(()=>{
      const retweetRef = query(collection(db,"tweets"),where("retweetedBy","array-contains",userId))
      const unsub = onSnapshot(retweetRef,(snap)=>{
        const retweets = snap.docs.map((doc)=>({id: doc.id,...doc.data()}))
        setTweets(retweets)
      },(err)=>{
        setError(err.message)
      })

      return ()=> unsub()
    },[userId])
  return (
      <TweetCard tweets={tweets} isLoading={isLoading} error={error} handleFollow={handleFollow} handleLikeTweet={handleLikeTweet} handleRepost={handleRepost}/>

  )
}

export default RepostsFeed