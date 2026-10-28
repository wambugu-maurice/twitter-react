import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import {  db } from "../../firebase"
import TweetCard from "./TweetCard"
import PostsFeed from "./PostsFeed"
import useTweetActions from "../hooks/useTweetActions"

function Tweets() {
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { handleFollow, handleLikeTweet, handleRepost } = useTweetActions()

  useEffect(()=>{
    const tweetsRef = query(collection(db, "tweets"), orderBy("postedOn", "desc"))
    const unsub = onSnapshot(tweetsRef, (snap) => {
      setTweets(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setIsLoading(false)
    }, (err) => {
      setError(err.message)
      setIsLoading(false)
    })
    return ()=> unsub()
  },[])
  return (<>
    <TweetCard tweets={tweets} isLoading={isLoading} error={error} handleFollow=        {handleFollow} handleLikeTweet={handleLikeTweet} handleRepost={handleRepost}/>

    <PostsFeed  tweets={tweets} isLoading={isLoading} error={error} handleFollow=        {handleFollow} handleLikeTweet={handleLikeTweet} handleRepost={handleRepost}/>
    </>
  )
}

export default Tweets