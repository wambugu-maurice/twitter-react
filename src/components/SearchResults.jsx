import { useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";

function SearchResults({ results }) {
  const[toFollow,setToFollow]=useState([])
  const[lastDoc,setLastDoc]=useState(null)
  const[hasMore,setHasMore]=useState(true)

  const loadFollows = async ()=> {
    const q = lastDoc ? query(collection(db,"users"),
                        orderBy("registeredOn","desc"),
                        startAfter(lastDoc),limit(3)):
                        query(collection(db,"users"),
                        orderBy("registeredOn","desc"),
                         limit(3))
    const snap = await getDocs(q)
    const fetchedFollows = snap.docs.map((doc)=>({id: doc.id,...doc.data()}))
    setToFollow(fetchedFollows);
    setLastDoc(snap.docs[snap.docs.length - 1] ?? lastDoc)
    if(snap.docs.length < 3) setHasMore(false)
    
  }
useState(()=>{
  loadFollows()
},[])

  return (
    <div className="queryDiv">
      {results?.map((tweet) => {
        return (
          <article className="tweetCard searchCard" key={tweet.id}>
            <div className="tweetAvatar">
              {tweet.name?.charAt(0).toUpperCase()}
            </div>
            <div className="tweetContent">
              <div className="tweetHeader">
                <p className="tweetName">
                  {tweet.name}
                  <span className="tweetUsername">
                    @{tweet.name?.toLowerCase().replace(/\s+/g, "")}
                  </span>
                </p>
              </div>
            </div>
          </article>
        );
      })}
      
        <>
        <h2><strong>Popular creatives</strong></h2>
        {
          toFollow.map((follow)=>(
          <div key={follow.id}>
              
              <li className="followsList" >{follow.name}</li>
          </div>
        ))}
        </>
      { hasMore && <button className="moreBtn" onClick={loadFollows}>Load more</button>}
    </div>
  );
}

export default SearchResults;
