import axios from "axios"
import { useState } from "react"
import useAuthContext from "./useAuthContext"


export default function useChangePassword(){
    const [error,seterror]=useState()
    const {auth,dispatchs}= useAuthContext()

    async function passwordimplement(id,original,prevdata){
        await axios.patch(`http://localhost:8000/accounts/${id}`,{...prevdata,password:original,password2:original}).then((res)=>{
            console.log("password changed")
            localStorage.setItem("user",JSON.stringify(res.data))
            dispatchs({type:"login",payload:res.data})
            console.log(auth)

        }).catch((err)=>{console.log(err)})
    }
    
    async function changepassword(id,original,changed,confirmchanged){
        await axios.get("http://localhost:8000/accounts").then((res)=>{
            res.data.filter((item)=>{
                console.log(item.id,id)
                if(item.id === id){
                    if(item.password === original){
                        if (changed===confirmchanged) {
                            passwordimplement(id,changed,item)
                        }
                        else{
                            seterror("New Passwords Don't Match")
                        }
                    }
                    else{
                        seterror("Incorrect Password")
                    }
                }
            })
        }).catch((err)=>{console.log(err)})
    }
    return {changepassword,error}
}
