import "./footer.css"
export default function Footer(prop){
    return(
        <>
            <div className="py-20 flex justify-center"  style={{"backgroundColor":"#CBE4F2"}} >
                <div className="container flex flex-wrap flex-row justify-between">
                    <div id="Contact" className="flex flex-col justify-center">
                        <img src="/logo.svg" height={"250px"} width={"250px"}></img>
                        <div className="flex flex-row gap-7 mt-4">
                            <img src="/social/facebook.svg"></img>
                            <img src="/social/instagram.svg"></img>
                            <img src="/social/linkedin.svg"></img>
                            <img src="/social/google.svg"></img>
                        </div>
                        <div className="mt-7 ">
                            <button className="p-4 2xl:text-2xl md:text-xl rounded-full shadow-xl text-3xl text-white w-full" style={{"backgroundColor":"#F48888"}}>+91 9999999999</button>
                        </div>
                        <div className="mt-7">
                            <button className="p-4 2xl:text-2xl md:text-xl rounded-full shadow-xl text-3xl text-white w-full" style={{"backgroundColor":"#F48888"}}>support@care.com</button>
                        </div>
                    </div>
                    <div id="Navigation" className="flex flex-col">
                        <div className="2xl:text-2xl md:text-xl">Navigation</div>
                        <hr className="bg-red-400 w-36 h-2 rounded-full"></hr>
                        <div className="my-2">
                            <a href="/aboutus"><div className="2xl:text-2xl md:text-xl my-4">About Us</div></a>
                            <a href="/community"><div className="2xl:text-2xl md:text-xl my-4">Community</div></a>
                            <a href="/searchnanny"><div className="2xl:text-2xl md:text-xl my-4">Search For A Nanny</div></a>
                            <a href="blogs"><div className="2xl:text-2xl md:text-xl my-4">Blogs</div></a>

                        </div>
                    </div>
                    <div id="Others" className="flex flex-col">
                    <div className="2xl:text-2xl md:text-xl">Authenticated Links</div>
                        <hr className="bg-red-400 w-44 h-2 rounded-full"></hr>
                        <div className="my-2">
                            <a href={prop.auth ?"/myzone/applications":"/login"}><div className="2xl:text-2xl md:text-xl my-4">Applications</div></a>
                            <a href={prop.auth ?"/myzone/verifications":"/login"}><div className="2xl:text-2xl md:text-xl my-4">Verifications</div></a>
                            <a href={prop.auth ?"/myzone/mybookings":"/login"}><div className="2xl:text-2xl md:text-xl my-4">Bookings</div></a>
                            <a href={prop.auth ?"/myzone/profile":"/login"}><div className="2xl:text-2xl md:text-xl my-4">Profile</div></a>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="bg-blue-300 h-10 w-full"></hr>
        </>
    )
}