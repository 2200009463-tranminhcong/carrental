// MoMo Payment API Configuration (Sandbox/Test)
export const MOMO_CONFIG = {
  // Thông tin tài khoản MoMo thực của cửa hàng (để hiển thị trong modal nếu cần)
  accountNumber: "0386222083",
  accountName: "TRAN MINH CONG",

  // Thông tin tích hợp API MoMo (sandbox)
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: "MOMO",
  partnerName: "Car Rental System",
  storeId: "MomoTestStore",

  // Endpoints
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",

  // URL callback sau khi thanh toán (client redirect)
  redirectUrl: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/payment-result` : "http://localhost:5173/payment-result",

  // URL nhận IPN (Instant Payment Notification) từ MoMo server
  ipnUrl: process.env.IPN_URL || "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",

  requestType: "payWithMethod",
  lang: "vi",
};
