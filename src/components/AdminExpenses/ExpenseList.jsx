import React from 'react';

const ExpenseList = ({
    filteredList,
    isLoadingList,
    formData,
    handleEdit,
    handleDelete,
    searchTerm,
    setSearchTerm,
    fetchDataList,
    editingRowIndex
}) => {
    return (
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
                        className="w-full px-3 py-1.5 rounded-full border border-blue-200 text-sm focus:ring-2 focus:ring-blue-300 outline-none pl-8 text-blue-700 font-bold"
                    />
                    <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
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
    );
};

export default ExpenseList;
