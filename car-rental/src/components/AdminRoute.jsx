import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';

    // If not logged in as admin, redirect to the hidden admin login page
    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    // If logged in, render the child routes (e.g., Layouts, Dashboard, etc.)
    return <Outlet />;
};

export default AdminRoute;
