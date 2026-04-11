import express from "express";
import {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    updatePaymentStatus,
    paymentMomo,
    getMomoInfo,
    createMomoPayment,
    momoIpnCallback,
    getBookingById,
    confirmMomoPayment,
    markBookingAsRead,
} from "../controllers/bookingController.js";

const router = express.Router();

// Booking CRUD
router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/momo-info", getMomoInfo);
router.get("/user/:userId", getUserBookings);
router.get("/:id", getBookingById);
router.put("/:id/status", updateBookingStatus);
router.put("/:id/read", markBookingAsRead);
router.put("/:id/payment-status", updatePaymentStatus);  // Admin đổi trạng thái thanh toán

// Momo Payment (legacy manual)
router.post("/:id/payment-momo", paymentMomo);

// Momo Payment API Integration
router.post("/momo-payment/create", createMomoPayment);     // Tạo link thanh toán
router.post("/momo-payment/ipn", momoIpnCallback);           // IPN callback từ MoMo server
router.post("/momo-payment/confirm", confirmMomoPayment);   // Xác nhận sau redirect

export default router;
