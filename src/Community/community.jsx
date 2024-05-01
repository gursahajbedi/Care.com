import { Link } from "react-router-dom";

export default function Community(prop){
    return(
        <>
            <Link to={{
                pathname:`/community/post/${prop.data.id}`,
                state:[prop.data]
            }}>
            <div className="my-8">
                <div className="mx-auto 2xl:w-8/12 md:w-11/12 bg-white border-2 shadow-2xl border-gray-400 py-3" style={{borderRadius:"50px"}}>
                    <div className="2xl:text-4xl md:text-3xl flex flex-row">
                        <div className="flex flex-row mx-auto">
                            <div className="p-7">
                                <div className="2xl:text-2xl md:text-xl">
                                    {prop.data.title}
                                </div>
                                <div className="2xl:text-lg md:text-base text-gray-500 mt-2">
                                    {prop.data.desc}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col align items-center justify-center me-7">
                            <img src="/homepage/communityprofile.svg" style={{height:"90px"}}></img>
                            {prop.data.author_type === "Mother" && (<div className="w-28 bg-red-400 rounded-2xl 2xl:text-xl md:text-lg text-center text-white mt-2">
                                {prop.data.author_type}
                            </div>)}
                            {prop.data.author_type === "Nanny" && (<div className="w-28 bg-blue-400 rounded-2xl 2xl:text-xl md:text-lg text-center text-white mt-2">
                                {prop.data.author_type}
                            </div>)}
                        </div>
                        <div className="flex flex-col items-center justify-center me-10 gap-y-2">
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
            </Link>
            
        </>
    )
}