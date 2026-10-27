import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth, db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { NavLink, Outlet } from "react-router-dom";


const tabs = [
  { path: "", label: "Posts", end: true },
  { path: "reposts", label: "Reposts" }  
];

function Profile() {
  const[currentLoggedUser,setCurrentLoggedUser]=useState(null);


useEffect(()=>{
  let snapshot
  const unsub = onAuthStateChanged(auth,async(user)=>{
    if(!user) return setCurrentLoggedUser(null)
      const userRef = doc(db,"users",user.uid)
       snapshot = onSnapshot(userRef,(snap)=>{
        setCurrentLoggedUser(snap.exists ?{ id: snap.id,...snap.data()}: null)
      })    
  })
  return ()=>{
    unsub()
    if(snapshot) snapshot()

  }
},[])




  return (
    <section>
      <div className="userCard">
        <div className="userInfo">
          <div className="tweetAvatar">
          {currentLoggedUser?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="other">
          <h2><strong>{currentLoggedUser?.name}</strong></h2>
          <small> @{currentLoggedUser?.name}</small>

        </div>
        <div className="followersDiv">
          <div>
            <h2><strong>Followers</strong></h2>
            {currentLoggedUser?.followersCount ?? 0}
          </div>
          <div>
            <h2><strong>Following</strong></h2>
            {currentLoggedUser?.followingCount}
          </div>
        </div>
        </div>
        <div className="userActivity">
          <nav className="tabs">
              {tabs.map((t) => (
                <NavLink key={t.label} to={t.path}  className="tab">
                  {t.label}
              </NavLink>))}
         </nav>
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default Profile