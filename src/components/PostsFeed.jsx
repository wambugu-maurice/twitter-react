import { useEffect, useState } from "react"
import {  db } from "../../firebase"
import {  collection, onSnapshot, query,  where } from "firebase/firestore"
import TweetCard from "./TweetCard"
import useUser from "../hooks/useUser"
import useTweetActions from "../hooks/useTweetActions"

function PostsFeed({isLoading,error}) {
  const[tweets,setTweets]=useState([])
  const{loggedUser}=useUser()
  const userId = loggedUser?.id
  const { handleFollow, handleLikeTweet, handleRepost } = useTweetActions()


useEffect(()=>{
  if (!userId) return;
  const tweetsRef = query(collection(db,"tweets"),where("userId","==",userId))
  const snap = onSnapshot(tweetsRef,(doc)=>{
    const tweets = doc.docs.map((tweet)=>({
      id: tweet.id,...tweet.data()
      }))
    setTweets(tweets)
  })
  return snap
},[userId])

  return (
      <TweetCard tweets={tweets} isLoading={isLoading} error={error} handleFollow={handleFollow} handleLikeTweet={handleLikeTweet} handleRepost={handleRepost}/>
  )
}

export default PostsFeed