import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Prepare from './components/Prepare';
import Timeline from './components/Timeline';
import Expenses from './components/Expenses';
import AdminExpenses from './components/AdminExpenses/index';
import MusicPlayer from './components/MusicPlayer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import bgMobile from './assets/bg-mobile.png';
import bgDesktop from './assets/bg-desktop.png';
import bgMobileDark from './assets/bg-mobile-dark.png';
import bgDesktopDark from './assets/bg-deskop-dark.png';

gsap.registerPlugin(ScrollTrigger);

// Component cho trang chủ
const Home = ({ isDarkMode }) => (
  <>
    <Hero isDarkMode={isDarkMode} />
    <Prepare />
    <Timeline />
  </>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    // Set dark mode if it's between 6 PM and 6 AM
    setIsDarkMode(hour >= 18 || hour < 6);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className="min-h-screen font-sans text-white overflow-x-hidden relative">

        {/* Background Layer */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-1000">
          {/* Mobile Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden transition-all duration-1000"
            style={{ backgroundImage: `url(${isDarkMode ? bgMobileDark : bgMobile})` }}

          />

          {/* Desktop Background: Rotated for Light Mode only */}
          <div className="hidden md:flex items-center justify-center absolute inset-0 transition-all duration-1000">
            <div
              className="relative shadow-2xl transition-all duration-1000"
              style={{
                width: isDarkMode ? '100vw' : '100vh',
                height: isDarkMode ? '100vh' : '100vw',
                transform: isDarkMode ? 'none' : 'rotate(-90deg)',
                backgroundImage: `url(${isDarkMode ? bgDesktopDark : bgDesktop})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`fixed z-[60] w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 bottom-6 right-6 md:bottom-auto md:top-4 md:right-4 ${!isPlayerMinimized ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}
          title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>

        <Navbar isDarkMode={isDarkMode} />

        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/chi-tieu" element={<Expenses />} />
          <Route path="/nhap-lieu" element={<AdminExpenses />} />
        </Routes>

        <footer className="py-8 text-center border-t border-white/40 bg-white/20 backdrop-blur-md mt-10">
          <p className="text-blue-800 font-bold text-lg mb-2">
            &copy; 2025 DH23VT
          </p>
          <p className="text-blue-600 text-sm font-medium">
            Hội Trại Truyền Thống
          </p>
        </footer>

        <MusicPlayer onMinimizeChange={setIsPlayerMinimized} />
      </div>
    </Router>
  );
}

export default App;
