import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Combined SVG Icon: Open Book + Compass Ring + Star + Number 5 */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-amber-400 p-1 shadow-md hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Open Book shape */}
          <path
            d="M15 75 Q35 70 50 78 Q65 70 85 75 L85 45 Q65 40 50 48 Q35 40 15 45 Z"
            fill="#FFFFFF"
            stroke="#0369A1"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Book Spine Center Line */}
          <line x1="50" y1="48" x2="50" y2="78" stroke="#0284C7" strokeWidth="3" />

          {/* Compass Outer Ring in center */}
          <circle cx="50" cy="42" r="26" fill="#FEF3C7" stroke="#D97706" strokeWidth="3.5" />
          
          {/* Compass 4 Cardinal ticks */}
          <line x1="50" y1="18" x2="50" y2="23" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="61" x2="50" y2="66" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="42" x2="31" y2="42" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="69" y1="42" x2="74" y2="42" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />

          {/* Golden Star at the top */}
          <polygon
            points="50,19 52,24 57,24 53,27 55,32 50,29 45,32 47,27 43,24 48,24"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="1"
          />

          {/* Stylized Number 5 in center compass */}
          <path
            d="M44 32 L56 32 L55 38 Q50 36 45 40 Q43 45 47 49 Q51 52 56 49 Q58 47 58 44"
            fill="none"
            stroke="#0284C7"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Compass Red Needle Needle */}
          <polygon points="50,28 53,42 47,42" fill="#EF4444" opacity="0.85" />
          <polygon points="50,56 53,42 47,42" fill="#3B82F6" opacity="0.85" />
          <circle cx="50" cy="42" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
        </svg>

        {/* Small sparkling star pill badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-white items-center justify-center">
            ★
          </span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-heading text-lg sm:text-2xl font-black tracking-tight text-sky-600 leading-none">
            Math <span className="text-amber-500">Adventure</span> <span className="text-emerald-500">Kids</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
            Biến mỗi bài Toán thành phiêu lưu! 🧭
          </span>
        </div>
      )}
    </div>
  );
};
