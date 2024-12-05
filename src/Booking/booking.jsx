import { useLocation, useNavigate, useParams } from "react-router"
import Calendar from 'react-calendar';
import { endOfToday, set } from 'date-fns' 
import {TimeRange} from '@matiaslgonzalez/react-timeline-range-slider'  
import { useEffect, useState } from "react"
import dateFormat from "dateformat"
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import useAuthContext from "../AuthLogic/useAuthContext";
import "./booking.css"
import { Link } from "react-router-dom";
import { URL } from "../../global";



const RangeSlider=({disabledIntervals,errorState,setErrorState,startTime,endTime,onChangeCallback})=>{

    return (
      <div>
        <TimeRange
          onChangeCallback={onChangeCallback}
          timelineInterval={[startTime,endTime]}
          selectedInterval={[startTime,endTime]}
          disabledIntervals={disabledIntervals}
          onUpdateCallback={({ error }) => {
            setErrorState(error);
          }}
          error={errorState}
        />
      </div>
    );
}

const MyCalendarComponent = ({setdate,date}) => {
    const {state}=useLocation()
    const timings=state

    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    };


    const tommorow = getTomorrowDate()

    return (
        <div>
            <Calendar minDate={tommorow} onChange={setdate} value={date} />
        </div>
    )
  }

