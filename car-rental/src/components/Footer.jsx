import react from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className ="container max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Thông tin công ty */}
                <div>
                    <Link to="/" className="text-2xl font-bold text-white"> <Car className="inline-block mr-4 text-yellow-400" />
                        Car <span className="text-yellow-400">AutoRent</span>
                    </Link>

                    <p className="text-gray-400 mt-4">
                        Đối tác đáng tin cậy cho dịch vụ thuê xe cao cấp. Trải nghiệm sự tự do
                        trên mọi cung đường với những chiếc xe chất lượng và dịch vụ chuyên nghiệp.
                    </p>

                    <div className="flex gap-4 mt-4 text-gray-400">
                        <Facebook className="cursor-pointer hover:text-white" />
                        <Twitter className="cursor-pointer hover:text-white" />
                        <Instagram className="cursor-pointer hover:text-white" />
                        <Mail className="cursor-pointer hover:text-white" />
                        <Phone className="cursor-pointer hover:text-white" />
                        
                    </div>
                </div>
                
                {/* Liên kết nhanh */}
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
                    <ul className="space-y-2 text-white  ">
                        <li className="mt-1 hover:uniderline text-white">
                            <a href="/" className="text-gray-400 hover:text-white">Trang chủ</a>
                        </li>
                        <li className="mt-1 hover:underline text-white">
                            <a href="/cars" className="text-gray-400 hover:text-white">Xe</a>
                        </li>
                        <li className="mt-1 hover:underline text-white">
                            <a href="/about" className="text-gray-400 hover:text-white">Về chúng tôi</a>
                        </li>
                        <li className="mt-1 hover:underline text-white">
                            <a href="/contact" className="text-gray-400 hover:text-white">Liên hệ</a>
                        </li>
                    </ul>
                </div>
                {/*Service*/}
                <div className="mt-6 text">
                    <h3 className="text-lg font-semibold">Dịch vụ của chúng tôi</h3>

                    <ul className="mt-2 text-white ">
                        <li className="mt-1">
                            <Link to="/economy-cars" className="text-gray-400 hover:text-white hover:underline">
                            Xe tiết kiệm
                            </Link>
                        </li>

                        <li className="mt-1">
                            <Link to="/luxury-cars" className="text-gray-400 hover:text-white hover:underline">
                            Xe cao cấp
                            </Link>
                        </li>

                        <li className="mt-1">
                            <Link to="/suv-trucks" className="text-gray-400 hover:text-white hover:underline">
                            SUV & Xe tải
                            </Link>
                        </li>

                        <li className="mt-1">
                            <Link to="/electric-cars" className="text-gray-400 hover:text-white hover:underline">
                            Xe điện
                            </Link>
                        </li>

                        <li className="mt-1">
                            <Link to="/long-term-rental" className="text-gray-400 hover:text-white hover:underline">
                            Thuê xe dài hạn
                            </Link>
                        </li>
                    </ul>
                    
                </div>
                {/* Liên hệ */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Liên hệ với chúng tôi</h3>
                    <p className="flex items-center gap-2 mt-2 text-gray-400">
                        <Phone className="text-yellow-400" /> 0123-456-789
                    </p>
                    <p className="flex items-center gap-2 mt-2 text-gray-400">
                        <Mail className="text-yellow-400" />
                        info@carautorent.com
                    </p>
                    <p className="flex items-center gap-2 mt-2 text-gray-400">
                        <MapPin className="text-yellow-400" />
                        123 Đường ABC, Quận XYZ, Thành phố HCM
                    </p>
                
            </div>
            </div>
            {/* Bản quyền */}
            
            <div className="border-t border-gray-700 mt-10 py-6 text-sm flex flex-col sm:flex-row justify-between items-center text-gray-500">

                <p>
                    &copy; {new Date().getFullYear()} AutoRent. Tất cả các quyền được bảo lưu
                </p>

                <div className="flex gap-4 mt-4 sm:mt-0">
                    <a href="#" className="text-gray-500 hover:text-green-400 hover:underline">
                    Chính sách bảo mật
                    </a>

                    <a href="#" className="text-gray-500 hover:text-green-400 hover:underline">
                    Điều khoản dịch vụ
                    </a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;