import axios from "axios"
import { useEffect, useState } from "react"
<<<<<<< HEAD
import { useParams } from "react-router-dom"
=======
import { Link, useParams } from "react-router-dom"
>>>>>>> master
import dateFormat, { masks } from "dateformat";
import Comment from "./comment";
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<<<<<<< HEAD
=======
import useAuthContext from "../AuthLogic/useAuthContext";
>>>>>>> master


export default function Post(){

<<<<<<< HEAD
    const[data,setdata]=useState([])
    const[comments,setComments]=useState([])
    const[addcomment,setaddcomment]=useState()

    const {id}=useParams()

    const postcomment=async()=>{
        if(addcomment){
            const data={
                comment: addcomment,
                author: "present user",
                post_id:id
            }
            console.log(data)
            setaddcomment()
=======
    const[data,setdata]=useState({})
    const[comments,setComments]=useState([])
    const[addcomment,setaddcomment]=useState()
    const [profile,setprofile]=useState({})
    const {auth}=useAuthContext()


    const {id}=useParams()

    const scrollToBottom = () => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth' // Optionally, you can make the scroll smooth
        });
      };

    const postcomment=async()=>{
        if(addcomment){
            const data={
                content: addcomment,
            }

            await axios.post(`http://127.0.0.1:8000/api/community/posts/${id}/comments/write/`,data,{
                headers: {
                    Authorization: `Bearer ${auth.user.access}`,
                }
            }).then((res)=>{
                
                setaddcomment()
                fetchpost()
                scrollToBottom()
            })
>>>>>>> master
        }
        else{
            toast.error('Please Enter Something!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Flip,
                });
        }
    }

    const fetchpost = async()=>{
<<<<<<< HEAD
        await axios.get("http://localhost:8000/community").then((res)=>{
            console.log(res.data,id)
            res.data.filter((item)=>{
                if(item.id===id){
                    setdata(item)
                }
            })
        })
    }

    const fetchcomments=async()=>{
        console.log(data)
        let result=data.comments.map((item)=>{
            return(<Comment key={item.id} data={item} id={item.id}/>)
        })
        setComments(result)

=======
        await axios.get(`http://127.0.0.1:8000/api/community/post/${id}`).then((res)=>{
            console.log("Post",res.data)
            setdata(res.data)
            fetchprofile(res.data.author)
        })
    }

    const fetchprofile = async (id) => {
        await axios.get(`http://127.0.0.1:8000/api/accounts/list/`).then((res) => {
          const data=res.data.filter((item)=>{
            console.log("Profile",item)
            console.log(item.id === id, id, item.id)
            if(item.id === id){
              return item
            }
          })
          setprofile(data[0])
        });
      }

    const fetchcomments=async()=>{
        const sortedItems = [...data.comments].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        let result=sortedItems.map((item)=>{
            const pid=Number(id)
            
            return(<Comment key={item.id} data={item} id={item.id} pid={pid} fetchpost={fetchpost} />)
        })
        setComments(result)
    }

    const addlike=async()=>{
        if(auth.user){
            await axios.post(`http://127.0.0.1:8000/api/community/posts/${id}/like/`,{},{
                headers:{
                    Authorization:`Bearer ${auth.user.access}`
                }
            }).then((res)=>{
                fetchpost()
                
            })
        }else{
            toast.error('Please Login to Like this Post', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Flip,
                });
        }
    }

    const adddislike=async()=>{
        if(auth.user){
            await axios.post(`http://127.0.0.1:8000/api/community/posts/${id}/dislike/`,{},{
                headers:{
                    Authorization:`Bearer ${auth.user.access}`
                }
            }).then((res)=>{
                fetchpost()
                
            })
        }else{
            toast.error('Please Login to Dislike this Post', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Flip,
                });
        }
