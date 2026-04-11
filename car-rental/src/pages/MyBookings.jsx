import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Search, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import api from "../utils/api";

const MyBookings = () => {
    const navigate = useNavigate();
    const { user, isLoaded, isSignedIn } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelModalData, setCancelModalData] = useState({ isOpen: false, bookingId: null });

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
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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

    const handleConfirmCancel = async () => {
        const id = cancelModalData.bookingId;
        if (!id) return;
        try {
            const res = await api.put(`/bookings/${id}/status`, { status: "cancelled" });
            if (res.data.success) {
                setBookings(bookings.map(c => c._id === id ? { ...c, status: "cancelled" } : c));
                setCancelModalData({ isOpen: false, bookingId: null });
            }
        } catch (error) {
            console.error("Lỗi khi hủy đặt xe:", error);
            alert("Lỗi khi hủy đặt xe.");
        }
    };

    const markAsRead = async (id) => {
        try {
            const res = await api.put(`/bookings/${id}/read`);
            if (res.data.success) {
                // Update local state
                setBookings(bookings.map(c => c._id === id ? { ...c, isRead: true } : c));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đã đọc:", error);
            alert("Lỗi khi cập nhật trạng thái.");
        }
    };

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
                                className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border rounded-lg mt-6 shadow-lg text-black relative transition-colors ${booking.isRead ? "bg-[#F4F7FF] border-[#D6E0FF]" : "bg-blue-50 border-blue-300"
                                    }`} >

                                {!booking.isRead && (
                                    <span className="absolute top-4 right-5 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                    </span>
                                )}
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
                                    {!booking.isRead && (
                                        <button
                                            onClick={() => markAsRead(booking._id)}
                                            className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2 bg-white text-sm border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-gray-700 cursor-pointer"
                                        >
                                            <CheckCircle size={16} className="text-green-500" />
                                            Đánh dấu đã xem
                                        </button>
                                    )}
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        Thông tin chuyến đi
                                        {!booking.isRead && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Mới</span>}
                                    </h3>
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
                                        <p className={`text-sm font-semibold ${booking.paymentStatus === "paid"
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

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-between items-end">
                                    <div className="flex gap-2">
                                        {booking.status === "pending" && (
                                            <button
                                                onClick={() => setCancelModalData({ isOpen: true, bookingId: booking._id })}
                                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-sm"
                                            >
                                                Hủy đặt xe
                                            </button>
                                        )}

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Xác Nhận Hủy Đặt Xe */}
            {cancelModalData.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="flex flex-col items-center bg-white shadow-xl rounded-xl py-6 px-5 w-full max-w-[370px] md:max-w-[460px] border border-gray-200">
                        <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="text-gray-900 font-semibold mt-4 text-xl">Xác nhận hủy đặt xe</h2>
                        <p className="text-sm text-gray-600 mt-2 text-center leading-relaxed">
                            Bạn có chắc chắn muốn hủy đặt chiếc xe này?<br />Thao tác này không thể hoàn tác.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-6 w-full">
                            <button 
                                onClick={() => setCancelModalData({ isOpen: false, bookingId: null })}
                                type="button" 
                                className="w-full md:w-36 h-11 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 active:scale-95 transition-all">
                                Quay lại
                            </button>
                            <button 
                                onClick={handleConfirmCancel}
                                type="button" 
                                className="w-full md:w-36 h-11 rounded-lg text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition-all shadow-sm shadow-red-200">
                                Chắc chắn hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default MyBookings;