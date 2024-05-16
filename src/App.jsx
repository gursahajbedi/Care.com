import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./Home/navbar"
import Home from "./Home/home"
import Footer from "./Home/footer"
import Login from "./Auth/login"
import Register from "./Auth/register"
import CommPage from "./Community/commpage"
import Post from "./Community/post"
import BlogsPage from "./Blogs/blogspage"
import BlogCategoryPage from "./Blogs/blogcategory"
import Blog from "./Blogs/blog"
import useAuthContext from "./AuthLogic/useAuthContext"
import { Applications, Profile, Verification } from "./Myzone/myzone"
import Apply from "./Myzone/apply"
import Domains from "./Myzone/apply"
import { useEffect } from "react"
import Searchnanny from "./NannySearch/searchnanny"
import Microsite from "./NannySearch/microsite"

function App() {
  const {auth}=useAuthContext()
  const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  };
  
  return (
    <> 
        <Navbar/>
        <Router>
          <ScrollToTop/>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/community" element={<CommPage/>}></Route>
            <Route path="/community/post/:id" element={<Post/>}></Route>
            <Route path="/blogs/" exact element={<BlogsPage/>}></Route>
            <Route path="/blogs/category/:category" exact element={<BlogCategoryPage/>}></Route>
            <Route path="/blogs/post/:id" exact element={<Blog/>}></Route>
            {auth.user && (<Route path="/myzone/profile" exact element={<Profile/>}></Route>)}
            {auth.user && (<Route path="/myzone/applications" exact element={<Applications/>}></Route>)}
            {auth.user && (<Route path="/myzone/verification" exact element={<Verification/>}></Route>)}
            {auth.user && (<Route path="/myzone/applications/:step" element={<Apply/>}></Route>)}
            <Route path="/searchnanny" exact element={<Searchnanny/>}></Route>
            <Route path="/nanny/:id/:type" exact element={<Microsite/>}></Route>
            
          </Routes>
        </Router>
        <Footer/>
    </>
  )
}

export default App
