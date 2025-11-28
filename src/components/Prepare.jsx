import React from 'react';
import bgPrepare from '../assets/bd-prepare.png';

const prepareItems = [
    { icon: '🎒', title: 'Trang phục', desc: 'Thoải mái, năng động' },
    { icon: '💧', title: 'Bình nước', desc: 'Bảo vệ môi trường' },
    { icon: '🔦', title: 'Đèn pin', desc: 'Hoạt động ban đêm' },
    { icon: '🧴', title: 'Cá nhân', desc: 'Thuốc, kem chống muỗi' },
];

const Prepare = () => {
    return (
        <section className="py-16 px-4 w-full">
            <div className="max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-blue-600 mb-4">
                        CẦN CHUẨN BỊ GÌ?
                    </h2>
                    <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-10">

                    {/* Image Display */}
                    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                        <img
                            src={bgPrepare}
                            alt="Prepare Guide"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Grid Layout for Items */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {prepareItems.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-300 group"
                            >
                                <div className="text-5xl mb-4 transform transition-transform group-hover:scale-110">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-blue-700 mb-2 group-hover:text-blue-600">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 font-medium">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Prepare;
