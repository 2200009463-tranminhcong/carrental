import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Tạo contact mới (người dùng gửi form liên hệ)
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    const savedContact = await newContact.save();
    res.status(201).json({ success: true, data: savedContact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy danh sách liên hệ (Cho Admin)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Đánh dấu đã đọc
router.put("/:id/read", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
