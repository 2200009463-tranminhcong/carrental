import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import crypto from "crypto";
import https from "https";
import { MOMO_CONFIG } from "../configs/momo.js";

// Tạo booking mới
export const createBooking = async (req, res) => {
    try {
        const { user, car, pickupDate, returnDate, pickupLocation, returnLocation, pickupType, deliveryAddress, paymentMethod, totalPrice } = req.body;

        // Kiểm tra xe có tồn tại không
        const existingCar = await Car.findById(car);
        if (!existingCar) {
            return res.status(404).json({ success: false, message: "Không tìm thấy xe" });
        }

        // Kiểm tra dữ liệu đầu vào
        if (!user || !car || !pickupDate || !returnDate || !pickupLocation || !totalPrice) {
            return res.status(400).json({ success: false, message: "Dữ liệu không đầy đủ" });
        }

        const newBooking = new Booking({
            user,
            car,
            pickupDate,
            returnDate,
            pickupLocation,
            returnLocation: returnLocation || pickupLocation,
            pickupType: pickupType || "store",
            deliveryAddress: deliveryAddress || null,
            paymentMethod: paymentMethod || "cash",
            paymentStatus: "unpaid",
            totalPrice,
            status: "pending",
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ success: true, data: savedBooking });
    } catch (error) {
        console.error("Lỗi tạo booking:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách booking của một user (My Bookings)
export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ user: userId }).populate("car");
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy tất cả bookings (Dành cho admin/owner)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user", "name email phone").populate("car", "name brand image owner");
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái booking
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
        }
        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái thanh toán (dành cho admin)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!["unpaid", "paid", "failed"].includes(paymentStatus)) {
            return res.status(400).json({ success: false, message: "Trạng thái thanh toán không hợp lệ" });
        }
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true, runValidators: true }
        );
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
        }
        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===========================
// MOMO PAYMENT API INTEGRATION
// ===========================

/**
 * Tạo link thanh toán MoMo - gọi API MoMo và trả về payUrl để redirect người dùng
 */
