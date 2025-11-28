import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Thiết lập scrolled là true nếu cuộn hơn 50px
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        // Dọn dẹp listener khi component bị hủy
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Định nghĩa CSS chung cho cả hai nút
    const commonButtonClasses = `
        px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105
    `;

    // Định nghĩa CSS dựa trên trạng thái cuộn
    const scrolledButtonState = 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm';
    const unscrolledButtonState = 'bg-white text-blue-600 hover:bg-blue-50 shadow-md';

    // Áp dụng CSS cho nút khi cuộn
    const getButtonClass = () => scrolled ? scrolledButtonState : unscrolledButtonState;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-md shadow-md py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link to="/" className="text-2xl font-display font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                    DH23VT
                </Link>

                <div className="flex items-center gap-3">
                    {/* Admin Link (Đã sửa đổi để trông giống nút) */}
                    <Link
                        to="/nhap-lieu"
                        className={`${commonButtonClasses} ${getButtonClass()}`}
                    >
                        🔐 Nhập Liệu
                    </Link>

                    {/* Action Button - Chi Tiêu (Sử dụng lại CSS chung) */}
                    <Link
                        to="/chi-tieu"
                        className={`${commonButtonClasses} ${getButtonClass()}`}
                    >
                        💰 Chi Tiêu
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;