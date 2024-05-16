import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router"
import Childcare from "./childcare"
import Eldercare from "./eldercare"
import Petcare from "./petcare"


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
        navigate(`/myzone/applications/${list[0]}`)
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

export default function Apply(){
    const {step}=useParams()
    const [list,setlist]=useState([])
    let i=1;

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
                    {list.length === 0 &&(
                        <Step title={"Apply"} index="2"/>
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
                {step === "domains" && (<Domain list={list} setlist={setlist}/>)}
                {step === "childcare" && (<Childcare list={list}/>)}
                {step === "eldercare" && (<Eldercare list={list}/>)}
                {step === "petcare" && (<Petcare list={list}/>)}
                
            </div>
        </>
    )
}