>>>>>>> master
    }

    useEffect(()=>{
        fetchpost()
<<<<<<< HEAD
=======
    },[])

    useEffect(()=>{
>>>>>>> master
        fetchcomments()
    },[data])
    
    return(
        <>
        <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="dark"
                transition={Flip}
        />
        <div className="container mx-auto my-10">
            <div className="flex flex-row gap-7">
<<<<<<< HEAD
                <div>
                    <div className="border-4 border-gray-400 shadow-xl rounded-3xl p-7 flex flex-row">
                        <div>
=======
                <div className="w-9/12">
                    <div className="border-4 border-gray-400 shadow-xl rounded-3xl p-7 flex flex-row">
                        <div className="w-11/12">
>>>>>>> master
                            <div className="text-2xl">
                                {data.title}
                            </div>
                            <div className="text-lg mt-2">
                                {data.desc}
                            </div>
                        </div>
<<<<<<< HEAD
                        <div className="flex flex-col justify-right ps-5">
                            <div>
                                <img src="/community/upvote.svg" width={"30px"}></img>
                            </div>
=======
                        <div className="flex flex-col justify-right ps-5 w-1/12 items-center">
                            <button>
                                <img src="/community/upvote.svg" onClick={()=>addlike()} width={"30px"}></img>
                            </button>
>>>>>>> master
                            <div className="text-center text-lg font-bold">
                                {data.likes_count}
                            </div>
                            <div>
<<<<<<< HEAD
                                <img src="/community/downvote.svg" width={"30px"}></img>
=======
                                <img src="/community/downvote.svg" onClick={()=>adddislike()} width={"30px"}></img>
>>>>>>> master
                            </div>
                            <div className="text-center text-lg font-bold">
                                {data.dislikes_count}
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
                    <div className="px-5 py-2 border-2 border-gray-400 w-full mt-10 flex flex-row justify-between rounded-2xl">
                        <input className="w-full text-xl px-2" onChange={(e)=>setaddcomment(e.target.value)} placeholder="Add A Comment"></input>
                        <button onClick={()=>postcomment()}><span className="material-symbols-outlined text-5xl pt-1 text-red-400">send</span></button>
                    </div>
=======
                    {auth.user&&(<div className="px-5 py-2 border-2 border-gray-400 w-full mt-10 flex flex-row justify-between rounded-2xl">
                        <input className="w-full text-xl px-2" onChange={(e)=>setaddcomment(e.target.value)} placeholder="Add A Comment"></input>
                        <button onClick={()=>postcomment()}><span className="material-symbols-outlined text-5xl pt-1 text-red-400">send</span></button>
                    </div>)}
                    {!auth.user&&(<div className="px-5 py-2 border-2 border-gray-400 w-full mt-10 flex flex-row justify-between rounded-2xl">
                        <Link to="/login" className="text-xl py-3 mx-8">
                            Login To Post Comment And Replies
                            <hr className="w-full h-1 bg-red-400 rounded-full"></hr>
                        </Link>
                    </div>)}
>>>>>>> master
                </div>
                <div className="w-3/12">
                    <div className="border-4 border-gray-400 rounded-3xl shadow-xl p-7">
                        <div className="flex flex-col justify-center items-center">
<<<<<<< HEAD
                            <div>
                                <img src="/community/communityprofile.svg"></img>
                            </div>
                            <div className="text-2xl pt-3">
                                {data.author}
                            </div>
                            <div className="my-2">
                                {data.author_type === "Mother" && (<div className="w-28 bg-red-400 rounded-2xl 2xl:text-lg md:text-lg text-center text-white">
                                    {data.author_type}
                                </div>)}
                                {data.author_type === "Nanny" && (<div className="w-28 bg-blue-400 rounded-2xl 2xl:text-xl md:text-lg text-center text-white">
                                    {data.author_type}
                                </div>)}
                            </div>
=======
                            <div className="" style={{width:"100px",height:"100px"}}> 
                                <img src={profile.profile_pic != undefined?`http://127.0.0.1:8000${profile.profile_pic}`:`/community/communityprofile.svg`} className="rounded-full"style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                            </div>
                            <div className="text-2xl font-bold pt-3">
                                {profile.name}
                            </div>
                            
>>>>>>> master
                            <div className="text-lg">
                                Posted on <span className="font-bold">{dateFormat(data.published_date,"d mmm yyyy")}</span>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
            {comments.length != 0 &&(
                <div className="mt-10">
                    {comments}
                </div>

            )} 
        </div>
        </>
    )
}
