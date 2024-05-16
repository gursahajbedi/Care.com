import useAuthContext from "../AuthLogic/useAuthContext"
import "./navbar.css"

export default function Navbar(){
    const {auth}=useAuthContext()
    return(
        <>

            <div className="px-5 py-5 container-fluid rounded-br-2xl rounded-bl-2xl" style={{backgroundColor:"#CBE4F2"}}>
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <img src="/logo.svg" style={{height:"100px"}}></img>
                    </div>
                    <div className="flex flex-row flex-wrap gap-10 items-center justify-center">
                        <div className="2xl:text-2xl md:text-lg">About Us</div>
                        <div className="2xl:text-2xl md:text-lg">Community</div>
                        <div className="2xl:text-2xl md:text-lg">Search For A Nanny</div>
                        <div className="2xl:text-2xl md:text-lg">Quick Nanny</div>
                        <div className="2xl:text-2xl md:text-lg">Blogs</div>
                        {!auth.user && (
                            <a href="/login">
                            <img src="/login.svg" style={{height:"100px"}}></img>
                            </a>
                        )}
                        {auth.user && (
                            <a href="/myzone/profile" >
                                {auth.user.profile_pic ? 
                                    (<img src={`${auth.user.profile_pic}`} style={{height:"100px"}}></img>)
                                    :
                                    (<img className="border-4 border-gray-500 shadow-xl " src="/auth/default-profile.jpg" style={{height:"80px",borderRadius:"100%"}}></img>)
                                }
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}