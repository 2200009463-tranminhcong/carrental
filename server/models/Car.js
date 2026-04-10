import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Sedan", "SUV", "Luxury", "Hatchback", "Crossover", "Pickup"],
    },
    year: {
      type: Number,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Số tự động", "Số sàn"],
    },
    seats: {
      type: Number,
      required: true,
      default: 5,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
