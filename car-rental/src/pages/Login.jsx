import React, { use } from "react";
import  { Link } from "react-router-dom";
import { useEffect } from "react";
import { Facebook, Mail, Lock, Instagram, Car } from "lucide-react";

///Scroll reveal
import ScrollReveal from "scrollreveal";

const Login = (setShowLogin) => {

  useEffect(() => {
    ScrollReveal().reveal(".reveal-x-alt", {
      origin: "right",
      distance: "100px",
      duration: 1200,
      easing: "ease-in-out",
      reset: false,
    });
  } , []);
  
  return (
    <div className="py-20 flex flex-col items-center justify-center bg-zinc-100 px-4">
    <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">

  <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
    Chào mừng quay lại
  </h2>

  <form>

    <input
      id="email"
      className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
      type="email"
      placeholder="Nhập email của bạn"
      required
    />

    <input
      id="password"
      className="w-full bg-transparent border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
      type="password"
      placeholder="Nhập mật khẩu của bạn"
      required
    />

    <div className="text-right py-4">
      <a className="text-blue-600 underline" href="#">
        Quên mật khẩu?
      </a>
    </div>

    <button
      type="submit"
      className="w-full mb-3 bg-indigo-500 py-2.5 rounded-full text-white"
    >
      Đăng nhập
    </button>

  </form>

  <p className="text-center mt-4">
    Chưa có tài khoản?
    <a href="/register" className="text-blue-500 underline ml-1">
      Đăng ký
    </a>
  </p>

  <button
    type="button"
    className="w-full flex items-center gap-2 justify-center mt-5 bg-black py-2.5 rounded-full text-white"
  >
    <img
      className="h-4 w-4"
      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png"
      alt="appleLogo"
    />
    Đăng nhập với Apple
  </button>

  <button
    type="button"
    className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
  >
    <img
      className="h-4 w-4"
      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
      alt="googleFavicon"
        />
      Đăng nhập với Google
    </button>
  </div>
</div>
  )
}
export default Login;