import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay,FreeMode} from 'swiper/modules';
import useAuthContext from "../AuthLogic/useAuthContext";
import { URL } from "../../global";


export function BlogsComponent(prop){
    const navigate = useNavigate()

    const navigation = () =>{
        navigate('/blogs/post/'+ prop.data.id,{state:JSON.stringify(prop.data)})
    }
    return(
        <div className="w-5/12 flex flex-col justify-around" onClick={navigation}>
            <div className="flex flex-row h-64 justify-center items-center w-full shadow-xl border border-gray-400 p-8 bg-white" style={{borderRadius:"70px"}}>
                <img src={`${ URL }${prop.data.image}`} className="rounded-3xl" style={{height:"200px",width:"200px",borderRadius:"50px", objectFit:"cover"}}></img>
                <div className="mx-10">
                    <div className="flex flex-row mx-auto justify-between w-full">
                        {(prop.data.post_type === "General" || prop.data.post_type === "general") && <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                            {prop.data.post_type.charAt(0).toUpperCase() + prop.data.post_type.slice(1)}
                        </div>}
                        {(prop.data.post_type === "Advice" || prop.data.post_type === "advice") && <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                            {prop.data.post_type.charAt(0).toUpperCase() + prop.data.post_type.slice(1)}
                        </div>}
                        {(prop.data.post_type === "Tips" || prop.data.post_type === "tips") && <div className="mt-3  px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 text-black rounded-full">
                            {prop.data.post_type.charAt(0).toUpperCase() + prop.data.post_type.slice(1)}
                        </div>}
                    </div>
                    <div className="2xl:text-2xl font-semibold md:text-2xl mt-5">
                        {prop.data.title}
                    </div>
                    <div className="text-xl mt-3">
                        {prop.data.short_desc.slice(0,100)}...
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Categories(prop){
    const navigate=useNavigate()

    const navigation=()=>{
        navigate(`/blogs/category/${prop.title.toLowerCase()}`,{state:JSON.stringify(prop.data)})
    }
    return(
        <>
            <div className="text-4xl my-10 container mx-auto">
                {prop.data.length !=0 ? prop.title : null}
                {(prop.title === "Advice" || prop.title === "advice") && (<hr className="rounded-full bg-blue-400 h-2 w-44"></hr>)}
                {(prop.title === "General" || prop.title === "general") && (<hr className="rounded-full bg-red-400 h-2 w-44"></hr>)}
                {(prop.title === "Tips" || prop.title === "tips") && prop.data.length != 0 && (<hr className="rounded-full bg-yellow-400 h-2 w-44"></hr>)}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-y-7 mx-auto gap-x-5">
                {prop.data.slice(0,4)}
            </div>
            {prop.data.length != 0 && (<div className="mx-auto flex flex-col items-center mt-8">
                <div onClick={()=>navigation()}>
                    <img src="/blogs/seemore.svg"></img>
                </div>
            </div>)}
        </>
    )
}

export function Hero(prop){
    return(
        <>
        <Link to={`/blogs/post/${Number(prop.data.id)}`} state={JSON.stringify(prop.data)}>
        <div className="" style={{height:"630px"}}>
            <div className="flex flex-col justify-center items-center h-full w-full shadow-xl border border-gray-400 p-10 bg-white" style={{borderRadius:"70px"}}>
                <img src={`${ URL }${prop.data.image}`} className="rounded-3xl" style={{height:"370px",width:"100%",borderRadius:"50px", objectFit:"cover"}}></img>
                <div className="flex flex-row mx-auto justify-between w-full">
                        {(prop.data.post_type === "General" || prop.data.post_type === "general") && <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                            {prop.data.post_type.charAt(0).toUpperCase() + prop.data.post_type.slice(1)}
                        </div>}
                        {(prop.data.post_type === "Advice" || prop.data.post_type === "advice") && <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                            {prop.data.post_type.charAt(0).toUpperCase() + prop.data.post_type.slice(1)}
                        </div>}
                        {(prop.data.post_type === "Tips"|| prop.data.post_type === "tips") && <div className="mt-3  px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 text-black rounded-full">
                            {prop.data.post_type.charAt(0).toUpperCase() + prop.data.post_type.slice(1)}
                        </div>}
                    <div className="mt-3 2xl:text-xl md:text-lg py-2">
                        
                    </div>
                </div>
                <div className="2xl:text-3xl md:text-2xl mt-5">
                    {prop.data.title}
                </div>
                <div className="text-xl mt-3">
                    {prop.data.short_desc.slice(0,100)}...
                </div>
            </div>
        </div>
        </Link>
        </>
    )
}

export default function BlogsPage(){

    let user=localStorage.getItem('user')
    if(user){
        user=JSON.parse(user)
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.access}`;
    }

    
    const [blogs, setBlogs] = useState([])
    const [general,setGeneral]=useState([])
    const [advice,setAdvice]=useState([])
    const [hero,setHero]=useState([])
    const [tips,setTips]=useState([])


    const fetchblogs=()=>{
        axios.get(`${ URL }/api/blogs/list/`).then(
            (res)=>{
                setBlogs(res.data)
            }
        )
    }
    const fetchHero=()=>{
        const data=blogs.map((item)=>{
            // eslint-disable-next-line react/jsx-key
            return <SwiperSlide><Hero data={item}/></SwiperSlide>
        })
        setHero(data.slice(0,6))
    }
    const fetchgeneral=()=>{
        const data=blogs.filter((item)=>{
            if(item.post_type === "General" || item.post_type === "general"){
                return item
            }
        }).map((item)=>{
            // eslint-disable-next-line react/jsx-key
            return <BlogsComponent data={item}/>
        })

        setGeneral(data)
    }
    const fetchadvice=()=>{
        const data=blogs.filter((item)=>{
            console.log(item)
            if(item.post_type === "Advice" || item.post_type === "advice"){
                return item
            }
        }).map((item)=>{
            // eslint-disable-next-line react/jsx-key
            return <BlogsComponent data={item}/>
        })

        setAdvice(data)
    }
    const fetchtips=()=>{
        const data=blogs.filter((item)=>{
            console.log(item)
            if(item.post_type === "Tips" || item.post_type === "tips"){
                return item
            }
        }).map((item)=>{
            // eslint-disable-next-line react/jsx-key
            return <BlogsComponent data={item}/>
        })

        setTips(data)
    }

    useEffect(()=>{
        fetchblogs()
    },[])

    useEffect(()=>{
        fetchadvice()
        fetchgeneral()
        fetchHero()
        fetchtips()
    },[blogs])

    return(
        <>
            <div className="mx-auto">
                <div className="">
                    <Swiper
                        className="px-48 py-16 h-full"
                        modules={[FreeMode,Autoplay,Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={70}
                        slidesPerView={2}
                        freeMode={true}
                        navigation
                        loop={true}
                        loopAdditionalSlides={1}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                          }}
                        pagination={{ clickable: true }}
                        >
                                {hero}
                    </Swiper>
                </div>
                <Categories data={general} title="General"/>
                <Categories data={advice} title="Advice"/>
                <Categories data={tips} title="Tips"/>
            </div>
        </>
    )
}