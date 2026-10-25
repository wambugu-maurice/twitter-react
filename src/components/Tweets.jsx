import { arrayRemove, arrayUnion, collection, doc, increment, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../../firebase"
import { MdOutlineReply } from "react-icons/md"
import { AiOutlineShareAlt } from "react-icons/ai"
import toast from "react-hot-toast"
import { CiHeart } from "react-icons/ci"
import { FcLike } from "react-icons/fc"
import { BiRepost } from "react-icons/bi"

 

function Tweets() {
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const userId = auth.currentUser.uid

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


  async function handleLikeTweet(tweetId,alreadyLiked) {
    setError("")
    try {
      const tweetRef = doc(db,"tweets",tweetId)
      await updateDoc(tweetRef,{
        likedBy: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
        likes: increment(alreadyLiked ? -1 : 1)
      }) 
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
      
    }
    
  }

  async function handleRepost(tweetId,alreadyReweeted) {
    setError("")
    try {
      const tweetRef = doc(db,"tweets",tweetId);
      await updateDoc(tweetRef,{
        retweetedBy: alreadyReweeted ? arrayRemove(userId):arrayUnion(userId),
        retweets: increment(alreadyReweeted ? -1 : 1)  
      })
      
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
      
    }
    
  }



  return (
    
<div className="tweetsContainer">
  {isLoading && <p className="tweetStatus">Loading tweets...</p>}
  {error && <p className="tweetError">{error}</p>}

  {!isLoading && !error &&
    tweets.map((tweet) => {
      const alreadyLiked = tweet.likedBy?.includes(userId)
      const alreadyReweeted = tweet.retweetedBy?.includes(userId)
      return(
        <article className="tweetCard" key={tweet.id}>
        <div className="tweetAvatar">
          {tweet.name?.charAt(0).toUpperCase()}
        </div>

        <div className="tweetContent">
          <div className="tweetHeader">
            <p className="tweetName">{tweet.name}</p>
            <span className="tweetUsername">
              @{tweet.name?.toLowerCase().replace(/\s+/g, "")}
            </span>
            <span className="tweetDot">·</span>
            <time className="tweetTime">
              {tweet.postedOn
                ? tweet.postedOn.toDate().toLocaleDateString()
                : ""}
            </time>
          </div>

          <p className="tweetText">{tweet.tweet}</p>

          <div className="tweetActions">
            <button type="button" aria-label="Reply">
              <span><MdOutlineReply /></span>
              <span>Reply</span>
            </button>

            <button onClick={()=>handleRepost(tweet.id,alreadyReweeted)}>
             {tweet.retweetedBy?.includes(userId) ? <BiRepost className="rtBtn" /> : <BiRepost />} {tweet.retweets}
            </button>

            <button onClick={()=>handleLikeTweet(tweet.id,alreadyLiked)} >
              {tweet.likedBy?.includes(userId) ? <FcLike /> :<CiHeart />} {tweet.likes}
            </button>

            <button type="button" aria-label="Share">
              <span><AiOutlineShareAlt /></span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </article>
      )
      })}
</div>

  )
}

export default Tweets