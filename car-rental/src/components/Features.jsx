import React from "react";
import { useState } from "react";
import { Shield, Clock4, CreditCard, MapPin, Headphones, FileBadge,  Users, Zap} from "lucide-react";
import merc from "../assets/merc.png";


const features = [
  {
    title: "Xe được bảo hiểm",
    description: "Tất cả xe đều có bảo hiểm đầy đủ giúp bạn yên tâm khi sử dụng.",
    icon: <Shield className="w-6 h-6 text-white" />,
  },
  {
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn mọi lúc mọi nơi.",
    icon: <Headphones className="w-6 h-6 text-white" />,
  },
  {
    title: "Đặt xe nhanh chóng",
    description: "Quy trình đặt xe đơn giản chỉ trong vài bước.",
    icon: <Clock4 className="w-6 h-6 text-white" />,
  },
  {
    title: "Thanh toán an toàn",
    description: "Nhiều phương thức thanh toán an toàn và tiện lợi.",
    icon: <CreditCard className="w-6 h-6 text-white" />,
  },
  {
    title: "Nhiều địa điểm",
    description: "Dễ dàng nhận và trả xe tại nhiều địa điểm khác nhau.",
    icon: <MapPin className="w-6 h-6 text-white" />,
  },
  {
    title: "Tài xế uy tín",
    description: "Đội ngũ tài xế được xác minh và có nhiều kinh nghiệm.",
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    title: "Dịch vụ nhanh",
    description: "Giao và nhận xe nhanh chóng giúp tiết kiệm thời gian.",
    icon: <Zap className="w-6 h-6 text-white" />,
  },
  {
    title: "Thương hiệu uy tín",
    description: "Được hàng nghìn khách hàng tin tưởng sử dụng.",
    icon: <FileBadge className="w-6 h-6 text-white" />,
  },
];

const Features = () => {
  return (
    
    <section className="py-20 bg-gray-100">
      <div className="flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden reveal-y">

        <div className="text-white">

          <h2 className="text-3xl font-medium">
            Bạn có xe hạng sang không?
          </h2>

          <p className="mt-2">
            Kiếm tiền từ chiếc xe của bạn một cách dễ dàng bằng cách đăng nó lên CarRental.
          </p>

          <p className="max-w-[500px]">
            Chúng tôi lo mọi thứ như bảo hiểm, xác minh tài xế và thanh toán an toàn — 
            để bạn có thể kiếm thu nhập thụ động một cách thoải mái, không lo lắng.
          </p>

         <div className=" rainbow relative z-0 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button className="px-8 text-sm py-3 text-white rounded-full font-medium bg-gray-800">
                Bắt đầu tìm hiểu
            </button>
</div>

        </div>

        <img
          src={merc}
          alt="xe"
          className="w-90 max-h-80 mt-20"
        />

      </div>
      <div className="max-w-6xl mt-9 mx-auto px-4 text-center">

        <h2 className="text-4xl font-bold text-gray-800 mb-4 head-reveal">
          Tại sao chọn CarRental?
        </h2>

        <p className="text-gray-600 mb-12 max-w-2xl mx-auto head-reveal">
          Chúng tôi cam kết mang đến trải nghiệm thuê xe tốt nhất với dịch vụ
          chuyên nghiệp và đội xe chất lượng cao.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition reveal-y"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Features;