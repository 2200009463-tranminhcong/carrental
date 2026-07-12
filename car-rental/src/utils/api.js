import axios from "axios";

// Khởi tạo instance của Axios với baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 30000, // 30 giây timeout (Render free tier cần thời gian khởi động)
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

// ---------------------------------------------------------------
// Retry Interceptor — tự động retry khi Render server đang "thức dậy"
// Render free tier có thể mất 30-60 giây để khởi động lại sau khi ngủ
// ---------------------------------------------------------------
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000; // 3 giây giữa mỗi lần retry

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Chỉ retry khi: server chưa phản hồi (network error) hoặc trả về 503/502
    const shouldRetry =
      !error.response || // network error / timeout
      error.response.status === 503 || // Service Unavailable (Render đang wake up)
      error.response.status === 502;   // Bad Gateway

    if (!shouldRetry) return Promise.reject(error);

    // Khởi tạo bộ đếm retry nếu chưa có
    config._retryCount = config._retryCount || 0;

    if (config._retryCount >= MAX_RETRIES) return Promise.reject(error);

    config._retryCount += 1;
    const delay = RETRY_DELAY_MS * config._retryCount; // delay tăng dần: 3s, 6s, 9s...

    console.warn(
      `⏳ Server chưa sẵn sàng, thử lại lần ${config._retryCount}/${MAX_RETRIES} sau ${delay / 1000}s...`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return api(config);
  }
);

export default api;

