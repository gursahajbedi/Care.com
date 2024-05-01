import "./navbar.css"

export default function Navbar(){
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
                        <img src="/login.svg" style={{height:"100px"}}></img>
                    </div>
                </div>
            </div>
        </>
    )
}