import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import dateFormat, { masks } from "dateformat";
import Comment from "./comment";
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Post(){

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
        await axios.get("http://localhost:8000/community").then((res)=>{
            res.data.filter((item)=>{
                if(item.id===Number(id)){
                    setdata(item)
                }
            })
        })
    }

    const fetchcomments=async()=>{
        let result=data.comments.map((item)=>{
            return(<Comment key={item.id} data={item} id={item.id}/>)
        })
        setComments(result)

    }

    useEffect(()=>{
        fetchpost()
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
                <div>
                    <div className="border-4 border-gray-400 shadow-xl rounded-3xl p-7 flex flex-row">
                        <div>
                            <div className="text-2xl">
                                {data.title}
                            </div>
                            <div className="text-lg mt-2">
                                {data.desc}
                            </div>
                        </div>
                        <div className="flex flex-col justify-right ps-5">
                            <div>
                                <img src="/community/upvote.svg" width={"30px"}></img>
                            </div>
                            <div className="text-center text-lg font-bold">
                                {data.likes_count}
                            </div>
                            <div>
                                <img src="/community/downvote.svg" width={"30px"}></img>
                            </div>
                            <div className="text-center text-lg font-bold">
                                {data.dislikes_count}
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-2 border-2 border-gray-400 w-full mt-10 flex flex-row justify-between rounded-2xl">
                        <input className="w-full text-xl px-2" onChange={(e)=>setaddcomment(e.target.value)} placeholder="Add A Comment"></input>
                        <button onClick={()=>postcomment()}><span className="material-symbols-outlined text-5xl pt-1 text-red-400">send</span></button>
                    </div>
                </div>
                <div className="w-3/12">
                    <div className="border-4 border-gray-400 rounded-3xl shadow-xl p-7">
                        <div className="flex flex-col justify-center items-center">
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
