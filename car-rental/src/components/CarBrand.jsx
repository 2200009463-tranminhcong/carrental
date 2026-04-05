
import React from "react";
import "./CarBrands.css";

const CarBrand = () => {

  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg"
  ];

  return (
    <div className="py-0 bg-white">
      <div className="marquee-container">
        <div className="marquee-track">

          {[...logos, ...logos].map((src, index) => (
            <div key={index} className="logo-box">
              <img
                src={src}
                alt="car brand"
                className="logo-img"
              />
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default CarBrand;
