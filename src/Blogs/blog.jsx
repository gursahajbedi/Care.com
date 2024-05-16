import { useLocation } from "react-router-dom"

export default function Blog(){
    const loc=useLocation()
    const data=JSON.parse(loc.state)



    return(
        <>
        <div>
        </div>    
        </>
    )
}