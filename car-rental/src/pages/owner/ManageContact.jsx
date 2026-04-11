import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import api from '../../utils/api';
import { Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

const ManageContact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts');
            if (res.data.success) {
                setContacts(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách liên hệ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const markAsRead = async (id) => {
        try {
            const res = await api.put(`/contacts/${id}/read`);
            if (res.data.success) {
                // Update local state
                setContacts(contacts.map(c => c._id === id ? { ...c, isRead: true } : c));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đã đọc:", error);
            alert("Lỗi khi cập nhật trạng thái.");
            }
        };

        if (loading) {
            return <div className="p-10 flex-1 bg-white text-black">Đang tải danh sách liên hệ...</div>;
        }

    return (
        <div className='px-4 py-10 md:px-10 flex-1 text-black bg-white overflow-y-auto'>
            <Title title="Quản lý liên hệ" subTitle="Xem và phản hồi các tin nhắn liên hệ từ khách hàng." />

            <div className='mt-6 space-y-4 max-w-4xl'>
                {contacts.length === 0 ? (
                    <p className="text-gray-500">Chưa có liên hệ nào.</p>
                ) : (
                    contacts.map((contact) => (
                        <div key={contact._id} className={`p-5 rounded-lg border ${contact.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200 shadow-sm'} transition-colors relative`}>
                            
                            {!contact.isRead && (
                                <span className="absolute top-4 right-5 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                            )}

                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="space-y-2 flex-1">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        {contact.firstName} {contact.lastName}
                                        {!contact.isRead && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Mới</span>}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={16} />
                                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600">{contact.email}</a>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={16} />
                                            <a href={`tel:${contact.phone}`} className="hover:text-blue-600">{contact.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} />
                                            <span>{new Date(contact.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-white p-3 md:p-4 rounded border border-gray-100/50 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                        <span className="font-medium text-gray-500 mb-1 block">Nội dung tin nhắn:</span>
                                        {contact.message}
                                    </div>
                                </div>

                                <div className="mt-2 md:mt-0 flex gap-2">
                                    {!contact.isRead && (
                                        <button 
                                            onClick={() => markAsRead(contact._id)}
                                            className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2 bg-white text-sm border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-gray-700 cursor-pointer"
                                        >
                                            <CheckCircle size={16} className="text-green-500" />
                                            Đánh dấu đã xem
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageContact;
