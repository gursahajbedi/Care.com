import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import dateFormat, { masks } from "dateformat";
import Comment from "./comment";
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthContext from "../AuthLogic/useAuthContext";
import { URL } from "../../global";


export default function Post(){

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

            await axios.post(`${ URL }/api/community/posts/${id}/comments/write/`,data,{
                headers: {
                    Authorization: `Bearer ${auth.user.access}`,
                }
            }).then((res)=>{
                
                setaddcomment()
                fetchpost()
                scrollToBottom()
            })
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
        await axios.get(`${ URL }/api/community/post/${id}`).then((res)=>{
            console.log("Post",res.data)
            setdata(res.data)
            fetchprofile(res.data.author)
        })
    }

    const fetchprofile = async (id) => {
        await axios.get(`${ URL }/api/accounts/list/`).then((res) => {
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
            await axios.post(`${ URL }/api/community/posts/${id}/like/`,{},{
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
            await axios.post(`${ URL }/api/community/posts/${id}/dislike/`,{},{
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
    }

    useEffect(()=>{
        fetchpost()
    },[])

    useEffect(()=>{
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
                <div className="w-9/12">
                    <div className="border-4 border-gray-400 shadow-xl rounded-3xl p-7 flex flex-row">
                        <div className="w-11/12">
                            <div className="text-2xl">
                                {data.title}
                            </div>
                            <div className="text-lg mt-2">
                            <div dangerouslySetInnerHTML={{ __html: data.desc}}/>
                            </div>
                        </div>
                        <div className="flex flex-col justify-right ps-5 w-1/12 items-center">
                            <button>
                                <img src="/community/upvote.svg" onClick={()=>addlike()} width={"30px"}></img>
                            </button>
                            <div className="text-center text-lg font-bold">
                                {data.likes_count}
                            </div>
                            <div>
                                <img src="/community/downvote.svg" onClick={()=>adddislike()} width={"30px"}></img>
                            </div>
                            <div className="text-center text-lg font-bold">
                                {data.dislikes_count}
                            </div>
                        </div>
                    </div>
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
                </div>
                <div className="w-3/12">
                    <div className="border-4 border-gray-400 rounded-3xl shadow-xl p-7">
                        <div className="flex flex-col justify-center items-center">
                            <div className="" style={{width:"100px",height:"100px"}}> 
                                <img src={profile.profile_pic != undefined?`${ URL }${profile.profile_pic}`:`/community/communityprofile.svg`} className="rounded-full"style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                            </div>
                            <div className="text-2xl font-bold pt-3">
                                {profile.name}
                            </div>
                            
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
