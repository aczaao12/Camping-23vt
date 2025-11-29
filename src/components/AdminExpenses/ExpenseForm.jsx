import React from 'react';

const ExpenseForm = ({
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isSubmitting,
    editingRowIndex,
    handleCancelEdit,
    status,
    setEditingRowIndex,
    setStatus,
    setSearchTerm
}) => {
    return (
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
                            <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-200 outline-none text-blue-700 font-bold" placeholder="Ví dụ: Dây thừng..." />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Số Lượng</label>
                                <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-200 outline-none text-blue-700 font-bold" placeholder="SL..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Giá Tiền</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-200 outline-none text-blue-700 font-bold" placeholder="VNĐ..." />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Họ và Tên</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 outline-none text-blue-700 font-bold" placeholder="Nhập họ tên..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">MSSV</label>
                            <input type="text" name="mssv" value={formData.mssv} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 outline-none text-blue-700 font-bold" placeholder="Nhập MSSV..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Số Tiền</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 outline-none text-blue-700 font-bold" placeholder="VNĐ..." />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Ghi Chú</label>
                    <textarea name="note" value={formData.note} onChange={handleChange} rows="2" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-gray-200 outline-none text-blue-700 font-bold" placeholder="Ghi chú thêm..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-95 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : editingRowIndex ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isSubmitting ? 'Đang xử lý...' : editingRowIndex ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
