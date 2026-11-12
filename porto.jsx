import React, { useState, useEffect } from "react";

export default function Intro({ onIntroFinished }) {
    const [isFadingOut, setIsFadingOut] = useState(false);

  // Fungsi untuk memicu transisi menghilang perlahan
    const handleTriggerFadeOut = () => {
    setIsFadingOut(true);
    // Beri waktu 800ms sesuai durasi animasi fade-out CSS sebelum melebur ke web utama
    setTimeout(() => {
    onIntroFinished();
    }, 800);
};

    return (
    <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F1EFEA] transition-all duration-800 cubic-bezier(0.25, 1, 0.5, 1) ${
        isFadingOut ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
    }`}
    >
      {/* Container Video */}
        <div className="relative w-full max-w-4xl aspect-video px-4">
        <video
          src="/video-intro.mp4" // Ganti dengan path video asli kamu
            autoPlay
            muted
            playsInline
            onEnded={handleTriggerFadeOut}
            className="w-full h-full object-contain"
            />
            </div>

      {/* Tombol Skip Intro Minimalis & Luxury */}
    <button
        onClick={handleTriggerFadeOut}
        className="absolute bottom-10 right-10 text-xs uppercase tracking-widest text-[#1D1D1F]/60 hover:text-[#1D1D1F] transition-colors duration-300 font-mono border-b border-[#1D1D1F]/20 hover:border-[#1D1D1F] pb-1"
    >
        Skip Intro →
        </button>
    </div>
    );
}

import React, { useState, useEffect } from 'react';
import Intro from './components/Intro'; // Sesuaikan path komponen intro kamu
import MainPage from './MainPage'; // Ganti dengan komponen utama web portofoliomu

export default function App() {
    const [showIntro, setShowIntro] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    // Mengecek apakah di sesi browser ini user sudah melihat intro
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro === 'true') {
        setShowIntro(false);
    }
    setIsLoading(false);
}, []);

const handleIntroFinished = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
};

  if (isLoading) return null; // Mencegah kedipan layout saat mengecek sessionStorage

return (
    <>
        {showIntro ? (
        <Intro onIntroFinished={handleIntroFinished} />
    ) : (
        /* Bagian ini akan muncul dengan efek fade-in halus setelah intro selesai */
        <div className="animate-fade-in-up">
        <MainPage />
        </div>
    )}
    </>
    );
}
