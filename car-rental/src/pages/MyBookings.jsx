import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import api from "../utils/api";

const MyBookings = () => {
    const navigate = useNavigate();
    const { user, isLoaded, isSignedIn } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            if (!isLoaded) return;
            
            if (!isSignedIn) {
                setLoading(false);
                return;
            }

            try {
                // Get mongo User ID first
                const syncResponse = await api.post("/users/sync", {
                    clerkId: user.id,
                    name: user.fullName || user.username,
                    email: user.primaryEmailAddress?.emailAddress,
                    image: user.imageUrl,
                });

                if (syncResponse.data.success) {
                    const mongoUserId = syncResponse.data.data._id;
                    const response = await api.get(`/bookings/user/${mongoUserId}`);
                    if (response.data.success) {
                        const sorted = [...response.data.data].sort(
                            (a, b) => new Date(b.pickupDate) - new Date(a.pickupDate)
                        );
                        setBookings(sorted);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách đặt xe:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, [isLoaded, isSignedIn, user]);

    if (loading) {
        return <div className="min-h-screen bg-gray-200 py-16 text-center text-xl mt-20">Đang tải lịch sử đặt xe...</div>;
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-200 py-16 text-center flex flex-col items-center mt-20">
                <h1 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập!</h1>
                <p>Vui lòng đăng nhập để xem các chuyến đi của mình.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E4E9FF] via-[#FFF3CC] to-[#CCD9FF] py-16">
            <div className=" px-6 md:px-16 lg:px-24 xl:px-32 mt-13 mb-20 mr-48  max-w-7xl">
                {/* Nút quay lại */}
                <button onClick={() => navigate(-1)}
                    className="bg-white flex items-center gap-2 mb-6 text-gray-700 hover:text-black cursor-pointer">
                    ← Quay lại
                </button>
                <h1 className="text-black text-4xl font-bold mb-2 flex items-center gap-2">
                    <Search size={28} />
                    Xe đã đặt
                </h1>

                <p className="text-gray-500 mb-10">
                    Xem và quản lý tất cả các xe bạn đã đặt
                </p>

                {bookings.length === 0 ? (
                    <div className="text-center text-gray-500 bg-white p-10 rounded-lg shadow-md">
                        Bạn chưa có chuyến đi nào. Hãy đặt một chiếc xe và bắt đầu hành trình!
                    </div>
                ) : (
                    <div>
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-[#F4F7FF] border border-[#D6E0FF] text-black grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border rounded-lg mt-6 shadow-lg" >
                                {/* Car Image */}
                                <div>
                                    <img
                                        src={booking.car?.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                                        alt={booking.car?.name}
                                        className="w-full h-40 object-cover rounded"
                                    />

                                    <p className="text-lg font-semibold mt-3">
                                        {booking.car?.name}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        {booking.car?.year} • {booking.car?.type} • {booking.car?.location}
                                    </p>

                                </div>
                                {/* Booking Info */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-3">
                                        <p className="bg-gray-100 px-3 py-1 rounded text-sm">
                                            Đơn #{booking._id.slice(-6).toUpperCase()}
                                        </p>
                                        <p
                                            className={`px-3 py-1 text-xs font-bold rounded-full ${booking.status === "confirmed"
                                                ? "bg-green-100 text-green-600"
                                                : booking.status === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {booking.status === "pending" ? "Chờ duyệt" : booking.status === "confirmed" ? "Đã xác nhận" : "Bị hủy"}</p>
                                    </div>
                                    {/* Rental Time */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <Calendar size={16} className="text-blue-500" />
                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Thời gian thuê
                                            </p>
                                            <p>{new Date(booking.pickupDate).toLocaleDateString("vi-VN")} → {new Date(booking.returnDate).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                    </div>
                                
                                    {/* Pickup Location */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <MapPin size={16} className="text-red-500" />
                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Địa điểm nhận xe</p>
                                            <p>
                                                {booking.pickupType === "delivery" 
                                                    ? `Giao tại: ${booking.deliveryAddress}`
                                                    : `Tại cửa hàng: ${booking.pickupLocation}`
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    <div className="mt-4">
                                        <p className="text-gray-500 text-sm">Thanh toán</p>
                                        <p className={`text-sm font-semibold ${
                                            booking.paymentStatus === "paid" 
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                        }`}>
                                            {booking.paymentStatus === "paid" ? "✓ Đã thanh toán" : "Chưa thanh toán"}
                                        </p>
                                    </div>
                                </div>
                                {/* Price */}
                                <div className="flex flex-col justify-between items-end">
                                    <div className="text-right">
                                        <p className="text-gray-500 text-sm">
                                            Tổng tiền
                                        </p>
                                        <h2 className="text-2xl font-bold text-blue-600">
                                            ₫ {booking.totalPrice.toLocaleString()}
                                        </h2>
                                        {/* Booking Time */}
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <Clock size={16} className="text-green-500" />
                                            <div className="text-right">
                                                <p className="text-gray-500 text-sm">
                                                    Ngày đặt
                                                </p>
                                                <p className="text-sm">
                                                    {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

}

export default MyBookings;