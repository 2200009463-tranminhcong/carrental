import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react";
import api from "../utils/api";

/**
 * Trang kết quả thanh toán MoMo
 * MoMo sẽ redirect về: /payment-result?resultCode=0&orderId=...&transId=...&...
 */
const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // loading | success | failed | pending
    const [message, setMessage] = useState("");
    const [bookingId, setBookingId] = useState(null);
    const confirmedRef = useRef(false); // tránh gọi API 2 lần

    useEffect(() => {
        const resultCode = searchParams.get("resultCode");
        const orderId = searchParams.get("orderId");
        const requestId = searchParams.get("requestId");
        const transId = searchParams.get("transId");
        const amount = searchParams.get("amount");
        const orderInfo = searchParams.get("orderInfo");
        const orderType = searchParams.get("orderType");
        const payType = searchParams.get("payType");
        const responseTime = searchParams.get("responseTime");
        const momoMessage = searchParams.get("message");
        const extraData = searchParams.get("extraData");
        const signature = searchParams.get("signature");
        const partnerCode = searchParams.get("partnerCode");

        // Giải mã extraData để lấy bookingId
        let parsedBookingId = null;
        if (extraData) {
            try {
                const decoded = JSON.parse(atob(extraData));
                parsedBookingId = decoded.bookingId;
                setBookingId(parsedBookingId);
            } catch (e) {
                console.error("Không giải mã được extraData:", e);
            }
        }

        if (resultCode === null) {
            setStatus("pending");
            setMessage("Không tìm thấy thông tin giao dịch.");
            return;
        }

        // Gọi API để xác nhận và cập nhật trạng thái thanh toán vào DB
        // (dự phòng khi IPN không đến được server trong môi trường dev)
        if (!confirmedRef.current && signature && extraData) {
            confirmedRef.current = true;
            api.post("/bookings/momo-payment/confirm", {
                orderId,
                requestId,
                amount,
                orderInfo,
                orderType,
                transId,
                resultCode: Number(resultCode),
                message: momoMessage,
                payType,
                responseTime,
                extraData,
                signature,
                partnerCode,
            }).then(response => {
                if (response.data.success) {
                    console.log("✅ Xác nhận thanh toán MoMo thành công, DB đã cập nhật.");
                } else {
                    console.warn("⚠️ Gọi confirm API trả về thất bại:", response.data.message);
                }
            }).catch(err => {
                console.warn("⚠️ Không thể gọi confirm API:", err.message);
            });
        }

        if (resultCode === "0") {
            setStatus("success");
            setMessage(`Thanh toán thành công! Mã giao dịch: ${transId || "N/A"}`);
        } else {
            setStatus("failed");
            setMessage(momoMessage || "Thanh toán không thành công. Vui lòng thử lại.");
        }
    }, [searchParams]);

    const resultCode = searchParams.get("resultCode");
    const transId = searchParams.get("transId");
    const amount = searchParams.get("amount");
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-20">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
                {/* Icon trạng thái */}
                <div className="flex flex-col items-center text-center">
                    {status === "loading" && (
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                    )}
                    {status === "success" && (
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    )}
                    {status === "failed" && (
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                    )}
                    {status === "pending" && (
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-12 h-12 text-yellow-500" />
                        </div>
                    )}

                    {/* Tiêu đề */}
                    <h1 className={`text-2xl font-bold mb-2 ${
                        status === "success" ? "text-green-600" :
                        status === "failed" ? "text-red-600" :
                        status === "pending" ? "text-yellow-600" :
                        "text-gray-600"
                    }`}>
                        {status === "success" && "🎉 Thanh toán thành công!"}
                        {status === "failed" && "❌ Thanh toán thất bại"}
                        {status === "pending" && "⏳ Đang xử lý..."}
                        {status === "loading" && "Đang kiểm tra kết quả..."}
                    </h1>

                    <p className="text-gray-500 text-sm mb-6">{message}</p>

                    {/* Chi tiết giao dịch */}
                    {(status === "success" || status === "failed") && (
                        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3 text-left mb-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-2">Chi tiết giao dịch</h2>

                            {/* Logo MoMo */}
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                    alt="MoMo"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="font-medium text-[#ae2070]">Ví MoMo</span>
                            </div>

                            {amount && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Số tiền</span>
                                    <span className="font-bold text-green-700">
                                        {parseInt(amount).toLocaleString()} VNĐ
                                    </span>
                                </div>
                            )}
                            {transId && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Mã giao dịch MoMo</span>
                                    <span className="font-mono text-gray-700">{transId}</span>
                                </div>
                            )}
                            {orderId && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Mã đơn hàng</span>
                                    <span className="font-mono text-gray-700 text-xs break-all">{orderId}</span>
                                </div>
                            )}
                            {resultCode !== null && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Mã kết quả</span>
                                    <span className={`font-bold ${resultCode === "0" ? "text-green-600" : "text-red-600"}`}>
                                        {resultCode}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Thông báo thêm nếu thành công */}
                    {status === "success" && (
                        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-sm text-blue-700 text-left">
                            ✅ Đơn đặt xe của bạn đã được xác nhận và thanh toán. Chủ xe sẽ liên hệ với bạn trong thời gian sớm nhất.
                        </div>
                    )}

                    {/* Thông báo nếu thất bại */}
                    {status === "failed" && (
                        <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-sm text-red-700 text-left">
                            ⚠️ Thanh toán chưa hoàn thành. Đơn đặt xe của bạn vẫn đang ở trạng thái chờ xác nhận. Bạn có thể thử thanh toán lại hoặc liên hệ hỗ trợ.
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Link
                            to="/MyBookings"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-center transition"
                        >
                            Xem đơn đặt xe
                        </Link>
                        <Link
                            to="/cars"
                            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl text-center transition"
                        >
                            Tiếp tục thuê xe
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
