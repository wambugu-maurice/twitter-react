import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase"
import { MdOutlineReply } from "react-icons/md"
import { AiOutlineShareAlt } from "react-icons/ai"
import { FcLike } from "react-icons/fc"
import { CiHeart } from "react-icons/ci"
import { BiRepost } from "react-icons/bi"
import useUser from "../hooks/useUser"
import useTweetActions from "../hooks/useTweetActions"


function Explore() {
    const[searchTweets,setSearchTweets]=useState([])
    const[searchQuery,setSearchQuery]=useState("")
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState("")
    const{loggedUser}=useUser()
    const { handleFollow, handleLikeTweet, handleRepost } = useTweetActions()

    useEffect(()=>{
      let ignore = false
      setError("")
      setLoading(true)

      if(!searchQuery.trim()){
        setSearchTweets([])
        setLoading(false)
        setError("")
        return
      }
      const timer = setTimeout(async() => {
        try {
            const q = query(collection(db,"tweets"),
                                  where("tweet",">=",searchQuery),
                                where("tweet","<=",searchQuery + '\uf8ff'))
            const snapshot = await getDocs(q)
            const results = snapshot.docs.map((doc)=>({id: doc.id,...doc.data()}))
             if(!ignore)setSearchTweets(results)
          
        } catch (err) {
          if(!ignore)setError(err.message)
          
        }finally{
         if(!ignore) setLoading(false)
        }
        
      }, 400);

      return ()=> {
        ignore = true
        clearTimeout(timer)
      }
    },[searchQuery])
     

  return (
    <div className="exploreDiv">
      <input type="search" placeholder="type to search" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
      {
        error && <p className="errMsg">{error}</p>
      }
      {
        loading ? <p>Searching...</p> :
        searchTweets?.map((tweet)=>{
          const alreadyLiked = tweet.likedBy?.includes(loggedUser.id)
          const alreadyReweeted = tweet.retweetedBy?.includes(loggedUser.id)
          const alreadyFollowing = loggedUser?.following?.includes(tweet.userId)
        const isOnwTweet = loggedUser?.id === tweet.userId
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
                    <div className="follow">
                      {
                        !isOnwTweet && (
                          <button className="followBtn" onClick={()=>handleFollow(tweet.userId,alreadyFollowing)}>
                        { alreadyFollowing ? "Unfollow" : "Follow"}
                      </button>
                        )
                      }
                    </div>
                  </div>
        
                  <p className="tweetText">{tweet.tweet}</p>
        
                  <div className="tweetActions">
                    <button type="button" aria-label="Reply">
                      <span><MdOutlineReply /></span>
                      <span>Reply</span>
                    </button>
        
                    <button onClick={()=>handleRepost(tweet.id,alreadyReweeted)}>
                     {tweet.retweetedBy?.includes(loggedUser.id) ? <BiRepost className="rtBtn" /> : <BiRepost />} {tweet.retweets}
                    </button>
        
                    <button onClick={()=>handleLikeTweet(tweet.id,alreadyLiked)} >
                      {tweet.likedBy?.includes(loggedUser.id) ? <FcLike /> :<CiHeart />} {tweet.likes}
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
      }
        
    </div>
  )
}

export default Explore