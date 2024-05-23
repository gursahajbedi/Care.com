import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function Blog() {
    let {id}=useParams()
    const [blog,setBlog]=useState({})
    const [blogs, setBlogs] = useState([]);
    const [similarBlogs, setSimilarBlogs] = useState([]);

    const fetchBlogs = () => {
        axios.get("http://127.0.0.1:8000/api/blogs/list/").then((res) => {
              const data=res.data.filter((item)=>{
              id=Number(id)
              if(item.id == id){
                return item
              }
            })    
            setBlog(data[0])
            setBlogs(res.data); 
        });
    };

    useEffect(() => {
      fetchBlogs();
  },[id]);

    const filterSimilarBlogs = () => {
      let filtered = blogs.filter(
          (item) => item.title.includes(blog.title) && item.id !== blog.id
      );
      if (filtered.length === 0) {
          // If no similar blogs found, use other blogs as a fallback
          filtered = blogs.filter(item => item.id !== blog.id).slice(0, 5); // limit to 5 blogs
      }
      setSimilarBlogs(filtered);
    }

    function decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
  }
  useEffect(() => {
    if (blogs.length > 0) {
        filterSimilarBlogs();
    }
}, [blogs]);

    return (
        <div className="flex flex-col md:flex-row items-start justify-center gap-6 my-20 px-6 md:px-44">
            <div className="flex-1">
              <hr className="h-1 bg-red-400"></hr>
              <div className="flex flex-row justify-between my-6">
                <div className="text-4xl font-bold text-gray-800 my-3">
                      {blog.title}
                  </div>
                  <div className="text-lg text-gray-700 flex flex-row items-center gap-x-3 border-2 border-gray-200 rounded-full py-2 px-3 text-nowrap h-20">
                      Written By <span className="font-semibold flex flex-row items-center gap-x-3">Care.Com With <span className="material-symbols-outlined text-red-400 text-2xl">favorite</span></span>
                  </div>
              </div>
        
                <img
                    src={`http://127.0.0.1:8000${blog.image}`}
                    alt="Blog Post"
                    className="rounded-3xl shadow-lg"
                    style={{ height: "500px", width: "1000px", objectFit: "cover" }}
                />
                <div className="flex flex-row justify-between items-center w-full mt-6">
                    {blog.category === "General" && (
                        <div className="text-lg rounded-full bg-red-500 w-28 text-center text-white py-2 shadow-md">
                            {blog.category}
                        </div>
                    )}
                    {blog.category === "Advice" && (
                        <div className="text-lg rounded-full bg-blue-500 w-28 text-center text-white py-2 shadow-md">
                            {blog.category}
                        </div>
                    )}
                    {blog.category === "Tips" && (
                        <div className="text-lg rounded-full bg-yellow-500 w-28 text-center text-white py-2 shadow-md">
                            {blog.category}
                        </div>
                    )}
        
                </div>
                <div className="w-full mt-8 leading-8 text-lg text-wrap">
                    <div dangerouslySetInnerHTML={{ __html: decodeHtml(blog.content) }}/>
                </div>
            </div>

            {/* Similar Blogs Section */}
            <div className="w-full md:w-1/3 md:ml-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Blogs</h2>
                <div className="grid grid-cols-1 gap-6">
                    {similarBlogs.map((blog) => (
                      <Link key={blog.id} to={`/blogs/post/${blog.id}`}>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <img
                                src={`http://127.0.0.1:8000${blog.image}`}
                                alt={blog.title}
                                className="rounded-t-lg"
                                style={{ height: "150px", width: "100%", objectFit: "cover" }}
                            />
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">{blog.title}</h3>
                                <p className="text-gray-600 mt-2">
                                    {blog.short_desc.slice(0,200)}...
                                </p>
                        
                                <Link
                                    to={`/blogs/post/${blog.id}`}
                                    className="text-blue-500 hover:underline mt-4 inline-block"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                      </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}