import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { MdOutlineReply } from "react-icons/md"
import { BiRepost } from "react-icons/bi"
import { AiOutlineShareAlt } from "react-icons/ai"

 

function Tweets() {
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

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



  return (
    
<div className="tweetsContainer">
  {isLoading && <p className="tweetStatus">Loading tweets...</p>}
  {error && <p className="tweetError">{error}</p>}

  {!isLoading && !error &&
    tweets.map((tweet) => (
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

            <button type="button" aria-label="Repost">
              <span><BiRepost /></span>
              <span>Repost</span>
            </button>

            <button type="button" aria-label="Like">
              <span>♡</span>
              <span>Like</span>
            </button>

            <button type="button" aria-label="Share">
              <span><AiOutlineShareAlt /></span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </article>
    ))}
</div>

  )
}

export default Tweets