import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const AdminExpenses = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');

    // Data State
    const [dataList, setDataList] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Search State

    // Form State
    const [formData, setFormData] = useState({
        name: '', mssv: '', amount: '', itemName: '', quantity: '', note: '', type: 'Trại phí'
    });
    const [editingRowIndex, setEditingRowIndex] = useState(null); // Nếu có giá trị => Đang sửa
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check session
    useEffect(() => {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    // Fetch data khi type thay đổi hoặc sau khi submit thành công
    useEffect(() => {
        if (isAuthenticated && API_URL !== 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
            fetchDataList();
        }
    }, [isAuthenticated, formData.type]);

    const fetchDataList = async () => {
        setIsLoadingList(true);
        try {
            const res = await fetch(`${API_URL}?sheet=${encodeURIComponent(formData.type)}`);
            const json = await res.json();
            if (json.status === 'success') {
                // Đảo ngược mảng để thấy cái mới nhất lên đầu
                setDataList(json.data.reverse());
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoadingList(false);
        }
    };

    // Filter Logic (Safe String Conversion)
    const filteredList = dataList.filter(item => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        if (formData.type === 'Mua sắm') {
            return String(item['Tên vật phẩm'] || '').toLowerCase().includes(lowerTerm);
        } else {
            return (
                String(item['Họ và tên'] || '').toLowerCase().includes(lowerTerm) ||
                String(item['MSSV'] || '').toLowerCase().includes(lowerTerm)
            );
        }
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === 'DH23VT2025') {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_auth', 'true');
            setAuthError('');
        } else {
            setAuthError('Mật khẩu không đúng!');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (item) => {
        setEditingRowIndex(item._rowIndex);
        // Fill form based on type
        if (formData.type === 'Mua sắm') {
            setFormData({
                ...formData,
                itemName: item['Tên vật phẩm'],
                quantity: item['Số lượng'],
                amount: item['Giá tiền'],
                note: item['Ghi chú']
            });
        } else {
            setFormData({
                ...formData,
                name: item['Họ và tên'],
                mssv: item['MSSV'],
                amount: item['Số tiền'],
                note: item['Ghi chú']
            });
        }
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStatus({ type: 'info', msg: `Đang sửa dòng #${item._rowIndex}` });
    };

    const handleCancelEdit = () => {
        setEditingRowIndex(null);
        setFormData({ ...formData, name: '', mssv: '', amount: '', itemName: '', quantity: '', note: '' });
        setStatus({ type: '', msg: '' });
    };

    const handleDelete = async (rowIndex) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa dòng này không?')) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}?sheet=${encodeURIComponent(formData.type)}&action=delete&rowIndex=${rowIndex}`, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({})
            });
            const result = await res.json();
            if (result.status === 'success') {
                setStatus({ type: 'success', msg: 'Đã xóa thành công!' });
                fetchDataList();
            } else {
                setStatus({ type: 'error', msg: result.message });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Lỗi xóa: ' + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (API_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
            setStatus({ type: 'error', msg: 'Chưa cấu hình API URL!' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            let payload = {};
            if (formData.type === 'Mua sắm') {
                payload = { 'Tên vật phẩm': formData.itemName, 'Số lượng': formData.quantity, 'Giá tiền': formData.amount, 'Ghi chú': formData.note };
            } else {
                payload = { 'Họ và tên': formData.name, 'MSSV': formData.mssv, 'Số tiền': formData.amount, 'Ghi chú': formData.note };
            }

            // Determine Action
            const action = editingRowIndex ? 'edit' : 'add';
            const rowIndexParam = editingRowIndex ? `&rowIndex=${editingRowIndex}` : '';

            const response = await fetch(`${API_URL}?sheet=${encodeURIComponent(formData.type)}&action=${action}${rowIndexParam}`, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'success') {
                setStatus({ type: 'success', msg: editingRowIndex ? 'Cập nhật thành công!' : 'Thêm mới thành công!' });
                setFormData({ ...formData, name: '', mssv: '', amount: '', itemName: '', quantity: '', note: '' });
                setEditingRowIndex(null);
                fetchDataList(); // Refresh list
            } else {
                setStatus({ type: 'error', msg: result.message || 'Có lỗi xảy ra.' });
            }

        } catch (error) {
            setStatus({ type: 'error', msg: 'Lỗi kết nối: ' + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 pb-10 px-4 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">🔒 Khu Vực Quản Trị</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            // CẬP NHẬT: Thêm class màu chữ và độ đậm tại đây
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-blue-700 font-bold"
                            placeholder="Mật khẩu..."
                            autoFocus
                        />
                        {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
                        >
                            Truy Cập
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Form - Sticky on Desktop */}
                <div className="lg:col-span-1 lg:sticky lg:top-24 z-10">
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-blue-800">{editingRowIndex ? '✏️ Sửa Dữ Liệu' : '📝 Thêm Mới'}</h2>
                            {editingRowIndex && (
                                <button onClick={handleCancelEdit} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition-colors">Hủy</button>
                            )}
                        </div>

                        {status.msg && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-bold text-center break-words ${status.type === 'success' ? 'bg-green-100 text-green-700' : status.type === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Type Selector */}
                            <div className="grid grid-cols-3 gap-1">
                                {['Trại phí', 'Ăn uống', 'Mua sắm'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, type });
                                            setEditingRowIndex(null);
                                            setStatus({ type: '', msg: '' });
                                            setSearchTerm('');
                                        }}
                                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === type ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Fields */}
                            {formData.type === 'Mua sắm' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Tên Vật Phẩm</label>
                                        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-200 outline-none" placeholder="Ví dụ: Dây thừng..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Số Lượng</label>
                                            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-200 outline-none" placeholder="SL..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Giá Tiền</label>
                                            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-200 outline-none" placeholder="VNĐ..." />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Họ và Tên</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Nhập họ tên..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">MSSV</label>
                                        <input type="text" name="mssv" value={formData.mssv} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Nhập MSSV..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Số Tiền</label>
                                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 outline-none" placeholder="VNĐ..." />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Ghi Chú</label>
                                <textarea name="note" value={formData.note} onChange={handleChange} rows="2" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-gray-200 outline-none" placeholder="Ghi chú thêm..."></textarea>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-95 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : editingRowIndex ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {isSubmitting ? 'Đang xử lý...' : editingRowIndex ? 'Cập Nhật' : 'Thêm Mới'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Data List */}
                <div className="lg:col-span-2 w-full">
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/50 flex flex-col h-[600px]">
                        <div className="p-4 bg-blue-50/80 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10 backdrop-blur-sm gap-3">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <h3 className="font-bold text-blue-800 flex items-center gap-2 whitespace-nowrap">
                                    📂 Danh Sách
                                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">{filteredList.length}</span>
                                </h3>
                                <button onClick={fetchDataList} className="text-sm text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors" title="Làm mới">🔄</button>
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    // CẬP NHẬT: Thêm màu chữ và độ đậm cho văn bản đang nhập
                                    className="w-full px-3 py-1.5 rounded-full border border-blue-200 text-sm focus:ring-2 focus:ring-blue-300 outline-none pl-8 text-blue-700 font-semibold"
                                />
                                {/* Màu icon mặc định (🔍) được giữ nguyên, nhưng có thể đổi nếu muốn */}
                                <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        // CẬP NHẬT: Đổi màu nút xóa thành xanh và hover thành xanh đậm
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-700 hover:text-blue-900"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-auto flex-1">
                            {isLoadingList ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <p>Đang tải dữ liệu...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm relative">
                                    <thead className="bg-gray-50 sticky top-0 z-0 shadow-sm">
                                        <tr>
                                            <th className="p-3 font-bold text-gray-600 w-10">#</th>
                                            {formData.type === 'Mua sắm' ? (
                                                <>
                                                    <th className="p-3 font-bold text-gray-600">Vật Phẩm</th>
                                                    <th className="p-3 font-bold text-gray-600 w-16 text-center">SL</th>
                                                    <th className="p-3 font-bold text-gray-600 text-right w-24">Giá</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="p-3 font-bold text-gray-600">Tên</th>
                                                    <th className="p-3 font-bold text-gray-600 w-24">MSSV</th>
                                                    <th className="p-3 font-bold text-gray-600 text-right w-24">Tiền</th>
                                                </>
                                            )}
                                            <th className="p-3 font-bold text-gray-600 text-center w-20">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredList.map((item, idx) => (
                                            <tr key={idx} className={`hover:bg-blue-50 transition-colors group ${editingRowIndex === item._rowIndex ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}>
                                                <td className="p-3 text-gray-400 text-xs">{item._rowIndex}</td>
                                                {formData.type === 'Mua sắm' ? (
                                                    <>
                                                        <td className="p-3 font-medium text-gray-800">{item['Tên vật phẩm']}</td>
                                                        <td className="p-3 text-center text-gray-600">{item['Số lượng']}</td>
                                                        <td className="p-3 text-right font-mono text-red-600 font-bold">{parseInt(item['Giá tiền']).toLocaleString()}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-3 font-medium text-gray-800">{item['Họ và tên']}</td>
                                                        <td className="p-3 text-gray-500 text-xs">{item['MSSV']}</td>
                                                        <td className="p-3 text-right font-mono text-blue-600 font-bold">{parseInt(item['Số tiền']).toLocaleString()}</td>
                                                    </>
                                                )}
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(item)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Sửa">✏️</button>
                                                        <button onClick={() => handleDelete(item._rowIndex)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Xóa">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredList.length === 0 && (
                                            <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">
                                                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu nào'}
                                            </td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminExpenses;
