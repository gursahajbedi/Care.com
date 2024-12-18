import { useEffect, useState } from "react"
import dateFormat, { masks } from "dateformat";
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthContext from "../AuthLogic/useAuthContext";
import axios from "axios"
import { URL } from "../../global";

export default function Comment({data,id,pid,fetchpost}){

    const [activeid,setactiveid]=useState()
    const [replytext,setreplytext]=useState()
    const {auth} = useAuthContext()
    const [profile,setprofile]=useState({})

    const scrollToBottom = () => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth' // Optionally, you can make the scroll smooth
        });
      };
    
    const postreply=async()=>{
        if(replytext){
            const data={
                content:replytext,
                parent:activeid,
                
            }
            console.log(pid)
            await axios.post(`${ URL }/api/community/posts/${pid}/comments/write/`,data,{
                headers: {
                    'Authorization': `Bearer ${auth.user.access}`
                }
            }).then((res)=>{   
                console.log(data)
                setactiveid()
                setreplytext()
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

    const fetchprofile = async (id) => {
        console.log(id)
        await axios.get(`${ URL }/api/accounts/list/`).then((res) => {
          const data=res.data.filter((item)=>{
            if(item.id==Number(id)){
              return item
            }
          })
          console.log(data)
          setprofile(data[0])
        });
      }
      

      useEffect(()=>{
        fetchprofile(data.author.id)
      },[data])

    const addlike=async()=>{
        console.log("adding")
        if(auth.user){
            await axios.post(`${ URL }/api/community/comments/${id}/like/`,{},{
            headers:{
                Authorization:`Bearer ${auth.user.access}`
            }
            }).then((res)=>{
            fetchpost()
            console.log(res.data)
            })
        }
        else{
            toast.error('Please Login To Like This Comment!', {
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
            await axios.post(`${ URL }/api/community/comments/${id}/dislike/`,{},{
                headers:{
                    Authorization:`Bearer ${auth.user.access}`
                }
            }).then((res)=>{
                fetchpost()
                console.log(res.data)
            })
        }else{
            toast.error('Please Login To Dislike This Comment!', {
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

    const reply=(id)=>{
        if(id === activeid){
            setactiveid()
        }
        else{
            setactiveid(id)
        }
    }
    useEffect(()=>{
        console.log(activeid)
        console.log(replytext)
    },[activeid,replytext])
    return(
        <>
            <div id="Comments" className="pt-6">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="dark"
                transition={Flip}
            />
                    <div className="flex flex-row items-center">
                        <div className="" style={{width:"70px",height:"70px"}}>
                            <img src={profile.profile_pic != undefined?`${ URL }${profile.profile_pic}`:`/community/communityprofile.svg`} className="rounded-full" style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                        </div>
                        <div className="p-4 py-5 border-t-4 border-b-4 w-8/12 flex flex-col">
                            <div className="flex flex-row justify-between text-xl">
                                <div className="text-base text-gray-400 flex flex-col justify-between w-10/12">
                                    <div className="text-xl text-black">
                                        {data.content}
                                    </div>
                                    {dateFormat(data.created_at,"dd mmm yyyy")}
                                </div>
                                <div className="flex flex-row items-center text-lg mx-4 gap-4">
                                    <div className="flex flex-col justify-center items-center">
                                        <img src="/community/upvote.svg" style={{height:"35px",width:"30px"}} onClick={()=>{addlike()}}></img>
                                        <span className="font-bold">{data.likes_count}</span>
                                    </div>
                                    <div className="flex flex-col justify-center items-center">
                                        <img src="/community/downvote.svg" style={{height:"35px",width:"30px"}} onClick={()=>{adddislike()}}></img>
                                        <span className="font-bold">{data.dislikes_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {auth.user && (<div className="w-1/12">
                        {activeid ===  id ?(
                            <button><img className="ms-4" src="/community/noreply.svg" style={{height:"58px"}}  onClick={()=>reply(id)}></img></button>
                        ):(
                            <button><img className="ms-4" src="/community/reply.svg" style={{height:"60px"}}  onClick={()=>reply(id)}></img></button>
                        )}
                        </div>)}
                    </div>
                    {activeid ===  id &&
                        (<div className="border-2 border-gray-400 p-2 w-6/12 relative left-24 rounded-3xl flex flex-row items-center gap-5 mt-5">
                            <div className="w-11/12">
                                <input className="ps-3 py-2 w-full text-lg" onChange={(e)=>setreplytext(e.target.value)} placeholder="Add A Reply"></input>
                            </div>
                            <div className="">
                                <button className="text-blue-500" onClick={()=>postreply()}><span className="material-symbols-outlined text-4xl pt-1">send</span></button>
                            </div>
                        </div>)
                    }
                    {data.replies.length != 0 && (
                        <div className="relative left-16" style={{width:"1000px"}}>
                            <img className="absolute -left-8 -top-9 -z-20" src="/community/node.svg" style={{height:"125px"}}></img>
                            {activeid === id &&(<img className="absolute -left-8 -top-32 -z-20" src="/community/nodeextend.svg" style={{height:"115px"}}></img>)}
                            {data.replies.map((item)=>{
                                return <Comment key={item.id} data={item} id={item.id} pid={pid} fetchpost={fetchpost}/>
                            })}
                        </div>
                    )}
            </div>
        </>
    )
}