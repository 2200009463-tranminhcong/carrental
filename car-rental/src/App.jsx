import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import Contact from "./pages/Contact";
import PaymentResult from "./pages/PaymentResult";

import Footer from "./components/Footer";

///Dashboard
import Layouts from "./pages/owner/Layouts";

import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCar from "./pages/owner/ManageCar";
import ManageBooking from "./pages/owner/ManageBooking";
import ManageContact from "./pages/owner/ManageContact";

// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";


const App = () => {
  
  return (
    <Router>
      <Layout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/MyBookings" element={<MyBookings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        
        {/* Hidden Admin Login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Owner Routes */}
        <Route path="/owner" element={<AdminRoute />}>
          <Route element={<Layouts />}>
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="manage-cars" element={<ManageCar />} />
            <Route path="manage-bookings" element={<ManageBooking />} />
            <Route path="manage-contacts" element={<ManageContact />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
