export default function Testimonials(prop){
    return(
        <>
            <div className="mx-5 py-3 border rounded-3xl shadow-xl bg-white" style={{height:"450px"}}>
                <div className="flex flex-col justify-center items-center">
                    <img src="/homepage/girl.jpg" className="mt-5 rounded-full border border-4 border-gray-300" style={{height:"150px", width:"150px",objectFit:"cover"}}></img>
                    <img src="/ratingfake.svg" className="mt-3"></img>
                    <div id="name" className="md:text-xl 2xl:text-2xl">
                        {prop.data.name}
                    </div>
                    <div id="review" className="md:text-lg 2xl:text-xl text-center w-3/4 mt-4">
                        "{prop.data.review}"
                    </div>
                    <div id="author" className="md:text-lg 2xl:text-xl text-center w-3/4 mt-4">
                        -{prop.data.author}
                    </div>
                </div>
            </div>
        </>
    )
}