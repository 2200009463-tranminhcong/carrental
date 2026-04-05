import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Menu, X, LogIn } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navSearch, setNavSearch] = useState("");
    const navigate = useNavigate();

    const handleNavSearch = (e) => {
        e.preventDefault();
        const q = navSearch.trim();
        navigate(`/cars${q ? `?search=${encodeURIComponent(q)}` : ""}`);
        setNavSearch("");
    };

    return (
        <nav className=' bg-white shadow sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16 items-center'>
                    {/* Logo */}
                    <Link to="/" className='flex items-center space-x-2'>
                        <Car className='h-8 w-8 text-amber-500' /><span className='text-blue text-2xl font-bold'>
                            CarRental
                        </span>
                    </Link>

                    {/* Desktop Menu Items */}
                    <div className="hidden md:flex item-center space-x-8">
                        <Link to={"/"} className="text-gray-700 hover:text-blue-700 transition-colors duration-300">
                            Trang Chủ
                        </Link>

                        <Link to={"/cars"} className="text-gray-700 hover:text-blue-700 transition-colors duration-300">
                            Danh Mục Xe
                        </Link>

                        <Link to={"/MyBookings"} className="text-gray-700 hover:text-blue-700 transition-colors duration-300">
                            Xe Đã Đặt
                        </Link>

                        <Link to={"/contact"} className="text-gray-700 hover:text-blue-700 transition-colors duration-300">
                            Liên Hệ
                        </Link>
                    </div>

                    <div className="hidden md:flex item-center space-x-4">
                        {/* Nav Search */}
                        <form onSubmit={handleNavSearch} className="flex items-center border pl-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden max-w-md w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#6B7280">
                                <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
                            </svg>
                            <input
                                type="text"
                                value={navSearch}
                                onChange={(e) => setNavSearch(e.target.value)}
                                placeholder="Tìm kiếm xe..."
                                className="bg-white w-full h-full outline-none text-sm text-gray-500"
                            />
                            <button type="submit" className="bg-indigo-500 w-32 h-9 rounded-full text-sm text-white mr-[5px]">Search</button>
                        </form>

                        <Link to="/owner">
                            <button className="bg-white rounded-3xl text-gray-600 py-1 px-2 flex items-center gap-2 transition duration-300 hover:bg-gray-100 cursor-pointer">
                                Dashboard
                            </button>
                        </Link>

                        {/* Clerk AUTH */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="py-1 px-4 flex items-center gap-2 rounded-md transition duration-300 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
                                    <LogIn size={18} />
                                    <span>Đăng Nhập</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer focus:outline-none">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Items */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700"
                                onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                            <Link to="/cars" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700"
                                onClick={() => setIsMenuOpen(false)}>
                                Cars
                            </Link>
                            <Link to="/mybookings" className="text-gray-700 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}>
                                My Bookings
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </Link>

                            {/* Mobile search */}
                            <form onSubmit={handleNavSearch} className="flex items-center border px-3 gap-2 bg-white border-gray-300 h-[40px] rounded-full overflow-hidden mx-2 mt-2">
                                <input
                                    type="text"
                                    value={navSearch}
                                    onChange={(e) => setNavSearch(e.target.value)}
                                    placeholder="Tìm kiếm xe..."
                                    className="bg-white w-full h-full outline-none text-sm text-gray-500"
                                />
                                <button type="submit" className="bg-indigo-500 px-3 h-7 rounded-full text-xs text-white">Tìm</button>
                            </form>
                        </div>

                        <div className="flex flex-col px-3 space-y-3 pb-5">
                            <Link to="./owner" className="block text-gray-700 hover:text-blue-700 rounded-md text-base font-medium cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                                Dashboard
                            </Link>
                            
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="w-full text-left flex items-center gap-2 rounded-sm transition duration-300 bg-blue-500 text-white py-2 px-3 hover:bg-blue-600">
                                        <LogIn size={18} />
                                        <span>Đăng Nhập</span>
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
export default Nav;