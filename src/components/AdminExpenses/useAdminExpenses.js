import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

const useAdminExpenses = () => {
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

    return {
        isAuthenticated,
        passwordInput,
        setPasswordInput,
        authError,
        handleLogin,
        formData,
        setFormData,
        handleChange,
        handleSubmit,
        isSubmitting,
        editingRowIndex,
        setEditingRowIndex,
        handleCancelEdit,
        status,
        setStatus,
        filteredList,
        isLoadingList,
        handleEdit,
        handleDelete,
        searchTerm,
        setSearchTerm,
        fetchDataList
    };
};

export default useAdminExpenses;
