import { useEffect, useState } from "react";
import Community from "./community";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination} from 'swiper/modules';
import { useScrollTrigger } from "@mui/material";

function Popular(prop){
    return(
        <>
            <Link to={`/community/post/${prop.data.id}`}>
            <div className="h-full border-4 border-gray-400 rounded-2xl p-5 container">
                <div className="flex flex-row justify-around my-7">
                    
                    <div className="flex flex-col justify-center items-center">
                        <img src="/community/communityprofile.svg"></img>
                        <div>
                            {prop.data.author_type === "Mother" && (<div className="w-28 bg-red-400 rounded-2xl 2xl:text-xl md:text-lg text-center text-white mt-2">
                                {prop.data.author_type}
                            </div>)}
                            {prop.data.author_type === "Nanny" && (<div className="w-28 bg-blue-400 rounded-2xl 2xl:text-xl md:text-lg text-center text-white mt-2">
                                {prop.data.author_type}
                            </div>)}
                        </div>
                        
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="text-2xl font-bold">
                        {prop.data.title}
                    </div>
                    <div className="">
                        {prop.data.desc}
                    </div>
                </div>
            </div>
            </Link>
        </>
    )
}

export default function CommPage(){
    const [community,Setcommunity]=useState([]);
    const [searchcomm,Setsearchcomm]=useState([])
    const [found,Setfound]=useState(true)
    const [sortedData, SetSortedData] = useState([]);
    const [ddactive,setddactive]=useState(false)
    const [selection,setselection]=useState('Random')
    const [MoodData,setMoodData]=useState([...community])

    const fetch_Community=async()=>{
        axios.get("http://localhost:8000/community")
            .then((res)=>{
                Setcommunity(res.data)
            })
    }

    const MoodSwitcher=()=>{
        if(selection === "Random"){
            setMoodData([...community])
        }
        else if (selection === "Hot"){
            if(community.length != 0){
                const data=[...community]
                const sortByComments = (objA, objB) => {
                    const Blen=objB.comments.length
                    const Alen=objA.comments.length
                    return Blen - Alen; // Descending order for max first
                };
                const resultant=data.sort(sortByComments)
                setMoodData(resultant)
            }
        }
        else if (selection === "Recent"){
            if(community.length != 0){
                const data=[...community]
                const sortByDate = (objA,objB) =>{
                    const DateA = new Date(objA.published_date)
                    const DateB = new Date(objB.published_date)
                    return DateB > DateA ? 1 : -1;
                }
                const resultant=data.sort(sortByDate)
                console.log(resultant)
                setMoodData(resultant)
            }
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetch_popular=()=>{
        const sortByLikes = (objA, objB) => {
            return objB.likes_count - objA.likes_count; // Descending order for max first
        };
        const data=[...community].sort(sortByLikes)
        SetSortedData(data)
    }

    const search=(e)=>{
        const data=MoodData.filter((item)=>{
            if (item.title.includes(e)===true){
                return item
            }
        })
        if(data.length != 0){
            Setfound(true)
        }
        else{
            Setfound(false)
        }
        console.log(searchcomm)
        Setsearchcomm(data)
    }

    useEffect(()=>{
        fetch_Community()
        setMoodData([...community])
    },[community])

    useEffect(()=>{
        fetch_popular()
    })

    useEffect(()=>{
        MoodSwitcher()
    },[selection,MoodData])
    return(
        <>
            <div className="flex flex-col mx-auto my-10">
                <div className="text-4xl mx-auto mb-10 container my-5">
                    Popular Threads
                    <hr className="w-96 bg-red-400 h-2 rounded-full "></hr>
                </div>
                {(MoodData.length != 0 && sortedData.length != 0)&&(
                <div className="flex flex-row px-32 mx-auto mb-10 gap-5 container">
                    <div className="container mx-auto p-5">
                        <Swiper
                        className="p-10 h-full"
                        modules={[Pagination]}
                        spaceBetween={50}
                        slidesPerView={2}
                        pagination={{ clickable: true }}
                        >
                            {
                                sortedData.slice(0,4).map((item)=>{
                                    // eslint-disable-next-line react/jsx-key
                                    return <SwiperSlide> <Popular key={item.id} data={item}/> </SwiperSlide>
                                })
                            }
                    </Swiper>
                    </div>   
                </div>
                )}
                <div className="text-4xl mx-auto mb-10 container my-5">
                    Explore
                    <hr className="w-64 bg-red-400 h-2 rounded-full "></hr>
                </div>
                <div className="text-xl mx-auto container px-48 mb-5 flex flex-col">
                    <div className="flex flex-row gap-3">
                        <input type="text" className="text-center rounded-3xl w-10/12 p-3 py-5 border-gray-400 border-4" onChange={(e)=>search(e.target.value)} placeholder="Search"></input>
                        <button className="p-4 ps-7 border-2 border-black rounded-3xl flex flex-row items-center hover:bg-red-400 hover:text-white" onClick={()=>setddactive((prev)=>!prev)}>
                            <div className="text-2xl">
                                {selection}
                            </div>
                            <div>
                                <span className="material-symbols-outlined text-2xl">
                                    expand_more
                                </span> 
                            </div>
                        </button>
                    </div>
                    { ddactive &&
                    (<div className=" flex flex-col justify-end items-end 2xl:px-7 md:px-0">
                        <div className="border-gray-300 border-2 flex flex-col">
                            <button className="hover:bg-blue-500 hover:text-white p-4 px-7 flex flex-row gap-1" onClick={()=>{setselection("Random");setddactive(false)}}>
                                <span className="material-symbols-outlined">shuffle</span>Random
                            </button>
                            <button className="hover:bg-blue-500 hover:text-white p-4 px-7 flex flex-row" onClick={()=>{setselection("Hot");setddactive(false)}}>
                                <span className="material-symbols-outlined">local_fire_department</span>Hot
                            </button>
                            <button className="hover:bg-blue-500 hover:text-white p-4 px-7 flex flex-row"onClick={()=>{setselection("Recent");setddactive(false)}}>
                            <span className="material-symbols-outlined">schedule</span>Recent
                            </button>
                        </div>
                    </div>)
                    }   
                </div>
                {(MoodData.length != 0 && searchcomm.length === 0) &&(
                    <div className="flex flex-col justify-center align-center">
                        {found?(
                        <div> 
                            {
                                MoodData.map((item)=>{
                                    // eslint-disable-next-line react/jsx-key
                                    return <Community data={item}/>
                                })
                            }
                        </div>
                        ):(
                            <div className="flex flex-col mx-auto text-xl my-5">
                                <img src="/community/NoResults.png"></img>
                            </div>
                        )}
                    </div>
                )}
                {(searchcomm.length != 0 && MoodData.length != 0) &&(<div className="flex flex-col justify-center align-center">
                    {
                        searchcomm.map((item)=>{
                            // eslint-disable-next-line react/jsx-key
                            return <Community data={item}/>
                        })
                    }
                </div>)}
            </div>
        </>
    )
}