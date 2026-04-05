import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car.js";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const dummyCars = [
  {
    name: "BMW X5 2023",
    brand: "BMW",
    model: "X5", // Add model if you altered your schema to need it, or it will just be ignored
    type: "SUV",
    year: 2023,
    transmission: "Số tự động",
    seats: 7,
    pricePerDay: 1500000,
    location: "Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Cửa sổ trời", "Camera 360", "Bản đồ GPS", "Bluetooth", "Ghế da"],
    description: "Chiếc SUV hạng sang mang lại trải nghiệm êm ái, mạnh mẽ với không gian nội thất đẳng cấp.",
    isAvailable: true
  },
  {
    name: "Mercedes-Benz C300 AMG",
    brand: "Mercedes",
    type: "Sedan",
    year: 2022,
    transmission: "Số tự động",
    seats: 5,
    pricePerDay: 1300000,
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Bản đồ GPS", "Camera cập lề", "Cảm biến lốp", "Khe cắm USB"],
    description: "Mẫu sedan thể thao sang trọng, thiết kế hiện đại, phù hợp cho doanh nhân hoặc các chuyến đi dạo phố.",
    isAvailable: true
  },
  {
    name: "Ford Ranger Wildtrak 2024",
    brand: "Ford",
    type: "Pickup",
    year: 2024,
    transmission: "Số tự động",
    seats: 5,
    pricePerDay: 1100000,
    location: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1606016159991-dce8ea90024a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Camera lùi", "Cảm biến va chạm", "Bluetooth", "Lốp dự phòng"],
    description: "Ông vua bán tải, động cơ mạnh mẽ thích hợp cho các cung đường đèo dốc và off-road nhẹ.",
    isAvailable: true
  },
  {
    name: "VinFast VF8 Plus",
    brand: "VinFast",
    type: "SUV",
    year: 2023,
    transmission: "Số tự động",
    seats: 5,
    pricePerDay: 1400000,
    location: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1706859586144-8df65fb48f93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // close enough placeholder
    features: ["Camera 360", "Cảnh báo chệch làn", "Hệ thống tự lái", "Điều khiển bằng giọng nói"],
    description: "Xe điện gầm cao thông minh từ thương hiệu Việt, thiết kế khỏe khoắn và đầy ắp công nghệ.",
    isAvailable: true
  },
  {
    name: "Honda City RS",
    brand: "Honda",
    type: "Sedan",
    year: 2021,
    transmission: "Số tự động",
    seats: 5,
    pricePerDay: 700000,
    location: "Nha Trang",
    image: "https://images.unsplash.com/photo-1605556209590-edc76a9be690?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Màn hình DVD", "Bluetooth", "Khe cắm USB", "Camera lùi"],
    description: "Thiết kế thể thao, không gian rộng rãi nhất phân khúc, siêu tiết kiệm nhiên liệu.",
    isAvailable: true
  },
  {
    name: "Mazda CX-5 Premium",
    brand: "Mazda",
    type: "Crossover",
    year: 2022,
    transmission: "Số tự động",
    seats: 5,
    pricePerDay: 950000,
    location: "Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Cửa sổ trời", "Camera 360", "Ghế da", "Cảm biến lốp"],
    description: "Mẫu crossover 5 chỗ bán chạy, thiết kế Kodo tinh tế, công nghệ hỗ trợ lái an toàn.",
    isAvailable: true
  },
  {
    name: "Hyundai SantaFe Premium",
    brand: "Hyundai",
    type: "SUV",
    year: 2023,
    transmission: "Số tự động",
    seats: 7,
    pricePerDay: 1250000,
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Cửa sổ trời toàn cảnh", "Màn hình giải trí", "Camera 360", "Ghế da cao cấp"],
    description: "SUV 7 chỗ lý tưởng cho gia đình, nội thất rộng rãi và nhiều tiện nghi.",
    isAvailable: true
  },
  {
    name: "Toyota Vios 1.5G",
    brand: "Toyota",
    type: "Sedan",
    year: 2020,
    transmission: "Số tự động",
    seats: 5,
    pricePerDay: 600000,
    location: "Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Điều hòa tự động", "Bluetooth", "Đầu DVD", "Ghế da"],
    description: "Dòng xe quốc dân, vận hành bền bỉ, tiết kiệm nhiên liệu.",
    isAvailable: true
  },
  {
    name: "Kia Carnival Luxury",
    brand: "Kia",
    type: "SUV", // Reusing SUV as it fits schema best for MPV/Van
    year: 2024,
    transmission: "Số tự động",
    seats: 7, // Actually usually 7 or 8
    pricePerDay: 1600000,
    location: "Vũng Tàu",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Cửa lùa điện", "Ghế thương gia", "Màn hình giải trí lớn", "Camera 360", "Rèm che nắng"],
    description: "Mẫu xe gia đình cỡ lớn mang đến sự thoải mái tối đa cho mọi hành khách trên các chuyến đi dài.",
    isAvailable: true
  },
   {
    name: "Audi R8 - Special Edition",
    brand: "Audi",
    type: "Luxury",
    year: 2021,
    transmission: "Số tự động",
    seats: 2,
    pricePerDay: 5000000,
    location: "Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Động cơ V10", "Ghế thể thao", "Chế độ lái thể thao", "Carbon Fiber Trim"],
    description: "Trải nghiệm siêu xe tốc độ đẳng cấp, thu hút mọi ánh nhìn.",
    isAvailable: true
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB for seeding...");

        // Find the admin user to use as the owner
        let adminUser = await User.findOne({ email: "admin@gmail.com" });
        
        if (!adminUser) {
            console.log("Admin user not found. Creating a temporary owner...");
            adminUser = await User.create({
                clerkId: "admin-secret-id",
                name: "Quản Trị Viên (Auto)",
                email: "admin@gmail.com",
                role: "admin"
            });
        }

        // Wipe existing cars maybe? Or just append. Let's append to be safe or maybe wipe?
        // Let's wipe all cars owned by admin to avoid duplicates if run multiple times
        await Car.deleteMany({ owner: adminUser._id });
        console.log("Cleared old admin cars.");

        // Assign owner to dummy cars
        const carsWithOwner = dummyCars.map(car => ({
            ...car,
            owner: adminUser._id
        }));

        await Car.insertMany(carsWithOwner);
        console.log(`Successfully added ${carsWithOwner.length} cars!`);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
