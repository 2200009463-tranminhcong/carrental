import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import api from '../../utils/api'

const ManageBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOwnerBookings = async () => {
        try {
            const response = await api.get('/bookings');
            if (response.data.success) {
                const sorted = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBookings(sorted);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách bookings:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOwnerBookings();
    }, [])

    // Thay đổi trạng thái đơn đặt xe (pending → confirmed/cancelled)
    const handleStatusChange = async (id, newStatus) => {
        setBookings(prev => prev.map(booking =>
            booking._id === id ? { ...booking, status: newStatus } : booking
        ));
        try {
            const response = await api.put(`/bookings/${id}/status`, { status: newStatus });
            if (!response.data.success) {
                alert("Lỗi cập nhật: " + response.data.message);
                fetchOwnerBookings();
            } else {
                fetchOwnerBookings();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Lỗi hệ thống khi cập nhật trạng thái.");
            fetchOwnerBookings();
        }
    };

    // Thay đổi trạng thái thanh toán (admin thủ công)
    const handlePaymentStatusChange = async (id, newPaymentStatus) => {
        // Optimistic UI update
        setBookings(prev => prev.map(booking =>
            booking._id === id ? { ...booking, paymentStatus: newPaymentStatus } : booking
        ));
        try {
            const response = await api.put(`/bookings/${id}/payment-status`, { paymentStatus: newPaymentStatus });
            if (!response.data.success) {
                alert("Lỗi cập nhật thanh toán: " + response.data.message);
                fetchOwnerBookings();
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("Lỗi hệ thống khi cập nhật trạng thái thanh toán.");
            fetchOwnerBookings();
        }
    };

    // Badge màu cho trạng thái thanh toán
    const paymentBadgeClass = (status) => {
        if (status === "paid") return "bg-green-100 text-green-700";
        if (status === "failed") return "bg-red-100 text-red-600";
        return "bg-yellow-100 text-yellow-700";
    };

    const paymentLabel = (status) => {
        if (status === "paid") return "✓ Đã TT";
        if (status === "failed") return "✗ Thất bại";
        return "Chưa TT";
    };

    if (loading) return <div className="p-10 text-gray-500">Đang tải danh sách đặt xe...</div>;

    return (
        <div className="px-4 pt-10 p-4 w-full text-gray-500 bg-white">
            <Title
                title="Quản lý đặt xe"
                subTitle="Theo dõi tất cả các đặt chỗ của khách hàng, phê duyệt hoặc hủy yêu cầu và quản lý trạng thái đặt chỗ"
            />

            <div className='shadow-sm max-w-5xl w-full rounded-md overflow-x-auto border border-borderColor mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600 bg-white'>
                    <thead className='text-gray-700 bg-gray-50'>
                        <tr>
                            <th className="p-3 font-medium whitespace-nowrap">Khách hàng</th>
                            <th className="p-3 font-medium">Xe</th>
                            <th className="p-3 font-medium max-md:hidden whitespace-nowrap">Khoảng thời gian</th>
                            <th className="p-3 font-medium whitespace-nowrap">Tổng tiền</th>
                            <th className="p-3 font-medium whitespace-nowrap">Thanh toán</th>
                            <th className="p-3 font-medium whitespace-nowrap">Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-400">Không có đơn đặt xe nào</td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking._id} className='border-t border-borderColor text-gray-600 hover:bg-gray-50'>
                                    {/* Khách hàng */}
                                    <td className='p-3'>
                                        <div className='font-medium text-black'>{booking.user?.name || "Khách ẩn danh"}</div>
                                        <div className='text-xs text-blue-500 truncate max-w-[120px]'>{booking.user?.email}</div>
                                    </td>

                                    {/* Xe */}
                                    <td className='p-3 flex items-center gap-3'>
                                        <img
                                            src={booking.car?.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                                            alt={booking.car?.name}
                                            className="h-12 w-12 aspect-square rounded-md object-cover flex-shrink-0"
                                        />
                                        <p className='font-medium max-md:hidden text-black'>
                                            {booking.car?.name}
                                        </p>
                                    </td>

                                    {/* Thời gian */}
                                    <td className='p-3 max-md:hidden text-xs'>
                                        {booking.pickupDate ? booking.pickupDate.split('T')[0] : '?'} <br/>
                                        <span className="text-gray-400">đến</span> <br/>
                                        {booking.returnDate ? booking.returnDate.split('T')[0] : '?'}
                                    </td>

                                    {/* Tổng tiền */}
                                    <td className='p-3 whitespace-nowrap font-medium text-green-600'>
                                        ₫ {booking.totalPrice?.toLocaleString()}
                                    </td>

                                    {/* Thanh toán — Admin có thể thay đổi */}
                                    <td className='p-3'>
                                        <div className="flex flex-col gap-1">
                                            {/* Badge hiện tại */}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${paymentBadgeClass(booking.paymentStatus)}`}>
                                                {paymentLabel(booking.paymentStatus)}
                                            </span>
                                            {/* Dropdown đổi trạng thái */}
                                            <select
                                                value={booking.paymentStatus}
                                                onChange={(e) => handlePaymentStatusChange(booking._id, e.target.value)}
                                                className="mt-1 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-400 cursor-pointer"
                                            >
                                                <option value="unpaid">Chưa thanh toán</option>
                                                <option value="paid">Đã thanh toán</option>
                                                <option value="failed">Thất bại</option>
                                            </select>
                                            {/* Hình thức nhận xe */}
                                            <span className="text-xs text-gray-400">
                                                {booking.pickupType === "delivery"
                                                    ? `Giao: ${booking.deliveryAddress}`
                                                    : `Cửa hàng`
                                                }
                                            </span>
                                        </div>
                                    </td>

                                    {/* Hành động — đổi trạng thái đơn */}
                                    <td className='p-3'>
                                        {booking.status === 'pending' ? (
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                                className='bg-white px-2 py-1.5 text-xs text-black border border-borderColor rounded-md outline-none focus:border-blue-500 cursor-pointer'
                                            >
                                                <option value="pending">Đang chờ</option>
                                                <option value="confirmed">Xác nhận duyệt</option>
                                                <option value="cancelled">Hủy đơn</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                                            ${booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageBooking;

