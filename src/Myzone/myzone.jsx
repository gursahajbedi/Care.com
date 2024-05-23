import { Link, useNavigate } from "react-router-dom"
import  useLogout  from "../AuthLogic/useLogout.jsx"
import useAuthContext from "../AuthLogic/useAuthContext.jsx"
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./profile.css"
import { useEffect, useState } from "react"
import axios from "axios"

import ReactPaginate from 'react-paginate';

export function Menu(){
    const {logout}= useLogout()
    const navigate= useNavigate()

    const handlelogout=async()=>{
        await logout().then(()=>{   
            navigate("/")
        })
    }
    return(
        <>
        <div className="w-2/12 h-96 border-4 rounded-3xl shadow-xl border-gray-200 flex flex-col justify-center items-center gap-y-5"> 
            <Link to={"/myzone/profile"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/profile.svg" style={{height:"35px"}}></img></div>
                <div>My Profile</div>
            </Link>
            <Link to={"/myzone/applications"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/applications.svg" style={{height:"35px"}}></img></div>
                <div>Applications</div>
            </Link>
            <Link to={"/myzone/verification"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/verification.svg" style={{height:"40px"}}></img></div>
                <div>Verification</div>
            </Link>
            <Link to={"/myzone/mybookings"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/bookings.svg" style={{height:"45px"}}></img></div>
                <div>My Bookings</div>
            </Link>
            <button className="text-xl flex flex-row items-center gap-x-4" onClick={()=>{handlelogout()}}>
                <span className="text-3xl material-symbols-outlined text-red-600">Logout</span>
                <div className="text-red-600 text-2xl">Logout</div>
            </button>
        </div>
        </>
    )
}

export function Profile() {
    const [profile, setProfile] = useState({});
    const [profilePic, setProfilePic] = useState(null); // Changed state name to profilePic
    const [isLoading,setLoading]=useState(false)
    const [email,setemail]=useState("")
    const [phone,setphone]=useState("")
    const [name,setname]=useState("")


    const { auth } = useAuthContext();
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/accounts/list/");
            const data = res.data.find(item => item.id === Number(auth.user.id));
            if (data) {
                setProfile(data);
                setemail(data.email)
                setphone(data.phone_number)
                setname(data.name)
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const changeProfilePicture = async () => {
        if (!profilePic) {
            console.error('No profile picture selected');
            return;
        }

        const formData = new FormData();
        formData.append('profile_pic', profilePic);

        try {
            await axios.patch('http://127.0.0.1:8000/api/accounts/profile-update/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Profile picture updated successfully');
            fetchProfile()
            toast.success('Profile picture updated successfully', {
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
            // Optionally, you can update the profile state after successful upload
            // fetchProfile();
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    const changeProfileData = async(e)=>{
        e.preventDefault()
        try {
            await axios.patch('http://127.0.0.1:8000/api/accounts/profile-update/', {
                name:name,
                phone_number:phone,
                email:email
            })
            fetchProfile()
            toast.success('Profile data updated successfully', {
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
            // Optionally, you can update the profile state after successful upload
            // fetchProfile();
        } catch (error) {
            console.error('Error updating profile data:', error);
        }
    }



    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(()=>{
        console.log(phone,email,name)
    })

    const [hover, setHover] = useState(false);

    const handleProfile = (e) => {
        setProfilePic(e.target.files[0]); // Set profilePic state with the selected file
    };

    return (
        <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
            {/* Assuming Menu is defined elsewhere */}
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
            <Menu />
            <div className="w-10/12">
                <div className="text-4xl">
                    Profile
                    <hr className="w-64 h-2 rounded-full bg-red-400 "></hr>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <div className="flex flex-row justify-center items-center" onClick={() => {}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                        {hover ? (
                            <img src={`http://127.0.0.1:8000${profile.profile_pic}`} className="profile z-0 border-4 border-gray-500" style={{ height: "150px", width: "150px", borderRadius: "100%", objectFit:"cover" }} alt="Profile"></img>
                        ) : (
                            <img src={`http://127.0.0.1:8000${profile.profile_pic}`} className="z-0 border-4 border-gray-500 " style={{ height: "150px", width: "150px", borderRadius: "100%",objectFit:"cover" }} alt="Profile"></img>
                        )}
                        {hover && (
                            <img className="absolute camera z-10" src="/auth/camera.png" style={{ height: "50px" }} alt="Camera"></img>
                        )}
                        <input type="file" onChange={(e) => handleProfile(e)} className="z-20 h-36 w-36 me-2 bg-black rounded-full" accept="image/gif, image/jpeg, image/png"></input>
                    </div>
                    <button onClick={changeProfilePicture} className="bg-red-400 rounded-full px-6 py-3 mt-5 text-white hover:brightness-75 shadow-xl ">Upload Profile Picture</button>
                    <form className="w-1/2 text-center mt-10" onSubmit={(e)=>changeProfileData(e)}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">Name</label>
                            <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={(e) => setname(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2">Email</label>
                            <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={email} onChange={(e) => setemail( e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-gray-700 text-lg font-bold mb-2">Phone</label>
                            <input type="text" pattern="[\d]{9}" maxLength={10} id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={phone} onChange={(e) => setphone(e.target.value)} />
                        </div>
                        <button type="submit" className="bg-red-400 rounded-full px-6 py-3 mt-5 text-white hover:brightness-75 shadow-lg">Edit Credentails</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export function Verification(){
    const {auth}=useAuthContext()
    const [appdata,setappdata]=useState({})
    const [status,setstatus]=useState(null)

    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;

    const [state,setState]=useState()
    const [type,setType]=useState()
    const [URL,setURL]=useState()
    const [OrganName,setOrganName]=useState()
    const [ref1Contact,setRef1Contact]=useState()
    const [ref1Name,setRef1Name]=useState()
    const [ref2Contact,setRef2Contact]=useState()
    const [ref2Name,setRef2Name]=useState()

    const [iproof,setiproof]=useState([])
    const [pcproof,setpcproof]=useState([])
    const [dlproof,setdlproof]=useState([])

    const handleProfile = (e,setPic) => {
        setPic(e.target.files[0]); // Set profilePic state with the selected file
    };

    const navigate=useNavigate()

    const fetchverify=async()=>{
        await axios.get(`http://127.0.0.1:8000/api/app/list/`).then((res)=>{
            console.log(res.data)
            res.data.filter((item)=>{
                if(item.user==Number(auth.user.id)){
                    console.log(item)
                    setappdata(item);
                    setstatus(item.status);
                    setState(item.state || "");
                    setType(item.user_type || "");
                    setURL(item.organisation_url || "");
                    setOrganName(item.organisation_name || "");
                    setRef1Contact(item.reference1_phone || "");
                    setRef1Name(item.reference1_name || "");
                    setRef2Contact(item.reference2_phone || "");
                    setRef2Name(item.reference2_name || "");
                }
            })
        })
    }
    useEffect(()=>{
        fetchverify()
    },[auth.user.id])

    useEffect(()=>{
        console.log(ref1Contact,ref1Name,ref2Contact,ref2Name)
    })

    const postverify=async(e)=>{
        e.preventDefault()
        const formData = {
            user: auth.user.id,
            status,
            age: null,
            state,
            pincode: null,
            gender: null,
            display_name: null,
            general_about: null,
            user_type: type,
            organisation_url: URL,
            organisation_name: OrganName,
            reference1_name: ref1Name,
            reference1_phone: ref1Contact,
            reference2_name: ref2Name,
            reference2_phone: ref2Contact,
            domains: "{}",
            identity_proof: iproof,
            police_certificate: pcproof,
            driving_license_proof: dlproof,
        };
        await axios.post(`http://127.0.0.1:8000/api/app/`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }, 
        }).then((res)=>{
            console.log(res.data)
            setappdata(res.data)
            navigate('/myzone/applications')
        })
    }

    const postverifyapproved=async(e)=>{
        e.preventDefault()
        await axios.patch(`http://127.0.0.1:8000/api/app/application/patch/`,{
            ...appdata,
            "state": state,
            "user_type": type,
            "organisation_url": URL,
            "organisation_name": OrganName,
            "reference1_name": ref1Name,
            "reference1_phone": ref1Contact,
            "reference2_name": ref2Name,
            "reference2_phone": ref2Contact
        }).then((res)=>{
            console.log(res.data)
            setappdata(res.data)
            navigate('/myzone/applications')
        })
    }

    return(
        <>
            <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
                <Menu/>
                <div className="w-10/12">
                    <div className="text-4xl">
                        Verification
                        <hr className="w-64 h-2 rounded-full bg-red-400 "></hr>
                    </div>
                    {status === false || !status &&(
                        <form className="flex flex-col items-center justify-center gap-y-2" onSubmit={(e)=>{postverify(e)}}>
                            <div className="text-center font-bold text-gray-500 border-s-4 my-6 border-e-4 rounded-full py-5 px-10">Please Note: <br/> Processing of the Verification may take upto 24 hours</div>
                            <input value={state} className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter State" type="text"  onChange={(e)=>{setState(e.target.value)}}/>
                            <select className="border-gray-400 border-2 w-96 px-4 text-xl" type="text" onChange={(e)=>setType(e.target.value)}>
                                <option className="" selected value="">Select Type</option>
                                <option className="" value="indivisual">Indivisual</option>
                                <option className="" value="organisation">Organisation</option>
                            </select>
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Organisation URL" type="text"  onChange={(e)=>{setURL(e.target.value)}}/>)}
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Organisation Name" type="text" onChange={(e)=>{setOrganName(e.target.value)}}/>)}
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Contact" type="text" pattern="[\d]{9}" maxLength={10} onChange={(e)=>{setRef1Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Name" type="text" onChange={(e)=>{setRef1Name(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Contact" type="text" pattern="[\d]{9}" maxLength={10} onChange={(e)=>{setRef2Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Name" type="text" onChange={(e)=>{setRef2Name(e.target.value)}}/>
                            <div className="w-1/2 my-3 relative h-10 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg focus:outline-none focus:border-blue-500">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="absolute left-4 top-2 w-1/2">{iproof.length === 0 ? "Upload Identity Proof" : JSON.stringify(iproof)}</p>    
                                    
                                </div>
                                
                              <input
                                type="file"
                                accept="image/gif, image/jpeg, image/png"
                                name="image"
                                className="opacity-0 absolute inset-0 w-full h-full"
                                onChange={(e)=>handleProfile(e,setiproof)}
                                required
                              />
                            </div>
                            <div className=" my-3 relative w-1/2 h-10 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg focus:outline-none focus:border-blue-500">
                              <p className="absolute left-4 top-2 ">{pcproof.length === 0 ? "Upload Police Certificate Proof" : JSON.stringify(pcproof)}</p>
                              <input
                                type="file"
                                accept="image/gif, image/jpeg, image/png"
                                name="image"
                                className="opacity-0 absolute inset-0 w-full h-full"
                                onChange={(e)=>handleProfile(e,setpcproof)}
                                required
                              />
                            </div>
                            <div className="relative my-3 w-1/2 h-10 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg focus:outline-none focus:border-blue-500">
                              <p className="absolute left-4 top-2 ">{dlproof.length === 0 ? "Upload Driving License Proof" : JSON.stringify(dlproof)}</p>
                              <input
                                type="file"
                                accept="image/gif, image/jpeg, image/png"
                                name="image"
                                className="opacity-0 absolute inset-0 w-full h-full"
                                onChange={(e)=>handleProfile(e,setdlproof)}
                                required
                              />
                            </div>
                            <button type="submit" className="bg-red-400 rounded-full px-4 py-2 text-xl text-white">Submit Verification</button>
                        </form>
                    )}
                    {status === true &&(
                        <form className="flex flex-col items-center justify-center gap-y-2" onSubmit={(e)=>{postverifyapproved(e)}}>
                            <div className="text-center font-bold text-gray-500 border-s-4 my-6 border-e-4 rounded-full py-5 px-10">Please Note: <br/> Verification Once Approved does'nt require Processing to Edit</div>
                            <input  className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter State" type="text" defaultValue={state} onChange={(e)=>{setState(e.target.value)}}/>
                            {appdata.user_type === "indivisual" &&(<select className="border-gray-400 border-2 w-96 px-4 text-xl" type="text" onChange={(e)=>setType(e.target.value)} defaultValue={type}>
                                <option className="" value="">Select Type</option>
                                <option className="" selected value="indivisual">Indivisual</option>
                                <option className="" value="organisation">Organisation</option>
                            </select>)}
                            {appdata.user_type === "organisation" &&(<select className="border-gray-400 border-2 w-96 px-4 text-xl" type="text" onChange={(e)=>setType(e.target.value)} defaultValue={type}>
                                <option className="" value="">Select Type</option>
                                <option className="" value="indivisual">Indivisual</option>
                                <option className="" selected value="organisation">Organisation</option>
                            </select>)}
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Organisation URL" defaultValue={URL} type="text" onChange={(e)=>{setURL(e.target.value)}}/>)}
                            {(type === "organisation") &&(<input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Organisation Name" defaultValue={OrganName} type="text" onChange={(e)=>{setOrganName(e.target.value)}}/>)}
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Contact" type="text" defaultValue={ref1Contact} pattern="[\d]{9}" maxLength={10} onChange={(e)=>{setRef1Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 1 Name" type="text" defaultValue={ref1Name} onChange={(e)=>{setRef1Name(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Contact" type="text" defaultValue={ref2Contact} pattern="[\d]{9}" maxLength={10} onChange={(e)=>{setRef2Contact(e.target.value)}}/>
                            <input className="w-96 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg" placeholder="Enter Reference 2 Name" type="text" defaultValue={ref2Name} onChange={(e)=>{setRef2Name(e.target.value)}}/>
                            
                            <button type="submit" className="bg-red-400 rounded-full px-4 py-2 text-xl text-white">Edit Verification</button>
                        </form> 
                    )}
                </div>
            </div>
        </>
    )
}
export function Applications(){
    const {auth}=useAuthContext()
    const [appdata,setappdata]=useState([])
    const [isapplication,setapplication]=useState(false)

    const fetchapplications=async()=>{
        await axios.get(`http://127.0.0.1:8000/api/app/list/`).then((res)=>{
            const newdata=res.data.filter((item)=>{
                if(item.user === Number(auth.user.id)){
                    return item
                }
            })
            const data = newdata[0]
            console.log(data)
            
            if(data.status === false){
                setapplication(false)
            }      
            else{
                console.log(data)
                if(data.domains==="{}"){
                    setappdata([])
                    setapplication(true)
                }
                else{
                    setappdata(JSON.parse(data.domains))
                    setapplication(true)
                }
            }
        })
    }

    useEffect(()=>{
        fetchapplications()
    },[])
    useEffect(()=>{
        console.log(appdata)
    })

    return(
        <>
            <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
                <Menu/>
                <div className="w-10/12">
                    <div className="text-4xl">
                        Applications
                        <hr className="w-64 h-2 rounded-full bg-red-400 "></hr>
                    </div>
                    {!isapplication && (
                    <div className="flex flex-col items-center justify-center gap-y-4 pt-20">
                        <div className="">
                            <img src="/nanny/NotVerified.jpg" style={{height:"100px"}}></img>
                        </div>
                        <div className="text-3xl">
                            You are Not Verfiied to Become A Nanny!
                        </div>
                        <Link to={"/myzone/verification"} className=" text-2xl hover:brightness-75">
                            <button className="flex flex-row items-center bg-red-400 text-3xl text-white rounded-full py-4 gap-x-3 px-9 shadow-2xl">
                                Get Verified
                                <img src="/auth/whitearrow.svg"></img>
                            </button>
                        </Link>
                    </div>
                    )}
                    {isapplication &&(<div>
                        {appdata.length != 0 &&(<div className="flex flex-col justify-center w-full items-center gap-y-4 mt-10">
                        {
                            appdata.map((item)=>{
                                return(
                                    <div className="container flex flex-row items-center justify-between border-4 border-gray-200 rounded-2xl p-3 m-3 w-1/2">
                                        <div className="text-2xl flex flex-row items-center">
                                            {item.type === "childcare" && (<div className="flex items-center pe-4">
                                                <span className="material-symbols-outlined text-blue-500 text-4xl">child_care</span>
                                            </div>)}
                                            {item.type === "eldercare" && (<div className="flex items-center pe-4">
                                                <span className="material-symbols-outlined text-blue-500 text-4xl">elderly </span>
                                            </div>)}
                                            {item.type === "petcare" && (<div className="flex items-center pe-4">
                                                <span className="material-symbols-outlined text-blue-500 text-4xl">pets</span>
                                            </div>)}
                                            <div>
                                                {item.type[0].toUpperCase()+item.type.slice(1)} Application
                                            </div>
                                        </div>
                                        <div className="text-xl text-red-400">
                                            <span className="text-4xl material-symbols-outlined">delete</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <Link to={"/myzone/applications/domains"} className=" text-2xl hover:brightness-75">
                                <img src="/auth/create.svg"></img>
                        </Link>
                    </div>)}
                    {appdata.length ==0 &&(
                        <div className="flex flex-col items-center justify-center gap-y-4 pt-20">
                            <div className="">
                                <img src="/myzone/applications.svg" style={{height:"100px"}}></img>
                            </div>
                            <div className="text-3xl">
                                No Applications Yet!
                            </div>
                            <Link to={"/myzone/applications/domains"} className=" text-2xl hover:brightness-75">
                                <img src="/auth/create.svg"></img>
                            </Link>
                        </div>
                    )}
                    </div>)}
                </div>
            </div>
        </>
    )
}

function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((item) => (
            <div>
              <h3>{item}</h3>
            </div>
          ))}
      </>
    );
  }

export function BookingComponent({data}){
    const {auth}=useAuthContext()
    const [domain,setdomain]=useState([])
    const [phone,setphone]=useState("")

    const fetchapp =async()=>{
        await axios.get(`http://127.0.0.1:8000/api/app/list/`).then((res)=>{
            const ndata=res.data.filter((item)=>{
                if(item.user == data.profile){
                    return item
                }
            })
            console.log("ndata",ndata)
            const domains=JSON.parse(ndata[0].domains)
            console.log(domains)
            const newdata=domains.filter((item)=>{
                if(item.type === data.domain_name){
                    return true
                }
                else{return false}
            })
            setdomain(newdata[0])
        })
    }

    const fetchprofile = async (id) => {
        await axios.get(`http://127.0.0.1:8000/api/accounts/list/`).then((res) => {
          res.data.filter((item)=>{
            if(item.id==id){
              setphone(item.phone_number)
            }
          })
        });
      }

    useEffect(()=>{
        fetchapp()
    },[])

    useEffect(()=>{
        fetchprofile(Number(domain.id))
    },[domain])
    
    return(
        <div className="border-2 border-gray-400 rounded-full py-6 w-1/2 mx-auto flex flex-row items-center justify-between my-8">
            <div className="flex flex-col w-1/2 items-center">
                <div className="text-xl font-semibold">
                    Booked:
                </div>
                <div className="text-xl flex flex-row items-end">
                    {domain.display_name}
                    <div className="text-base font-semibold ps-2">
                        {domain.age}({domain.gender?domain.gender[0]:null})

                    </div>
                </div>
                <div className="text-xl text-red-500">
                    ({data.domain_name})
                </div>
                {data.domain_name=="childcare"&&(
                    <div className="flex flex-wrap gap-x-4 items-center justify-center">
                        {JSON.parse(data.child_types).map((item)=>{
                            return(
                                <div className="text-blue-400">
                                    | {item} |
                                </div>
                            )
                        })}
                    </div>
                )}
                {data.domain_name=="petcare"&&(
                    <div className="flex flex-wrap gap-x-4 items-center justify-center">
                        {JSON.parse(data.pet_types).map((item)=>{
                            return(
                                <div className="text-blue-400">
                                    | {item} |
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className="flex flex-col w-1/2 items-center">
                <div className="text-xl font-semibold">
                    Booked For:
                </div>
                <div className="text-xl flex flex-row items-center">
                    {data.day}
                </div>
                <div className="text-xl flex flex-row items-center">
                    {data.from_time} - {data.to_time}
                </div>
                <Link to={`https://wa.me/${phone}`} className="bg-green-500 flex flex-row items-center justify-center text-xl text-white gap-x-2 border-2 border-gray-400 rounded-full px-3 py-1 mt-2">
                    Chat On Whatsapp <span className="material-symbols-outlined">call</span>
                </Link>
            </div>
        </div>
    )
}

export function MyBookings(){
    const itemsPerPage=4;
    const [booking,setbooking]=useState([])
    const [components,setcomponents]=useState([])
    const {auth}=useAuthContext()
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;

    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = components.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(components.length / itemsPerPage);

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % components.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
      setItemOffset(newOffset);
    };

    const fetchbookings =async()=>{
        await axios.get("http://127.0.0.1:8000/api/bookings/list/").then((res)=>{
            console.log(res.data)
            const data=res.data.filter((item)=>{
                if(item.user == Number(auth.user.id)){
                    return item
                }
            })
            setbooking(data)
        })
    }

    const fetchcomponent=()=>{
        const data=booking.map((item)=>{
            // eslint-disable-next-line react/jsx-key
            return <BookingComponent data={item} />
        })
        setcomponents(data)
        console.log(data)
    }

    useEffect(()=>{
        fetchbookings()
    },[])

    useEffect(()=>{
        fetchcomponent()
    },[booking])

    return(
        <div>
            <div className="mx-auto flex flex-row justify-center px-36 gap-x-8 py-10">
                <Menu/>
                <div className="w-10/12">
                <div className="text-4xl">
                    Bookings
                    <hr className="bg-red-400 w-64 h-2 rounded-full mb-9"></hr>
                </div>
                {booking.length != 0 &&(<>
                  <Items currentItems={currentItems} />
                  <div className="flex flex-col items-center justify-center">
                  <ReactPaginate
                    className="flex flex-row items-center justify-center gap-x-5 mt-10"
                    activeClassName="bg-red-400 rounded-full px-4 py-2 text-white"
                    breakLabel="..."
                    nextLabel={(<span className="material-symbols-outlined bg-blue-500 text-white p-2 rounded-full">arrow_forward</span>)}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel={(<span className="material-symbols-outlined bg-blue-500 text-white p-2 rounded-full">arrow_back</span>)}
                    renderOnZeroPageCount={null}
                  />
                  </div>
                </>)}
                {booking.length === 0 &&(
                <div className="mx-auto flex flex-col justify-center gap-x-8">
                    <img src="/myzone/nobookings.svg" style={{height:"400px"}}></img>
                </div>
                )}
                </div>
            </div>
        </div>
    )
}