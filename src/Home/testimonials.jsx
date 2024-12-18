import { useEffect, useState } from "react";
import { URL } from "../../global";
import axios from 'axios'

export default function Testimonials(prop) {
    const [userprofile, setuserProfile] = useState({});
    const [nannyprofile, setnannyProfile] = useState({});
    const [application,setapplication]=useState([])
    const [app,setapp]=useState({})

    const fetchProfile = async (id,setdata) => {
        try {
            const response = await axios.get(`${ URL }/api/accounts/list/`);
            const data = response.data.find(item => item.id === Number(id));
            if (data) {
                console.log(data);
                setdata(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchapp =async()=>{
        await axios.get(`${ URL }/api/app/list/`).then((res)=>{
                const data = res.data.find(item => item.id === prop.data.profile);
                console.log(data)
                setapp(data)
                const newapp=JSON.parse(data.domains)
                const data2 = newapp.filter((item)=>{
                    if(item.type === prop.data.domain_name){
                        return item
                    }
                })
                setapplication(data2[0])
          })
      }

    useEffect(() => { 
        fetchapp()
    }, []); // Fetch profile whenever prop.data.id changes

    useEffect(()=>{
        if(app != {}){
            console.log(prop.data.user,app.user)
            fetchProfile(prop.data.user,setuserProfile);
            fetchProfile(app.user,setnannyProfile);
        }
    },[app])


    return(
        <>
            <div className="mx-5 py-3 border rounded-3xl shadow-xl bg-white" style={{height:"450px"}}>
                <div className="flex flex-col justify-center items-center h-full gap-y-3">
                    <div style={{height:"150px", width:"150px"}}>
                        <img src={nannyprofile.profile_pic != null?`${ URL }${nannyprofile.profile_pic}`:`/community/communityprofile.svg`} className="rounded-full" style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                    </div>
                    <img src="/ratingfake.svg" className="mt-3"></img>
                    <div id="name" className="md:text-xl 2xl:text-2xl">
                        {application.display_name}
                    </div>
                    <div id="review" className="md:text-lg 2xl:text-xl text-center w-3/4 mt-4">
                        "{prop.data.content}"
                    </div>
                    <div id="author" className="md:text-lg 2xl:text-xl text-center w-3/4 mt-4">
                        -{userprofile.name}
                    </div>
                </div>
            </div>
        </>
    )
}