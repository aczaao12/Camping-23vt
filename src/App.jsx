import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Prepare from './components/Prepare';
import Timeline from './components/Timeline';
import Expenses from './components/Expenses';
import AdminExpenses from './components/AdminExpenses';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import bgMobile from './assets/bg-mobile.png';
import bgDesktop from './assets/bg-desktop.png';

gsap.registerPlugin(ScrollTrigger);

// Component cho trang chủ
const Home = () => (
  <>
    <Hero />
    <Prepare />
    <Timeline />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-white overflow-x-hidden relative">

        {/* Background Layer */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Mobile Background: Normal */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: `url(${bgMobile})` }}
          />

          {/* Desktop Background: Rotated 90 degrees */}
          <div className="hidden md:flex items-center justify-center absolute inset-0">
            <div
              className="relative shadow-2xl"
              style={{
                width: '100vh',   // Swap width/height to match screen after rotation
                height: '100vw',
                transform: 'rotate(90deg)',
                backgroundImage: `url(${bgDesktop})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
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
      </div>
    </Router>
  );
}

export default App;
