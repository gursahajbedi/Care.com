import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router"
import Childcare from "./childcare"
import Eldercare from "./eldercare"
import Petcare from "./petcare"
import { Flip, ToastContainer, toast } from 'react-toastify';

export function Step(prop){
    return(
        <>
            <div>
                <img src="/apply/arrow.svg"></img>
            </div>
            <div className="flex flex-col items-center">
                <div className="absolute text-xl top-40">
                    {prop.title}
                </div>
                <div className="rounded-full bg-blue-300 py-3 px-5 ">{prop.index}</div>                    
            </div>
            
        </>
    )
}

export function Domain(prop){
    const list=prop.list
    const setlist=prop.setlist

    const handleclick=(e)=>{
        if (list.length != 0){
            if(list.includes(e)){
                const newlist=list.filter((item)=>{
                    if(item != e){
                        return item
                    }
                })
                setlist(newlist)
            }
            else{
                setlist([...list,e])
            }
        }
        else{
            setlist([...list,e])
        }
    }

    const navigate= useNavigate()

    const navigation=()=>{
        navigate(`/myzone/applications/details`)
    }
    return(
        <>
            <div className="py-10 flex flex-col justify-center items-center gap-y-8">
                {!list.includes("childcare") ? (<button value="childcare" className="w-44 border-2 border-gray-300 py-5 px-8 text-xl bg-white hover:brightness-75 rounded-xl" onClick={(e)=>{handleclick(e.target.value)}}>Child Care</button>):(<button value="childcare" className="w-44 border-2 border-gray-300 py-5 px-8 text-xl bg-green-800 text-white hover:brightness-75 rounded-xl" onClick={(e)=>{handleclick(e.target.value)}}>Child Care</button>)}
                {!list.includes("eldercare") ? (<button value="eldercare" className="w-44 border-2 border-gray-300 py-5 px-8 text-xl bg-white hover:brightness-75 rounded-xl" onClick={(e)=>{handleclick(e.target.value)}}>Elder Care</button>):(<button value="eldercare" className="w-44 border-2 border-gray-300 py-5 px-8 text-xl bg-green-800 text-white hover:brightness-75 rounded-xl" onClick={(e)=>{handleclick(e.target.value)}}>Elder Care</button>)}
                {!list.includes("petcare") ? (<button value="petcare" className="w-44 border-2 border-gray-300 py-5 px-8 text-xl bg-white hover:brightness-75 rounded-xl" onClick={(e)=>{handleclick(e.target.value)}}>Pet Care</button>):(<button value="petcare" className="w-44 border-2 border-gray-300 py-5 px-8 text-xl bg-green-800 text-white hover:brightness-75 rounded-xl" onClick={(e)=>{handleclick(e.target.value)}}>Pet Care</button>)}
            </div>
            <div className="">
                <button onClick={()=>{navigation()}} className="bg-red-400 border-gray-200 border-2 px-7 py-3 text-xl rounded-2xl text-white">Next</button>
            </div>
        </>
    )
}

export function Details({data,setdata,list}){

    const [name,setname]=useState() //Name - Display
    const [age, setage]=useState() //Age
    const [pincode,setpincode]=useState()
    const [city,setcity]=useState()
    const [state,setstate]=useState()
    const [gender,setgender]=useState()
    const [yoe,setyoe]=useState()

    const navigate = useNavigate()
    
    const navigation=()=>{
        if(name && age && pincode && city && state && gender && yoe){
            setdata({
                name:name,
                age:age,
                pincode:pincode,
                city:city,
                state:state,
                gender:gender,
                yoe:yoe
            })
            navigate(`/myzone/applications/${list[0]}`)
        }
        else{
            toast.error('Please Fill In All Of Your Details', {
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
    return(
        <div className="flex flex-col items-center">
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
            <div className="py-10 flex flex-col justify-center items-center gap-y-8">
                <div className="flex flex-col items-center container w-full gap-y-6 py-6">
                    <input className="border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="Display Name" type="text" defaultValue={name} onChange={(e)=>{setname(e.target.value)}} style={{width:"600px"}}></input>
                    <div className="flex flex-row gap-x-8">
                        <input className="border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="Age" type="number" defaultValue={age} onChange={(e)=>{setage(e.target.value)}} style={{width:"290px"}}></input>
                        <input className="border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="Pincode" type="number" defaultValue={pincode} onChange={(e)=>{setpincode(e.target.value)}} style={{width:"290px"}}></input>
                    </div>
                    <div className="flex flex-row gap-x-8">
                        <input className="border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="City" type="text" defaultValue={city} onChange={(e)=>{setcity(e.target.value)}} style={{width:"290px"}}></input>
                        <input className="border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="State" type="text" defaultValue={state} onChange={(e)=>{setstate(e.target.value)}} style={{width:"290px"}}></input>
                    </div>
                    <select className=" border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="Gender" type="text" defaultValue={name} onChange={(e)=>{setgender(e.target.value)}} style={{width:"600px"}}>
                        <option selected value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input className="border-4 border-gray-400 rounded-xl px-5 text-xl py-5" placeholder="Years Of Experience" type="number" defaultValue={yoe} onChange={(e)=>{setyoe(e.target.value)}} style={{width:"600px"}}></input>
                </div>
            </div>
            <div className="">
                <button onClick={()=>{navigation()}} className="bg-red-400 border-gray-200 border-2 px-7 py-3 text-xl rounded-2xl text-white">Next</button>
            </div>
        </div>
    )
}

export default function Apply(){
    const {step}=useParams()
    const [list,setlist]=useState([])
    const [data,setdata]=useState()
    let i=2;

    useEffect(()=>{
        console.log(list)
    },[list])

    return(
        <>
            <div className="flex flex-col items-center justify-center gap-y-2">
                <div className="flex flex-row justify-center items-center py-12 gap-x-2">
                    <div className="flex flex-col items-center">
                        <div className="absolute text-xl top-40">
                            Domains
                        </div>
                        <div className="rounded-full bg-blue-300 py-3 px-5 ">1</div>                    
                    </div>
                    <Step title={'Details'} index="2"/>
                    {list.length === 0 &&(
                        <Step title={"Apply"} index="3"/>
                    )}
                    {list.length != 0 &&(
                        <>
                        {
                            list.map((item)=>{
                                i=i+1
                                const data=item[0].toUpperCase()+item.slice(1)
                                // eslint-disable-next-line react/jsx-key
                                return(<Step title={data} index={i}/>)
                            })
                        }
                        </>
                    )}
                    
                </div>
                <hr className="w-1/2 h-1 bg-gray-300"></hr>
                {step === "details" && (<Details data={data} setdata={setdata} list={list}/>)}
                {step === "domains" && (<Domain list={list} setlist={setlist}/>)}
                {step === "childcare" && (<Childcare list={list} details={data}/>)}
                {step === "eldercare" && (<Eldercare list={list} details={data}/>)}
                {step === "petcare" && (<Petcare list={list} details={data}/>)}
                
            </div>
        </>
    )
}