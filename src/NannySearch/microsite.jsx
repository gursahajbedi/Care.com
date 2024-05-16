import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import dateFormat, { masks } from "dateformat";
import './microsite.css'

function ReviewPanel({data,setstate,renderStars}){
    return(
        <>
        <div className="overlay" onClick={()=>setstate(false)}>
            <div className="content">
                {
                    data.map((item)=>{
                        return(
                            <div key={data} className="flex flex-col justify-center items-center w-full my-8">
                                <div className="flex flex-row items-center justify-center w-full">
                                    <div className="w-2/12">
                                        <img src="/microsite/ratingpic.svg" style={{height:"100px",width:"100px"}}></img>
                                    </div>
                                    <div className="flex flex-row items-end border-b-2 pb-3 border-gray-300 w-10/12 gap-x-4">
                                        <div className="flex flex-col ">
                                            <div className="w-3/12 text-2xl text-nowrap">
                                                {item.name}
                                            </div>
                                            <div className="text-base w-6/12 text-nowrap text-gray-400">
                                                Posted On {dateFormat(item.posted_on,"dd/mm/yyyy")}
                                            </div>
                                        </div>
                                        <div className="w-3/12 text-2xl flex flex-row items-center justify-center">
                                            <div className="pt-1">
                                                {item.rating?item.rating.toFixed(1):0}
                                            </div>
                                            <div className="flex flex-row ps-3">
                                                {renderStars(item.rating?item.rating.toFixed(1):0)}
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center ps-4">
                                    {item.content}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        </>
    )
}

function Ratings({data,id,type}){
    const [rating,setrating]=useState([])
    const [total,settotal]=useState()
    const [top,settop]=useState({})
    const [reviewactive,setreviewactive]=useState(false)

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
    
        const stars = [];
    
        // Full stars
        for (let i = 0; i < fullStars; i++) {
          stars.push(
            <span key={i}>
              <img src="/microsite/star_fill.svg"></img>
            </span>
          );
        }
    
        // Half star
        if (halfStar === 1) {
          stars.push(
            <span key="half">
              <img src="/microsite/star_half.svg"></img>
            </span>
          );
        }
    
        // Empty stars
        for (let i = 0; i < 5 - fullStars - halfStar; i++) {
          stars.push(
            <span key={fullStars + halfStar + i}>
              <img src="/microsite/star_none.svg"></img>
            </span>
          );
        }
    
        return stars;
      };

    const fetchrating=async()=>{
        await axios.get("http://localhost:8000/ratings").then((res)=>{
            if(res.data.length !== 0){
                const data=res.data.filter((item)=>{
                    if(item.nanny_id === id && item.type === type ){
                        return item
                    }
                })
                setrating(data)
            }
        })
    }

    const fetchtotal=()=>{
        const list=[]
        if(rating.length != 0 ){
            rating.map((item)=>{
                list.push(item.rating)
            })
            const sum=parseFloat(list.reduce((acc,curr)=>acc+curr,0))
            const avg=parseFloat(sum/rating.length)
            settotal(avg.toFixed(1))
        }
        if(rating.length === 0){
            settotal((0).toFixed(1))
        }
    }

    const fetchtop=()=>{
        if(rating.length != 0){
        const data=rating.filter((item)=>{
            if(item.rating === 5){
                return item
            }
        })
        settop(data[0])
        }
    }

    useEffect(()=>{
        fetchrating()
        setreviewactive(false)
    },[type])

    useEffect(()=>{
        fetchtotal()
        fetchtop()
        setreviewactive(false)
    },[type,rating,reviewactive])

    return(
        <div className="w-8/12 flex flex-col mt-10">
            <div className="text-3xl ps-4 flex flex-row justify-between">
                <div className="w-8/12">
                    Reviews
                </div>
                <div className="w-4/12 flex flex-row">
                    {total}
                    <div className="text-2xl">({rating.length})</div>
                    <div className="ms-4 border-s-2 border-gray-300 flex flex-row items-center ps-3">
                        {renderStars(total)}
                    </div>
                </div>
            </div>
            <hr className="w-full h-1 rounded-full bg-red-400 "></hr>
            {top.length !=0 &&(
            <div className="flex flex-col justify-center items-center w-full my-8">
                <div className="flex flex-row items-center justify-center w-full">
                    <div className="w-2/12">
                        <img src="/microsite/ratingpic.svg" style={{height:"100px",width:"100px"}}></img>
                    </div>
                    <div className="flex flex-row items-end border-b-2 pb-3 border-gray-300 w-10/12 gap-x-4">
                        <div className="w-3/12 text-2xl text-nowrap">
                            {top.name}
                        </div>
                        <div className="text-base w-6/12 text-nowrap text-gray-400">
                            Posted On {dateFormat(top.posted_on,"dd/mm/yyyy")}
                        </div>
                        <div className="w-3/12 text-2xl flex flex-row items-center justify-center">
                            <div className="pt-1">
                                {top.rating?top.rating.toFixed(1):0}
                            </div>
                            <div className="flex flex-row ps-3">
                                {renderStars(top.rating?top.rating.toFixed(1):0)}
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center ps-4">
                    {top.content}
                </div>
            </div>)}
            <div className="flex flex-col items-start ps-4">
                <button className="border-b-4 border-gray-400 rounded-full hover:bg-gray-300" onClick={()=>setreviewactive(true)}>
                    <div className="flex flex-row items-center gap-x-4 border-2 border-gray-300 rounded-full p-3 px-6">
                        <div className="text-2xl">
                            See All Reviews
                        </div>
                        <img src="/apply/arrow.svg" style={{height:"20px"}}></img>
                    </div>
                </button>
            </div>
            {reviewactive && (
                <ReviewPanel data={rating} setstate={setreviewactive} renderStars={renderStars} key={rating}/>
            )}
        </div>
    )

}

function About({data}){
    return(
        <>
            <div className="w-8/12 flex flex-col">
                <div className="text-3xl ps-4">
                    About {data.display_name} 
                </div>
                <hr className="w-full h-1 rounded-full bg-red-400 "></hr>
                <div className="text-xl px-4 py-8">
                    <p>{data.about}</p>
                </div>
                <button className="shadow-xl w-full h-12 border-2 border-gray-200 rounded-full"><span className="text-5xl material-symbols-outlined">expand_less</span></button>
            </div>
        </>
    )
}

export default function Microsite(){
    const {id,type}=useParams()
    const [isactive,setactive]=useState(type)
    
    const [data,setdata]=useState({})
    const [domainslist,setdomainslist]=useState([])
    const [domains,setdomains]=useState([])

    useEffect(()=>{
        fetchdata(); 
    },[id,type,isactive])

    useEffect(()=>{
        filterdata()
    },[type,domainslist])

    const fetchdata=async()=>{
        try {
            const res = await axios.get(`http://localhost:8000/applications/${id}`);
            setdomainslist(res.data.domains_offered);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    const filterdata=()=>{
        const domain=[]
        if(domainslist.length != 0){
            const Ndata=domainslist.filter((item)=>{
                domain.push(item.type)
                if(item.type===type){
                    return item
                }
            })
            setdata(Ndata[0])
            setdomains(domain)
        }
    }

    const handleclick=(newType)=>{
        setactive(newType)
    }

    return(
        <>
        <div className="flex flex-col items-center justify-center my-20">
            <div className="flex flex-row justify-center items-center gap-x-32">
                <object className="absolute w-full mt-20 -z-40" data="/microsite/creative.svg" type="image/svg+xml"></object>
                <div className="w-8/12 flex flex-row items-center gap-x-10">
                    <div className="w-6/12">
                        <img src="/nanny/profile_img.svg" style={{height:"400px",width:"400px"}}></img>
                    </div>
                    <div className="flex flex-col text-4xl w-7/12">
                        <div className="flex flex-row text-nowrap gap-x-4 items-end">
                            {data.display_name}
                            <div className="text-3xl">{data.age} y/o</div>
                        </div>
                        <div className="text-3xl">
                            Starting from {data.recurring_base_rate}₹ / hr
                        </div>
                        <div className="text-2xl">
                            {data.city} , {data.state} - {data.pincode}
                        </div>
                        <div className="flex flex-row items-center text-2xl text-nowrap relative -left-4">
                            <img src="/nanny/hiredblack.svg" style={{height:"40px"}}></img>
                            Hired By 1 Family in your Neighborhood
                        </div>
                    </div>
                </div>
                <div className="w-4/12 flex flex-col justify-center items-center gap-y-5 text-3xl">
                    <div>
                        Domains Offered:
                    </div>
                    {
                        domains.map((item)=>{
                            return(
                                // eslint-disable-next-line react/jsx-key
                                <Link to={`/nanny/${id}/${item}`} onClick={()=>handleclick(item)}>
                                    {isactive === item ?(
                                    <div className="rounded-full border-t-4 border-gray-500" >
                                        <div className="rounded-full border-2 border-gray-400 bg-blue-400 text-white px-10 py-2 text-center">
                                            {item[0].toUpperCase() + item.slice(1)}
                                        </div>
                                    </div>
                                    ):(
                                    <div className="rounded-full border-b-4 border-gray-500">
                                        <div className="rounded-full border-2 border-gray-400 bg-white px-10 py-2 text-center">
                                            {item[0].toUpperCase() + item.slice(1)}
                                        </div>
                                    </div>
                                    )}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex flex-row w-full justify-center items-center px-64 mt-24">
                <div>
                <About key={isactive} data={data}/>
                <Ratings data={data} id={id} type={type} />
                </div>
                <div className="w-4/12">

                </div>
            </div>
        </div>
        </>
    )
}