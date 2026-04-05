import React from "react";
import { useState } from "react";
import video from "../assets/Video.mp4";
import { Play, X } from "lucide-react";

const VideoSection = () => {
    return (

        <section className="w-full bg-blue-950 py-20 head-reveal">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl text-white font-bold text-center mb-12">
                    Trải nghiệm lái xe 
                    <span className="text-yellow-500 relative ml-2">
                        Đẳng cấp
                    </span>
                </h2>
                <div className="border-4 border-gray-300 relative h-[500px] overflow-hidden rounded-xl shadow-xl">
                    <video autoPlay loop muted controls className="w-full h-full object-cover" >
                        <source src={video} type="video/mp4" />
                    </video>
                </div>
            </div>

        </section>
    )
}
export default VideoSection;