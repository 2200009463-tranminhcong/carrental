import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Users, Cog, Fuel, Star } from "lucide-react";
import api from "../utils/api";
import { assets } from "../assets/assets";

const Cars = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize from URL params
    const [carList, setCarList]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState(searchParams.get("search") || searchParams.get("location") || "");
    const [category, setCategory]   = useState("All");

    // Sync URL → state when params change (e.g. coming from Nav / Hero)
    useEffect(() => {
        const urlSearch   = searchParams.get("search")   || "";
        const urlLocation = searchParams.get("location") || "";
        setSearch(urlSearch || urlLocation);
    }, [searchParams]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/cars');
                if (response.data.success) {
                    setCarList(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục xe:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // Filter by search text and category
    const filteredCars = carList.filter((car) => {
        if (!car.isAvailable) return false;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            car.name.toLowerCase().includes(q) ||
            (car.location && car.location.toLowerCase().includes(q)) ||
            (car.brand && car.brand.toLowerCase().includes(q));
        const matchCategory = category === "All" || car.type === category;
        return matchSearch && matchCategory;
    });

    const handleLocalSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        // Keep URL in sync with typed search
        if (val) {
            setSearchParams({ search: val });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E4E9FF] via-[#FFF3CC] to-[#CCD9FF] py-7">
            <div className="max-w-6xl mx-auto px-4">
                {/* Title */}
                <h1 className="text-black text-4xl font-bold text-center mb-4 mt-8">
                    Danh Mục Xe Thuê
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Khám phá các mẫu xe tốt nhất cho chuyến đi của bạn
                </p>

                {/* Featured Cars Accordion */}
                <div className="flex flex-col md:flex-row items-center gap-6 h-auto md:h-[400px] w-full max-w-5xl mb-16 mx-auto">
                    <div className="relative group flex-grow transition-all w-full md:w-56 h-[300px] md:h-[400px] duration-500 md:hover:w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer">
                        <img className="h-full w-full object-cover object-center"
                            src={assets.car_image1}
                            alt="BMW X5" />
                        <div
                            className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">BMW X5</h1>
                            <p className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Phân khúc SUV sang trọng, khung gầm vững chắc, cảm giác lái thể thao và tiện nghi đỉnh cao.</p>
                        </div>
                    </div>
                    <div className="relative group flex-grow transition-all w-full md:w-56 h-[300px] md:h-[400px] duration-500 md:hover:w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer">
                        <img className="h-full w-full object-cover object-center"
                            src={assets.car_image2}
                            alt="Toyota Corolla" />
                        <div
                            className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">Toyota Corolla</h1>
                            <p className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Dòng Sedan quốc dân với độ bền bỉ vượt thời gian, tiết kiệm nhiên liệu và không gian thoải mái.</p>
                        </div>
                    </div>
                    <div className="relative group flex-grow transition-all w-full md:w-56 h-[300px] md:h-[400px] duration-500 md:hover:w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer">
                        <img className="h-full w-full object-cover object-center"
                            src={assets.car_image3}
                            alt="Jeep Wrangler" />
                        <div
                            className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">Jeep Wrangler</h1>
                            <p className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Biểu tượng Off-road mạnh mẽ, sẵn sàng chinh phục mọi địa hình với thiết kế mui trần cá tính.</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Tìm theo tên xe, địa điểm, hãng xe..."
                        value={search}
                        onChange={handleLocalSearch}
                        className="w-full max-w-md px-4 py-3 bg-white border border-gray-300 rounded-full shadow-sm outline-none text-black"
                    />
                </div>

                {/* Show active filter hint */}
                {search && (
                    <p className="text-center text-sm text-gray-500 mb-4">
                        Kết quả tìm kiếm cho: <span className="font-semibold text-blue-600">"{search}"</span>
                        <button
                            onClick={() => { setSearch(""); setSearchParams({}); }}
                            className="ml-2 text-red-400 underline hover:text-red-600"
                        >
                            Xóa
                        </button>
                    </p>
                )}

                {/* Categories */}
                <div className="flex justify-center gap-3 mb-10 flex-wrap">
                    {["All", "SUV", "Sedan", "Luxury", "Hatchback", "Pickup"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={`px-4 py-2 rounded-full border transition
                                ${category === item
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Cars Grid */}
                {loading ? (
                    <div className="text-center text-gray-500 py-20 text-xl font-semibold">Đang tải dữ liệu xe...</div>
                ) : filteredCars.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 text-xl font-semibold">Không tìm thấy xe nào phù hợp.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCars.map((car) => (
                            <div key={car._id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-3 reveal-y">
                                <div className="relative overflow-hidden rounded-md">
                                    <img src={car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'} alt={car.name} className="rounded-md w-full h-48 sm:h-56 md:h-60 object-cover" />
                                    <span className="text-gray-700 absolute top-5 left-5 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow ">{car.type}</span>
                                    <span className={`absolute top-5 right-5 text-white text-xs font-semibold px-2 py-1 rounded-full ${car.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {car.isAvailable ? 'Có sẵn' : 'Đã thuê'}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-black text-lg font-semibold">{car.name}</h3>
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
                                            <span className="inline-flex items-center gap-1">
                                                <Fuel className="w-4 h-4 text-blue-500" />
                                                Xăng
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {car.features && car.features.slice(0, 3).map((badge, i) => (
                                                <span
                                                    key={i}
                                                    className="text-black bg-gray-50 text-xs px-2 py-1 rounded-full font-semibold border border-gray-200"
                                                >
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
                                            <Link to={`/cars/${car._id}`} className="text-center sm:w-1/2 w-full bg-green-500 text-white px-3 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-600 hover:text-white">
                                                Đặt xe ngay
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Cars;