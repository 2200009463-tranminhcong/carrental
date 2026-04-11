import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    pickupType: {
      type: String,
      enum: ["store", "delivery"],
      default: "store",
    },
    deliveryAddress: {
      type: String,
    },
    returnLocation: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "momo"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // MoMo Payment API fields
    momoOrderId: { type: String },
    momoRequestId: { type: String },
    momoTransId: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
