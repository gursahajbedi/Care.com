import { Link } from "react-router-dom"
import useAuthContext from "../AuthLogic/useAuthContext"
import "./navbar.css"
import { useEffect, useState } from "react"
import axios from 'axios'

export default function Navbar(){
    const {auth}=useAuthContext()

    const[profile,setprofile]=useState({})

    const fetchprofile = async (id) => {
          await axios.get(`http://127.0.0.1:8000/api/accounts/list/`).then((res) => {
            const data=res.data.filter((item)=>{
              if(item.id==id){
                return item
              }
            })
            setprofile(data[0])
          });
    }

    useEffect(()=>{
        if(auth.user){
            fetchprofile(auth.user.id)
        }
    },[auth])

    return(
        <>

            <div className="px-5 py-5 container-fluid rounded-br-2xl rounded-bl-2xl" style={{backgroundColor:"#CBE4F2"}}>
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <a href="/">
                        <img src="/logo.svg" style={{height:"100px"}}></img>
                        </a>
                    </div>
                    <div className="flex flex-row flex-wrap gap-10 items-center justify-center">
                        <a href="/aboutus"><div className="2xl:text-2xl md:text-lg">About Us</div></a>
                        <a href="/community"><div className="2xl:text-2xl md:text-lg">Community</div></a>
                        <a href="/searchnanny"><div className="2xl:text-2xl md:text-lg">Search For A Nanny</div></a>
                        <a href="/blogs"><div className="2xl:text-2xl md:text-lg">Blogs</div></a>
                        {!auth.user && (
                            <a href="/login">
                            <img src="/login.svg" style={{height:"100px"}}></img>
                            </a>
                        )}
                        {auth.user && (
                            <a href="/myzone/profile" >
                                <div className="" style={{width:"100px",height:"100px"}}>
                                    <img src={profile.profile_pic != null?`http://127.0.0.1:8000${profile.profile_pic}`:`/auth/default-profile.jpg`} className="rounded-full border-4 border-gray-500 shadow-xl" style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}