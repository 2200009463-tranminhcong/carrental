import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

// Routes
import carRoute from "./routes/carRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import userRoute from "./routes/userRoute.js";
import contactRoute from "./routes/contactRoute.js";

// Initialize Express App
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// API Endpoints
app.use("/api/cars", carRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/users", userRoute);
app.use("/api/contacts", contactRoute);

app.get('/', (req, res) => res.send("Server is running. API is ready."));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;