import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Home/navbar"
import Home from "./Home/home"
import Footer from "./Home/footer"
import Login from "./Auth/login"
import Register from "./Auth/register"
import CommPage from "./Community/commpage"
import Post from "./Community/post"
import BlogsPage from "./Blogs/blogspage"
import BlogCategoryPage from "./Blogs/blogcategory"

function App() {
  return (
    <>
        <Navbar/>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/community" element={<CommPage/>}></Route>
            <Route path="/community/post/:id" element={<Post/>}></Route>
            <Route path="/blogs/" exact element={<BlogsPage/>}></Route>
            <Route path="/blogs/category/:category" exact element={<BlogCategoryPage/>}></Route>
          </Routes>
        </Router>
        <Footer/>
    </>
  )
}

export default App
