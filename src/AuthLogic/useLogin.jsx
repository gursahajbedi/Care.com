import axios from "axios"
import useAuthContext from "./useAuthContext"


export default function useLogin(){

    const {dispatchs}=useAuthContext()

    async function login(email,password){
        await axios.get("http://localhost:8000/accounts").then((res)=>{
            console.log(res.data)
            res.data.filter((item)=>{
                if(item.email === email && item.password === password){
                    localStorage.setItem("user",JSON.stringify(item))
                    dispatchs({type:"login",payload:res.data})
                }
            })
        }).catch((err)=>console.log(err))
        console.log("logged in")
    }
    return {login}
}
