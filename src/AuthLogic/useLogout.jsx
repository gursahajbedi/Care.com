import useAuthContext from "./useAuthContext"

export default function useLogout(){
    const {dispatch}=useAuthContext()
    async function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("preferences")
        await dispatch({type:"logout"})
        console.log("logged out")
    }
    return {logout}
}