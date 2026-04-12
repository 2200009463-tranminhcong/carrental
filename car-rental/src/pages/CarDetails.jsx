import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MapPin, Users, Cog, Fuel, Star, Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import api from "../utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoaded, isSignedIn } = useUser();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pickupDate, setPickupDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);
    const [pickupType, setPickupType] = useState("store");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchCarDetail = async () => {
            try {
                const [carRes, bookedRes] = await Promise.all([
                    api.get(`/cars/${id}`),
                    api.get(`/bookings/booked-dates/${id}`)
                ]);

                if (carRes.data.success) {
                    setCar(carRes.data.data);
                }
                if (bookedRes.data.success) {
                    // Chuyển đổi chuỗi ngày thành đối tượng Date
                    const ranges = bookedRes.data.data.map(b => ({
                        start: new Date(b.pickupDate),
                        end: new Date(b.returnDate)
                    }));
                    setBookedDates(ranges);
                }
            } catch (error) {
                console.error("Lỗi khi tải thông tin chi tiết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetail();
    }, [id]);

    const days = pickupDate && returnDate
        ? Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
        : 0;

    const totalPrice = car ? (days > 0 ? days * car.pricePerDay : car.pricePerDay) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoaded || !isSignedIn) {
            alert("Vui lòng đăng nhập để đặt xe!");
            return;
        }

        if (days <= 0) {
            alert("Ngày trả xe phải sau ngày nhận xe.");
            return;
        }

        if (days < 1) {
            alert("Xe thuê tối thiểu ít nhất 1 ngày.");
            return;
        }

        if (pickupType === "delivery" && !deliveryAddress) {
            alert("Vui lòng nhập địa chỉ giao xe.");
            return;
        }

        try {
            setBookingLoading(true);

            // Đồng bộ user với MongoDB
            const syncResponse = await api.post("/users/sync", {
                clerkId: user.id,
                name: user.fullName || user.username,
                email: user.primaryEmailAddress?.emailAddress,
                image: user.imageUrl,
            });

            if (!syncResponse.data.success) {
                alert("Lỗi đồng bộ người dùng!");
                return;
            }

            const mongoUserId = syncResponse.data.data._id;

            // Tạo booking
            const bookingData = {
                user: mongoUserId,
                car: car._id,
                pickupDate,
                returnDate,
                pickupLocation: car.location,
                pickupType,
                deliveryAddress: pickupType === "delivery" ? deliveryAddress : null,
                paymentMethod,
                totalPrice,
            };

            const response = await api.post("/bookings", bookingData);

            if (response.data.success) {
                const bookingId = response.data.data._id;

                if (paymentMethod === "momo") {
                    // ✅ Gọi API tạo link thanh toán MoMo thực thụ
                    try {
                        const momoResponse = await api.post("/bookings/momo-payment/create", {
                            bookingId,
                            amount: totalPrice,
                            orderInfo: `Thuê xe ${car.name} - ${days} ngày`,
                        });

                        if (momoResponse.data.success && momoResponse.data.payUrl) {
                            // Redirect người dùng đến trang thanh toán MoMo
                            window.location.href = momoResponse.data.payUrl;
                        } else {
                            alert("Không thể tạo link thanh toán MoMo: " + momoResponse.data.message);
                        }
                    } catch (err) {
                        console.error("Lỗi tạo thanh toán MoMo:", err);
                        const errMsg = err.response?.data?.message || err.message;
                        alert("Lỗi kết nối MoMo: " + errMsg);
                    }
                } else {
                    alert(`Đặt xe thành công! Bạn có thể xem chi tiết trong Quản lý chuyến đi.`);
                    navigate("/MyBookings");
                }
            } else {
                alert("Đặt xe thất bại: " + response.data.message);
            }
        } catch (error) {
            console.error("Lỗi đặt xe:", error);
            alert("Đã xảy ra lỗi trong quá trình đặt xe.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-lg font-medium">Đang tải thông tin xe...</p>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="text-center py-20 text-xl font-semibold">
                Không tìm thấy xe
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E4E9FF] via-[#FFF3CC] to-[#CCD9FF]">
            <div className="max-w-5xl mx-auto py-24 px-1">
                {/* Nút quay lại */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-100 flex items-center gap-2 mb-6 text-gray-500 hover:text-black cursor-pointer"
                >
                    ← Quay lại Danh Mục
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row gap-7 ">
                        {/* Ảnh xe */}
                        <div className="md:w-1/2 rounded-lg">
                            <img
                                src={car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                                alt={car.name}
                                className="w-full h-72 object-cover rounded-lg"
                            />
                            <div className="mt-4 pb-4">
                                <h2 className="text-3xl font-bold text-black">
                                    {car.name}
                                </h2>
                                <p className="text-gray-500">
                                    {car.type} • {car.year}
                                </p>
                            </div>
                        </div>

                        {/* Thông tin xe */}
                        <div className="md:w-1/2">
                            {/* Rating */}
                            <div className="flex items-center gap-2 text-yellow-500 mb-4">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <span className="font-medium">4.8</span>
                            </div>

                            {/* Thông số */}
                            <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    {car.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    {car.seats} chỗ
                                </div>
                                <div className="flex items-center gap-2">
                                    <Cog className="w-4 h-4 text-blue-500" />
                                    {car.transmission}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Fuel className="w-4 h-4 text-blue-500" />
                                    Xăng
                                </div>
                            </div>

                            {/* Mô tả */}
                            <p className="text-gray-700 mb-6">
                                {car.description || "Đây là một chiếc xe tuyệt vời với hiệu suất mạnh mẽ, thiết kế sang trọng và trải nghiệm lái xe cực kỳ thoải mái."}
                            </p>
                            {/* Tính năng nổi bật */}
                            <div className="">
                                <h1 className="text-xl font-semibold">Tiện ích của xe</h1>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    {car.features && car.features.map((item, index) => (
                                        <li key={index} className="flex items-center text-gray-600">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Giá */}
                            <div className="text-2xl font-bold text-green-600 mt-4 mb-4">
                                {car.pricePerDay.toLocaleString()} VNĐ/ ngày
                            </div>
                        </div>
                        <hr className="border-gray-700" />
                    </div>
                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="h-max sticky top-24 shadow-lg rounded-xl p-6 space-y-6 bg-gray-100 mt-6 text-black">
                        {/* Price */}
                        <p className="flex items-center justify-between text-2xl text-green-700 font-semibold">
                            {totalPrice.toLocaleString()}
                            <span className="text-base text-gray-600 font-normal">VNĐ</span>
                        </p>
                        {days > 0 && (
                            <p className="text-gray-500 text-sm">
                                {days} ngày × {car.pricePerDay.toLocaleString()} VNĐ
                            </p>
                        )}

                        <hr className="border-green-400" />

                        <p className="text-gray-500">Lưu ý: xe thuê tối thiểu ít nhất 1 ngày</p>
                        {/* Pickup Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-bold" htmlFor="pickup-date">Ngày nhận xe</label>
                            <DatePicker
                                selected={pickupDate}
                                onChange={(date) => setPickupDate(date)}
                                selectsStart
                                startDate={pickupDate}
                                endDate={returnDate}
                                minDate={new Date()}
                                excludeDateIntervals={bookedDates}
                                placeholderText="Chọn ngày nhận"
                                className="w-full bg-slate-300 text-blue-600 border px-3 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                dateFormat="dd/MM/yyyy"
                                required
                            />
                        </div>

                        {/* Return Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-500 font-bold" htmlFor="return-date">Ngày trả xe</label>
                            <DatePicker
                                selected={returnDate}
                                onChange={(date) => setReturnDate(date)}
                                selectsEnd
                                startDate={pickupDate}
                                endDate={returnDate}
                                minDate={pickupDate || new Date()}
                                excludeDateIntervals={bookedDates}
                                placeholderText="Chọn ngày trả"
                                className="w-full bg-slate-300 text-blue-600 border px-3 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                dateFormat="dd/MM/yyyy"
                                required
                                disabled={!pickupDate}
                            />
                        </div>

                        <hr className="border-gray-300" />

                        {/* Pickup Type */}
                        <div className="flex flex-col gap-3">
                            <label className="text-gray-500 font-bold">Địa chỉ nhận xe</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pickupType"
                                        value="store"
                                        checked={pickupType === "store"}
                                        onChange={(e) => setPickupType(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-gray-700">Tại cửa hàng: {car.location}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pickupType"
                                        value="delivery"
                                        checked={pickupType === "delivery"}
                                        onChange={(e) => setPickupType(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-gray-700">Giao xe tận nơi</span>
                                </label>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {pickupType === "delivery" && (
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-500 font-bold" htmlFor="delivery-address">Địa chỉ giao xe</label>
                                <input
                                    type="text"
                                    id="delivery-address"
                                    placeholder="Nhập địa chỉ giao xe"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    className="bg-white border px-3 py-2 rounded-lg"
                                    required={pickupType === "delivery"}
                                />
                            </div>
                        )}

                        <hr className="border-gray-300" />

                        {/* Payment Method */}
                        <div className="flex flex-col gap-3">
                            <label className="text-gray-500 font-bold">Hình thức thanh toán</label>
                            <div className="flex gap-4 flex-wrap">
                                {/* Cash */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-gray-700">Thanh toán khi nhận xe</span>
                                </label>

                                {/* MoMo */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="momo"
                                        checked={paymentMethod === "momo"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="flex items-center gap-1.5 text-gray-700">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                            alt="MoMo"
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        Ví MoMo
                                    </span>
                                </label>
                            </div>

                            {/* MoMo Info Banner */}
                            {paymentMethod === "momo" && (
                                <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-start gap-3 mt-1">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                        alt="MoMo"
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div>
                                        <p className="font-semibold text-pink-700 text-sm">Thanh toán qua Ví MoMo</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Sau khi nhấn <strong>"Đặt ngay"</strong>, bạn sẽ được chuyển đến trang thanh toán MoMo an toàn.
                                            Hỗ trợ thanh toán qua app MoMo, QR Code, ATM nội địa và thẻ quốc tế.
                                        </p>
                                        <p className="text-xs text-pink-600 font-medium mt-1.5">
                                            💰 Số tiền: {totalPrice.toLocaleString()} VNĐ
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className={`w-full text-white py-3 rounded-xl transition flex items-center justify-center gap-2 font-semibold ${bookingLoading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : paymentMethod === "momo"
                                        ? "bg-[#ae2070] hover:bg-[#8d1a5a]"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {bookingLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {paymentMethod === "momo" ? "Đang kết nối MoMo..." : "Đang xử lý..."}
                                </>
                            ) : paymentMethod === "momo" ? (
                                <>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                        alt="MoMo"
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                    Đặt xe & Thanh toán MoMo
                                </>
                            ) : (
                                "Đặt ngay"
                            )}
                        </button>

                        <p className="text-center text-gray-400 text-sm">
                            {paymentMethod === "momo"
                                ? "🔒 Thanh toán bảo mật qua cổng MoMo"
                                : "Sau khi ấn đặt, quản trị viên sẽ liên hệ lại với bạn."}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;