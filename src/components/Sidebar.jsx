import { IoMdNotificationsOutline } from "react-icons/io"
import { IoHomeOutline, IoPersonCircleOutline } from "react-icons/io5"
import { SlMagnifier } from "react-icons/sl"
import { TbMessages } from "react-icons/tb"
import { Link } from "react-router-dom"
import LogoutModal from "./LogoutModal"


function Sidebar() {
    const links =[
        {
            title:"home",
            path:"home",
            icon: IoHomeOutline
        },{
            title:"explore",
            path:"explore",
            icon: SlMagnifier
        },{
            title:"notification",
            path: "notification",
            icon: IoMdNotificationsOutline
        },{
            title: "messages",
            path: "messages",
            icon: TbMessages
        },{
            title: "profile",
            path:"profile",
            icon: IoPersonCircleOutline
        }
    ]
  return (
    <div className="sidebar">
        <ul>
            {
                links.map((link)=>(
                    <li key={link.path}>
                        <div className="linksIcon">
                            <link.icon />
                        </div>
                        <div className="link">
                            <Link to={link.path}>{link.title}</Link>
                        </div>
                    </li>
                ))
            }
            <LogoutModal />
        </ul>
    </div>
  )
}

export default Sidebar