import useAuthContext from "./useAuthContext"

export default function useLogout(){
    const {dispatchs}=useAuthContext()
    async function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("preferences")
        await dispatchs({type:"logout"})
        console.log("logged out")
    }
    return {logout}
}