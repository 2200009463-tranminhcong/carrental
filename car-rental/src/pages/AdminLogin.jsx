import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/owner/Title';
import api from '../utils/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (email === 'admin@gmail.com' && password === '123456') {
            try {
                setLoading(true);
                // Call users/sync to ensure the admin user exists in DB and get their MongoDB ID
                const response = await api.post('/users/sync', {
                    clerkId: 'admin-secret-id', // A fixed dummy ID for the custom admin
                    name: 'Quản Trị Viên',
                    email: 'admin@gmail.com',
                    image: '',
                    role: 'admin' // Force role to admin if your backend supports it or just let backend default to user if it doesn't matter for the frontend right now.
                });

                if (response.data.success) {
                    const adminUser = response.data.data;
                    
                    // Save login state
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    localStorage.setItem('adminUserId', adminUser._id);
                    localStorage.setItem('adminUserData', JSON.stringify(adminUser));

                    navigate('/owner'); // Redirect to dashboard
                } else {
                    alert('Lỗi khởi tạo tài khoản Admin trên hệ thống.');
                }
            } catch (error) {
                console.error('Lỗi khi đăng nhập admin:', error);
                alert('Có lỗi hệ thống.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Thông tin đăng nhập không chính xác!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <Title title="Quản Trị Viên" subTitle="Đăng nhập hệ thống quản lý" />
                
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full px-3 py-2 border rounded-md outline-none focus:border-primary"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full px-3 py-2 border rounded-md outline-none focus:border-primary"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium mt-4 ${loading ? 'bg-blue-300' : 'bg-primary hover:bg-blue-700'}`}
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                    
                    <div className="text-center mt-4">
                        <span 
                            onClick={() => navigate('/')} 
                            className="text-sm text-gray-500 hover:text-primary cursor-pointer underline"
                        >
                            Quay lại trang chủ
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
