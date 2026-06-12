import React from 'react';
import { Routes, Route } from "react-router-dom";
import Homepage from "../Homepage";
import Destination from "../Destination";
import Booking from "../Booking";
import Search from "../Search";
import Admin from "../Admin";
import Login from "../Login";
import Register from "../Register";
import About from "../About";
import Contact from "../Contact";
import UserDashboard from "../UserDashboard";
import Blog from "../Blog";
import BlogDetail from "../BlogDetail";
import Privacy from "../Privacy";
import Terms from "../Terms";
import PackageDetails from "../PackageDetails";
import ForgotPassword from "../ForgotPassword";
// import ResetPassword from "../ResetPassword";
// import favicon from "./assets/favicon.ico
// import { img } from "../public/favicon.ico"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* <Link rel="icon" href="/favicon.ico" /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/package/:id" element={<PackageDetails />} />
        </Routes>
    );
}

export default AppRoutes;
