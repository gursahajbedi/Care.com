import axios from "axios"
import { useEffect, useState } from "react"
import Eldercare from "../Myzone/eldercare"
import Slider from '@mui/material/Slider';
import Childcare from "../Myzone/childcare";
import { Link, useLocation } from "react-router-dom";
import { htmlToText } from "html-to-text";
import { data } from "autoprefixer";
import { URL } from "../../global";

function Head(prop){
    return(
        <div className="flex flex-row justify-center items-center gap-x-20">
            {prop.type != "childcare" &&(<button className="py-3 px-5 flex flex-col items-center justify-center" onClick={()=>{prop.settype("childcare")}}>
                <div>
                    <img className="" src="/nanny/child.svg"></img>
                </div>
                <div className="text-xl">
                    Child Caretaker
                </div>
            </button>)}
            {prop.type === "childcare" &&(<button className="py-3 px-5 flex flex-col items-center justify-center rounded-2xl" style={{boxShadow:"inset gray 0px 10px 25px -15px"}} onClick={()=>{prop.settype("childcare")}}>
                <div>
                    <img className="" src="/nanny/child.svg"></img>
                </div>
                <div className="text-xl">
                    Child Caretaker
                </div>
            </button>)}
            {prop.type != "eldercare" &&(<button className="py-3 px-5 flex flex-col items-center justify-center" onClick={()=>{prop.settype("eldercare")}}>
                <div>
                    <img className="" src="/nanny/elder.svg"></img>
                </div>
                <div className="text-xl">
                    Elder Caretaker
                </div>
            </button>)}
            {prop.type === "eldercare" &&(<button className="py-3 px-5 flex flex-col items-center justify-center rounded-2xl" style={{boxShadow:"inset gray 0px 10px 25px -15px"}} onClick={()=>{prop.settype("eldercare")}}>
                <div>
                    <img className="" src="/nanny/elder.svg"></img>
                </div>
                <div className="text-xl">
                    Elder Caretaker
                </div>
            </button>)}
            {prop.type != "petcare" &&(<button className="py-3 px-5 flex flex-col items-center justify-center" onClick={()=>{prop.settype("petcare")}}>
                <div>
                    <img className="" src="/nanny/pet.svg"></img>
                </div>
                <div className="text-xl">
                    Pet Caretaker
                </div>
            </button>)}
            {prop.type === "petcare" &&(<button className="py-3 px-5 flex flex-col items-center justify-center rounded-2xl" style={{boxShadow:"inset gray 0px 10px 25px -15px"}} onClick={()=>{prop.settype("petcare")}}>
                <div>
                    <img className="" src="/nanny/pet.svg"></img>
                </div>
                <div className="text-xl">
                    Pet Caretaker
                </div>
            </button>)}
        </div>
    )
}

export function AddsList({setdata}){
    const component={
        id:1,
        item:""
    }
    const [list,setlist]=useState([component])

    const handleadd=(e)=>{
        e.preventDefault()
        const data={
            id:list.length + 1,
            item:""
        }
        setlist([...list,data])
    }
    const handlechange=(value,id)=>{
        const newlist=list.filter((item)=>{
            if(item.id===id){
                return item.item=value
            }
            else{
                return item
            }
        })
        setlist(newlist)
    }
    const filterlist=()=>{
        const data=[]
        list.filter((item)=>{
            data.push(item.item)
        })
        setdata(data)
    }

    useEffect(()=>{
        filterlist()
    },[list])

    return(
        <>
        <div className="flex flex-row items-center">
            <div className="flex flex-col">
            {
                list.map((item)=>{
                    return (<input key={item.id} placeholder="Any Other.." className="border-b-2 border-gray-400 px-3 py-1 my-1" type="text" onChange={(e)=>handlechange(e.target.value,item.id)}></input>)
                })
            }
            </div>
            <img className="hover:brightness-75 relative" src="/childcare/add.svg" style={{height:"30px"}} onClick={(e)=>handleadd(e)}></img>
        </div>
        
        </>
    )
}

