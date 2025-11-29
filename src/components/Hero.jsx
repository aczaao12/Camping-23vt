import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import bannerImg from '../assets/bannerCEFT.png';


const Hero = ({ isDarkMode }) => {
    const heroRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        gsap.fromTo(heroRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );
    }, []);

    // Load all images from ../assets/IMG
    const imagesModules = import.meta.glob('../assets/IMG/*.{png,jpg,jpeg,svg}', { eager: true });
    const imageList = Object.values(imagesModules).map((mod) => mod.default);

    // Add the first image to the end for seamless looping
    const extendedList = [...imageList, imageList[0]];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentIndex === extendedList.length - 1) {
            // Wait for the transition to finish, then reset instantly to 0
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 1000); // Match the transition duration (1000ms)
            return () => clearTimeout(timeout);
        } else {
            // Ensure transition is enabled for normal slides
            if (!isTransitioning) {
                // Small delay to allow the DOM to update with transition: none
                const timer = setTimeout(() => {
                    setIsTransitioning(true);
                }, 50);
                return () => clearTimeout(timer);
            }
        }
    }, [currentIndex, isTransitioning, extendedList.length]);

    const trackRef = useRef(null);
    const [sliderHeight, setSliderHeight] = useState('auto');

    useEffect(() => {
        const updateHeight = () => {
            if (trackRef.current && trackRef.current.children[currentIndex]) {
                const height = trackRef.current.children[currentIndex].offsetHeight;
                if (height > 0) setSliderHeight(height);
            }
        };

        // Update height immediately
        updateHeight();

        // Also update on window resize
        window.addEventListener('resize', updateHeight);

        // Small timeout to ensure image render
        const timer = setTimeout(updateHeight, 100);

        return () => {
            window.removeEventListener('resize', updateHeight);
            clearTimeout(timer);
        };
    }, [currentIndex, extendedList]);

    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 md:py-20">
            <div ref={heroRef} className="max-w-6xl mx-auto text-center w-full">

                {/* Top Banner Image */}
                <div className="w-full max-w-3xl mx-auto mb-8">
                    <img
                        src={bannerImg}
                        alt="Banner CEFT"
                        className="w-full h-auto object-contain drop-shadow-lg"
                    />
                </div>

                {/* Text Content */}
                <h1
                    className={`
    text-4xl md:text-6xl font-display font-bold 
    ${isDarkMode ? 'text-[#FFF5C3]' : 'text-blue-600'} mb-4
    [text-shadow:0_0_10px_rgba(255,255,255,0.9),0_0_20px_rgba(0,0,0,0.8)]
  `}
                >
                    HỘI TRẠI TRUYỀN THỐNG
                </h1>

                {/* Main Camping Images Slider */}
                <div
                    className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 transition-[height] duration-500 ease-in-out"
                    style={{ height: sliderHeight !== 'auto' ? `${sliderHeight}px` : 'auto' }}
                >
                    <div
                        ref={trackRef}
                        className="flex items-start"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                            transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
                        }}
                    >
                        {extendedList.map((imgSrc, index) => (
                            <div key={index} className="min-w-full">
                                <img
                                    src={imgSrc}
                                    alt={`Camping Scene ${index}`}
                                    className="w-full h-auto object-contain"
                                    onLoad={() => {
                                        // Trigger height update when image loads
                                        if (index === currentIndex && trackRef.current) {
                                            const height = trackRef.current.children[currentIndex].offsetHeight;
                                            if (height > 0) setSliderHeight(height);
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simple CTA */}
                <button className="mt-10 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
                    Xem Chi Tiết
                </button>

            </div>
        </section>
    );
};

export default Hero;
