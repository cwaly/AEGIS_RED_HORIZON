import { FC } from 'react';

export const Logo: FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            {/* Parche Táctico Base (Estilo Vanguard) */}
            <circle cx="50" cy="50" r="48" fill="#0b1120" stroke="#1e293b" strokeWidth="2" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite]" />

            {/* Escudo Robusto (Estilo Governance) */}
            <path 
                d="M 25 25 L 50 15 L 75 25 L 75 55 C 75 75 50 85 50 85 C 50 85 25 75 25 55 Z" 
                fill="#0f172a" 
                stroke="#f43f5e" 
                strokeWidth="2" 
            />

            {/* Pilares / Nodos de Infraestructura */}
            <rect x="35" y="45" width="6" height="20" fill="#1e293b" />
            <rect x="59" y="45" width="6" height="20" fill="#1e293b" />
            <circle cx="38" cy="40" r="3" fill="#f43f5e" className="opacity-80" />
            <circle cx="62" cy="40" r="3" fill="#f43f5e" className="opacity-80" />

            {/* Flecha Central "Red Horizon" */}
            <line x1="50" y1="90" x2="50" y2="10" stroke="#f43f5e" strokeWidth="3" />
            <polygon points="50,5 45,15 55,15" fill="#f43f5e" />

            {/* Núcleo de IA Central */}
            <circle cx="50" cy="55" r="8" fill="none" stroke="#e2e8f0" strokeWidth="1.5" className="opacity-50" />
            <circle cx="50" cy="55" r="3" fill="#f43f5e" className="animate-pulse" />
        </svg>
    </div>
  );
};