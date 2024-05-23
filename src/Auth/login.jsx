
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../AuthLogic/useLogin";

export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e) => {
        e.preventDefault()
        setShowPassword(!showPassword);
    };

    const {login}=useLogin()

    const navigate= useNavigate()

    const LoginSubmit = async(e)=>{
        e.preventDefault()
        await login(email,password).then(()=>{
            navigate("/");
        })
    }
    return (
        <div className="mx-auto container">
            <div className="w-full border-4 border-gray-400 rounded-3xl shadow-2xl my-20 p-5 py-16">
                <div className="w-full flex flex-row items-center">
                    <div className="flex flex-col w-1/2 ps-10 border-r-2 border-r-gray-400">
                        <div className="2xl:text-3xl md:text-2xl">
                            Login
                            <hr className="h-2 w-36 rounded-full bg-red-400"></hr>
                        </div>
                        <form className="2xl:text-2xl md:text-xl" onSubmit={(e)=>LoginSubmit(e)}>
                            <div className="my-9">
                                <div className="my-3">Email</div>
                                <input className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Email" type="email" onChange={(e)=>{setEmail(e.target.value)}}></input>
                            </div>
                            <div className="my-5">
                                <div className="flex flex-row items-center justify-between w-9/12">
                                    <div className="my-3">Password</div>
                                    <button onClick={(e)=>togglePasswordVisibility(e)} className="text-lg underline">Show Password</button>
                                </div>
                                <input className="border-2 rounded-3xl border-gray-400 w-3/4 px-7 py-4" placeholder="Password" type={showPassword ? 'text' : 'password'} onChange={(e)=>{setPassword(e.target.value)}}></input>
                            </div>
                            <div className="my-12">
                                <button type="submit" className=" h-10 rounded-full bg-red-400 text-white py-6 px-7 flex flex-row items-center gap-3 shadow-xl" >
                                    Proceed
                                    <span>
                                        <img src="/auth/whitearrow.svg" width={"30px"}></img>
                                    </span>
                                </button>
                            </div>
                        </form>
                        <div className="2xl:text-2xl md:text-xl">
                            Dont Have An Account? <Link to={"/register"} className="border-b-4 border-red-400">Register Here</Link>
                        </div>
                    </div>
                <div className="w-1/2 flex flex-nowrap justify-center container">
                    <img src="/auth/mother.svg" className="rounded-3xl w-9/12 "></img>
                </div>
                </div>
            </div>

        </div>
    );
}