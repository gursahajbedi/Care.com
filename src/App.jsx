import { BrowserRouter as Router, Routes, Route, useLocation, } from "react-router-dom"
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
import { Applications, MyBookings, Profile, Verification } from "./Myzone/myzone"
import Apply from "./Myzone/apply"
import Domains from "./Myzone/apply"
import { useEffect } from "react"
import Searchnanny from "./NannySearch/searchnanny"
import Microsite from "./NannySearch/microsite"
import Booking from "./Booking/booking"
import MyPaymentForm from "./Payments/payment"
import AdminLogin from "./Admin/Admin"
import AdminDashboard, { AddStaff, Blogs } from "./Admin/AdminDashboard"

import { Navigate } from 'react-router'
import AboutUs from "./aboutus"

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
        <Navbar auth={auth.user}/>
        <Router>
          <ScrollToTop/>
          <Routes>
            <Route path="/" element={<Home auth={auth.user}/>}></Route>
            <Route path="/aboutus" element={<AboutUs/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/community" element={<CommPage/>}></Route>
            <Route path="/community/post/:id" element={<Post/>}></Route>
            <Route path="/blogs/" element={<BlogsPage auth={auth}/>}></Route>
            <Route path="/blogs/category/:category" element={<BlogCategoryPage/>}></Route>
            <Route path="/blogs/post/:id" element={<Blog/>}></Route>
            {auth.user && (<Route path="/myzone/profile" exact element={<Profile/>}></Route>)}
            {auth.user && (<Route path="/myzone/applications" exact element={<Applications/>}></Route>)}
            {auth.user && (<Route path="/myzone/verification" exact element={<Verification/>}></Route>)}
            {auth.user && (<Route path="/myzone/mybookings" exact element={<MyBookings/>}></Route>)}
            {auth.user && (<Route path="/myzone/applications/:step" element={<Apply/>}></Route>)}
            <Route path="/searchnanny" exact element={<Searchnanny/>}></Route>
            <Route path="/nanny/:id/:type" exact element={<Microsite/>}></Route>
            <Route path="/booking/:id/:type" exact element={<Booking/>}></Route>
            <Route path="/payment" exact element={<MyPaymentForm/>}></Route>
            <Route
              path="/admin/login"
              element={
                auth.user && auth.user.is_staff ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <AdminLogin />
                )
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                auth.user && auth.user.is_staff ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="/admin/blogs"
              element={
                auth.user && auth.user.is_staff ? (
                  <Blogs />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="/admin/addstaff"
              element={
                auth.user && auth.user.is_staff ? (
                  <AddStaff/>
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
          </Routes>
        </Router>
        <Footer auth={auth.user}/>
    </>
  )
}

export default App
