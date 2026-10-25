import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { NavLink, Outlet } from "react-router-dom";


const tabs = [
  { path: "", label: "Posts", end: true },
  { path: "reposts", label: "Reposts" }  
];

function Profile() {
  const[currentLoggedUser,setCurrentLoggedUser]=useState(null);

useEffect(()=>{
  const unsub = onAuthStateChanged(auth,async(user)=>{
    if(!user) return setCurrentLoggedUser(null)
      const userRef = doc(db,"users",user.uid)
      const snap = await getDoc(userRef);
    setCurrentLoggedUser(snap.exists() ? snap.data() : user.displayName)
  })
  return unsub
},[])


  return (
    <section>
      <div className="userCard">
        <div className="userInfo">
          <div className="tweetAvatar">
          {currentLoggedUser?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="other">
          <h2>{currentLoggedUser?.name}</h2>
          <small> @{currentLoggedUser?.name}</small>
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