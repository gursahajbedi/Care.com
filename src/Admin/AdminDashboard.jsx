import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import './admin.css'
import useLogout from "../AuthLogic/useLogout"
import ReactPaginate from 'react-paginate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAuthContext from "../AuthLogic/useAuthContext"
import { URL } from '../../global';

export function Menu(){
    const {logout}= useLogout()
    const navigate= useNavigate()

    const handlelogout=async()=>{
        await logout().then(()=>{   
            navigate("/admin/login")
        })
    }
    return(
        <>
        <div className="w-3/12 h-64 border-4 rounded-3xl shadow-xl border-gray-200 flex flex-col justify-center items-center gap-y-5"> 
          <div className="flex flex-col items-start p-s-10 gap-y-5">
            <Link to={"/admin/dashboard"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/profile.svg" style={{height:"35px"}}></img></div>
                <div>Approve / Reject</div>
            </Link>
            <Link to={"/admin/blogs"} className="text-xl flex flex-row items-center gap-x-4">
                <div><img src="/myzone/profile.svg" style={{height:"35px"}}></img></div>
                <div>Blogs</div>
            </Link>
            <button className="text-xl flex flex-row items-center gap-x-4" onClick={()=>{handlelogout()}}>
                <span className="text-3xl material-symbols-outlined text-red-600">Logout</span>
                <div className="text-red-600 text-2xl">Logout</div>
            </button>
            </div>
        </div>
        </>
    )
}

export function VerifyComponent({data,profiles,handleapprove,handlereject}){
    const[profile,setprofile]=useState({})

    const fetchprofile = async (id) => {
          await axios.get(`${URL}/api/accounts/list/`).then((res) => {
            const data=res.data.filter((item)=>{
              if(item.id==id){
                return item
              }
            })
            setprofile(data[0])
          });
    }

    useEffect(()=>{
        fetchprofile(data.user)
    },[])

    const [active,setactive]=useState(false)

    return(
        <div key={data.id} className="w-full flex flex-col items-center">
            <div className="w-full flex flex-row items-center">
                <div className="flex flex-row items-center justify-between border-4 rounded-full px-7 py-5 border-gray-400 w-full">
                    <img src="/myzone/profile.svg" style={{height:"50px"}}></img>
                    <div className="flex flex-col items-center text-lg">
                        <div className="font-semibold">
                            Id:
                        </div>
                        <div>
                            {data.id}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-semibold text-lg">Name:</div>
                        <div className="text-lg">{profile.name}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-semibold text-lg">Email:</div>
                        <div className="text-lg">{profile.email}</div>
                    </div>
                    <div className="flex flex-col items-center bg-green-400 rounded-full" onClick={()=>handleapprove(data.id)}>
                        <span className="text-white text-5xl material-symbols-outlined">
                            check_circle
                        </span>
                    </div>
                    <div className="flex flex-col items-center bg-red-400 rounded-full" onClick={()=>handlereject(data.id)}>
                        <span className="text-white text-5xl material-symbols-outlined">
                            cancel
                        </span>
                    </div>
                </div>
                <div onClick={()=>{setactive(true)}}>
                    <span className="material-symbols-outlined text-4xl">
                        keyboard_arrow_down
                    </span>
                </div>
            </div>
            {active && (
                <div className="overlay">
                    <div className="content flex flex-col">
                        <div className="flex flex-row justify-end">
                            <span className="material-symbols-outlined text-3xl" onClick={()=>setactive(false)}>
                                close
                            </span>
                        </div>
                        <div className="flex flex-row">
                        <div className="flex flex-col items-start gap-y-8 w-5/12 text-xl border-2 border-gray-400 shadow-xl rounded-xl p-12 h-fit">
                            <div>
                                <b>State : </b>{data.state}
                            </div>
                            <div>
                                <b>Type : </b>{data.user_type}
                            </div>

                            <div>
                                <b>Org. URL : </b>{data.organisation_url}
                            </div>
                            <div>
                                <b>Org. Name : </b>{data.organisation_name}
                            </div>
                            <div>
                                <b>Reference Name : </b>{data.reference1_name}
                            </div>
                            <div>
                                <b>Reference Contact : </b>{data.reference1_phone}
                            </div>
                            <div>
                                <b>Reference Name : </b>{data.reference2_name}
                            </div>
                            <div>
                                <b>Reference Phone : </b>{data.reference2_phone}
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-6 items-center justify-center w-7/12">
                            <div style={{height:"250px",width:"500px"}}>
                                <img src={`${URL}${data.identity_proof}`} style={{height:"100%", width:"100%", objectFit:"cover"}}></img>
                            </div>
                            <div style={{height:"250px",width:"500px"}}>
                              <img src={`${URL}${data.police_certificate}`} style={{height:"100%", width:"100%", objectFit:"cover"}}></img>
                            </div>
                            <div style={{height:"250px",width:"500px"}}>
                              <img src={`${URL}${data.driving_license_proof}`} style={{height:"100%", width:"100%", objectFit:"cover"}}></img>
                            </div>
                        </div>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default function AdminDashboard(){

  const {auth}=useAuthContext()

    const [application,setapplication]=useState([])
    const [profiles, setProfiles] = useState({});
    const fetchapp =async()=>{
      await axios.get(`${URL}/api/app/list/`).then((res)=>{
            const newdata=res.data.filter((item)=>{
                if(item.status === false){
                    return item
                }
            })
            setapplication(newdata)  
        })
    }

    const handleapprove=async(id)=>{
        await axios.patch(`${URL}/api/app/verifications/${id}/`,{},{
          headers: {
            'Authorization': `Bearer ${auth.user.access}`
        }
        }).then((res)=>{
            console.log(res.data)
        })
    }

    const handlereject=async(id)=>{
        await axios.delete(`${URL}/api/app/application/${id}/delete/`,{
          headers: {
            'Authorization': `Bearer ${auth.user.access}`
        }
        }).then((res)=>{
            console.log(res.data)
        })
    }

    useEffect(()=>{
        fetchapp()
        console.log(application)
    },[])

    useEffect(()=>{
        fetchapp()
    },[handleapprove])

    return(
        <div className="flex flex-col items-center justify-center w-3/4 mx-auto my-10">
            <div className="flex flex-row items-center justify-center gap-x-10 w-full">
                <Menu/>
                {application.length !==0 &&
                (<div className="w-9/12 flex flex-col items-center justify-between gap-y-5">
                    {
                        application.map((item)=>{
                            return(
                                <VerifyComponent data={item} profile={profiles[item.id]} key={item.id} handleapprove={handleapprove} handlereject={handlereject}/>
                            )
                        })
                    }
                </div>)
                }
                { application.length ===0 &&
                    (
                        <div className="w-9/12 flex flex-col items-center justify-center">
                            <img src="/nanny/NotVerified.jpg" style={{height:"150px"}}></img>
                            <div className="text-3xl">
                                No Further Verifications For Remaining
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map((item) => (
            <div>
              <h3>{item}</h3>
            </div>
          ))}
      </>
    );
  }

  export function Blogs() {

    const {auth}=useAuthContext()
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;

    const itemsPerPage = 5;
    const [blogs, setBlogs] = useState([]);
    const [components, setComponents] = useState([]);
    const [active, setActive] = useState(false);
  
    const [itemOffset, setItemOffset] = useState(0);
  
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = components.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(components.length / itemsPerPage);
  
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % components.length;
      setItemOffset(newOffset);
    };
  
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('${URL}/api/blogs/list/');
        setBlogs(response.data);
        fetchComponents(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
  
    const deleteBlog = async (id) => {
      try {
        await axios.delete(`${URL}/api/blogs/${id}/delete/`);
        setBlogs(blogs.filter(blog => blog.id !== id));
        fetchComponents(blogs.filter(blog => blog.id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    };
  
    const fetchComponents = (blogs) => {
      const data = blogs.map(blog => (
        <li key={blog.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center my-5">
          <div>
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="text-gray-600">{blog.shortdesc}</p>
            <p className="text-sm text-gray-500"><strong>Author:</strong> {blog.author}</p>
            <p className="text-sm text-gray-500"><strong>Category:</strong> {blog.category}</p>
            <p className="text-sm text-gray-500">{blog.created_at}</p>
          </div>
          <button
            onClick={() => deleteBlog(blog.id)}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </li>
      ));
      setComponents(data);
    };
  
    useEffect(() => {
      fetchBlogs();
    }, []);
  
    const initialvalue={
      title: '',
      author: Number(auth.user.id),
      short_desc: '',
      content: '',
      post_type: '',
      image:''
    }
    const [newBlog, setNewBlog] = useState(initialvalue);

    useEffect(()=>{
      setNewBlog(initialvalue)
    },[active])
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewBlog({ ...newBlog, [name]: value });
    };
  
    const handleContentChange = (value) => {
      setNewBlog({ ...newBlog, content: value });
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0]; // Get the first file from the input
    
      setNewBlog({ ...newBlog, image: file });
    };
  
    const addBlog = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        formData.append('author', newBlog.author);
        formData.append('short_desc', newBlog.short_desc);
        formData.append('image', newBlog.image);
        formData.append('title', newBlog.title);
        formData.append('post_type', newBlog.post_type);
        formData.append('content', newBlog.content);

        const response = await axios.post('${URL}/api/blogs/write/', formData,{
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response)
        setBlogs([...blogs, response.data]);
        fetchComponents([...blogs, response.data]);
        setActive(false);
      } catch (error) {
        console.error('Error adding blog:', error);
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center w-3/4 mx-auto my-10">
        <div className="flex flex-row justify-between w-full">
          <Menu />
          <div className="w-9/12 flex flex-col items-center">
            <div className="container mx-auto flex flex-row items-center justify-center p-2">
              <div className="w-full">
                <div className="flex flex-row justify-between items-center mb-3">
                  <h2 className="text-2xl font-semibold mb-1 w-full">Blogs</h2>
                  <button
                    onClick={() => setActive(true)}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  >
                    Create
                  </button>
                </div>
                <hr className="rounded-full h-1 w-full bg-red-400 mb-5"></hr>
              </div>
            </div>
            <div>
              <Items currentItems={currentItems} />
              <div className="flex flex-col items-center justify-center">
                <ReactPaginate
                  className="flex flex-row items-center justify-center gap-x-5 mt-10"
                  activeClassName="bg-red-400 rounded-full px-4 py-2 text-white"
                  breakLabel="..."
                  nextLabel={(
                    <span className="material-symbols-outlined bg-blue-500 text-white p-2 rounded-full">arrow_forward</span>
                  )}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel={(
                    <span className="material-symbols-outlined bg-blue-500 text-white p-2 rounded-full">arrow_back</span>
                  )}
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </div>
        {active && (
          <div className="overlay">
            <div className="content-2">
              <div className="flex justify-end">
                <span className="material-symbols-outlined text-3xl cursor-pointer" onClick={() => setActive(false)}>
                  close
                </span>
              </div>
              <form className="flex flex-col gap-y-4" onSubmit={addBlog}>
                <input
                  name="title"
                  className="w-full border-gray-400 py-2 px-4 border-2 text-xl rounded-lg"
                  placeholder="Blog Title"
                  
                  onChange={handleInputChange}
                  required
                />
                <div className="relative w-full h-10 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg focus:outline-none focus:border-blue-500">
                  <p className="absolute left-4 top-2 ">{newBlog.image.length === 0 ? "Upload File" : JSON.stringify(newBlog.image)}</p>
                  <input
                    type="file"
                    accept="image/gif, image/jpeg, image/png"
                    name="image"
                    className="opacity-0 absolute inset-0 w-full h-full"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <textarea
                  name="short_desc"
                  className="w-full border-gray-400 py-2 px-4 border-2 text-xl rounded-lg"
                  placeholder="Short Description"
                  defaultValue={newBlog.short_desc}
                  onChange={handleInputChange}
                  required
                />
                <ReactQuill
                  
                  onChange={handleContentChange}
                  className="h-40 mb-4"
                />
                <select
                  name="post_type"
                  className="w-full mt-8 border-gray-400 py-2 px-4 border-2 text-xl rounded-lg"
                  
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  <option value="General">General</option>
                  <option value="Advice">Advice</option>
                  <option value="Tips">Tips</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  Add Blog
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

export function AddStaff(){
    
    return(
        <div className="flex flex-col items-center justify-center w-3/4 mx-auto">
            <div className="flex flex-row items-center justify-between w-full">
                <Menu/>
                <div className="w-9/12">
                    
                </div>
            </div>
        </div>
    )
}