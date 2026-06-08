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
import PackageDetail from "../PackageDetail";
import UserDashboard from "../UserDashboard";
import Blog from "../Blog";

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
            <Route path="/package-detail" element={<PackageDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/blog" element={<Blog />} />
        </Routes>
    );
}

export default AppRoutes;