import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { MapPin } from 'lucide-react'
import { assets } from '../../assets/assets'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom';

const AddCar = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    type: '',
    transmission: '',
    seats: '',
    location: '',
    description: '',
    image: '',
  })

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const adminId = localStorage.getItem('adminUserId');
    if (!adminId) {
      alert("Phiên đăng nhập quản trị đã hết hạn.");
      navigate('/admin');
      return;
    }

    try {
      setLoading(true);

      let imageBase64 = car.image;
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        imageBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }

      const payload = {
        owner: adminId,
        brand: car.brand,
        name: `${car.brand} ${car.model}`,
        type: car.type,
        year: Number(car.year),
        transmission: car.transmission,
        seats: Number(car.seats),
        pricePerDay: Number(car.pricePerDay),
        location: car.location,
        image: imageBase64 || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
        features: ["Bảo hiểm", "Điều hòa"], // Default features
        isAvailable: true
      };

      const response = await api.post('/cars', payload);
      if (response.data.success) {
        alert("Thêm xe thành công!");
        navigate('/owner/manage-cars');
      } else {
        alert("Thêm xe thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi thêm xe:", error);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  }

const [image, setImage] = useState(null)

  return (
    <div className='px-4 py-10 md:px-10 flex-1 text-black bg-white'>
      <Title title="Thêm xe mới"
        subTitle="Điền thông tin chi tiết để đăng xe cho thuê, bao gồm giá, tình trạng sẵn sàng và thông số kỹ thuật của xe." />
      <form onSubmit={onSubmitHandler} className='bg-white flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
        {/* Car Image URL */}
        <div className='flex flex-col w-full'>
          <label className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt=""
              className="h-14 rounded"
            />

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">Lưu ý: Để trống sẽ sử dụng ảnh mặc định.</p>
        </div>

        {/* Hãng xe & Mẫu xe */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700'>Hãng xe</label>
            <input
              type="text"
              placeholder="Ví dụ: BMW, Mercedes, Audi..."
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
              value={car.brand}
              onChange={e => setCar({ ...car, brand: e.target.value })}
            />
          </div>

          <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700'>Dòng xe (Model)</label>
            <input
              type="text"
              placeholder="Ví dụ: X5, E-Class, M4..."
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
              value={car.model}
              onChange={e => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Năm, Giá, Loại xe */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700'>Năm sản xuất</label>
            <input
              type="number"
              placeholder="Ví dụ: 2023"
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
              value={car.year}
              onChange={e => setCar({ ...car, year: e.target.value })}
            />
          </div>

          <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700'>Giá Niêm yết (VNĐ/Ngày)</label>
            <input
              type="number"
              placeholder="Ví dụ: 1000000"
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
              value={car.pricePerDay}
              onChange={e => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>

          <div className='flex flex-col w-full md:col-span-2'>
            <label className='font-medium text-gray-700'>Danh mục xe</label>
            <select
              onChange={e => setCar({ ...car, type: e.target.value })}
              value={car.type}
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'>
              <option value="" disabled>Chọn dòng xe</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Crossover">Crossover</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
        </div>

        {/* Hộp số, Số chỗ ngồi */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700'>Hộp số</label>
            <select
              onChange={e => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
            >
              <option value="" disabled>Chọn hộp số</option>
              <option value="Số tự động">Số tự động</option>
              <option value="Số sàn">Số sàn</option>
            </select>
          </div>

          <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700'>Số chỗ ngồi</label>
            <select
              onChange={e => setCar({ ...car, seats: e.target.value })}
              value={car.seats}
              required
              className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
            >
              <option value="" disabled>Chọn số chỗ</option>
              <option value="2">2 chỗ</option>
              <option value="4">4 chỗ</option>
              <option value="5">5 chỗ</option>
              <option value="7">7 chỗ</option>
              <option value="9">9 chỗ</option>
              <option value="16">16 chỗ</option>
            </select>
          </div>
        </div>

        {/* Địa điểm */}
        <div>
          <label htmlFor="pickup-location" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="inline-block" size={18} />
            <span>Địa điểm nhận xe</span>
          </label>
          <select
            onChange={e => setCar({ ...car, location: e.target.value })}
            value={car.location}
            id="pickup-location"
            required
            className="w-full px-3 py-2 border border-borderColor rounded-md bg-gray-50 outline-none focus:border-blue-500"
          >
            <option value="" disabled>Chọn tỉnh / Thành phố</option>
            <option>Hồ Chí Minh</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
            <option>Nha Trang</option>
            <option>Đà Lạt</option>
            <option>Phú Quốc</option>
            <option>Vũng Tàu</option>
            <option>Huế</option>
            <option>Hội An</option>
            <option>Hạ Long</option>
            <option>Buôn Ma Thuột (Đắk Lắk)</option>
            <option>Pleiku (Gia Lai)</option>
            <option>Kon Tum</option>
          </select>
        </div>

        {/* Mô tả xe */}
        <div className='flex flex-col w-full'>
          <label className='font-medium text-gray-700'>Mô tả</label>
          <textarea
            rows={4}
            placeholder="Ví dụ: Một chiếc xe sang trọng với nội thất rộng rãi và động cơ mạnh mẽ."
            className='bg-gray-50 px-3 py-2 mt-1 border border-borderColor rounded-md outline-none focus:border-blue-500'
            value={car.description}
            onChange={e => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 mt-4 text-white rounded-md font-medium w-max cursor-pointer transition ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Đang xử lý..." : "Đăng xe của bạn"}
        </button>
      </form>
    </div>
  )
}

export default AddCar
