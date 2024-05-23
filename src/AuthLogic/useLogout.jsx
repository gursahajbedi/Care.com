import useAuthContext from "./useAuthContext"

export default function useLogout(){
<<<<<<< HEAD
    const {dispatchs}=useAuthContext()
    async function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("preferences")
        await dispatchs({type:"logout"})
=======
    const {dispatch}=useAuthContext()
    async function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("preferences")
        await dispatch({type:"logout"})
>>>>>>> master
        console.log("logged out")
    }
    return {logout}
}