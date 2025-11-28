import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

const Expenses = () => {
    const [campFeeData, setCampFeeData] = useState([]);
    const [foodData, setFoodData] = useState([]);
    const [shoppingData, setShoppingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('campFee'); // 'campFee', 'food', 'shopping'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (API_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
                setLoading(false);
                return;
            }

            try {
                // Fetch Trại phí
                const campRes = await fetch(`${API_URL}?sheet=Trại phí`);
                const campJson = await campRes.json();
                if (campJson.status === 'success') setCampFeeData(campJson.data);

                // Fetch Ăn uống
                const foodRes = await fetch(`${API_URL}?sheet=Ăn uống`);
                const foodJson = await foodRes.json();
                if (foodJson.status === 'success') setFoodData(foodJson.data);

                // Fetch Mua sắm
                const shoppingRes = await fetch(`${API_URL}?sheet=Mua sắm`);
                const shoppingJson = await shoppingRes.json();
                if (shoppingJson.status === 'success') setShoppingData(shoppingJson.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Tính tổng
    const calculateTotal = (data, type) => {
        if (type === 'shopping') {
            return data.reduce((sum, item) => sum + (Number(item['Giá tiền']) || 0), 0);
        }
        return data.reduce((sum, item) => sum + (Number(item['Số tiền']) || 0), 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getDataByTab = () => {
        switch (activeTab) {
            case 'campFee': return campFeeData;
            case 'food': return foodData;
            case 'shopping': return shoppingData;
            default: return [];
        }
    };

    const currentData = getDataByTab();

    // Logic lọc dữ liệu theo từ khóa tìm kiếm (Safe String Conversion)
    const filteredData = currentData.filter(item => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        if (activeTab === 'shopping') {
            return String(item['Tên vật phẩm'] || '').toLowerCase().includes(lowerTerm);
        } else {
            return (
                String(item['Họ và tên'] || '').toLowerCase().includes(lowerTerm) ||
                String(item['MSSV'] || '').toLowerCase().includes(lowerTerm)
            );
        }
    });

    if (API_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl max-w-2xl mx-auto shadow-xl">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">⚠️ Chưa cấu hình API</h2>
                    <p className="text-gray-700 mb-4">
                        Vui lòng deploy Google Apps Script và cập nhật URL vào file <code>src/config.js</code>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-center text-blue-600 mb-8 drop-shadow-sm">
                    CÔNG KHAI TÀI CHÍNH
                </h1>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center mb-8 gap-4">
                    <button
                        onClick={() => { setActiveTab('campFee'); setSearchTerm(''); }}
                        className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'campFee'
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white/50 text-blue-600 hover:bg-white/80'
                            }`}
                    >
                        ⛺ Trại Phí
                    </button>
                    <button
                        onClick={() => { setActiveTab('food'); setSearchTerm(''); }}
                        className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'food'
                            ? 'bg-yellow-500 text-blue-900 shadow-lg scale-105'
                            : 'bg-white/50 text-blue-600 hover:bg-white/80'
                            }`}
                    >
                        🍱 Ăn Uống
                    </button>
                    <button
                        onClick={() => { setActiveTab('shopping'); setSearchTerm(''); }}
                        className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'shopping'
                            ? 'bg-green-600 text-white shadow-lg scale-105'
                            : 'bg-white/50 text-green-700 hover:bg-white/80'
                            }`}
                    >
                        🛒 Mua Sắm
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                    {loading ? (
                        <div className="p-10 text-center text-blue-600 font-bold animate-pulse">
                            Đang tải dữ liệu...
                        </div>
                    ) : (
                        <div className="p-6 md:p-8">
                            {/* Summary Card & Search */}
                            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 w-full md:w-auto flex-1 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wider">
                                        {activeTab === 'shopping' ? 'Tổng Chi Mua Sắm' : `Tổng Thu ${activeTab === 'campFee' ? 'Trại Phí' : 'Ăn Uống'}`}
                                    </h3>
                                    <div className="flex justify-between items-end mt-2">
                                        <p className={`text-3xl md:text-4xl font-bold ${activeTab === 'shopping' ? 'text-red-600' : 'text-blue-600'}`}>
                                            {formatCurrency(calculateTotal(currentData, activeTab))}
                                        </p>
                                        <p className="text-gray-600 font-medium">
                                            {activeTab === 'shopping' ? 'Số lượng món:' : 'Số lượng đóng:'} <span className="font-bold text-blue-600">{currentData.length}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Search Input */}
                                <div className="w-full md:w-1/3">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder={activeTab === 'shopping' ? " Tìm tên vật phẩm..." : "Tìm tên hoặc MSSV..."}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            // Thay đổi màu chữ chính thành xanh 700 và font-weight thành font-bold
                                            className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all pl-12 shadow-sm text-blue-700 font-bold"
                                        />
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-700 group-focus-within:text-blue-500 transition-colors">
                                            {/* Màu icon mặc định là xanh 700, khi focus icon sẽ nhạt hơn (xanh 500) */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </span>
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                // Màu nút xóa mặc định là xanh 700, khi hover chuyển sang xanh đậm 900
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-700 hover:text-blue-900 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-blue-100 text-blue-800">
                                            <th className="p-4 font-bold">STT</th>
                                            {activeTab === 'shopping' ? (
                                                <>
                                                    <th className="p-4 font-bold">Tên Vật Phẩm</th>
                                                    <th className="p-4 font-bold text-center">Số Lượng</th>
                                                    <th className="p-4 font-bold text-right">Giá Tiền</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="p-4 font-bold">Họ và Tên</th>
                                                    <th className="p-4 font-bold">MSSV</th>
                                                    <th className="p-4 font-bold text-right">Số Tiền</th>
                                                </>
                                            )}
                                            <th className="p-4 font-bold">Ghi Chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => (
                                            <tr key={index} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                                                <td className="p-4 text-gray-500 font-medium">{index + 1}</td>

                                                {activeTab === 'shopping' ? (
                                                    <>
                                                        <td className="p-4 font-bold text-gray-800">{item['Tên vật phẩm']}</td>
                                                        <td className="p-4 text-center text-gray-600 font-mono">{item['Số lượng']}</td>
                                                        <td className="p-4 text-right font-bold text-red-600">
                                                            {formatCurrency(item['Giá tiền'])}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-4 font-bold text-gray-800">{item['Họ và tên']}</td>
                                                        <td className="p-4 text-gray-600 font-mono">{item['MSSV']}</td>
                                                        <td className="p-4 text-right font-bold text-blue-600">
                                                            {formatCurrency(item['Số tiền'])}
                                                        </td>
                                                    </>
                                                )}

                                                <td className="p-4 text-gray-500 italic text-sm">{item['Ghi chú']}</td>
                                            </tr>
                                        ))}
                                        {filteredData.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                                                    {searchTerm ? 'Không tìm thấy kết quả nào.' : 'Chưa có dữ liệu nào.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
