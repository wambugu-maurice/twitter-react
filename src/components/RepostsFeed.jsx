import { useEffect, useState } from "react"
import { auth, db } from "../../firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { AiOutlineShareAlt } from "react-icons/ai"
import { FcLike } from "react-icons/fc"
import { CiHeart } from "react-icons/ci"
import { BiRepost } from "react-icons/bi"
import { MdOutlineReply } from "react-icons/md"


function RepostsFeed() {
  const[repostsByUser,setRepostsByUser]=useState([])
    const[error,setError]=useState("")
    const userId = auth.currentUser.uid

    useEffect(()=>{
      const retweetRef = query(collection(db,"tweets"),where("retweetedBy","array-contains",userId))
      const unsub = onSnapshot(retweetRef,(snap)=>{
        const retweets = snap.docs.map((doc)=>({id: doc.id,...doc.data()}))
        setRepostsByUser(retweets)
        console.log(retweets)
      },(err)=>{
        setError(err.message)
      })

      return ()=> unsub()
    },[userId])
  return (
    <div>
      { error && <p className="errMsg">{error}</p>}
      
      {
      
        repostsByUser.map((tweet)=>{
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
        })
      }</div>
  )
}

export default RepostsFeed