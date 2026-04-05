import User from "../models/User.js";

// Tạo hoặc cập nhật thông tin user sau khi đăng nhập (từ Clerk webhook hoặc call trực tiếp)
export const createOrUpdateUser = async (req, res) => {
  try {
    const { clerkId, name, email, image } = req.body;
    let user = await User.findOne({ clerkId });

    if (user) {
      user.name = name;
      user.email = email;
      user.image = image;
      await user.save();
      return res.status(200).json({ success: true, data: user });
    }

    user = new User({ clerkId, name, email, image });
    const savedUser = await user.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin User theo ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
