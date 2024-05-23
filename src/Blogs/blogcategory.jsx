import { useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { BlogsComponent } from "./blogspage";

export default function BlogCategoryPage(){
    const loc=useLocation()
    const data=JSON.parse(loc.state)
    let {category}=useParams()
    category=category.charAt(0).toUpperCase() + category.slice(1)

    return(
        <>
            <div className="text-4xl my-10 container mx-auto">
                {category}
                {category === "Advice" || category ==="advice" && (<hr className="rounded-full bg-blue-400 h-2 w-44"></hr>)}
                {category === "General" || category ==="general" && (<hr className="rounded-full bg-red-400 h-2 w-44"></hr>)}
                {category === "Tips" || category ==="tips" && (<hr className="rounded-full bg-yellow-400 h-2 w-44"></hr>)}
            </div>
            <div className="mx-auto flex flex-wrap justify-center items-center gap-y-8 my-10 gap-x-5">
                {
                    data.map((item)=>{
                        // eslint-disable-next-line react/jsx-key
                        return  (<BlogsComponent data={item.props.data} />)
                    })
                }
            </div>
        </>
    )
}