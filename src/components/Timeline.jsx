import React, { useEffect, useState } from 'react';

const timelineData = [
    { time: "05:00", endTime: "05:30", title: "Tập trung, điểm danh CTV, ăn sáng", icon: "🌅" },
    { time: "05:30", endTime: "06:30", title: "Tập trung, phát dụng cụ trại", icon: "⛺" },
    { time: "05:30", endTime: "07:00", title: "Set up sân khấu", icon: "🛠️" },
    { time: "07:00", endTime: "08:30", title: "Nhảy bao bố", icon: "🦘" },
    { time: "08:30", endTime: "09:30", title: "Kéo co", icon: "💪" },
    { time: "09:30", endTime: "10:30", title: "Trò chơi liên hoàn", icon: "🏃" },
    { time: "10:30", endTime: "11:30", title: "Gian hàng ẩm thực", icon: "🍢" },
    { time: "11:30", endTime: "12:00", title: "Nghỉ ngơi", icon: "💤" },
    { time: "12:00", endTime: "16:30", title: "Chạy trạm", icon: "🚩" },
    { time: "17:00", endTime: "18:00", title: "Đón khách mời", icon: "👋" },
    { time: "18:00", endTime: "18:10", title: "VN: Đội văn nghệ Rạng Đông", icon: "💃" },
    { time: "18:10", endTime: "18:30", title: "Khai mạc & Giới thiệu đại biểu", icon: "🎙️" },
    { time: "18:30", endTime: "18:40", title: "Phát biểu của BCN", icon: "🗣️" },
    { time: "18:40", endTime: "18:50", title: "Tri ân đơn vị đồng hành", icon: "💐" },
    { time: "18:50", endTime: "19:50", title: "Thi thời trang tái chế", icon: "👗" },
    { time: "19:50", endTime: "21:15", title: "Phần thi văn nghệ", icon: "🎤" },
    { time: "21:15", endTime: "21:25", title: "VN: Đội xung kích Nhịp Điệu Xanh", icon: "🎸" },
    { time: "21:25", endTime: "21:40", title: "Công bố kết quả", icon: "🏆" },
    { time: "21:40", endTime: "22:20", title: "LOTO Show", icon: "🎰" },
    { time: "22:20", endTime: "22:30", title: "EDM Party", icon: "🎧" },
];

const Timeline = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const checkTime = () => {
            // 1. **LẤY THỜI GIAN HIỆN TẠI**
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            // 2. **GÁN CỨNG THỜI GIAN TEST** (Bỏ comment dòng dưới để thử nghiệm)
            // Ví dụ, bạn muốn test sự kiện "Thi thời trang tái chế" (18:50 - 19:50)
            // let testTime = "19:00";
            //let [testH, testM] = testTime.split(':').map(Number);
            //let currentMinutes = testH * 60 + testM;
            // **[KẾT THÚC SỬA ĐỔI]**   

            // Tìm sự kiện đang diễn ra
            const index = timelineData.findIndex(item => {
                const [startH, startM] = item.time.split(':').map(Number);
                const [endH, endM] = item.endTime ? item.endTime.split(':').map(Number) : [startH + 1, startM]; // Default 1 hour if no end time

                const start = startH * 60 + startM;
                const end = endH * 60 + endM;

                return currentMinutes >= start && currentMinutes < end;
            });

            setActiveIndex(index);
        };

        checkTime();
        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (activeIndex !== null && activeIndex !== -1) {
            const element = document.getElementById(`timeline-item-${activeIndex}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeIndex]);

    return (
        <section className="py-20 px-4 w-full relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 drop-shadow-sm">
                        LỊCH TRÌNH
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
                    <p className="mt-4 text-blue-800 font-medium">Hành trình trải nghiệm đầy thú vị</p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-blue-200 rounded-full"></div>

                    <div className="space-y-8">
                        {timelineData.map((item, index) => {
                            const isActive = index === activeIndex;
                            const isLeft = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    id={`timeline-item-${index}`}
                                    className={`relative flex items-center md:justify-between ${isLeft ? 'md:flex-row-reverse' : ''}`}
                                >

                                    {/* Empty space for opposite side on desktop */}
                                    <div className="hidden md:block w-5/12"></div>

                                    {/* Center Node */}
                                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 flex items-center justify-center z-10">
                                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${isActive ? 'bg-yellow-400 border-yellow-200 scale-150 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'bg-white border-blue-400'}`}></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`ml-12 md:ml-0 w-full md:w-5/12`}>
                                        <div
                                            className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                                                ${isActive
                                                    ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-400 shadow-xl ring-2 ring-yellow-200/50'
                                                    : 'bg-white/60 border-white/60 hover:bg-white/80 shadow-sm'
                                                }
                                            `}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="text-3xl select-none filter drop-shadow-md">{item.icon}</div>
                                                <div className="flex-1">
                                                    <div className={`font-mono text-sm font-bold mb-1 ${isActive ? 'text-blue-900' : 'text-blue-600'}`}>
                                                        {item.time} - {item.endTime}
                                                    </div>
                                                    <h3 className={`text-lg font-bold leading-tight ${isActive ? 'text-blue-900' : 'text-blue-800'}`}>
                                                        {item.title}
                                                    </h3>
                                                    {isActive && (
                                                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full animate-pulse">
                                                            Đang diễn ra
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
