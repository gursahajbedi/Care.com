import axios from "axios"


export default function useRegister(){
    
    async function signup(email,phone,password,password2){
        const body={"email":email,"password":password,"phone":phone,"password2":password2,"profile_pic":null}
        if(body.password === body.password2){
            await axios.post("http://localhost:8000/accounts",body).then((res)=>{return res}).catch((res)=>{return res})
        }
    }
    console.log("registered")
    return {signup}
}
