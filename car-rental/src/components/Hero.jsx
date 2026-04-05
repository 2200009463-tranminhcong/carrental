import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Search } from "lucide-react";
import ScrollReveal from "scrollreveal";

import { assets } from "../assets/assets";

const Hero = () => {
    const navigate = useNavigate();
    const [location, setLocation]     = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [returnDate, setReturnDate] = useState("");

    useEffect(() => {
        ScrollReveal().reveal(".hero-reveal", {
            distance: "50px",
            easing: "ease-in-out",
            duration: 1000,
            origin: "left",
            reset: false,
        });
    }, []);

    useEffect(() => {
        ScrollReveal().reveal(".head-reveal", {
            scale: 0.85,
            distance: "0px",
            easing: "ease-in-out",
            duration: 1500,
            reset: false,
        });
    }, []);

    useEffect(() => {
        ScrollReveal().reveal(".reveal-y", {
            distance: "100px",
            easing: "ease-in-out",
            duration: 1200,
            origin: "bottom",
            interval: 200,
            reset: false,
        });
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location)    params.set("location",   location);
        if (pickupDate)  params.set("pickupDate",  pickupDate);
        if (pickupTime)  params.set("pickupTime",  pickupTime);
        if (returnDate)  params.set("returnDate",  returnDate);
        navigate(`/cars?${params.toString()}`);
    };

    return (
        <section 
            className="text-white sm:py-28 py-16 text-center relative overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${assets.hero_bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 pointer-events-none"></div>

            <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 hero-reveal">
                    Tìm chiếc
                    <span className="text-yellow-400 drop-shadow-md"> xe thuê hoàn hảo </span>
                    dành cho bạn
                </h1>

                <p className="text-lg sm:text-xl mb-12 text-gray-200 hero-reveal max-w-2xl mx-auto drop-shadow">
                    Khám phá những ưu đãi tốt nhất với các dòng xe chất lượng. Đặt xe ngay và bắt đầu hành trình của bạn một cách dễ dàng.
                </p>

            <div className=" bg-white rounded-full md:rounded-full shadow-lg p-4 sm:p-6 mx-auto grid grid-col-1 sm:grid-cols-5 gap-4 items-end text-black hero-reveal ml-5 mr-5">

                {/* Pickup Location */}
                <div>
                    <label htmlFor="pickup-location" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="inline-block mr-2" />
                        <span>Địa điểm nhận xe</span>
                    </label>
                    <select
                        id="pickup-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="rounded-3xl w-full p-2 border-gray-300 cursor-pointer bg-gray-300"
                    >
                        <option value="" disabled>Chọn tỉnh / Thành phố</option>
                        <option>Hồ Chí Minh</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                        <option>Nha Trang</option>
                        <option>Đà Lạt</option>
                        <option>Phú Quốc</option>
                        <option>Vũng Tàu</option>
                        <option>Huế</option>
                        <option>Hội An</option>
                        <option>Hạ Long</option>
                        <option>Buôn Ma Thuột (Đắk Lắk)</option>
                        <option>Pleiku (Gia Lai)</option>
                        <option>Kon Tum</option>
                        <option>Gia Nghĩa (Đắk Nông)</option>
                        <option>Bảo Lộc (Lâm Đồng)</option>
                    </select>
                </div>

                {/* Pick-up Date */}
                <div>
                    <label htmlFor="pickup-date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span>Ngày nhận xe</span>
                    </label>
                    <input
                        type="date"
                        id="pickup-date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="rounded-full w-full p-2 border-gray-300 cursor-pointer bg-gray-300"
                    />
                </div>

                {/* Pick-up Time */}
                <div>
                    <label htmlFor="pickup-time" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-5 h-5" />
                        <span>Giờ nhận xe</span>
                    </label>
                    <input
                        type="time"
                        id="pickup-time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="rounded-full w-full p-2 border-gray-300 cursor-pointer bg-gray-300"
                    />
                </div>

                {/* Return date */}
                <div>
                    <label htmlFor="return-date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span>Ngày trả xe</span>
                    </label>
                    <input
                        type="date"
                        id="return-date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full p-2 border-gray-300 rounded-full cursor-pointer bg-gray-300"
                    />
                </div>

                {/* Search Button */}
                <div>
                    <button
                        onClick={handleSearch}
                        className="rounded-full w-full gap-2 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center justify-center transition duration-300"
                    >
                        <Search className="w-5 h-5" />
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-white hero-reveal">
                <div>
                    <h2 className="sm:text-4xl text-3xl font-bold">500+</h2>
                    <p className="sm:text-lg text-gray-200">Xe cao cấp</p>
                </div>
                <div>
                    <h2 className="sm:text-4xl text-3xl font-bold">50+</h2>
                    <p className="sm:text-lg text-gray-200">Địa điểm</p>
                </div>
                <div>
                    <h2 className="sm:text-4xl text-3xl font-bold">24/7</h2>
                    <p className="sm:text-lg text-gray-200">Hỗ trợ khách hàng</p>
                </div>
                <div>
                    <h2 className="sm:text-4xl text-3xl font-bold">99%</h2>
                    <p className="sm:text-lg text-gray-200">Khách hàng hài lòng</p>
                </div>
            </div>
            </div>

        </section>
    );
}

export default Hero;