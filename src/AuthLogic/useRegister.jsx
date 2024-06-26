import axios from "axios"


export default function useRegister(){
    
    async function signup(email,name,password,password2,phone){
        // const body={"email":email,"password":password,"name":name,"password2":password2,"is_admin":false,"phone":phone}
        // if(body.password === body.password2){
        //     await axios.post("http://localhost:8000/accounts",body).then((res)=>{return res}).catch((res)=>{return res})
        // }

        const body={"email":email,"password":password,"name":name,"password2":password2,"phone_number":phone}
        await axios.post("http://127.0.0.1:8000/api/accounts/signup/",body).then((res)=>{
            return res
        }).catch((err)=>{
            return err
        })

    }
    console.log("registered")
    return {signup}
}
