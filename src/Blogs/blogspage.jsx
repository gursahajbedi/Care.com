import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay,FreeMode} from 'swiper/modules';

export function BlogsComponent(prop){
    const navigate = useNavigate()

    const navigation = () =>{
        navigate('/blogs/post/'+ prop.data.id,{state:JSON.stringify(prop.data)})
    }
    return(
        <div className="w-5/12 flex flex-col justify-around" onClick={navigation}>
            <div className="flex flex-row h-64 justify-center items-center w-full shadow-xl border border-gray-400 p-8 bg-white" style={{borderRadius:"70px"}}>
                <img src="https://cdn.pixabay.com/photo/2016/11/08/05/08/adult-1807500_1280.jpg" className="rounded-3xl" style={{height:"200px",width:"200px",borderRadius:"50px", objectFit:"cover"}}></img>
                <div className="mx-10">
                    <div className="flex flex-row mx-auto justify-between w-full">
                        {(prop.data.category === "General") && <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                            {prop.data.category}
                        </div>}
                        {(prop.data.category === "Advice") && <div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                            {prop.data.category}
                        </div>}
                        {(prop.data.category === "Tips") && <div className="mt-3  px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 text-black rounded-full">
                            {prop.data.category}
                        </div>}
                        <div className="mt-3 2xl:text-xl md:text-lg py-2">
                            -{prop.data.author}
                        </div>
                    </div>
                    <div className="2xl:text-2xl font-semibold md:text-2xl mt-5">
                        {prop.data.title}
                    </div>
                    <div className="text-xl mt-3">
                        {prop.data.shortdesc.slice(0,50)}...
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
                {prop.title}
                {prop.title === "Advice" && (<hr className="rounded-full bg-blue-400 h-2 w-44"></hr>)}
                {prop.title === "General" && (<hr className="rounded-full bg-red-400 h-2 w-44"></hr>)}
                {prop.title === "Tips" && (<hr className="rounded-full bg-yellow-400 h-2 w-44"></hr>)}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-y-7 mx-auto gap-x-5">
                {prop.data.slice(0,4)}
            </div>
            <div className="mx-auto flex flex-col items-center mt-8">
                <div onClick={()=>navigation()}>
                    <img src="/blogs/seemore.svg"></img>
                </div>
            </div>
        </>
    )
}

export function Hero(prop){
    return(
        <>
        <div className="" style={{height:"630px"}}>
            <div className="flex flex-col justify-center items-center h-full w-full shadow-xl border border-gray-400 p-10 bg-white" style={{borderRadius:"70px"}}>
                <img src="https://cdn.pixabay.com/photo/2016/11/08/05/08/adult-1807500_1280.jpg" className="rounded-3xl" style={{height:"370px",width:"100%",borderRadius:"50px", objectFit:"cover"}}></img>
                <div className="flex flex-row mx-auto justify-between w-full">
                    {prop.data.category === "General"&&(<div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-red-500 rounded-full">
                        {prop.data.category}
                    </div>)}
                    {prop.data.category === "Advice" &&(<div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-blue-500 rounded-full">
                        {prop.data.category}
                    </div>)}
                    {prop.data.category === "Tips" &&(<div className="mt-3 text-white px-5 py-2 2xl:text-xl md:text-lg bg-yellow-500 rounded-full">
                        {prop.data.category}
                    </div>)}
                    <div className="mt-3 2xl:text-xl md:text-lg py-2">
                        -{prop.data.author}
                    </div>
                </div>
                <div className="2xl:text-3xl md:text-2xl mt-5">
                    {prop.data.title}
                </div>
                <div className="text-xl mt-3">
                    {prop.data.shortdesc}
                </div>
            </div>
        </div>
        </>
    )
}

export default function BlogsPage(){
    const [blogs, setBlogs] = useState([])
    const [general,setGeneral]=useState([])
    const [advice,setAdvice]=useState([])
    const [hero,setHero]=useState([])
    const [tips,setTips]=useState([])
    const fetchblogs=()=>{
        axios.get("http://localhost:8000/blogs").then(
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
            if(item.category === "General" || item.category === "general"){
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
            if(item.category === "Advice" || item.category === "advice"){
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
            if(item.category === "Tips" || item.category === "tips"){
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