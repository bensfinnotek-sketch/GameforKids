import React from 'react';
import { Sparkles } from 'lucide-react';

interface MascotBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  bubbleMessage?: string;
}

export const MascotBadge: React.FC<MascotBadgeProps> = ({
  className = '',
  size = 'md',
  bubbleMessage,
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-22 sm:h-22',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* Optional Speech Bubble */}
      {bubbleMessage && (
        <div className="mb-2 bg-gradient-to-r from-amber-50 to-amber-100/90 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-2xl text-[11px] font-black shadow-xs flex items-center gap-1.5 animate-bounce motion-reduce:animate-none">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
          <span>{bubbleMessage}</span>
        </div>
      )}

      {/* Outer Ring & Avatar Container */}
      <div className="relative group">
        
        {/* Glow halo */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-amber-300 opacity-60 blur-xs group-hover:opacity-100 transition-opacity" />

        {/* Circular Avatar */}
        <div className={`${sizeClasses[size]} relative rounded-full p-1 bg-white ring-4 ring-amber-300/80 shadow-lg overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
          <img
            src="/src/assets/images/mini_mascot_avatar_1791350392100.jpg"
            alt="Mascot Bé Thám Hiểm Mini"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Star Badge on top right */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white text-[11px] font-black shadow-sm">
          ★
        </div>
      </div>

    </div>
  );
};
