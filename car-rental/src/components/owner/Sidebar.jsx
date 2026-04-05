import React, { useState, useEffect } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const SideBar = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [image, setImage] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedAdmin = localStorage.getItem('adminUserData');
        if (storedAdmin) {
            setUser(JSON.parse(storedAdmin));
        }
    }, [])

    const updateImage = async () => {
        // use.image = URL.createObjectURL()
        setImage('')
    }

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUserId');
        localStorage.removeItem('adminUserData');
        navigate('/');
    }

    return (
        <div className="bg-gray-100 text-gray-600 relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
            <div className="group relative">
                <label htmlFor="image">
                    <img
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : user?.image ||
                                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
                        }
                        alt="Admin Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
                        <img src={assets.edit_icon} alt="edit" className="w-5" />
                    </div>
                </label>
            </div>
            {image && (
                <button
                    className="absolute top-0 right-0 flex p-2 gap-1 bg-green-100 bg-primary/10 text-primary cursor-pointer"
                >
                    Lưu
                    <img
                        src={assets.check_icon}
                        width={13}
                        alt="check"
                        onClick={updateImage}
                    />
                </button>
            )}

            <p className="mt-2 text-base font-semibold max-md:hidden">{user?.name || "Quản trị viên"}</p>
            <p className="text-xs text-gray-500 max-md:hidden">{user?.email}</p>

            <div className="w-full mt-6 flex-1">
                {ownerMenuLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={`relative flex items-center gap-2 w-full py-3 pl-4 ${
                            link.path === location.pathname
                                ? "bg-blue-100 shadow-sm text-primary font-medium"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                        end={link.path === '/owner'}
                    >
                        <img
                            src={
                                link.path === location.pathname
                                    ? link.coloredIcon
                                    : link.icon
                            }
                            alt="icon"
                            className="w-5"
                        />
                        <span className="max-md:hidden">{link.name}</span>
                        <div
                            className={`${
                                link.path === location.pathname ? "bg-primary" : ""
                            } w-1.5 h-8 rounded-l right-0 absolute`}
                        ></div>
                    </NavLink>
                ))}
            </div>

            {/* Logout Button */}
            <div className="w-full mb-8 pt-4 border-t border-gray-200 px-4">
                <button 
                    onClick={handleLogout}
                    className="bg-white flex text-red-600 hover:text-white items-center gap-2 w-full py-2 px-4 rounded hover:bg-red-500 transition max-md:justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    <span className="max-md:hidden font-medium">Đăng xuất</span>
                </button>
            </div>
        </div>
    )
}

export default SideBar
