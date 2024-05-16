import { Link, useNavigate } from "react-router-dom"
import  useLogout  from "../AuthLogic/useLogout.jsx"
import useAuthContext from "../AuthLogic/useAuthContext.jsx"
import useChangePassword from "../AuthLogic/useChangePass.jsx"
import "./profile.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "bootstrap"

export function Menu(){
    const {logout}= useLogout()
    const navigate= useNavigate()

    const handlelogout=async()=>{
        await logout().then(()=>{
            navigate("/")
        })
    }
    return(
        <>
        <div className="w-2/12 h-72 border-4 rounded-3xl shadow-xl border-gray-200 flex flex-col justify-center items-center gap-y-5"> 
            <Link to={"/myzone/profile"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/profile.svg" style={{height:"35px"}}></img></div>
                <div>My Profile</div>
            </Link>
            <Link to={"/myzone/applications"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/applications.svg" style={{height:"35px"}}></img></div>
                <div>Applications</div>
            </Link>
            <Link to={"/myzone/verification"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/verification.svg" style={{height:"40px"}}></img></div>
                <div>Verification</div>
            </Link>
            <button className="text-xl flex flex-row items-center gap-x-4" onClick={()=>{handlelogout()}}>
                <span className="text-3xl material-symbols-outlined text-red-600">Logout</span>
                <div className="text-red-600 text-2xl">Logout</div>
            </button>
        </div>
        </>
    )
}

export function Profile(){
    const {auth}=useAuthContext()
    const [hover,sethover]=useState(false)

    const [original,setoriginal]=useState()
    const [pass,setpass]=useState()
    const [confirm,setconfirm]=useState()
    const {changepassword,error}=useChangePassword()

    const id = auth.user["id"]


    const handleProfile=(e)=>{
        console.log(e.target.files[0])
    }
    const handlesubmit=async(e)=>{
        e.preventDefault()
        if(original && pass && confirm){
            await changepassword(id,original,pass,confirm)
        }
    }
    return(
        <>
            <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
                <Menu/>
                <div className="w-10/12">
                    <div className="text-4xl">
                        Profile
                        <hr className="w-64 h-2 rounded-full bg-red-400 "></hr>
                    </div>
                    <div className="flex flex-col items-center mt-10">
                        {!auth.user.profile_pic && (<div className="flex flex-row justify-center items-center" onClick={()=>{handleProfile()}} onMouseEnter={()=>sethover(true)} onMouseLeave={()=>sethover(false)}>
                            {hover ? (<img src="/auth/default-profile.jpg" className="profile z-0 border-4 border-gray-500" style={{height:"150px",width:"150px",borderRadius:"100%"}} ></img>):(<img src="/auth/default-profile.jpg" className="z-0 border-4 border-gray-500 " style={{height:"150px",width:"150px",borderRadius:"100%"}} ></img>)}
                            {hover && (<img className="absolute camera z-10" src="/auth/camera.png" style={{height:"50px"}}></img>)}
                            <input type="file" onChange={(e)=>handleProfile(e)} className="z-20 h-36 w-36 me-2 bg-black rounded-full" accept="image/gif, image/jpeg, image/png"></input>
                        </div>)}
                        {auth.user.profile_pic && (<div className="flex flex-row justify-center items-center" onClick={()=>{handleProfile()}}>
                            <img src={`${auth.profile_pic}`} className="profile border-4 border-gray-500 " style={{height:"150px",width:"150px",borderRadius:"100%"}} onMouseEnter={()=>sethover(true)} onMouseLeave={()=>sethover(false)}></img>
                            {hover && (<img className="absolute camera" src="/auth/camera.png" style={{height:"50px"}}></img>)}
                        </div>)}
                    </div>
                    <div className="flex flex-col items-center py-10">
                        <form className="flex flex-col gap-y-4 items-center justify-center" onSubmit={(e)=>{handlesubmit(e)}}>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Original Password" type="text" onChange={(e)=>{setoriginal(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter New Password" type="text" onChange={(e)=>{setpass(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Confirm Password" type="text" onChange={(e)=>{setconfirm(e.target.value)}}/>
                            {error && (<div className="text-red-400">{error}</div>)}
                            <button type="submit" className="bg-red-400 text-white px-4 py-1 rounded-xl">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export function Verification(){
    const {auth}=useAuthContext()
    const [appdata,setappdata]=useState({})
    const [status,setstatus]=useState(null)

    const fetchverify=async()=>{
        await axios.get(`http://localhost:8000/applications/${auth.user.id}`).then((res)=>{
            if(res.status === 200){
                setappdata(res.data)
                setstatus(res.data.status)
            }
        })
    }
    useEffect(()=>{
        fetchverify()
    },[])

    const [state,setState]=useState(appdata.verification ?(appdata.verification.state):(""))
    const [type,setType]=useState(appdata.verification ?(appdata.verification.user_type):(""))
    const [URL,setURL]=useState(appdata.verification ?(appdata.verification.organisation_url):(""))
    const [OrganName,setOrganName]=useState(appdata.verification ?(appdata.verification.organisation_name):(""))
    const [ref1Contact,setRef1Contact]=useState(appdata.verification ?(appdata.verification.reference1_contact):(""))
    const [ref1Name,setRef1Name]=useState(appdata.verification ?(appdata.verification.reference1_name):(""))
    const [ref2Contact,setRef2Contact]=useState(appdata.verification ?(appdata.verification.reference2_contact):(""))
    const [ref2Name,setRef2Name]=useState(appdata.verification ?(appdata.verification.reference2_name):(""))

    const postverify=async(e)=>{
        e.preventDefault()
        if(appdata === {}){
        await axios.patch(`http://localhost:8000/applications/${auth.user.id}`,{
            ...appdata,
            status:"approved",
            verification:{
                "state": state,
                "user_type": type,
                "organisation_url": URL,
                "organisation_name": OrganName,
                "reference1_name": ref1Name,
                "reference1_contact": ref1Contact,
                "reference2_name": ref2Name,
                "reference2_contact": ref2Contact
            }
        }).then((res)=>{
            console.log(res.data)
            setappdata(res.data)
            console.log('patched')
        })
        }else{
            await axios.post("http://localhost:8000/applications/",{
                id:auth.user.id,
                status:"approved",
                verification:{
                "state": state,
                "user_type": type,
                "organisation_url": URL,
                "organisation_name": OrganName,
                "reference1_name": ref1Name,
                "reference1_contact": ref1Contact,
                "reference2_name": ref2Name,
                "reference2_contact": ref2Contact
                },
                domains_offered:[]
            }).then((res)=>{
                console.log(res.data)
                setappdata(res.data)
                console.log('posted')
            })
        }
    }

    const postverifyapproved=async(e)=>{
        e.preventDefault()
        console.log("ausdoa")
        await axios.patch(`http://localhost:8000/applications/${auth.user.id}`,{
            ...appdata,
            verification:{
                "state": state,
                "user_type": type,
                "organisation_url": URL,
                "organisation_name": OrganName,
                "reference1_name": ref1Name,
                "reference1_contact": ref1Contact,
                "reference2_name": ref2Name,
                "reference2_contact": ref2Contact
            }
        }).then((res)=>{
            console.log(res.data)
            setappdata(res.data)
        })
    }


    return(
        <>
            <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
                <Menu/>
                <div className="w-10/12">
                    <div className="text-4xl">
                        Verification
                        <hr className="w-64 h-2 rounded-full bg-red-400 "></hr>
                    </div>
                    {status === null &&(
                        <form className="flex flex-col items-center justify-center gap-y-2" onSubmit={(e)=>{postverify(e)}}>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter State" type="text" onChange={(e)=>{setState(e.target.value)}} defaultValue={state}/>
                            <select className="border-gray-400 border-2 w-96 px-4 text-xl" type="text" onChange={(e)=>setType(e.target.value)}>
                                <option className="" selected defaultValue="">Select Type</option>
                                <option className="" value="indivisual">Indivisual</option>
                                <option className="" value="organisation">Organisation</option>
                            </select>
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Oranisation URL" type="text"  onChange={(e)=>{setURL(e.target.value)}}/>)}
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Oranisation Name" type="text" onChange={(e)=>{setOrganName(e.target.value)}}/>)}
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Contact" type="text" onChange={(e)=>{setRef1Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Name" type="text" onChange={(e)=>{setRef1Name(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Contact" type="text" onChange={(e)=>{setRef2Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Name" type="text" onChange={(e)=>{setRef2Name(e.target.value)}}/>
                            <button type="submit" className="bg-red-400 rounded-full px-4 py-2 text-xl text-white">Submit Verification</button>
                        </form>
                    )}
                    {status === "approved" &&(
                        <form className="flex flex-col items-center justify-center gap-y-2" onSubmit={(e)=>{postverifyapproved(e)}}>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter State" type="text" onChange={(e)=>{setState(e.target.value)}}/>
                            {appdata.verification.user_type === "indivisual" &&(<select className="border-gray-400 border-2 w-96 px-4 text-xl" type="text" onChange={(e)=>setType(e.target.value)}>
                                <option className="" value="">Select Type</option>
                                <option className="" selected value="indivisual">Indivisual</option>
                                <option className="" value="organisation">Organisation</option>
                            </select>)}
                            {appdata.verification.user_type === "organisation" &&(<select className="border-gray-400 border-2 w-96 px-4 text-xl" type="text" onChange={(e)=>setType(e.target.value)}>
                                <option className="" value="">Select Type</option>
                                <option className="" value="indivisual">Indivisual</option>
                                <option className="" selected value="organisation">Organisation</option>
                            </select>)}
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Oranisation URL" type="text" onChange={(e)=>{setURL(e.target.value)}}/>)}
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Oranisation Name" type="text" onChange={(e)=>{setOrganName(e.target.value)}}/>)}
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Contact" type="text" defaultValue={appdata.verification.reference1_contact} onChange={(e)=>{setRef1Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Name" type="text" defaultValue={appdata.verification.reference1_name} onChange={(e)=>{setRef1Name(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Contact" type="text" defaultValue={appdata.verification.reference2_contact} onChange={(e)=>{setRef2Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Name" type="text" defaultValue={appdata.verification.reference2_name} onChange={(e)=>{setRef2Name(e.target.value)}}/>
                            <button type="submit" className="bg-red-400 rounded-full px-4 py-2 text-xl text-white">Edit Verification</button>
                        </form> 
                    )}
                </div>
            </div>
        </>
    )
}
export function Applications(){
    const {auth}=useAuthContext()
    const [appdata,setappdata]=useState([])
    const [isapplication,setapplication]=useState(false)

    const fetchapplications=async()=>{
        await axios.get(`http://localhost:8000/applications/${auth.user.id}`).then((res)=>{
            if(res.status === 404){
                setapplication(false)
            }      
            else{
                setappdata(res.data.domains_offered)
                setapplication(true)
            }
        })
    }

    useEffect(()=>{
        fetchapplications()
    },[])
    useEffect(()=>{
        console.log(appdata)
    })

    return(
        <>
            <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
                <Menu/>
                <div className="w-10/12">
                    <div className="text-4xl">
                        Applications
                        <hr className="w-64 h-2 rounded-full bg-red-400 "></hr>
                    </div>
                    {!isapplication && (
                    <div className="flex flex-col items-center justify-center gap-y-4 pt-20">
                        <div className="">
                            <img src="/nanny/NotVerified.jpg" style={{height:"100px"}}></img>
                        </div>
                        <div className="text-3xl">
                            You are Not Verfiied to Become A Nanny!
                        </div>
                        <Link to={"/myzone/verification"} className=" text-2xl hover:brightness-75">
                            <button className="flex flex-row items-center bg-red-400 text-3xl text-white rounded-full py-4 gap-x-3 px-9 shadow-2xl">
                                Get Verified
                                <img src="/auth/whitearrow.svg"></img>
                            </button>
                        </Link>
                    </div>
                    )}
                    {isapplication &&(<div>
                    {appdata.length != 0 &&(<div className="flex flex-col justify-center w-full items-center gap-y-4 mt-10">
                        {
                            appdata.map((item)=>{
                                return(
                                    <div className="container flex flex-row items-center justify-between border-4 border-gray-200 rounded-2xl p-3 m-3 w-1/2">
                                        <div className="text-2xl flex flex-row items-center">
                                            {item.type === "childcare" && (<div className="flex items-center pe-4">
                                                <span className="material-symbols-outlined text-blue-500 text-4xl">child_care</span>
                                            </div>)}
                                            {item.type === "eldercare" && (<div className="flex items-center pe-4">
                                                <span className="material-symbols-outlined text-blue-500 text-4xl">elderly </span>
                                            </div>)}
                                            {item.type === "petcare" && (<div className="flex items-center pe-4">
                                                <span className="material-symbols-outlined text-blue-500 text-4xl">pets</span>
                                            </div>)}
                                            <div>
                                                {item.type[0].toUpperCase()+item.type.slice(1)} Application
                                            </div>
                                        </div>
                                        <div className="text-xl text-red-400">
                                            <span className="text-4xl material-symbols-outlined">delete</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <Link to={"/myzone/applications/domains"} className=" text-2xl hover:brightness-75">
                                <img src="/auth/create.svg"></img>
                        </Link>
                    </div>)}
                    {appdata.length ==0 &&(
                        <div className="flex flex-col items-center justify-center gap-y-4 pt-20">
                            <div className="">
                                <img src="/myzone/applications.svg" style={{height:"100px"}}></img>
                            </div>
                            <div className="text-3xl">
                                No Applications Yet!
                            </div>
                            <Link to={"/myzone/applications/domains"} className=" text-2xl hover:brightness-75">
                                <img src="/auth/create.svg"></img>
                            </Link>
                        </div>
                    )}
                    </div>)}
                </div>
            </div>
        </>
    )
}