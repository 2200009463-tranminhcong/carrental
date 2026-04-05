import axios from "axios";

// Khởi tạo instance của Axios với baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

export default api;
