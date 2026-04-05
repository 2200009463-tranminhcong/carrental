import mongoose from "mongoose";
import dns from "dns";

// Ưu tiên dùng Google DNS để bypass lỗi SRV của VNPT
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ Database Connected to MongoDB Atlas")
    );
    mongoose.connection.on("error", (err) =>
      console.error("❌ MongoDB connection error:", err.message)
    );
    mongoose.connection.on("disconnected", () =>
      console.warn("⚠️  MongoDB disconnected. Retrying...")
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed (attempt ${retryCount + 1}/${MAX_RETRIES}): ${error.message}`);

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`🔄 Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      return connectDB(retryCount + 1);
    } else {
      console.error("💥 Could not connect to MongoDB after maximum retries. Server will still start but DB features will not work.");
    }
  }
};

export default connectDB;
