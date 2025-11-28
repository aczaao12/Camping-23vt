import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import bannerImg from '../assets/bannerCEFT.png';
import campingImg from '../assets/camping.png';

const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(heroRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );
    }, []);

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
                    className="
    text-4xl md:text-6xl font-display font-bold 
    text-blue-600 mb-4
    [text-shadow:0_0_10px_rgba(255,255,255,0.9),0_0_20px_rgba(0,0,0,0.8)]
  "
                >
                    HỘI TRẠI TRUYỀN THỐNG
                </h1>



                {/* Main Camping Image */}
                <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                    <img
                        src={campingImg}
                        alt="Camping Scene"
                        className="w-full h-auto object-contain"
                    />
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
