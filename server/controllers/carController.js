import Car from "../models/Car.js";

// Lấy danh sách xe
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("owner", "name email phone");
    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết xe
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );
    if (!car) {
      return res.status(404).json({ success: false, message: "Không tìm thấy xe" });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm xe mới (Dành cho owner/admin)
export const createCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json({ success: true, data: savedCar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật xe
export const updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ success: false, message: "Không tìm thấy xe" });
    }
    res.status(200).json({ success: true, data: updatedCar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa xe
export const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ success: false, message: "Không tìm thấy xe" });
    }
    res.status(200).json({ success: true, message: "Đã xóa xe thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
