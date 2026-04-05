import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, MapPin, Users, Cog, Fuel, Star, ArrowRight } from "lucide-react";
import api from "../utils/api";

const FeaturedCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/cars');
                if (response.data.success) {
                    const availableCars = response.data.data.filter(car => car.isAvailable);
                    setCars(availableCars.slice(0, 6)); // Lấy 6 xe nổi bật
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách xe:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    return (
        <section className='bg-gradient-to-b from-[#E8EDFF] via-[#FDF6E3] to-[#E0E7FF] py-20 sm:px-16 px-4'>
            <div className='max-w-7xl mx-auto text-center mb-12 head-reveal'>
                <h2 className='sm:text-4xl text-3xl font-bold mb-2 flex justify-center items-center gap-2'>
                    <span className='text-blue-500'>
                        <Car className='w-12 h-12' />
                    </span>
                    <span className='text-gray-800'>Xe Nổi Bật</span>
                </h2>
                <p className='text-gray-600 text-lg'>
                    Khám phá những dòng xe cao cấp được chúng tôi lựa chọn,
                    phù hợp cho mọi chuyến đi của bạn.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Đang tải dữ liệu...</div>
            ) : cars.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Chưa có xe nào trong hệ thống.</div>
            ) : (
                <div className="text-black grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cars.map((car) => (
                        <div key={car._id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-3 reveal-y">
                            <div className="relative overflow-hidden rounded-md">
                                <img src={car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'} alt={car.name} className="rounded-md w-full h-48 sm:h-56 md:h-60 object-cover" />
                                <span className="absolute top-5 left-5 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow ">{car.type}</span>
                                <span className={`absolute top-5 right-5 text-white text-xs font-semibold px-2 py-1 rounded-full ${car.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {car.isAvailable ? 'Có sẵn' : 'Đã thuê'}
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{car.name}</h3>
                                    <div className="gap-1 text-yellow-500 text-sm flex items-center"><Star className="w-5 h-5" />4.8</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{car.year}</p>
                                    <div className="flex items-center text-sm text-gray-500 my-4 gap-1">
                                        <MapPin className="w-4 h-4 inline-block" />{car.location}
                                    </div>
                                    <div className="flex sm:items-center sm:flex-row flex-col sm:gap-10 gap-2 mt-2 text-gray-600 text-sm">
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            {car.seats} chỗ
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Cog className="w-4 h-4 text-blue-500" />
                                            {car.transmission}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {car.features && car.features.slice(0, 3).map((badge, i) => (
                                            <span key={i} className="bg-gray-50 text-xs px-2 py-1 rounded-full font-semibold border border-gray-200">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-lg font-bold text-blue-500">
                                            {car.pricePerDay.toLocaleString()}
                                            <span className="text-sm font-normal text-gray-500"> VNĐ/ngày</span>
                                        </p>
                                    </div>
                                    <div className="flex sm:flex-row flex-col mt-4 gap-3">
                                        <Link to={`/cars/${car._id}`} className="text-center bg-white sm:w-1/2 w-full border border-gray-300 px-3 py-2 rounded cursor-pointer transition duration-300 hover:bg-gray-300">
                                            Xem chi tiết
                                        </Link>
                                        <Link to={`/cars/${car._id}`} className="text-center sm:w-1/2 w-full bg-green-500 text-white px-3 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-600">
                                            Đặt xe ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button onClick={() => navigate('/cars')} className='mx-auto flex items-center justify-center mt-12 bg-blue-500 py-3 px-5 text-white rounded cursor-pointer gap-1 transition duration-300 hover:bg-blue-700'>
                Xem tất cả xe <ArrowRight className="h-5 w-5" />
            </button>
        </section>
    );
};

export default FeaturedCars;