export const createMomoPayment = async (req, res) => {
    try {
        const { bookingId, amount, orderInfo } = req.body;

        // Kiểm tra booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
        }

        const {
            accessKey, secretKey, partnerCode, partnerName, storeId,
            endpoint, redirectUrl, ipnUrl, requestType, lang
        } = MOMO_CONFIG;

        // Tạo orderId và requestId duy nhất
        const orderId = partnerCode + Date.now() + "_" + bookingId.slice(-6);
        const requestId = orderId;
        const extraData = Buffer.from(JSON.stringify({ bookingId })).toString("base64");
        const autoCapture = true;
        const orderGroupId = "";
        const finalAmount = String(amount || booking.totalPrice);
        const finalOrderInfo = orderInfo || `Thanh toán đặt xe - Booking #${bookingId.slice(-6)}`;

        // Tạo raw signature (đúng format MoMo)
        const rawSignature =
            `accessKey=${accessKey}` +
            `&amount=${finalAmount}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}` +
            `&orderInfo=${finalOrderInfo}` +
            `&partnerCode=${partnerCode}` +
            `&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}` +
            `&requestType=${requestType}`;

        // Ký HMAC SHA256
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        // Request body gửi tới MoMo
        const requestBody = JSON.stringify({
            partnerCode,
            partnerName,
            storeId,
            requestId,
            amount: finalAmount,
            orderId,
            orderInfo: finalOrderInfo,
            redirectUrl,
            ipnUrl,
            lang,
            requestType,
            autoCapture,
            extraData,
            orderGroupId,
            signature,
        });

        // Gửi request tới MoMo
        const momoUrl = new URL(endpoint);

        const options = {
            hostname: momoUrl.hostname,
            port: 443,
            path: momoUrl.pathname,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };

        const momoResponse = await new Promise((resolve, reject) => {
            const req = https.request(options, (momoRes) => {
                let data = "";
                momoRes.on("data", (chunk) => { data += chunk; });
                momoRes.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON response from MoMo"));
                    }
                });
            });
            req.on("error", reject);
            req.write(requestBody);
            req.end();
        });

        console.log("MoMo API response:", momoResponse);

        if (momoResponse.resultCode === 0) {
            // Lưu MoMo orderId vào booking để đối chiếu sau
            await Booking.findByIdAndUpdate(bookingId, {
                momoOrderId: orderId,
                momoRequestId: requestId,
            });

            return res.status(200).json({
                success: true,
                payUrl: momoResponse.payUrl,
                orderId: momoResponse.orderId,
                message: "Tạo link thanh toán MoMo thành công",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: momoResponse.message || "Tạo thanh toán MoMo thất bại",
                resultCode: momoResponse.resultCode,
            });
        }
    } catch (error) {
        console.error("Lỗi tạo thanh toán MoMo:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * IPN Callback - MoMo gọi về server sau khi thanh toán xong
 * MoMo sẽ POST request này để thông báo kết quả giao dịch
 */
export const momoIpnCallback = async (req, res) => {
    try {
        const {
            partnerCode, orderId, requestId, amount, orderInfo,
            orderType, transId, resultCode, message, payType,
            responseTime, extraData, signature
        } = req.body;

        const { accessKey, secretKey } = MOMO_CONFIG;

        // Xác thực chữ ký từ MoMo
        const rawSignature =
            `accessKey=${accessKey}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&message=${message}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&orderType=${orderType}` +
            `&partnerCode=${partnerCode}` +
            `&payType=${payType}` +
            `&requestId=${requestId}` +
            `&responseTime=${responseTime}` +
            `&resultCode=${resultCode}` +
            `&transId=${transId}`;

        const checkSignature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        if (checkSignature !== signature) {
            console.error("MoMo IPN: Chữ ký không hợp lệ!");
            return res.status(400).json({ success: false, message: "Chữ ký không hợp lệ" });
        }

        // Giải mã extraData để lấy bookingId
        let bookingId = null;
        try {
            const decodedExtra = JSON.parse(Buffer.from(extraData, "base64").toString("utf-8"));
            bookingId = decodedExtra.bookingId;
        } catch (e) {
            console.error("Không thể giải mã extraData:", e);
        }

        if (resultCode === 0) {
            // Thanh toán thành công
            if (bookingId) {
                await Booking.findByIdAndUpdate(bookingId, {
                    paymentStatus: "paid",
                    momoTransId: transId,
                });
                console.log(`Booking ${bookingId} đã được thanh toán thành công qua MoMo. TransId: ${transId}`);
            }
        } else {
            // Thanh toán thất bại
            console.log(`Thanh toán MoMo thất bại. OrderId: ${orderId}, ResultCode: ${resultCode}, Message: ${message}`);
            if (bookingId) {
                await Booking.findByIdAndUpdate(bookingId, {
                    paymentStatus: "failed",
                });
            }
        }

        // Trả về 200 cho MoMo biết đã nhận IPN
        res.status(200).json({ status: 0, message: "success" });
    } catch (error) {
        console.error("Lỗi xử lý MoMo IPN:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Xác nhận thanh toán MoMo từ redirect URL (frontend gọi sau khi MoMo redirect về)
 * Xác thực chữ ký và cập nhật paymentStatus vào database
 */
export const confirmMomoPayment = async (req, res) => {
    try {
        const { orderId, requestId, amount, orderInfo, orderType, transId,
            resultCode, message, payType, responseTime, extraData, signature } = req.body;

        const { accessKey, secretKey } = MOMO_CONFIG;

        // Xác thực chữ ký từ MoMo để tránh giả mạo
        const rawSignature =
            `accessKey=${accessKey}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&message=${message}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&orderType=${orderType}` +
            `&partnerCode=${MOMO_CONFIG.partnerCode}` +
            `&payType=${payType}` +
            `&requestId=${requestId}` +
            `&responseTime=${responseTime}` +
            `&resultCode=${resultCode}` +
            `&transId=${transId}`;

        const checkSignature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        if (checkSignature !== signature) {
            console.error("confirmMomoPayment: Chữ ký không hợp lệ!");
            return res.status(400).json({ success: false, message: "Chữ ký không hợp lệ" });
        }

        // Giải mã extraData để lấy bookingId
        let bookingId = null;
        try {
            const decodedExtra = JSON.parse(Buffer.from(extraData, "base64").toString("utf-8"));
            bookingId = decodedExtra.bookingId;
        } catch (e) {
            console.error("Không thể giải mã extraData:", e);
            return res.status(400).json({ success: false, message: "extraData không hợp lệ" });
        }

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Không tìm thấy bookingId" });
        }

        if (Number(resultCode) === 0) {
            // Thanh toán thành công → cập nhật DB
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { paymentStatus: "paid", momoTransId: transId },
                { new: true }
            );
            if (!updatedBooking) {
                return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
            }
            console.log(`[MoMo Redirect] Booking ${bookingId} đã thanh toán thành công. TransId: ${transId}`);
            return res.status(200).json({ success: true, data: updatedBooking });
        } else {
            // Thanh toán thất bại → đánh dấu failed
            await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
            console.log(`[MoMo Redirect] Thanh toán thất bại. BookingId: ${bookingId}, resultCode: ${resultCode}`);
            return res.status(200).json({ success: false, message: message || "Thanh toán thất bại" });
        }
    } catch (error) {
        console.error("Lỗi xác nhận thanh toán MoMo:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Kiểm tra trạng thái booking (dùng sau khi redirect về từ MoMo)
 */
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("car", "name image pricePerDay");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin thanh toán Momo (số tài khoản thủ công - vẫn giữ lại làm fallback)
export const getMomoInfo = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                accountNumber: MOMO_CONFIG.accountNumber,
                accountName: MOMO_CONFIG.accountName,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Thanh toán Momo thủ công (legacy - giữ lại tương thích)
export const paymentMomo = async (req, res) => {
    try {
        const { amount } = req.body;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { paymentStatus: "paid" },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Thanh toán thành công",
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Đánh dấu booking đã đọc
export const markBookingAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt xe" });
        }

        res.status(200).json({ success: true, message: "Đã đánh dấu là đã đọc", data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
