import React from 'react';
import Homepage from "../Homepage"
import Destination from "../Destination"
import {Routes,Route} from "react-router-dom"
import Booking from "../Booking"
import Search from "../Search"
import Admin from "../Admin"
import Login from "../Login"
import Register from "../Register"
function AppRoutes() {
    return(
     <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/destination" element={<Destination/>}/>
        <Route path="/booking" element={<Booking/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    );
}

export default AppRoutes;