export default function Booking(){
    const {auth}=useAuthContext()
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;

    const now=Date.now()
    const getDateAtSpecificHour = (hour = 12,date=now) =>
        set(date, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    };

    const [datatosend,setdatatosend]=useState({})

    const [errorState, setErrorState] = useState(true);
    const [booktime,setbooktime]=useState([])
    const tommorow=getTomorrowDate()

    const [date,setdate]= useState(tommorow)
    const [startTime,setstartTime]=useState(getDateAtSpecificHour(10))
    const [endTime,setendTime]=useState(getDateAtSpecificHour(20))

    const onChangeCallback =(item)=>{
        setbooktime(item)
        console.log(item)
    }
    const {id,type}=useParams()
    const [disabledIntervals, setDisabledIntervals] = useState([]);
    const [initialbooking,setinitialbooking]=useState([])
    const [bookings,setbookings]=useState([])

    const fetchbookings=async()=>{
        await axios.get(`${ URL }/api/bookings/manylist/`).then((res)=>{
            console.log(res.data)
            const data=res.data.filter((item)=>{            
                if(item.domain_name == type && item.profile == id){
                    return item
                }
            })
            setinitialbooking(data)
            console.log("initalbooking",data)
            console.log(data)
        })
    }
    

    const filterbookings = () => {
        let data = [];
        data = initialbooking.filter(item => item);
        setbookings(data);
    };

    useEffect(()=>{
        fetchbookings()
        filterbookings()
        console.log(bookings)
    },[])

    useEffect(() => {
        filterbookings();
        console.log(bookings)
    }, [initialbooking]);

    const disInt=()=>{
        console.log("bookings",bookings)
        const list = []
        bookings.forEach((item) => {
            try {
              console.log("item",item)
              const dString = item.day;
              const [day, month, year] = dString.split('/');
              const date = new Date(year, month - 1, day);
        
              const dfrom = item.from_time;
              const [hour] = dfrom.split(':');
              const from = getDateAtSpecificHour(parseInt(hour, 10), date);
        
              const dto = item.to_time;
              const [hour1] = dto.split(':');
              const to = getDateAtSpecificHour(parseInt(hour1, 10), date);
        
              list.push({
                id: item.id,
                start: from,
                end: to
              });
            } catch (error) {
              console.error('Error parsing date or time:', error);
            }
          });
          console.log("list",list)
          setDisabledIntervals(list)
    }

    useEffect(()=>{
        disInt()
    },[bookings])

    const getDayOfWeekFromDate = (date) => {
        const Newdate= new Date(date)
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thurday', 'friday', 'saturday'];
        return daysOfWeek[Newdate.getDay()];
    };

    const fetchtimings =()=>{
        const Newdate= new Date(date)
        const day=getDayOfWeekFromDate(date)
        const timing=timings[day]
        const dfrom = timing.from;
        const [hour] = dfrom.split(':');
        const from = getDateAtSpecificHour(parseInt(hour),Newdate);
        setstartTime(from)

        const dto = timing.to;
        const [hour1] = dto.split(':');
        const to = getDateAtSpecificHour(parseInt(hour1),Newdate);
        setendTime(to)

        setbooktime([from,to])
    }

    useEffect(()=>{
        fetchtimings()
        setErrorState(true)
    },[date])

    const {state}=useLocation()
    const timings=state.timing
    const data=state.data

    const [children,setchildren]=useState(1)
    const [pet,setpet]=useState(1)

    const getHourDifference = (date1, date2) => {
        // Calculate the difference in milliseconds
        const diffInMs = Math.abs(date2 - date1);
        
        // Convert milliseconds to hours
        const hours = diffInMs / (1000 * 60 * 60);
        
        return hours;
    };
    
    const calculatePrice = (type, active, baseRate, additionalCount, increment, startTime, endTime) => {
        const hours = getHourDifference(new Date(startTime), new Date(endTime));
        const base = Number(baseRate);
        const count = Number(additionalCount);
        const inc = Number(increment);
    
        if (type === 'childcare' || type === 'petcare') {
            // For childcare and petcare, if there are additional children/pets, adjust the price
            if (count.length == 0 || count == 0 || count == 1) {
                return (base + inc) * hours;
            }
            return (base + count * inc) * hours;
        } else if (type === 'eldercare') {
            // For eldercare, no additional count check
            return base * hours;
        }
    
        return 0; // Default case, should not reach here if type is correctly specified
    };

    const navigate=useNavigate()

    const [pet_type,setpet_type]=useState([])
    const [child_type,setchild_type]=useState([])

    const handleclick=(e,type,settype)=>{
        console.log(e)
        if (type.length != 0){
            if(type.includes(e)){
                const newlist=type.filter((item)=>{
                    if(item != e){
                        return item
                    }
                })
                settype(newlist)
            }
            else{
                settype([...type,e])
            }
        }
        else{
            settype([...type,e])
        }
    }

    const handlesubmit=async()=>{

        if (type==='childcare'){
            const baseRate = data.one_time_base_rate
            const price = calculatePrice(type, null, baseRate, children, data.increment, booktime[0], booktime[1]);
            const senddata={
                "user": Number(auth.user.id),
                "profile": Number(id),
                "domain_name": type,
                "no_of_pets":pet,
                "no_of_children":children,
                "child_types":JSON.stringify(child_type),
                "pet_types":JSON.stringify(pet_type),
                "day": dateFormat(date,"dd/mm/yyyy"),
                "from_time": dateFormat(booktime[0],"HH:MM:ss"),
                "to_time": dateFormat(booktime[1],"HH:MM:ss"),
                "price":price
            }
            navigate("/payment",{state:{data:JSON.stringify(senddata),pincode:data.pincode}})
            // await axios.post('http://localhost:8000/booking',{
            // "user_id": auth.user.id,
            // "nanny_id": id,
            // "type": type,
            // "children": children,
            // "date": dateFormat(date,"dd/mm/yyyy"),
            // "from": dateFormat(booktime[0],"HH:MM:ss"),
            // "to": dateFormat(booktime[1],"HH:MM:ss"),
            // "price":price
            // }).then(()=>console.log("Posted"))
        }
        else if(type==="eldercare"){
            const baseRate = data.one_time_base_rate
            const price = calculatePrice(type, null, baseRate, children, data.increment, booktime[0], booktime[1]);
            const senddata={
                "user": Number(auth.user.id),
                "profile": Number(id),
                "domain_name": type,
                "no_of_pets":pet,
                "no_of_children":children,
                "child_types":JSON.stringify(child_type),
                "pet_types":JSON.stringify(pet_type),
                "day": dateFormat(date,"dd/mm/yyyy"),
                "from_time": dateFormat(booktime[0],"HH:MM:ss"),
                "to_time": dateFormat(booktime[1],"HH:MM:ss"),
                "price":price
            }
            navigate("/payment",{state:{data:JSON.stringify(senddata),pincode:data.pincode}})
        //     await axios.post('http://localhost:8000/booking',{
        //     "user_id": auth.user.id,
        //     "nanny_id": id,
        //     "type": type,
        //     "children": children,
        //     "date": dateFormat(date,"dd/mm/yyyy"),
        //     "from": dateFormat(booktime[0],"HH:MM:ss"),
        //     "to": dateFormat(booktime[1],"HH:MM:ss"),
        //     "price":price

        // }).then(()=>console.log("Posted"))
        }
        else if(type==="petcare"){
            const baseRate =data.one_time_base_rate
            const price = calculatePrice(type, null, baseRate, children, data.increment, booktime[0], booktime[1]);
            const senddata={
                    "user": Number(auth.user.id),
                    "profile": Number(id),
                    "domain_name": type,
                    "no_of_pets":pet,
                    "no_of_children":children,
                    "child_types":JSON.stringify(child_type),
                    "pet_types":JSON.stringify(pet_type),
                    "day": dateFormat(date,"dd/mm/yyyy"),
                    "from_time": dateFormat(booktime[0],"HH:MM:ss"),
                    "to_time": dateFormat(booktime[1],"HH:MM:ss"),
                    "price":price
            }
            navigate("/payment",{state:{data:JSON.stringify(senddata),pincode:data.pincode}})
        //     await axios.post('http://localhost:8000/booking',{
        //     "user_id": auth.user.id,
        //     "nanny_id": id,
        //     "type": type,
        //     "pets": pet,
        //     "date": dateFormat(date,"dd/mm/yyyy"),
        //     "from": dateFormat(booktime[0],"HH:MM:ss"),
        //     "to": dateFormat(booktime[1],"HH:MM:ss"),
        //     "price":price

        // }).then(()=>console.log("Posted"))
        }
    }
    useEffect(()=>{
        console.log(datatosend)
    },[datatosend])
    return(
        <>
        <div className="mx-20 text-3xl mt-14 my-5 flex flex-row justify-between items-end">
            <div className="flex flex-col justify-center w w-10/12">
                <div className="text-4xl">
                    Booking
                </div>
            </div>
            <div className="flex flex-row items-center gap-x-7">
                    <div className="font-semibold text-3xl">
                        Amount:
                    </div>
                    {type==="childcare" && (<div className="text-4xl">
                        <p>{calculatePrice(type, null, data.one_time_base_rate, children, data.increment, booktime[0], booktime[1])}/-</p>
                    </div>)}
                    {type==="petcare" &&(<div className="text-4xl">
                        <p>{calculatePrice(type, null, data.one_time_base_rate, pet, data.increment, booktime[0], booktime[1])}/-</p>
                    </div>)}
                    {type==="eldercare" &&(<div className="text-4xl">
                        <p>{calculatePrice(type, null, data.one_time_base_rate, 0, data.increment, booktime[0], booktime[1])}/-</p>
                    </div>)}
                    <div className="text-xl">
                    </div>
            </div>
        </div>
        <hr className="bg-red-400 w-11/12 mx-auto h-2 rounded-full"></hr>
        <div className="flex flex-col justify-center itmes-center mt-14">
            {type === 'childcare'&&(
            <div className="mx-auto mb-8 flex flex-col">
                <div className="text-center text-xl flex flex-col my-10">
                    No. Of Children:
                    <input type="number" defaultValue={children} className="text-center border-b-4 border-gray-400 text-2xl p-2" onChange={(e)=>setchildren(e.target.value)}></input>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-4 text-xl">
                    Children Age Ranges:
                    <div className="flex flex-row items-center justify-center ">
                    {data.child_age_ranges.map((childType, index) => (
                        <button
                            key={index}
                            onClick={() => handleclick(childType,child_type,setchild_type)}
                            className={child_type.includes(childType) ? 'bg-blue-200' : 'bg-white'}
                            style={{
                                marginRight: '8px',
                                marginBottom: '8px',
                                border: '',
                                padding: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{height:"100px",width:"100px"}}>
                            {childType==="Less Than 1"&&(<img src="/childcare/zonelessthan1.svg" style={{height:"100%",width:"100%",objectFit:"cover"}} className=""></img>)}
                            {childType==="1-3 Years Old"&&(<img src="/childcare/zone1-3yearsold.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className=""></img>)}
                            {childType==="3-5 Years Old"&&(<img src="/childcare/zone3-5yearsold.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className=""></img>)}
                            {childType==="5-11 Years Old"&&(<img src="/childcare/zone5-11years.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className=""></img>)}
                            {childType==="12+ Years Old"&&(<img src="/childcare/zone12+yearsold.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className=""></img>)}
                            </div>
                            {childType}
                        </button>
                    ))}
                    </div>
                </div>
            </div>
            
            )}
            {type === 'petcare'&&(
            <div className="mx-auto mb-8 flex flex-col">
                <div className="text-center text-xl flex flex-col my-10">
                    No. Of Pets:
                    <input type="number" defaultValue={pet} className="text-center border-b-4 border-gray-400 text-2xl p-2" onChange={(e)=>setpet(e.target.value)}></input>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-4 text-lg">
                    Types of Pets:
                    <div className="flex flex-row items-center justify-center ">
                    {data.pet_type.map((petType, index) => (
                        <button
                            key={index}
                            onClick={() => handleclick(petType,pet_type,setpet_type)}
                            style={{
                                marginRight: '8px',
                                marginBottom: '8px',
                                backgroundColor: pet_type.includes(petType) ? 'lightblue' : 'white',
                                border: '',
                                borderRadius: '4px',
                                padding: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{height:"100px",width:"100px"}}>
                            {petType==="Cat"&&(<img src="/petcare/cat.svg" style={{height:"100%",width:"100%",objectFit:"cover"}} className="border-2 border-black"></img>)}
                            {petType==="Dog"&&(<img src="/petcare/dog.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className="border-2 border-black"></img>)}
                            {petType==="Birds"&&(<img src="/petcare/bird.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className="border-2 border-black"></img>)}
                            {petType==="Hamsters"&&(<img src="/petcare/hamster.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className="border-2 border-black"></img>)}
                            {petType==="Rabbits"&&(<img src="/petcare/rabbit.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className="border-2 border-black"></img>)}
                            {petType==="Turtles/Tortoise"&&(<img src="/petcare/turtle.svg"style={{height:"100%",width:"100%",objectFit:"cover"}} className="border-2 border-black"></img>)}
                            </div>
                            {petType}
                        </button>
                    ))}
                    </div>
                </div>
            </div>
            )}
            <div className="mx-auto">
                <MyCalendarComponent setdate={setdate} date={date}/>
            </div>
            <div className="text-2xl mx-auto mt-8 font-semibold text-center">
                {dateFormat(booktime[0],"dd/mm/yyyy ( HH:MM")} - {dateFormat(booktime[1],"HH:MM )")}
                <div className="text-lg text-gray-400">
                    Please Note that It might take upto 30 mins for the nanny to reach you.
                </div>
            </div>
            {disabledIntervals != [] &&(<div className="">
                <RangeSlider key={date} onChangeCallback={onChangeCallback} startTime={startTime} endTime={endTime} errorState={errorState} setErrorState={setErrorState}  disabledIntervals={disabledIntervals}/>
            </div>)}
            <div className="mx-auto">
                <div className="border-b-2 border-gray-400 rounded-full mb-10">
                    {!errorState&&(<button onClick={()=>{handlesubmit()}} className="text-3xl border-2 border-gray-400 bg-red-400 px-8 py-5 rounded-full text-white w-full">
                        Confirm Booking
                    </button>)}
                </div>
            </div>
        </div>
        </>
    )
}