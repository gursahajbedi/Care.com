import axios from "axios"
import useAuthContext from "./useAuthContext"
<<<<<<< HEAD
=======
import { useState } from "react"
>>>>>>> master


export default function useLogin(){

<<<<<<< HEAD
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
=======
    const {dispatch}=useAuthContext()

    async function login(email,password){
        // await axios.get("http://localhost:8000/accounts").then((res)=>{
        //     console.log(res.data)
        //     res.data.filter((item)=>{
        //         if(item.email === email && item.password === password){
        //             localStorage.setItem("user",JSON.stringify(item))
        //             dispatch({type:"login",payload:item})
        //         }
        //     })
        // }).catch((err)=>console.log(err))
        // console.log("logged in")

        await axios.post("http://127.0.0.1:8000/api/accounts/login/",{
            email:email,
            password:password
        }).then((res)=>{
            console.log(res.data)
            localStorage.setItem("user",JSON.stringify(res.data))
            dispatch({type:"login",payload:res.data})
        })
    }
    async function adminlogin(email,password){
        // await axios.get("http://localhost:8000/accounts").then((res)=>{
        //     res.data.filter((item)=>{
        //         if(item.email === email && item.password === password && item.is_staff === true){
        //             localStorage.setItem("user",JSON.stringify(item))
        //             dispatch({type:"login",payload:item})
        //         }
        //     })
        // }).catch((err)=>console.log(err))
        // console.log("logged in")

        await axios.get("http://127.0.0.1:8000/api/accounts/list").then((res)=>{
            const data=res.data.filter((item)=>{
                if(item.is_staff === true){
                    return item
                }
            })
            console.log(data)
            data.filter((item)=>{
                if(item.email === email){
                    login(email,password)
                }
            })
        })

        // await axios.post("http://127.0.0.1:8000/api/accounts/login/",{
        //     email:email,
        //     password:password
        // }).then((res)=>{
        //     console.log(res.data)
        //     localStorage.setItem("user",JSON.stringify(res.data))
        //     dispatch({type:"login",payload:res.data})
        // })
    }
    return {login,adminlogin}
>>>>>>> master
}
