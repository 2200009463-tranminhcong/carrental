import React from "react";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <Nav />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;