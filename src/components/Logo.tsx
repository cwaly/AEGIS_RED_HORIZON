import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <path 
                d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 Z" 
                fill="none" 
                stroke="url(#grad1)" 
                strokeWidth="3"
                className="opacity-80"
                strokeDasharray="100, 20"
            />
            <path 
                d="M50 20 L65 50 L50 90 L35 50 Z" 
                fill="#ef4444" 
                className="opacity-90 animate-pulse"
            />
            <circle cx="50" cy="50" r="5" fill="#ffffff" className="animate-ping" />
        </svg>
    </div>
  );
};