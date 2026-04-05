import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import Title from "../../components/owner/Title";
import api from "../../utils/api";

const ManageCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOwnerCars = async () => {
        try {
            const response = await api.get('/cars');
            if (response.data.success) {
                setCars(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục xe:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnerCars();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa xe này khỏi hệ thống?")) {
            try {
                const res = await api.delete(`/cars/${id}`);
                if (res.data.success) {
                    alert("Đã xóa xe thành công!");
                    fetchOwnerCars(); // Tải lại danh sách
                } else {
                    alert("Lỗi: " + res.data.message);
                }
            } catch (error) {
                console.error("Lỗi khi xóa xe:", error);
                alert("Đã xảy ra lỗi hệ thống.");
            }
        }
    };

    const handleToggleAvailability = async (id, currentStatus) => {
        try {
            const res = await api.put(`/cars/${id}`, { isAvailable: !currentStatus });
            if (res.data.success) {
                alert(`Đã ${!currentStatus ? 'hiển thị' : 'ẩn'} xe thành công!`);
                fetchOwnerCars();
            } else {
                alert("Lỗi: " + res.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái xe:", error);
            alert("Đã xảy ra lỗi hệ thống.");
        }
    };

    if (loading) return <div className="p-10 text-gray-500">Đang tải danh sách xe...</div>;

    return (
        <div className="px-4 pt-10 p-6 w-full text-gray-500 bg-white">
            <Title
                title="Quản lý xe"
                subTitle="Xem tất cả xe đã đăng, cập nhật thông tin hoặc xóa khỏi nền tảng đặt xe."
            />

            <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6 shadow-sm'>

                <table className='w-full border-collapse text-left text-sm text-gray-600 bg-white'>

                    <thead className='text-gray-500 bg-gray-50'>
                        <tr>
                            <th className="p-3 font-medium">Xe</th>
                            <th className="p-3 font-medium max-md:hidden">Danh mục</th>
                            <th className="p-3 font-medium">Giá</th>
                            <th className="p-3 font-medium max-md:hidden">Trạng thái</th>
                            <th className="p-3 font-medium text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-400">Không có xe nào trên hệ thống</td>
                            </tr>
                        ) : (
                            cars.map((car, index) => (
                                <tr key={car._id} className='border-t border-borderColor hover:bg-gray-50 transition'>
                                    <td className='p-3 flex items-center gap-3'>
                                        <img
                                            src={car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                                            alt={car.name}
                                            className="h-12 w-12 aspect-square rounded-md object-cover"
                                        />

                                        <div className='max-md:hidden'>
                                            <p className='font-medium text-black'>
                                                {car.name}
                                            </p>

                                            <p className='text-xs text-gray-500'>
                                                {car.seats} chỗ • {car.transmission}
                                            </p>
                                        </div>
                                    </td>

                                    <td className='p-3 max-md:hidden'>
                                        {car.type}
                                    </td>

                                    <td className='p-3'>
                                        {car.pricePerDay.toLocaleString()}đ/ngày
                                    </td>
                                    <td className='p-3 max-md:hidden'>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${car.isAvailable
                                                    ? 'bg-green-100 text-green-600 font-medium'
                                                    : 'bg-red-100 text-red-600 font-medium'
                                                }`}
                                        >
                                            {car.isAvailable ? "Có sẵn" : "Không có sẵn"}
                                        </span>
                                    </td>

                                    <td className='p-3'>
                                        <div className="flex items-center justify-center gap-3">
                                            <img
                                                src={car.isAvailable ? assets.eye_icon : assets.eye_close_icon}
                                                alt="Ẩn/Hiện"
                                                onClick={() => handleToggleAvailability(car._id, car.isAvailable)}
                                                className='cursor-pointer w-9 h-9 opacity-70 hover:opacity-100'
                                                title={car.isAvailable ? "Xe đang hoạt động (Nhấn để ẩn)" : "Xe đang tạm ẩn (Nhấn để hiện)"}
                                            />

                                            <img
                                                src={assets.delete_icon}
                                                alt="Xóa"
                                                onClick={() => handleDelete(car._id)}
                                                className='cursor-pointer w-9 h-9 opacity-70 hover:opacity-100 hover:text-red-500'
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default ManageCar;