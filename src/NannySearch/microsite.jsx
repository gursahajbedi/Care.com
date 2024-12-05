/* eslint-disable react/prop-types */
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import dateFormat, { masks } from "dateformat";
import './microsite.css'
import { Rating } from 'react-simple-star-rating'
import useAuthContext from "../AuthLogic/useAuthContext";
import { URL } from "../../global";

function ReviewPanel({ data, setstate, renderStars, setaddreview }) {
    const [profiles, setProfiles] = useState({});
    const {auth}=useAuthContext()

    const fetchProfile = async (id) => {
        if (!profiles[id]) { // Check if the profile is already fetched
            try {
                const res = await axios.get(`${ URL }/api/accounts/list/`);
                console.log("hey")
                const profileData = res.data.find(item => item.id === id);
                if (profileData) {
                    setProfiles(prevProfiles => ({ ...prevProfiles, [id]: profileData }));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
    };

    useEffect(() => {
        // Fetch profiles for all unique user IDs in the data
        const uniqueUserIds = [...new Set(data.map(item => item.user))];
        uniqueUserIds.forEach(id => fetchProfile(id));
    }, [data]);

    return (
        <>
            <div className="overlay-review" onClick={() => setstate(false)}>
                <div className="content-review flex flex-col justify-between">
                    {auth.user && (<div className="flex flex-col items-center justify-center">
                        <button onClick={() => setaddreview(true)} className=" w-full bg-red-400 flex flex-row items-center justify-center rounded-full py-2 px-8 text-xl text-white hover:brightness-75">Add A Review <span className="text-5xl ps-3">+</span></button>
                    </div>)}
                    {!auth.user && (<div className="flex flex-col items-center justify-center">
                        <Link to={"/login"} className="w-full bg-blue-400 flex flex-row items-center justify-center rounded-full py-2 px-8 text-xl text-white hover:brightness-75">Login to write A Review <span className="text-3xl ps-3 material-symbols-outlined">arrow_forward</span></Link>
                    </div>)}
                    {
                        data.map((item) => {
                            const profile = profiles[item.user];
                            return (
                                <div key={item.id} className="flex flex-col justify-center items-center w-full my-8">
                                    <div className="flex flex-row items-center justify-center w-full">
                                        <div className="w-2/12 flex flex-col justify-center items-center">
                                            <div style={{ height: "100px", width:"100px"}}>
                                            {profile && (
                                                <img src={`${ URL }${profile.profile_pic}`} style={{ height: "100%", width: "100%", objectFit: "cover" }} className="rounded-full" alt={`${profile.name}'s profile`} />
                                            )}
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-end border-b-2 pb-3 border-gray-300 w-10/12 gap-x-4">
                                            <div className="flex flex-col ">
                                                <div className="w-3/12 text-2xl text-nowrap">
                                                    {profile ? profile.name : 'Loading...'}
                                                </div>
                                                <div className="text-base w-6/12 text-nowrap text-gray-400">
                                                    Posted On {dateFormat(item.posted_on, "dd/mm/yyyy")}
                                                </div>
                                            </div>
                                            <div className="w-3/12 text-2xl flex flex-row items-center justify-center">
                                                <div className="pt-1">
                                                    {item.rating ? item.rating.toFixed(1) : 0}
                                                </div>
                                                <div className="flex flex-row ps-3">
                                                    {renderStars(item.rating ? item.rating.toFixed(1) : 0)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center ps-4">
                                        {item.content}
                                    </div>
                                </div>
                            );
                        })
                    }
                    
                </div>
            </div>
        </>
    );
}
function Ratings({data,id,type}){
    const [rating,setrating]=useState([])
    const [total,settotal]=useState()
    const [top,settop]=useState({})
    const [reviewactive,setreviewactive]=useState(false)
    const [addreview,setaddreview]=useState(false)
    const [stars,setStars]=useState(0)
    const [reviewcontent,setreviewcontent]=useState()
    const [profile, setprofile] = useState({});

    const {auth}=useAuthContext()

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

      const fetchrating = async () => {
        try {
            const res = await axios.get(`${ URL }/api/bookings/getRatings/`);
            if (res.data.length !== 0) {
                console.log(res.data)
                const data = res.data.filter((item) => item.profile === Number(id) && item.domain_name === type);
                setrating(data);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

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

    const fetchprofile = async (id) => {
        await axios.get(`${ URL }/api/accounts/list/`).then((res) => {
          const data=res.data.filter((item)=>{
            if(item.id==id){
              return item
            }
          })
          setprofile(data[0])
        });
    }

    const fetchtop=()=>{
        if (rating.length !== 0) {
            const topItem = rating.reduce((max, item) => (item.rating > max.rating ? item : max), rating[0]);
            fetchprofile(topItem.user)
            console.log(topItem)
            settop(topItem);
        }
    }

    const handlereviewsubmit=async()=>{
        console.log(auth.user.name,reviewcontent,stars)
        await axios.post(`${ URL }/api/bookings/addRating/`,{
            "profile": id,
            "domain_name": type,
            "content": reviewcontent,
            "rating": Number(stars),
            "user": Number(auth.user.id)
        },{
            headers:{
                'Authorization' : `Bearer ${auth.user.access}`
            }
        }).then(()=>{console.log("postedf");setaddreview(false);fetchrating()})
    }

    useEffect(()=>{
        fetchrating()
        fetchtotal()
        fetchtop()
        console.log("No Depend")
    },[])

    useEffect(()=>{
        fetchrating()
        console.log("Review Depend")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[type])

    useEffect(()=>{
        fetchtotal()
        fetchtop()
        console.log("Multidepend")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[type,reviewactive,rating])

    const handleStars = (rate) => {
        const ratefixed=rate.toFixed(1)
        setStars(ratefixed)
        console.log(ratefixed)
    }


    return(
        <div className="w-12/12 flex flex-col mt-10">
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
            {top != {} && rating.length !=0 &&(
            <div className="flex flex-col justify-center items-center w-full my-8">
                <div className="flex flex-row items-center justify-center w-full">
                    <div className="w-2/12 flex flex-col justify-center items-center">
                        <div style={{ height: "100px", width:"100px"}}>
                        {profile && (
                            <img src={`${ URL }${profile.profile_pic}`} style={{ height: "100%", width: "100%", objectFit: "cover" }} className="rounded-full" alt={`${profile.name}'s profile`} />
                        )}
                        </div>
                    </div>
                    <div className="flex flex-row items-end border-b-2 pb-3 border-gray-300 w-10/12 gap-x-4">
                        <div className="w-3/12 text-2xl text-nowrap">
                            {profile.name}
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
            {rating.length === 0 && (
                <div className="flex flex-col items-center justify-center text-3xl mt-10 gap-y-5">
                    No Reviews Yet!
                    {auth.user && (<div>
                        <button onClick={()=>setaddreview(true)} className="bg-red-400 flex flex-row justify-center items-center rounded-full py-2 px-8 text-xl text-white hover:brightness-75">Be the first one to Review <span className="text-5xl ps-3">+</span></button>
                    </div>)}
                    {!auth.user && (<div>
                        <Link to={'/login'} className="bg-blue-400 flex flex-row items-center justify-center rounded-full py-2 px-8 text-xl text-white hover:brightness-75">Please Login To Write A Review<span className="text-3xl ps-3 material-symbols-outlined">arrow_forward</span></Link>
                    </div>)}
                </div>
            )}
            {rating.length !=0 && (<div className="flex flex-col items-start ps-4">
                <button className="border-b-4 border-gray-400 rounded-full hover:bg-gray-300" onClick={()=>setreviewactive(true)}>
                    <div className="flex flex-row items-center gap-x-4 border-2 border-gray-300 rounded-full p-3 px-6">
                        <div className="text-2xl">
                            See All Reviews
                        </div>
                        <img src="/apply/arrow.svg" style={{height:"20px"}}></img>
                    </div>
                </button>
            </div>)}
            {reviewactive && (
                <ReviewPanel data={rating} setstate={setreviewactive} renderStars={renderStars} key={rating} setaddreview={setaddreview}/>
            )}
            {addreview && (
                <div className="overlay-review">
                    <div className="content-review">
                        <div className="flex flex-row items-end justify-end">
                            <span className="material-symbols-outlined bg-red-400 rounded-full p-1 text-white" onClick={()=>setaddreview(false)}>
                                close
                            </span>
                        </div>
                        <div className=" text-2xl">
                            Add A Review  
                            <hr className="bg-red-400 rounded-full w-64 h-1"></hr>
                        </div>
                        <div className="flex flex-row mt-4 items-center">
                            <Rating onClick={handleStars}/>
                            <div className="text-2xl ps-3">
                                {stars}
                            </div>
                        </div>
                        <div className="w-full mt-5">
                            <textarea onChange={(e)=>{setreviewcontent(e.target.value)}} className="p-2 text-xl border-2 w-full" rows={5}></textarea>
                        </div>
                        <div className="flex flex-row items-end justify-end mt-3">
                            <button onClick={()=>handlereviewsubmit()} className="bg-red-400 rounded-full text-2xl text-white px-5 py-2">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}



function About({data}){
    return(
        <>
            <div className="w-12/12 flex flex-col">
                <div className="text-3xl ps-4">
                    About {data.display_name} 
                </div>
                <hr className="w-full h-1 rounded-full bg-red-400 "></hr>
                <div className="text-xl px-4 py-8">
                    <div dangerouslySetInnerHTML={{ __html: data.about }} />
                </div>
            </div>
        </>
    )
}

export default function Microsite(){
    const {id,type}=useParams()
    const [isactive,setactive]=useState(type)
    const {auth}=useAuthContext()
    
    const [data,setdata]=useState({})
    const [domainslist,setdomainslist]=useState([])
    const [app,setapp]=useState({})
    const [domains,setdomains]=useState([])
    const[profile,setprofile]=useState({})

    const fetchprofile = async (id,setdata) => {
        try {
            const response = await axios.get(`${ URL }/api/accounts/list/`);
            const data = response.data.find(item => item.id === Number(id));
            if (data) {
                console.log(data);
                setdata(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const timings=data.timings?data.timings:{
        "monday": {
            "from": "",
            "to": ""
          },
          "tuesday": {
            "from": "",
            "to": ""
          },
          "wednesday": {
            "from": "",
            "to": ""
          },
          "thurday": {
            "from": "",
            "to": ""
          },
          "friday": {
            "from": "",
            "to": ""
          },
          "saturday": {
            "from": "",
            "to": ""
          },
          "sunday": {
            "from": "",
            "to": ""
          }
    }

    useEffect(()=>{
        fetchdata(); 
        fetchprofile(id);
    },[id,type,isactive])

    useEffect(()=>{
        filterdata()
    },[type,domainslist])

    useEffect(()=>{
        if(app != {}){
            fetchprofile(app.user, setprofile)
        }
    },[app])

    const fetchdata=async()=>{
        try {
            await axios.get(`${ URL }/api/app/list/`).then((res)=>{
            const newdata=res.data.filter((item)=>{
                if(item.id === Number(id)){
                    return item
                }
            })
            const data1 = newdata[0]
            setapp(data1)
            const domain=data1.domains==="{}"?[]:JSON.parse(data1.domains)
            setdomainslist(domain)
            console.log(domain)
        })
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
        <div className="flex flex-col items-center justify-center my-36">
            <div className="flex flex-row justify-center items-center gap-x-32 mb-20">
                <object className="absolute w-full mt-20 -z-40" data="/microsite/creative.svg" type="image/svg+xml"></object>
                <div className="w-8/12 flex flex-row items-center gap-x-10">
                    <div style={{height:"260px",width:"350px"}}>
                        <img src={`${ URL }${profile.profile_pic}`} className="rounded-full" style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                    </div>
                    <div className="flex flex-col text-4xl w-8/12">
                        <div className="flex flex-row text-nowrap gap-x-4 items-end">
                            {data.display_name}
                        </div>
                        <div className="text-3xl">
                            {data.age} y/o
                        </div>
                        <div className="text-3xl">
                            Starting from {data.one_time_base_rate}₹ / hr
                        </div>
                        <div className="text-2xl">
                            {data.city} , {data.state} - {data.pincode}
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
                                <Link to={`/nanny/${id}/${item}`} onClick={()=>handleclick(item)} key={item}>
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
            <div className="flex flex-row w-full justify-center px-44 mt-24 " key={type}>
                <div className="w-7/12">
                    <About data={data}/>
                    <Ratings  data={data} id={id} type={type} />
                    <Services data={data} id={id} type={type}/>
                </div>
                <div className="w-5/12 flex flex-col items-center mt-20">
                    <div className="text-4xl">
                        Timings
                    </div>
                    <hr className="w-72 h-1 rounded-full bg-red-400 "></hr>
                    <div className="flex flex-col items-center text-2xl gap-y-3 mt-3 ">
                        <div>Monday : {timings.monday.from} - {timings.monday.to}</div>
                        <div>Tuesday : {timings.tuesday.from} - {timings.tuesday.to}</div>
                        <div>Wednesday : {timings.wednesday.from} - {timings.wednesday.to}</div>
                        <div>Thursday : {timings.thurday.from} - {timings.thurday.to}</div>
                        <div>Friday : {timings.friday.from} - {timings.friday.to}</div>
                        <div>Saturday : {timings.saturday.from} - {timings.saturday.to}</div>
                        <div>Sunday : {timings.sunday.from} - {timings.sunday.to}</div>
                    </div>
                    {auth.user &&(<Link to={`/booking/${id}/${type}/`} state={{timing:timings,data:data}} className="bg-red-400 rounded-full mt-4 shadow-xl hover:brightness-75 text-white text-2xl p-4 flex flex-row items-center"> Request A Booking<span className=" text-4xl material-symbols-outlined">arrow_forward</span></Link>)}
                    {!auth.user &&(<Link to={`/login`} state={{timing:timings,data:data}} className="bg-red-400 rounded-full mt-4 shadow-xl hover:brightness-75 text-white text-2xl p-4 flex flex-row items-center"> Request A Booking<span className=" text-4xl material-symbols-outlined">arrow_forward</span></Link>)}
                </div>
            </div>
        </div>
        </>
    )
}

export function Services({data,id,type}){
    const childranges=data.child_age_ranges?data.child_age_ranges:[]
    const pet_type=data.pet_type?data.pet_type:[]
    const chw=data.can_help_with?data.can_help_with:[]
    const services=data.services?data.services:[]
    const prodetails=data.professional_details?data.professional_details:[]
    const lang=data.languages?data.languages:[]
    const work=data.work_experience?data.work_experience:[]


    return(
        <>  
        <div className="w-12/12 flex flex-col mt-10">
            <div className="text-3xl ps-4 flex flex-row justify-between mt-10 w-8/12">
                <div className="">
                    Services
                </div>
            </div>
            <hr className="w-full h-1 rounded-full bg-red-400 "></hr>
            <div className="flex flex-col items-start justify-center text-2xl ps-4 gap-y-8 mt-7">
                {type === "childcare" && (<div>
                <div className="flex flex-col items-start justify-center">
                    <div className="mb-2 font-semibold">
                        Age Groups
                    </div>
                    <hr className="bg-gray-400 h-1 w-96"></hr>
                </div>
                <div className="flex flex-row justify-center items-center gap-x-5 mt-4">
                    {
                        childranges.map((item)=>{
                            return(
                                <div key={item} className="flex flex-col items-center justify-center gap-y-3">
                                    {item==="Less Than 1"&&(<img src="/childcare/zonelessthan1.svg" style={{height:"160px"}}></img>)}
                                    {item==="1-3 Years Old"&&(<img src="/childcare/zone1-3yearsold.svg" style={{height:"160px"}}></img>)}
                                    {item==="3-5 Years Old"&&(<img src="/childcare/zone3-5yearsold.svg" style={{height:"160px"}}></img>)}
                                    {item === "5-11 Years Old" &&(<img src="/childcare/zone5-11years.svg" style={{height:"160px"}}></img>)}
                                    {item === "12+ Years Old" &&(<img src="/childcare/zone12+yearsold.svg" style={{height:"160px"}}></img>)}
                                    {item}
                                </div>
                            )
                        })
                    }
                </div></div>)}
                {type === "petcare" && (<div>
                <div className="flex flex-col items-start justify-center">
                    <div className="mb-2 font-semibold">
                        Pet Types
                    </div>
                    <hr className="bg-gray-400 h-1 w-96"></hr>
                </div>
                <div className="flex flex-row justify-center flex-wrap items-center gap-x-5 gap-y-5 mt-8">
                    {
                        pet_type.map((item)=>{
                            return(
                                <div key={item} className="flex flex-col items-center justify-center gap-y-3">
                                    {item==="Cat"&&(<img src="/petcare/cat.svg" style={{height:"160px"}}></img>)}
                                    {item==="Dog"&&(<img src="/petcare/dog.svg" style={{height:"160px"}}></img>)}
                                    {item==="Birds"&&(<img src="/petcare/bird.svg" style={{height:"160px"}}></img>)}
                                    {item === "Hamsters" &&(<img src="/petcare/hamster.svg" style={{height:"160px"}}></img>)}
                                    {item === "Rabbits" &&(<img src="/petcare/rabbit.svg" style={{height:"160px"}}></img>)}
                                    {item === "Turtles/Tortoise" &&(<img src="/petcare/turtle.svg" style={{height:"160px"}}></img>)}
                                    {item}
                                </div>
                            )
                        })
                    }
                </div></div>)}
                <div className="flex flex-col items-start justify-center my-8">
                    <div className="mb-2 font-semibold">
                        Services Offered
                    </div>
                    <hr className="bg-gray-400 h-1 w-96"></hr>
                    <div className="flex flex-row flex-wrap gap-x-3 mt-10 gap-y-3">
                        {
                            services.map((item)=>{
                                return(
                                    <div key={item} className="flex flex-row items-center justify-center gap-x-2">
                                        <span className="material-symbols-outlined">
                                            check
                                        </span>
                                        <div className="text-xl">
                                            {item}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col items-start justify-center mb-6">
                    <div className="mb-2 font-semibold">
                        Can Help With
                    </div>
                    <hr className="bg-gray-400 h-1 w-96"></hr>
                    <div className="flex flex-row flex-wrap gap-x-3 mt-10 gap-y-3">
                        {
                            chw.map((item)=>{
                                return(
                                    <div key={item} className="flex flex-row items-center justify-center gap-x-2">
                                        <span className="material-symbols-outlined">
                                            check
                                        </span>
                                        <div className="text-xl">
                                            {item}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                
            </div>
            <div className="text-3xl ps-4 flex flex-row justify-between mt-10 w-8/12">
                <div className="">
                    Qualifications & Work Experience
                </div>
            </div>
            <hr className="w-full h-1 rounded-full bg-red-400 "></hr>
            <div className="flex flex-col items-start justify-center text-2xl ps-4 gap-y-4 mt-8 w-full">
                <div className="flex flex-col items-start justify-center">
                    <div className="mb-2 font-semibold">
                        Qualifications
                    </div>
                    <hr className="bg-gray-400 h-1 w-96"></hr>
                </div>
                <div className="flex flex-row justify-center w-full">
                    <div className="flex flex-col w-6/12">
                        <div className="font-bold mt-4">
                            Education
                        </div>
                        <div className="text-xl mt-4">
                        <div dangerouslySetInnerHTML={{ __html: data.education }} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-6/12">
                        <div className="font-bold mt-4">
                            Professional Details
                        </div>
                        <div className="flex flex-col items-start">
                            {
                                prodetails.map((item)=>{
                                    return(
                                        <div key={item} className="flex flex-row items-center justify-center gap-x-2">
                                            <span className="material-symbols-outlined">
                                                check
                                            </span>
                                            <div className="text-xl">
                                                {item}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start mb-5">
                    <div className="font-bold mt-4">
                        Languages
                    </div>
                    <div className="flex flex-row items-start flex-wrap mt-5">
                        {
                            lang.map((item)=>{
                                return(
                                    <div key={item} className="flex flex-row items-center justify-center pe-5">
                                        <span className="material-symbols-outlined text-sm pb-1">
                                            asterisk
                                        </span>
                                        <div className="text-xl">
                                            {item}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col items-start justify-center">
                    <div className="mb-2 font-semibold">
                        Work Experience
                    </div>
                    <hr className="bg-gray-400 h-1 w-96"></hr>
                </div>
                <div className="flex flex-row flex-wrap justify-center w-full my-8">
                    {
                        work.map((item)=>{
                            return(
                                <div className="flex flex-col gap-y-4 w-6/12" key={item}>
                                    <div className="font-bold text-xl">
                                        {item.from.slice(0,4)}-{item.to.slice(0,4)}
                                    </div>
                                    <div>
                                        {item.workplace}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="text-3xl ps-4 flex flex-row justify-between mt-10 w-8/12">
                <div className="">
                    Safety Check
                </div>
            </div>
            <hr className="w-full h-1 rounded-full bg-red-400 "></hr>
            <div className="flex flex-col my-7 gap-y-7">
                <div className="flex flex-col w-full border-b-2 border-gray-400 rounded-full text-xl">
                    <div className="flex flex-row items-center justify-between w-full border-2 border-gray-200 rounded-full p-5">
                        <div className="flex flex-row items-center font-bold">
                            CareVerify Check
                            <span className="text-4xl pb-2 material-symbols-outlined text-green-400">
                                check
                            </span>
                        </div>
                        <img src="/microsite/careverify.svg"></img>
                    </div>

                </div>
                <div className="flex flex-col w-full border-b-2 border-gray-400 rounded-full text-xl">
                    <div className="flex flex-row items-center justify-between w-full border-2 border-gray-200 rounded-full p-5">
                        <div className="flex flex-row items-center font-bold">
                            Criminal Background Check
                            <span className="text-4xl pb-2 material-symbols-outlined text-green-400">
                                check
                            </span>
                        </div>
                        <span className="text-5xl pe-1 material-symbols-outlined">
                            domino_mask   
                        </span>
                    </div>

                </div>
                <div className="flex flex-col w-full border-b-2 border-gray-400 rounded-full text-xl">
                    <div className="flex flex-row items-center justify-between w-full border-2 border-gray-200 rounded-full p-5">
                        <div className="flex flex-row items-center font-bold">
                            Police Verification Check
                            <span className="text-4xl pb-2 material-symbols-outlined text-green-400">
                                check    
                            </span>
                        </div>
                        <span className="text-5xl pe-1 material-symbols-outlined">
                            local_police    
                        </span>
                    </div>

                </div>

            </div>
        </div>
        </>
    )
}