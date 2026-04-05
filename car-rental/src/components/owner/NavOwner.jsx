import React from 'react'
import { Link } from 'lucide-react';
import { assets, dummyUserData } from "../../assets/assets";



const NavOwner = () => {
    const user = dummyUserData;
  return (
    <div className='flex justify-center text-black bg-gray-100'>
      <p className='font-bold text-teal-700 '>Xin chào, {user.name || "Owner"} </p>
    </div>
  )
}

export default NavOwner
