import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Gallery = () => {
    const [stopScroll, setStopScroll] = useState(false);
    
    // Dữ liệu hình ảnh và thông tin xe
    const cardData = [
        {
            title: "Trải Nghiệm Thượng Lưu",
            image: assets.car_image1,
        },
        {
            title: "Thiết Kế Tinh Tế",
            image: assets.car_image2,
        },
        {
            title: "Chinh Phục Địa Hình",
            image: assets.car_image3,
        },
        {
            title: "Di Chuyển Linh Hoạt",
            image: assets.car_image4,
        },
        {
            title: "Phong Cách Quý Phái",
            image: assets.main_car,
        },
        {
            title: "Dẫn Đầu Xu Hướng",
            image: assets.banner_car_image,
        }
    ];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
            
            <div className="text-center mb-10 px-4">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Thư Viện Xe</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Ngắm nhìn bộ sưu tập các dòng xe phong phú và hiện đại nhất, sẵn sàng đồng hành cùng bạn trên mọi nẻo đường.
                </p>
            </div>

            <div className="overflow-hidden w-full relative max-w-7xl mx-auto mt-6" 
                 onMouseEnter={() => setStopScroll(true)} 
                 onMouseLeave={() => setStopScroll(false)}>
                 
                {/* Fade overlays */}
                <div className="absolute left-0 top-0 h-full w-20 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
                
                <div className="marquee-inner flex w-fit" 
                     style={{ 
                         animationPlayState: stopScroll ? "paused" : "running", 
                         animationDuration: cardData.length * 3000 + "ms" 
                     }}>
                    <div className="flex">
                        {[...cardData, ...cardData].map((card, index) => (
                            <div key={index} className="w-64 sm:w-80 mx-3 h-[18rem] sm:h-[22rem] relative group hover:scale-[0.98] transition-transform duration-300 rounded-2xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0">
                                <img src={card.image} alt={card.title} className="w-full h-full object-cover bg-gray-100" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
                                    <p className="text-white text-xl font-bold text-center drop-shadow-lg tracking-wide uppercase">{card.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="absolute right-0 top-0 h-full w-20 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            </div>
        </section>
    );
};

export default Gallery;
