import React from 'react'
import NavOwner from '../../components/owner/NavOwner'
import SideBar from '../../components/owner/SideBar'
import { Outlet } from 'react-router-dom'

const Layouts = () => {
  return (
    <div className="bg-white flex flex-col">

      <NavOwner />

      <div className="flex">

        <SideBar />

        <Outlet />

      </div>

    </div>
  )
}

export default Layouts