import { useEffect, useState } from "react";
import axios from 'axios'

export default function Community(prop){
    const [userprofile, setuserProfile] = useState({});

    const fetchProfile = async (id,setdata) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/list/`);
            const data = response.data.find(item => item.id === Number(id));
            if (data) {
                console.log(data);
                setdata(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchProfile(prop.data.author,setuserProfile);
    }, [prop.data.author]);
    return(
        <>
            <div className="my-8">
                <div className="mx-auto 2xl:w-8/12 md:w-11/12 bg-white border border-2 shadow-2xl border-gray-400 py-3" style={{borderRadius:"50px"}}>
                    <div className="2xl:text-4xl md:text-3xl flex flex-row justify-between items-center">
                        <div className="flex flex-row">
                            <div className="p-7">
                                <div className="2xl:text-2xl md:text-xl">
                                    {prop.data.title}
                                </div>
                                <div className="2xl:text-lg md:text-base text-gray-500 mt-2">
                                    {prop.data.desc.slice(0,200)}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center me-10 gap-y-4">
                            
                            <div style={{height:"110px", width:"110px"}} className="mx-4">
                                <img src={userprofile.profile_pic != null?`http://127.0.0.1:8000${userprofile.profile_pic}`:`/community/communityprofile.svg`} className="rounded-full" style={{height:"100%",width:"100%",objectFit:"cover"}}></img>
                            </div>
                                
                            <div className="flex flex-col items-center gap-x-2 mx-4">
                                <div>
                                    <img src="/community/upvote.svg"></img>
                                    <div className="2xl:text-lg md:text-base font-bold text-center">
                                        {prop.data.likes_count}
                                    </div>
                                </div>
                                <div>
                                    <img src="/community/downvote.svg"></img>
                                    <div className="2xl:text-lg md:text-base font-bold text-center">
                                        {prop.data.dislikes_count}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}