import axios from "axios";
import { useEffect, useState } from "react"
import useAuthContext from "../AuthLogic/useAuthContext"
import { useNavigate, useParams } from "react-router";
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function Timings(prop){
    const initialvalue={from:"",to:""}
    const [data,setdata]=useState(initialvalue)

    return(
        <>
        <div className="text-xl flex flex-row items-center gap-x-5">
            <img src="/apply/arrow.svg" className="mt-4" style={{ height: "15px" }} alt="arrow" />
            <div className="pe-4 pt-4" style={{ width: "100px" }}>{prop.title}</div>
            <div className="flex flex-col">
                <div>From:</div>
                <input
                    className="border-4 border-gray-400 px-9 py-2 rounded-full"
                    placeholder="From"
                    type="time"
                    name="from"
                    onChange={(e) => {
                        const newData = { ...data, from: e.target.value };
                        setdata(newData);
                        prop.func(newData);
                    }}
                />
            </div>
            <div className="pt-4">:</div>
            <div className="flex flex-col">
                <div>To:</div>
                <input
                    className="border-4 border-gray-400 px-9 py-2 rounded-full"
                    placeholder="To"
                    type="time"
                    name="to"
                    onChange={(e) => {
                        const newData = { ...data, to: e.target.value };
                        setdata(newData);
                        prop.func(newData);
                    }}
                />
            </div>
        </div>
        </>
    )
}
export function AddsList({setData}){
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
        setData(data)
    }

    useEffect(()=>{
        filterlist()
    },[list])

    return(
        <>
        <div className="flex flex-col">
            {
                list.map((item)=>{
                    return (<input key={item.id} className="border-2 border-gray-400 px-5 py-3 rounded-full my-1" type="text" onChange={(e)=>handlechange(e.target.value,item.id)}></input>)
                })
            }
            <img className="hover:brightness-75" src="/childcare/add.svg" style={{height:"40px"}} onClick={(e)=>handleadd(e)}></img>
        </div>
        
        </>
    )
}

export function Checkbox(prop) {
    const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      prop.setList(prevList => {
        if (checked) {
          return [...prevList, name];
        } else {
          return prevList.filter(item => item !== name);
        }
      });
    };
  
    return (
      <div>
        {prop.checklist.map((item, index) => (
          <div key={index} className="px-7">
            <label className="flex flex-row gap-x-3 py-1">
              <input
                className="h-5 w-5"
                type="checkbox"
                name={item}
                checked={prop.list.includes(item)}
                onChange={handleCheckboxChange}
              />
              {item}
            </label>
          </div>
        ))}
      </div>
    );
  }

