import { useEffect, useState } from "react"
import "./home.css"
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { URL } from "../../global"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Testimonials from "./testimonials.jsx"
import Community from "./community.jsx"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Statistics from "./statistics.jsx";
import StatisticsCounter from "./statistics.jsx";


export default function Home({auth}){
    const [find, setfind]=useState("Care")
    const [testimonials_data,set_td]=useState([])
    const[Blogs,setBlogs]=useState([])
    const[communitys,setCommunity]=useState([])
    const[testimonial,setTestimonials]=useState([])
    
    const fetch_blogs=()=>{
        axios.get(`${ URL }/api/blogs/list/`).then(
            (res)=>{
                console.log(res.data)
                setBlogs(res.data)
            }
        )
    }
    
    const fetch_community=async()=>{
        await axios.get(`${ URL }/api/community/posts/`).then((res)=>{
            setCommunity(res.data)
        })
    }
    
    const fetch_testimonials = async () => {
        try {
            const res = await axios.get(`${ URL }/api/bookings/getRatings/`);
            if (res.data.length !== 0) {
                const data=res.data.filter((item)=>{
                    if(item.rating === 5 || item.rating === "5"){
                        return item
                    }
                })
                setTestimonials(data);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const testimonials_map=()=>{
        const data=testimonial.map((item)=>{
            // eslint-disable-next-line react/jsx-key
            return (<SwiperSlide><Testimonials data={item} key={item.id}/></SwiperSlide>)
        })
        set_td(data)
    }

    useEffect(()=>{
        fetch_blogs();
        fetch_community();
        fetch_testimonials();
        testimonials_map();
    },[])

    useEffect(()=>{
        fetch_testimonials();
        testimonials_map();
    },[testimonial])


    const navigate=useNavigate()
    
    const handlesubmit=()=>{
        navigate('/searchnanny',{state:pin})
    }

    const [pin,setpin]=useState()

    return (
        <>
            <div className="flex flex-col mt-10" id="hero">
                <div className="mx-auto container flex flex-row justify-between items-center">
                    <div className="flex flex-col ">
                        <div className="text-4xl 2xl:text-5xl ms-2">
                            Easing Your MotherHood with <br/> Local Caretakers.
                        </div>
                        <div className="mt-5">
                            <div className="flex flex-row gap-10 ms-3 mb-6">
                                <div>
                                    <button onClick={()=>{setfind("Care")}} className="w-full 2xl:text-xl md:text-lg">Find A Care</button>
                                    {find==="Care" && <hr className="w-24 h-2 rounded-full" style={{backgroundColor:"#FF5B5B"}}></hr>}
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <input type="text" className="md:w-72 2xl:w-96 h-16 p-4 2xl:text-2xl md:text-xl border rounded-full shadow-lg" placeholder="Enter Your Pincode" onChange={(e)=>setpin(e.target.value)}></input>
                                <img src="./homepage/location.svg" className="pin relative right-12"></img>
                                <button id="Search" className="rounded-full h-16 w-44 border 2xl:text-2xl md:text-xl text-white" style={{"backgroundColor":"#FF5B5B"}} onClick={handlesubmit}>Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col me-3">
                        <img src="/homepage/mother.svg" className="w-full md:h-80 2xl:h-full"></img>
                    </div>
                </div>
                <div className="">
                    <object className="absolute w-full -z-40" data="/homepage/creative1.svg" type="image/svg+xml"></object>
                    <div className="mt-10 pt-10 mx-auto container flex flex-row justify-center items-top gap-20">
                        <div className="flex flex-col justify-center items-center">
                            <img src="/homepage/safefeature.svg" style={{height:"150px",width:"150px"}}></img>
                            <p className="text-lg text-center">Safe Nuturing Care</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <img src="/homepage/247feature.svg" style={{height:"150px",width:"150px"}}></img>
                            <p className="text-lg text-center">24/7 Live Support</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <img src="/homepage/nourishmentfeature.svg" style={{height:"150px",width:"150px"}}></img>
                            <p className="text-lg text-center">Tailoured Nourishment</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                        <img src="/homepage/communityfeature.svg" style={{height:"150px",width:"150px"}}></img>
                            <p className="text-lg text-center">Active Care Community</p>
                        </div>
                    </div>
                </div>
                {testimonial.length != 0 && (<div className="">
                    <div className="mt-6 mx-auto flex flex-col justify-center">
                        <div className="mt-6 2xl:text-4xl md: text-3xl text-center">
                            Hear From The Customers Themselves!
                        </div>
                        <div className="container mx-auto p-5">
                            <Swiper
                            className="p-10"
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={50}
                            slidesPerView={3}
                            navigation
                            pagination={{ clickable: true }}
                            >
                                    {testimonials_data}
                            </Swiper>
                        </div>
                    </div>
                </div>
                )}
                <div>
                    <div className="mx-auto my-8 flex flex-col">
                        <div className="text-4xl my-5 text-center">
                            Discover Our Blogs!
                        </div>
                        <div className="text-2xl my-5 text-center">
                            Curated Blogs just for you to gain insights from professional experts, helping you gain knowledge every step of the way.
                        </div>
                        {Blogs.length != 0 && (<div className="my-5">
                            <object className=" absolute w-full -z-40 " data="/homepage/creative2.svg" type="image/svg+xml"></object>
                            <div className="flex flex-row 2xl:flex-nowrap md:flex-wrap gap-10 2xl:px-48 md:px-24">
                            <div className=" 2xl:w-5/12 md:w-12/12 2xl:my-8 md:my-0 ">
                                <div className="flex flex-col justify-center items-center h-full w-full shadow-xl border border-gray-400 p-10 bg-white" style={{borderRadius:"70px"}}>
                                <img src={`${ URL }${Blogs[0].image}`} className="rounded-3xl" style={{height:"400px",width:"100%",borderRadius:"50px", objectFit:"cover"}}></img>
                                    <div className="flex flex-row mx-auto justify-between w-full">
                                            {Blogs[0].post_type === 'general' || Blogs[0].post_type === 'General' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                                                General
                                                </div>
                                            )}
                                            {Blogs[0].post_type === 'advice' || Blogs[0].post_type === 'Advice' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                                                Advice
                                                </div>
                                            )}
                                            {Blogs[0].post_type === 'tips' || Blogs[0].post_type === 'Tips' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 rounded-full">
                                                Tips
                                                </div>
                                            )}
                                        <div className="mt-3 2xl:text-xl md:text-lg py-2">
                                            
                                        </div>
                                    </div>
                                    <div className="2xl:text-3xl md:text-2xl mt-5">
                                        {Blogs[0].title}
                                    </div>
                                    <div className="text-xl mt-3">
                                        {Blogs[0].short_desc.slice(0,200)}...
                                    </div>
                                </div>
                            </div>
                            <div className="2xl:w-7/12 md:w-12/12 flex flex-col justify-around">
                                <div className="flex flex-row justify-center items-top w-full shadow-xl border border-gray-400 p-8 bg-white" style={{borderRadius:"70px"}}>
                                    <img src={`${ URL }${Blogs[1].image}`} className="rounded-3xl" style={{height:"280px",width:"280px",borderRadius:"50px", objectFit:"cover"}}></img>
                                    <div className="mx-10">
                                        <div className="flex flex-row mx-auto justify-between w-full">
                                            
                                        {Blogs[1].post_type === 'general' || Blogs[1].post_type === 'General' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                                                General
                                                </div>
                                            )}
                                            {Blogs[1].post_type === 'advice' || Blogs[1].post_type === 'Advice' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                                                Advice
                                                </div>
                                            )}
                                            {Blogs[1].post_type === 'tips' || Blogs[1].post_type === 'Tips' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 rounded-full">
                                                Tips
                                                </div>
                                            )}
                                            <div className="mt-3 2xl:text-xl md:text-lg py-2">
                                                
                                            </div>
                                        </div>
                                        <div className="2xl:text-3xl md:text-2xl mt-5">
                                            {Blogs[1].title}
                                        </div>
                                        <div className="text-xl mt-3">
                                            {Blogs[1].short_desc.slice(0,200)}...
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-center items-top w-full shadow-xl border border-gray-400 p-8 bg-white" style={{borderRadius:"70px"}}>
                                    <img src={`${ URL }${Blogs[2].image}`} className="rounded-3xl" style={{height:"280px",width:"280px",borderRadius:"50px", objectFit:"cover"}}></img>
                                    <div className="mx-10">
                                        <div className="flex flex-row mx-auto justify-between w-full">
                                            
                                        {Blogs[2].post_type === 'general' || Blogs[2].post_type === 'General' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                                                General
                                                </div>
                                            )}
                                            {Blogs[2].post_type === 'advice' || Blogs[2].post_type === 'Advice' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                                                Advice
                                                </div>
                                            )}
                                            {Blogs[2].post_type === 'tips' || Blogs[2].post_type === 'Tips' && (
                                                <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 rounded-full">
                                                Tips
                                                </div>
                                            )}
                                            <div className="mt-3 2xl:text-xl md:text-lg py-2">
                                                
                                            </div>
                                        </div>
                                        <div className="2xl:text-3xl md:text-2xl mt-5">
                                            {Blogs[2].title}
                                        </div>
                                        <div className="text-xl mt-3">
                                            {Blogs[2].short_desc.slice(0,200)}...
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                        <div className="mx-auto container flex justify-center">
                            <div className="my-8 flex flex-col text-center">
                                <Link to="/blogs">
                                    <div className="flex flex-row justify-center">
                                        <div className="2xl:text-2xl md:text-xl">
                                            See More
                                        </div>
                                        <img src="/homepage/arrow.svg" className="ms-3"></img>
                                    </div>
                                    <hr className="h-1 w-36 bg-black rounded-full "></hr>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="text-4xl my-5 text-center">
                        Access the Motherly Community!
                    </div>
                    <div className="mx-auto xl:text-2xl md:text-xl my-5 text-center w-10/12">
                        Explore your motherhood further, with interacting with a community of mothers and day-care workers, assisting you in every step of the way!
                    </div>  
                    <object className="absolute w-full -z-40" data="/homepage/creative1.svg" type="image/svg+xml"></object>
                    {(communitys.length) != 0 && (
                        <div>
                        {
                        communitys.slice(0,3).map((item)=>{
                            // eslint-disable-next-line react/jsx-key
                            return (<Community data={item}/>)
                        })
                        }
                        </div>
                    )}
                    <div className="mx-auto conainer flex justify-center">
                        <div className="my-3 flex flex-col text-center">
                            <a href="/community">
                                <div className="flex flex-row justify-center">
                                    <div className="2xl:text-2xl md:text-xl">
                                        See More
                                    </div>
                                    <img src="/homepage/arrow.svg" className="ms-3"></img>
                                </div>
                                <hr className="h-1 w-36 bg-black rounded-full "></hr>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-10 w-9/12">
                    <div className="text-4xl my-5 text-center">
                        Become A Day Care Partner
                    </div>
                    <div className="mx-auto xl:text-2xl md:text-xl my-5 text-center w-10/12">
                        Join us, and become a collaborator, in nourishing the new generation for success. Our program ensures a through training and lesson based environment for upcoming Day Care Workers.
                    </div>
                    <div className="flex-row flex justify-center">
                        <div className="w-6/12 h-3/4 my-10 mb-16">
                            {auth && (<Link to="/myzone/verification">
                                <img src="/homepage/daycarepartner.svg" className="relative w-11/12 left-14 h-full"></img>
                            </Link>)}
                            {!auth && (<Link to="/login">
                                <img src="/homepage/daycarepartner.svg" className="relative w-11/12 left-14 h-full"></img>
                            </Link>)}
                        </div>
                    </div>
                </div>
            </div>  
        </>
    )
}