function NannyComponent(prop){

    const [profile,setprofile]=useState({})
    const [rating,setrating]=useState([])
    const [total,settotal]=useState()
    const [app,setapp]=useState({})

    const textContent = htmlToText(prop.data.about, {
        wordwrap: false,
        preserveNewlines: true,
      });

    const fetchprofile = async (id) => {  
          await axios.get(`${ URL }/api/accounts/list/`).then((res) => {
            console.log(id)
            const data = res.data.find(item => item.id === id);
            if (data) {
                setprofile(data);
                prop.setLoading(false)
            }
          });
    }

    const fetchapp =async()=>{
        await axios.get(`${ URL }/api/app/list/`).then((res)=>{
            const ndata=res.data.filter((item)=>{
                
                if(item.id == prop.data.id){
                    return item
                }
            })
            console.log("appdata",ndata)
            setapp(ndata[0])
            fetchprofile(ndata[0].user)
        })
    }

    const fetchrating = async () => {
        try {
            const res = await axios.get(`${ URL }/api/bookings/getRatings/`);
            if (res.data.length !== 0) {
                
                const data = res.data.filter((item) => item.profile === Number(prop.data.id) && item.domain_name === prop.data.type);
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

    useEffect(()=>{
        fetchapp()
    },[prop.data.type])

    useEffect(()=>{
        fetchrating()
    },[profile,prop.data.id,prop.data.type])

    useEffect(()=>{
        fetchtotal()
    },[rating])

    return(
        <Link to={`/nanny/${prop.data.id}/${prop.data.type}`} state={{pincode:prop.data.pincode}}>
        <div className="flex-col w-full justify-between items-center">
            <div className="flex flex-row justify-between items-center">
                {!prop.loading && (
                <div className="w-3/12">
                    <img src={`${ URL }${profile.profile_pic}`} className="rounded-xl" style={{height:"150px",width:"100%",objectFit:"cover"}}></img>
                </div>
                )}
                {prop.loading && (
                <div className="w-3/12">
                    <img src={`/auth/default-profile.jpg`} className="rounded-xl" style={{height:"150px",width:"100%",objectFit:"cover"}}></img>
                </div>
                )}
                <div className=" w-7/12 flex flex-col ms-7">
                    <div className="flex flex-row items-end">
                        <div className="text-2xl">
                            {prop.data.display_name}
                        </div>
                        <div className="text-xl ps-3">
                            {prop.data.age} y/o
                        </div>
                    </div>
                    <div className="flex flex-row items-center py-2 text-xl">
                        <div className="flex flex-row items-center">{renderStars(total)}</div>
                        <div className="mt-1">({rating.length})</div>
                    </div>
                    <div className="text-xl">
                        {prop.data.city} , {prop.data.state} - {prop.data.pincode}
                    </div>
                </div>
                <div className="w-2/12 flex flex-col items-center text-center">
                    <div className="text-lg text-gray-400">
                        Starting From
                    </div>
                    <div className="text-2xl">
                        {prop.data.one_time_base_rate}/-
                    </div>
                    <div className="text-lg text-gray-400">
                        Per Hour
                    </div>
                </div>
                <hr></hr>
            </div>
            <div className="flex flex-row justify-between items-center mt-3">
                <div className="pe-5">
                    {textContent.slice(0,150)}
                </div>
                <div>
                    <button className="hover:brighness-75 bg-blue-400 text-white rounded-full px-7 shadow-xl py-3 text-xl">
                        Book
                    </button>
                </div>
            </div>
            <hr className="bg-red-400 w-full h-1 rounded-full my-12"/>
        </div>
        </Link>
    )
}

function Filters(prop){
    const [value1, setValue1] = useState([100, 10000]);
    const [age,setage]=useState([])
    const [languages,setlanguages]=useState([])
    const [pet,setpet]=useState([])
    const [addlang,setaddlang]=useState([])
    const [finallang,setfinallang]=useState([])
    

    function valuetext(value) {
        return `₹${value}`;
    }

    

    const handleclick=(e)=>{
        if (age.length != 0){
            if(age.includes(e)){
                const newlist=age.filter((item)=>{
                    if(item != e){
                        return item
                    }
                })
                setage(newlist)
            }
            else{
                setage([...age,e])
            }
        }
        else{
            setage([...age,e])
        }
    }
    
    const handleclicklang=(e)=>{
        if (languages.length != 0){
            if(languages.includes(e)){
                const newlist=languages.filter((item)=>{
                    if(item != e){
                        return item
                    }
                })
                setlanguages(newlist)
            }
            else{
                setlanguages([...languages,e])
            }
        }
        else{
            setlanguages([...languages,e])
        }
    }

    const handleclickpet=(e)=>{
        if (pet.length != 0){
            if(pet.includes(e)){
                const newlist=pet.filter((item)=>{
                    if(item != e){
                        return item
                    }
                })
                setpet(newlist)
            }
            else{
                setpet([...pet,e])
            }
        }
        else{
            setpet([...pet,e])
        }
    }

    const handleChange1 = (
        event,
        newValue,
        activeThumb,
      ) => {
        if (!Array.isArray(newValue)) {
          return;
        }
    
        if (activeThumb === 0) {
          setValue1([newValue[0], value1[1]]);
        } else {
          setValue1([value1[0], newValue[1]]);
        }
      };

      const joinlanguages=()=>{
        const data=addlang.filter((item)=>{
            if(item != ""){
                return item
            }
        })
        setfinallang(languages.concat(data))
    }


    useEffect(()=>{
        joinlanguages()
    },[finallang,addlang, languages])

    const handlesubmit =()=>{
        prop.setprice(value1)
        prop.setlang(finallang)
        prop.setage(age)
        prop.setpet(pet)
    }
    
    return(
        <div className="flex flex-col items-center">
            <div className="flex flex-row items-center mt-5">
                <select className="border-2 border-gray-400 text-2xl w-72 px-5 py-2 rounded-full appearance-none text-gray-400" defaultValue={prop.type} onChange={(e)=>{prop.settype(e.target.value)}}>
                    <option value="childcare">Child CareTaker</option>
                    <option value="eldercare">Elder CareTaker</option>
                    <option value="petcare">Pet CareTaker</option>
                </select>
                <span className="material-symbols-outlined relative -left-9">arrow_downward</span>
            </div>
            <div className="flex flex-row items-center mt-5">
                <input className="border-2 border-gray-400 text-2xl w-72 px-5 py-2 rounded-full appearance-none text-gray-400" defaultValue={prop.pincode} onChange={(e)=>{prop.setpincode(e.target.value)}}></input>
                <span className="material-symbols-outlined relative -left-9">location_on</span>
            </div>
            <div className="flex flex-col items-center mt-5 relative -left-3">
                <div className="border-2 border-gray-400 text-2xl w-72 px-5 py-2 rounded-2xl">
                    <div className="mt-2">
                        Filters
                        <hr className="rounded-full w-32 bg-gray-900"/>
                    </div>
                    <div className="text-xl text-gray-500 mt-2">
                        Pay Rate
                        <div className="text-2xl text-blue-400 mt-2">   
                            ₹{value1[0]} - ₹{value1[1]} / hr
                            <Slider
                              getAriaLabel={() => 'Minimum distance'}
                              value={value1}
                              onChange={handleChange1}
                              min={100}
                              max={10000}
                              step={100}
                              valueLabelDisplay="auto"
                              getAriaValueText={valuetext}
                              disableSwap
                            />
                        </div>  
                    </div>
                    {prop.type === "childcare" && (<div className="text-xl text-gray-500 mt-2">
                        Child Age Ranges:
                        <div className="flex flex-wrap text-base mt-2">
                            {age.includes("Less Than 1")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Less Than 1" onClick={(e)=>handleclick(e.target.value)}>Less Than 1</button>)}
                            {!age.includes("Less Than 1")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Less Than 1" onClick={(e)=>handleclick(e.target.value)}>Less Than 1</button>)}
                            {age.includes("1-3 Years Old")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="1-3 Years Old" onClick={(e)=>handleclick(e.target.value)}>1-3 Years</button>)}
                            {!age.includes("1-3 Years Old")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2"  value="1-3 Years Old"onClick={(e)=>handleclick(e.target.value)}>1-3 Years</button>)}
                            {age.includes("4-5 Years Old")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="4-5 Years Old" onClick={(e)=>handleclick(e.target.value)}>4-5 Years</button>)}
                            {!age.includes("4-5 Years Old")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="4-5 Years Old" onClick={(e)=>handleclick(e.target.value)}>4-5 Years</button>)}
                            {age.includes("6-11 Years Old")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="6-11 Years Old"onClick={(e)=>handleclick(e.target.value)}>6-11 Years</button>)}
                            {!age.includes("6-11 Years Old")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="6-11 Years Old"onClick={(e)=>handleclick(e.target.value)}>6-11 Years</button>)}
                            {age.includes("12+ Years Old")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="12+ Years Old"onClick={(e)=>handleclick(e.target.value)}>12+ Years</button>)}
                            {!age.includes("12+ Years Old")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="12+ Years Old"onClick={(e)=>handleclick(e.target.value)}>12+ Years</button>)}
                        </div>
                    </div>)}
                    {prop.type === "petcare" && (<div className="text-xl text-gray-500 mt-2">
                        Pet Type:
                        <div className="flex flex-wrap text-base mt-2">
                            {pet.includes("Cat")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Cat" onClick={(e)=>handleclickpet(e.target.value)}>Cat</button>)}
                            {!pet.includes("Cat")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Cat" onClick={(e)=>handleclickpet(e.target.value)}>Cat</button>)}
                            {pet.includes("Dog")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Dog" onClick={(e)=>handleclickpet(e.target.value)}>Dog</button>)}
                            {!pet.includes("Dog")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2"  value="Dog"onClick={(e)=>handleclickpet(e.target.value)}>Dog</button>)}
                            {pet.includes("Birds")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Birds" onClick={(e)=>handleclickpet(e.target.value)}>Birds</button>)}
                            {!pet.includes("Birds")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Birds" onClick={(e)=>handleclickpet(e.target.value)}>Birds</button>)}
                            {pet.includes("Hamsters")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Hamsters"onClick={(e)=>handleclickpet(e.target.value)}>Hamsters</button>)}
                            {!pet.includes("Hamsters")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Hamsters"onClick={(e)=>handleclickpet(e.target.value)}>Hamsters</button>)}
                            {pet.includes("Rabbits")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Rabbits"onClick={(e)=>handleclickpet(e.target.value)}>Rabbits</button>)}
                            {!pet.includes("Rabbits")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Rabbits"onClick={(e)=>handleclickpet(e.target.value)}>Rabbits</button>)}
                            {pet.includes("Turtles/Tortoise")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Turtles/Tortoise"onClick={(e)=>handleclickpet(e.target.value)}>Turtles/Tortoise</button>)}
                            {!pet.includes("Turtles/Tortoise")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Turtles/Tortoise"onClick={(e)=>handleclickpet(e.target.value)}>Turtles/Tortoise</button>)}
                        </div>
                    </div>)}
                    <div className="text-xl text-gray-500 mt-2">
                        Languages Preferred:
                        <div className="flex flex-wrap text-base mt-2">
                            {languages.includes("English")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="English" onClick={(e)=>handleclicklang(e.target.value)}>English</button>)}
                            {!languages.includes("English")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="English" onClick={(e)=>handleclicklang(e.target.value)}>English</button>)}
                            {languages.includes("French")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="French" onClick={(e)=>handleclicklang(e.target.value)}>French</button>)}
                            {!languages.includes("French")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2"  value="French"onClick={(e)=>handleclicklang(e.target.value)}>French</button>)}
                            {languages.includes("Hindi")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Hindi" onClick={(e)=>handleclicklang(e.target.value)}>Hindi</button>)}
                            {!languages.includes("Hindi")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Hindi" onClick={(e)=>handleclicklang(e.target.value)}>Hindi</button>)}
                            {languages.includes("Punjabi")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Punjabi"onClick={(e)=>handleclicklang(e.target.value)}>Punjabi</button>)}
                            {!languages.includes("Punjabi")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Punjabi"onClick={(e)=>handleclicklang(e.target.value)}>Punjabi</button>)}
                            {languages.includes("Spanish")&&(<button className="bg-gray-400 text-white rounded-full border-2 border-gray-200 px-4 py-2" value="Spanish"onClick={(e)=>handleclicklang(e.target.value)}>Spanish</button>)}
                            {!languages.includes("Spanish")&&(<button className="border-2 border-gray-200 rounded-full px-4 py-2" value="Spanish"onClick={(e)=>handleclicklang(e.target.value)}>Spanish</button>)}
                            <AddsList setdata={setaddlang}/>
                        </div>
                    </div>
                    <div className="text-xl text-gray-500 mt-2 flex flex-col items-end my-2">
                        <button className="rounded-full py-2 px-5 text-white border-2 border-gray-300 bg-red-400 shadow-xl" onClick={()=>handlesubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Searchnanny(){
    const [list,setlist]=useState([])
    const [typechoose,settypechoose]=useState("")
    const state=useLocation()
    const pin=state?state.state:null

    const preferences=JSON.parse(localStorage.getItem("preferences"))

    const [pincode,setpincode]=useState(pin?Number(pin):(preferences?preferences.pincode:null))
    const [type,settype]=useState(preferences?preferences.type:null)
    const [filtered,setfiltered]=useState([])

    //filters
    const [age,setage]=useState([])
    const [pet,setpet]=useState([])
    const [lang,setlang]=useState([])
    const [price,setprice]=useState([100,10000])
    const [xfilter,setxfilter]=useState([])
    const [loading,setloading]=useState(false)

    window.addEventListener('beforeunload',()=>{
        if(!localStorage.getItem("user")){
            localStorage.removeItem("preferences");
        }
    })

    const fetchdata=async()=>{
        await axios.get(`${ URL }/api/app/list/`).then((res)=>{
            if(res.data.length != 0){
                const listy=[]
                res.data.map((item)=>{
                    const domain=item.domains === "{}"?[]:JSON.parse(item.domains)
                    domain.map((item)=>{
                        listy.push(item)
                    })
                })
                setlist(listy)
            }
        })
    }

    const typefetching=()=>{
        const data=list.filter((item)=>{
            if (item.type == type && item.pincode == pincode){
                return item
            }
        })
        
        setfiltered(data)
    }

    const handlesubmit=()=>{
        localStorage.setItem("preferences",JSON.stringify({
            "type":typechoose,
            "setselect":true,
            "pincode":pincode
        }))
        settype(typechoose)
        
    }

    const filter = () => {
        const filteredData = filtered.filter((item) => {
            const itemPrice = Number(item.one_time_base_rate);
            
            // Filter by price
            if (itemPrice < price[0] || itemPrice > price[1]) {
                return false;
            }
    
            // Filter by languages
            if (lang.length > 0 && !lang.every(langItem => item.languages.includes(langItem))) {
                return false;
            }
    
            // Filter by age list for childcare
            if (type === "childcare" && age.length > 0 && !age.every(ageItem => item.child_age_ranges.includes(ageItem))) {
                return false;
            }
    
            // Filter by pet type for petcare
            if (type === "petcare" && pet.length > 0 && !pet.every(petItem => item.pet_type.includes(petItem))) {
                return false;
            }
    
            // All filters passed
            return true;
        });
        setxfilter(filteredData);
        
    };
    
    window.onload = function (){
        fetchdata();
        typefetching();
    }
    
    useEffect(()=>{
        fetchdata();
        typefetching();
        setloading(true)
    },[])

    useEffect(()=>{
        typefetching()
        setlang([])
        setpet([])
        setage([])
        setprice([100,10000])
        setloading(true)
    },[typechoose,type,pincode])

    useEffect(()=>{
        filter();
        setloading(true)
    },[price,age,lang])

    return(
        <div>
        {localStorage.getItem("preferences") &&(<div className="flex flex-col justify-center items-center px-32 my-16 gap-y-5">
            <Head type={type} settype={settype}/>
            <hr className="w-3/4 bg-red-400 rounded-full h-1"/>
            <div className="flex flex-row justify-between">
                <div className="w-4/12">
                    <Filters type={type} key={type} pincode={pincode} settype={settype} setpincode={setpincode} setprice={setprice} setlang={setlang} setage={setage} setpet={setpet}/>
                </div>
                {!(xfilter.length === 0 && filtered.length ===0) ?(<div>
                {(price[0]===100 && price[1]===10000 && pet.length === 0 && age.length === 0 && lang.length === 0 )?(<div className="w-8/12">
                {
                    filtered.map((item)=>{
                        return(<NannyComponent key={item} data={item} setLoading={setloading} loading={loading}/>)
                    })
                }
                </div>)
                :(<div className="w-8/12">
                    { xfilter.length !=0 &&(<div>
                    {
                        xfilter.map((item)=>{
                            return(<NannyComponent key={item} data={item} setLoading={setloading} loading={loading}/>)
                        })
                    }
                    </div>)}
                    {xfilter.length ===0 &&(
                        <div className="w-8/12 flex flex-col justify-center items-center" style={{width:"950px"}}>
                            <div>
                                <img src="/community/NoResults.png"></img>
                            </div>
                        </div>
                    )}
                </div>)}
                </div>):(
                <div className="w-8/12 flex flex-col justify-center items-center" style={{width:"950px"}}>
                        <div>
                            <img src="/community/NoResults.png"></img>
                        </div>
                </div>)}
                
            </div>

        </div>
        )}
        {!localStorage.getItem("preferences") &&(
            <div className="flex flex-col justify-center px-44 my-16 gap-y-5">
                <div className="text-3xl">
                    Looking For A Nanny?
                    <div className="text-gray-400 text-xl">
                    Share some details with us, so we can help make your search easier.
                    </div>
                    <hr className="w-full h-1 bg-red-400 rounded-full"/>
                </div>
                <div className="mt-5 flex flex-col jusitfy-center items-center text-2xl">
                    <div className="w-1/2 flex flex-col gap-y-4">
                        <div className="">
                            Select Type Of CareTaker
                        </div>
                        <div className="flex flex-row items-center">   
                            <select className="text-gray-400 border-2 border-gray-400 w-full px-5 py-5 rounded-2xl appearance-none" onChange={(e)=>{settypechoose(e.target.value)}}>
                                <option defaultValue value="">Select CareTaker</option>
                                <option value="childcare">Child Caretaker</option>
                                <option value="eldercare">Elder Caretaker</option>
                                <option value="petcare">Pet Caretaker</option>
                            </select>
                            <span className="material-symbols-outlined relative text-4xl -left-14">arrow_downward</span>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col gap-y-4 mt-7">
                        <div className="">
                            Enter Your Pincode
                        </div>
                        <div className="flex flex-row items-center">   
                            <input placeholder="Enter Your Pincode" className="border-2 border-gray-400 w-full px-5 py-5 rounded-2xl appearance-none" onChange={(e)=>{setpincode(e.target.value)}}></input>
                            <span className="material-symbols-outlined relative text-4xl -left-14">location_on</span>
                        </div>
                    </div>
                    <button onClick={()=>handlesubmit()} className="hover:brightness-75 mt-7 flex flex-row items-center gap-x-4 shadow-2xl bg-red-400 text-2xl px-7 py-4 me-4 text-white rounded-full ">Search <img src="/auth/whitearrow.svg"></img></button>
                </div>
            </div>
        )}
        </div>
    )
}