export function WorkEx(prop){
    const component={
        id:1,
        workplace:"",
        from:"",
        to:""
    }
    const [list,setlist]=useState([component])

    const handleadd=(e)=>{
        e.preventDefault()
        const data={
            id:list.length + 1,
            workplace:"",
            from:"",
            to:""
        }
        setlist([...list,data])
    }

    const handlechange=(target,id)=>{
        const {value,name}=target
        const newlist=list.filter((item)=>{
            if(item.id===id){
                if(name === "workplace"){
                    return item.workplace = value
                }               
                if(name === "from"){
                    return item.from = value
                }               
                if(name === "to"){
                    return item.to = value
                }                
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
            data.push({workplace:item.workplace,from:item.from,to:item.to})
        })
        prop.setData(data)
    }

    useEffect(()=>{
        filterlist()
    },[list])

    return(
        <>
        <div className="flex flex-col">
            {
                list.map((item)=>{
                    // eslint-disable-next-line react/jsx-key
                    return (<div className="flex flex-row items-center w-full pt-4">
                        <div className="w-7/12 flex flex-col items-center">
                            <div>
                                Work Place
                            </div>
                            <input key={item.id} placeholder="Enter Your Workplace" className="border-2 border-gray-400 px-5 py-3 rounded-full my-1" type="text" name="workplace" onChange={(e)=>handlechange(e.target,item.id)}></input>
                        </div>
                        <div className="relative w-1/12 px-3 text-3xl top-3">
                            :
                        </div>
                        <div className="flex flex-col items-center w-3/12">
                            <div>
                                From:
                            </div>
                            <input key={item.id} className="border-2 border-gray-400 px-5 py-3 rounded-full my-1" type="date" name="from" onChange={(e)=>handlechange(e.target,item.id)}></input>
                        </div>
                        <div className="relative w-1/12 px-7 text-3xl top-3">
                            -
                        </div>
                        <div className="flex flex-col items-center w-3/12">
                            <div>
                                To:
                            </div>
                            <input key={item.id} className="border-2 border-gray-400 px-5 py-3 rounded-full my-1" type="date" name="to" onChange={(e)=>handlechange(e.target,item.id)}></input>
                        </div>
                    </div>)
                })
            }
            <img className="hover:brightness-75 mt-3" src="/childcare/add.svg" style={{height:"40px"}} onClick={(e)=>handleadd(e)}></img>
        </div>
        
        </>
    )
}


export default function Childcare(prop){
    const {step}=useParams()
    const {auth}=useAuthContext()
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;
    let user_application=null
    const [domainslist,setdomainslist]=useState([])

    window.onload = function(){
        navigate("/myzone/applications/domains")
    }

    const NextRoute=(item)=>{
        const array=prop.list
        const index = array.indexOf(item);
        if (index !== -1 && index < array.length - 1) {
            const nextItem = array[index + 1];
            navigate(`/myzone/applications/${nextItem}`)
        } else {
            navigate('/myzone/applications')
        }
    }

    const getdata=async()=>{

        await axios.get(`http://127.0.0.1:8000/api/app/list/`).then((res)=>{
            const newdata=res.data.filter((item)=>{
                return item.user==Number(auth.user.id)
            })
            const data=newdata[0]
            console.log(newdata)
            if(data.domains === "{}"){
                setdomainslist([])
            }
            else{
                setdomainslist(JSON.parse(data.domains))
            }
        })
    }

    useEffect(()=>{
        getdata();
    },[])

    // const [name,setname]=useState("") //Name - Display
    // const [age, setage]=useState("") //Age
    // const [pincode,setpincode]=useState("")
    // const [city,setcity]=useState("")
    // const [state,setstate]=useState("")
    // const [gender,setgender]=useState("")
    // const [yoe,setyoe]=useState("")
    const [childranges,setchildranges]=useState([]) //Child Age Ranges

    const [mon,setmon]=useState({}) //Timings
    const [tue,settue]=useState({})
    const [wed,setwed]=useState({})
    const [thu,setthu]=useState({})
    const [fri,setfri]=useState({})
    const [sat,setsat]=useState({})
    const [sun,setsun]=useState({})

    const [about,setAbout]=useState("") //About
    const [services,setservices]=useState([]) //services offered
    const [languages,setlanguages]=useState([]) //languages offered

    const CHWChecklist=["Light Cleaning","Cooking","Swimming Supervision","Travel","Groceries/Errands","Transportation","Help With Pets","Carpooling"]
    const [canhelpwith,setcanhelpwith]=useState([]) //can help with

    const PreProDetails=["Transportation","CPR Trained","First Aid Trained","Does Not Smoke","Does Not Drink"]
    const [otherprodetails,setotherprodetails]=useState([])
    const [prodetails,setprodetails]=useState([])
    const [finalprodetails,setfinalprodetails]=useState([]) //professional details

    const [education,seteducation]=useState("")

    const [workex,setworkex]=useState([]) //workexperience
    const [onetime,setonetime]=useState("") //rates
    const [reccuring,setrecurring]=useState("")
    const [increment,setincrement]=useState("")

    const navigate = useNavigate()

    const handleContentChange = (value) => {
        setAbout(value);
      };
    
  const handleEducationChange = (value) => {
        seteducation(value);
      };

    const patchapplication=async()=>{
        await axios.patch(`http://127.0.0.1:8000/api/app/application/patch/`,
                {
                    ...user_application,
                    "domains":JSON.stringify([
                        ...domainslist,
                        {
                            "id":user_application.id,
                            "display_name":prop.details.name,
                            "type":"childcare",
                            "age":prop.details.age,
                            "pincode":prop.details.pincode,
                            "city":prop.details.city,
                            "state":prop.details.state,
                            "gender":prop.details.gender,
                            "years_of_experience":prop.details.yoe,
                            "child_age_ranges":childranges,
                            "timings":{
                                "monday":mon,
                                "tuesday":tue,
                                "wednesday":wed,
                                "thurday":thu,
                                "friday":fri,
                                "saturday":sat,
                                "sunday":sun
                            },
                            "about":about,
                            "services":services,
                            "languages":languages,
                            "can_help_with":canhelpwith,
                            "professional_details":finalprodetails,
                            "education":education,
                            "work_experience":workex,
                            "one_time_base_rate":onetime,
                            "recurring_base_rate":reccuring,
                            "increment":increment
                        }
                    ])
                }).then((res)=>{
                    console.log(res.data)
                    NextRoute(step)
                })
    }

    const navigation=async()=>{
        await axios.get(`http://127.0.0.1:8000/api/app/list/`).then((res)=>{
            const newdata=res.data.filter((item)=>{
                return item.user==Number(auth.user.id)
            })
            const data1=newdata[0]
            console.log(data1)
            
            const domainslist=data1.domains === "{}"?[]:JSON.parse(data1.domains)

            if(domainslist.length !== 0){
                console.log("trigger on")
                const data=domainslist.filter((item)=>{
                    if(item.type === "childcare"){
                        return item
                    }
                })
                if(data.length === 0){
                    console.log("no childcare data found")
                    patchapplication()
                }
                else{
                    console.log("childcare data found")
                    toast.error('Your Application Has Already Been Sent for Childcare', {
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
            if(domainslist.length === 0) {
                console.log("Trigger Else")
                patchapplication()
            }
        },[])
        
    }
    
    const handleclick=(e)=>{
        console.log(e)
        if (childranges.length != 0){
            if(childranges.includes(e)){
                const newlist=childranges.filter((item)=>{
                    if(item != e){
                        return item
                    }
                })
                setchildranges(newlist)
            }
            else{
                setchildranges([...childranges,e])
            }
        }
        else{
            setchildranges([...childranges,e])
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const joinprodetails=()=>{
        const data=otherprodetails.filter((item)=>{
            if(item != ""){
                return item
            }
        })
        setfinalprodetails(prodetails.concat(data))
    }


    useEffect(()=>{
        joinprodetails()
    },[joinprodetails, otherprodetails, prodetails])



    return(
        <div>
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
            <div className="text-3xl py-5">
                Timings
                <hr className="rounded-full bg-red-400 w-64 h-2"></hr>
            </div>
            <div className="flex flex-col items-center container w-full gap-y-6 py-4">
                <Timings title="Monday" func={setmon}/>
                <Timings title="Tuesday" func={settue}/>
                <Timings title="Wednesay" func={setwed}/>
                <Timings title="Thursday" func={setthu}/>
                <Timings title="Friday" func={setfri}/>
                <Timings title="Saturday" func={setsat}/>
                <Timings title="Sunday" func={setsun}/>
            </div>
            <div className="text-3xl py-5">
                Details
                <hr className="rounded-full bg-red-400 w-64 h-2"></hr>
            </div>
            <div className="flex flex-col text-xl gap-y-4">
                <div className="ps-3 pt-6">About:</div>
                <ReactQuill
                  value={about}
                  onChange={handleContentChange}
                  className="h-72 mb-4"
                  style={{width:"1100px"}}
                />
                <div className="ps-3 pt-6">
                    Child Age Ranges:
                </div>
                <div className="flex flex-row justify-center items-center gap-y-8 gap-x-2">
                    {!childranges.includes("Less Than 1") ? 
                        (<button onClick={()=>{handleclick("Less Than 1")}}><img className="" src="/childcare/zonelessthan1.svg" style={{height:"140px"}}></img><div>Less Than 1</div></button>)
                        :
                        (<button onClick={()=>{handleclick("Less Than 1")}}><img className="filter brightness-90" src="/childcare/zonelessthan1.svg" style={{height:"140px"}}></img><div>Less Than 1</div></button>)}
                    {!childranges.includes("1-3 Years Old") ? 
                        (<button onClick={()=>{handleclick("1-3 Years Old")}}><img src="/childcare/zone1-3yearsold.svg" style={{height:"140px"}}></img><div>1-3 Years Old</div></button>)
                        :
                        (<button onClick={()=>{handleclick("1-3 Years Old")}}><img className="filter brightness-90" src="/childcare/zone1-3yearsold.svg" style={{height:"140px"}}></img><div>1-3 Years Old</div></button>)}
                    {!childranges.includes("3-5 Years Old") ? 
                        (<button  onClick={()=>{handleclick("3-5 Years Old")}}><img src="/childcare/zone3-5yearsold.svg" style={{height:"140px"}}></img><div>3-5 Years Old</div></button>)
                        :
                        (<button onClick={()=>{handleclick("3-5 Years Old")}}><img className="filter brightness-90" src="/childcare/zone3-5yearsold.svg" style={{height:"140px"}}></img><div>3-5 Years Old</div></button>)}
                    {!childranges.includes("5-11 Years Old") ? 
                        (<button  onClick={()=>{handleclick("5-11 Years Old")}}><img src="/childcare/zone5-11years.svg" style={{height:"140px"}}></img><div>5-11 Years Old</div></button>)
                        :
                        (<button onClick={()=>{handleclick("5-11 Years Old")}}><img className="filter brightness-90" src="/childcare/zone5-11years.svg" style={{height:"140px"}}></img><div>5-11 Years Old</div></button>)}
                    {!childranges.includes("12+ Years Old") ? 
                        (<button  onClick={()=>{handleclick("12+ Years Old")}}><img src="/childcare/zone12+yearsold.svg" style={{height:"140px"}}></img><div>12+ Years Old</div></button>)
                        :
                        (<button onClick={()=>{handleclick("12+ Years Old")}}><img className="filter brightness-90" src="/childcare/zone12+yearsold.svg" style={{height:"140px"}}></img><div>12+ Years Old</div></button>)}
                </div>
            </div>
            <div className="flex flex-row justify-between text-xl py-10">
                <div className="w-5/12">
                    <div>
                        Services Offered:
                    </div>
                    <AddsList setData={setservices}></AddsList>
                </div>
                <div className="w-5/12">
                    <div className="">
                        Languages Spoken:
                    </div>
                    <AddsList setData={setlanguages}></AddsList>
                </div>
            </div>
            <div className="flex flex-row justify-between text-xl py-10">
                <div className="w-5/12">
                    <div>
                        Can Help With:
                    </div>
                    <Checkbox list={canhelpwith} setList={setcanhelpwith} checklist={CHWChecklist} />
                </div>
                <div className="w-5/12">
                    <div>
                        Professional Details:
                    </div>
                    <Checkbox list={prodetails} setList={setprodetails} checklist={PreProDetails}/>
                    <div className="text-lg">
                        <i>Any Other:</i>
                    </div>
                    <AddsList setData={setotherprodetails}/>
                </div>
            </div>
            <div className="text-3xl py-5">
                Education and Qualifications
                <hr className="rounded-full bg-red-400 w-7/12 h-2"></hr>
            </div>
            <div className="flex flex-col justify-center items-center pt-6 text-lg gap-y-6">
                <div className="flex flex-col gap-y-4 w-full">
                    <div className="ps-3">Education:</div>
                    <ReactQuill
                      value={education}
                      onChange={handleEducationChange}
                      className="h-40 w-full mb-4"
                    />
                </div>
                <div className="flex flex-col justify-center pt-6 text-lg gapy-y-6">
                    <div>
                        Work Experience:
                    </div>
                    <WorkEx setData={setworkex}/>
                </div>
            </div>
            <div className="text-3xl py-5">
                Rates (/hr)
                <hr className="rounded-full bg-red-400 w-7/12 h-2"></hr>
            </div>
            <div className="flex flex-col justify-center items-center pt-6 text-lg gap-y-6">
                <div className="text-center text-xl px-10 border-s-4 border-e-4 border-gray-400 rounded-full mb-4">
                    Calculation:
                    <div className="text-lg text-gray-400">
                        For 1 Child - Base Rate X Increment
                    </div>
                    <div className="text-lg text-gray-400">
                        For +1 Children - Base Rate + Rate Increment X Children
                    </div>
                </div>
                <input className="text-center w-1/2 border-2 border-gray-400 rounded-3xl px-5 text-xl py-5" placeholder="One Time Base Rate" type="number" onChange={(e)=>{setonetime(e.target.value)}}></input>
                <input className="text-center w-3/4 border-2 border-gray-400 rounded-3xl px-5 text-xl py-5" placeholder="Rate Increment on Consecutive Children" type="number" onChange={(e)=>{setincrement(e.target.value)}}></input>
            </div>
            <div className="flex flex-row items-end justify-end py-6">
                <button onClick={()=>{navigation()}} className="bg-red-400 border-gray-200 border-2 px-7 py-3 text-xl rounded-2xl text-white">Submit</button>
                <button onClick={()=>{NextRoute(step)}} className="bg-blue-500 border-gray-200 border-2 px-7 py-3 text-xl rounded-2xl text-white">Next</button>
            </div>
        </div>
    )
}



