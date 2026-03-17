"use client";

import React from 'react';

interface LoaderProps {
    show: boolean;
}

export default function Loader({ show }: LoaderProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-colors duration-500 animate-in fade-in duration-500">
            <div className="relative">
                {/* Pulse Rings */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl animate-ping scale-150"></div>
                <div className="absolute inset-0 bg-white/5 rounded-3xl animate-ping scale-200 delay-300"></div>

                {/* Animated Logo */}
                <div className="relative w-24 h-24 bg-[#f5f5f5] rounded-[2rem] flex items-center justify-center text-black font-black text-5xl animate-bounce transition-all duration-1000">
                    F.
                </div>
            </div>

            {/* Loading Text */}
            <div className="mt-10 flex flex-col items-center">
                <h2 className="text-xl font-black text-[#f5f5f5] tracking-[0.3em] uppercase">SYSTEM.INC</h2>
                <div className="flex space-x-2 mt-4">
                    <div className="w-2 h-2 bg-[#888] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#888] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#888] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
            </div>

            <style jsx>{`
        @keyframes loader-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-loader-bounce {
          animation: loader-bounce 1.5s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
}
