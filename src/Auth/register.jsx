
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRegister from "../AuthLogic/useRegister";


export default function Register(){
    const [email, setEmail] = useState("");
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const [password2,setPassword2]=useState("")
    const [phone,setphone]=useState()
    const {signup} = useRegister()
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCon, setShowPasswordCon] = useState(false);

    const togglePasswordVisibility = (e,show,setshow) => {
        e.preventDefault()
        setshow(!show);
    };

    const navigate=useNavigate()

    const RegisterSubmit = async(e) =>{
        e.preventDefault()
        await signup(email,name,password,password2,phone).then(()=>{
            navigate('/login')
        })
    }

    return (
        <div className="mx-auto container">
            <div className="w-full border-4 border-gray-400 rounded-3xl shadow-2xl my-20 p-5 py-16">
                <div className="w-full flex flex-row items-center">
                    <div className="flex flex-col w-1/2 ps-10 border-r-2 border-r-gray-400">
                        <div className="2xl:text-3xl md:text-2xl">
                            Register
                            <hr className="h-2 w-36 rounded-full bg-red-400"></hr>
                        </div>
                        <form className="2xl:text-2xl md:text-xl" onSubmit={(e)=>RegisterSubmit(e)}>
                            <div className="mt-9">
                                <div className="my-3">Email</div>
                                <input required type="email" className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}></input>
                            </div>
                            <div className="my-5">
                                <div className="my-3">Name</div>
                                <input required className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Name" onChange={(e)=>{setName(e.target.value)}}></input>
                            </div>
                            <div className="my-5">
                                <div className="my-3">Phone</div>
                                <input required type="text" pattern="[\d]{9}" maxLength={10} className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Phone" onChange={(e)=>{setphone(e.target.value)}}></input>
                            </div>
                            <div className="my-5">
                                <div className="flex flex-row items-center justify-between w-9/12">
                                    <div className="my-3">Password</div>
                                    <button onClick={(e)=>togglePasswordVisibility(e,showPassword,setShowPassword)} className="text-lg underline">Show Password</button>
                                </div>
                                <input required className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e)=>{setPassword(e.target.value)}}></input>
                            </div>
                            <div className="my-5">
                                <div className="flex flex-row items-center justify-between w-9/12">
                                    <div className="my-3">Confirm Password</div>
                                    <button onClick={(e)=>togglePasswordVisibility(e,showPasswordCon,setShowPasswordCon)} className="text-lg underline">Show Password</button>
                                </div>
                                <input required className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Confirm Password" type={showPasswordCon ? 'text' : 'password'} onChange={(e)=>{setPassword2(e.target.value)}}></input>
                            </div>
                            <div className="my-12">
                                <button type="submit" className=" h-10 rounded-full bg-red-400 text-white py-6 px-7 flex flex-row items-center gap-3 shadow-xl">
                                    Proceed
                                    <span>
                                        <img src="/auth/whitearrow.svg" width={"30px"}></img>
                                    </span>
                                </button>
                            </div>
                        </form>
                        <div className="2xl:text-2xl md:text-xl">
                            Already have An Account? <Link to={"/login"} className="border-b-4 border-red-400">Login Here</Link>
                        </div>
                    </div>
                <div className="w-1/2 flex flex-nowrap justify-center container">
                    <img src="/auth/mother.svg" className="rounded-3xl w-12/12 "></img>
                </div>
                </div>
            </div>

        </div>
    );
}