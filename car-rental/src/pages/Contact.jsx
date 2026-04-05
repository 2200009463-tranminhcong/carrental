import React, { useState } from 'react'
import api from '../utils/api'

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/contacts', formData)
      if (res.data.success) {
        setShowAlert(true)
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
        setTimeout(() => {
          setShowAlert(false)
        }, 5000)
      } else {
        alert("Gửi liên hệ thất bại: " + res.data.message)
      }
    } catch (error) {
      alert("Đã xảy ra lỗi hệ thống: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
  
    <section class="bg-gradient-to-b from-violet-100 to-[#FFE8E9] text-black flex items-center justify-center py-12 px-4">

        {/* ALERT THÔNG BÁO */}
        {showAlert && (
          <div class="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-3 z-50 shadow-md">
            Cảm ơn bạn đã liên hệ với chúng tôi. Tin nhắn của bạn đã được gửi thành công. 
            Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </div>
        )}

        <div class="grid md:grid-cols-2 md:gap-10 lg:gap-20 max-w-7xl w-full items-center">

            <div class="p-5">
            <h1 class="text-3xl font-semibold text-gray-900 text-center md:text-start mb-3 tracking-tight">
            Liên hệ với chúng tôi
            </h1>

            <p class="text-sm/6 text-gray-600 text-center md:text-start mx-auto md:mx-0 mb-8 leading-relaxed max-w-[400px]">
            Bạn có câu hỏi hoặc ý tưởng? Đội ngũ thân thiện của chúng tôi luôn sẵn sàng kết nối và hỗ trợ bạn.
            </p>

            <form onSubmit={handleSubmit}>

            <div class="grid grid-cols-2 gap-4 mb-5">

            <div>
            <label class="block text-sm text-gray-500 mb-2">Tên</label>
            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nguyễn" class="bg-gray-50 w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"/>
            </div>

            <div>
            <label class="block text-sm text-gray-500 mb-2">Họ</label>
            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Văn A" class="bg-gray-50 w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"/>
            </div>

            </div>

            <div class="mb-5">
            <label class="block text-sm text-gray-500 mb-2">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" class="bg-gray-50 w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"/>
            </div>

            <div class="mb-5">
            <label class="block text-sm text-gray-500 mb-2">Số điện thoại</label>

            <div class="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-indigo-500 transition-colors">

            <select class="px-3 py-3 text-sm outline-none cursor-pointer text-gray-500 bg-white border-r border-gray-300">
            <option>VN</option>
            <option>US</option>
            <option>UK</option>
            <option>CA</option>
            </select>

            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0900 123 456" class="bg-gray-50 flex-1 px-3 py-3 text-sm outline-none"/>

            </div>
            </div>

            <div class="mb-5">
            <label class="block text-sm text-gray-500 mb-2">Tin nhắn</label>
            <textarea required rows="4" name="message" value={formData.message} onChange={handleChange} class="bg-gray-100 w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none resize-y focus:border-indigo-500 transition-colors"></textarea>
            </div>

            <div class="flex items-center gap-2 mb-6">

            <input type="checkbox" class=" w-5 h-5 cursor-pointer accent-indigo-500 rounded-[5px] text-gray-300"/>

            <label class="text-sm text-gray-500 cursor-pointer">
            Bạn đồng ý với <span class="underline">điều khoản</span> và <span class="underline">chính sách bảo mật</span> của chúng tôi.
            </label>

            </div>

            <button disabled={loading} type="submit" class={`w-full py-3.5 bg-blue-600 text-white rounded-lg text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(99,102,241,0.3)] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}>
            {loading ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>

            </form>
            </div>

            <div class="rounded-3xl p-10 relative min-h-[662px] w-full max-w-[520px] hidden md:flex flex-col justify-between overflow-hidden">

            <img src="https://assets.prebuiltui.com/images/components/form/form-rightside-image.png" class="absolute inset-0 w-full h-full object-cover"/>

            <div class="relative z-10 mt-auto">

            <div class="flex justify-end gap-2 items-center">
            <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            </div>

            </div>
            </div>

            </div>
</section>
  )
}

export default Contact
