import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../utils/sound';
import { MascotState } from '../../types';

interface MascotMiniProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  pose?: MascotState;
  className?: string;
  showBubble?: boolean;
}

export const MascotMini: React.FC<MascotMiniProps> = ({
  size = 'md',
  message,
  pose = 'happy',
  className = '',
  showBubble = true,
}) => {
  const [currentPose, setCurrentPose] = useState<MascotState>(pose);
  const [tapCount, setTapCount] = useState(0);
  const [bubbleText, setBubbleText] = useState(
    message || 'Xin chào! Mình là Mini – Nhà thám hiểm Đảo Toán Học!'
  );
  const [isBouncing, setIsBouncing] = useState(false);

  const funMessages = [
    'Mỗi bài toán là một kho báu đang chờ bạn mở khóa! 💎',
    'Bạn siêu thông minh luôn á! Cùng Mini phiêu lưu nhé! ⭐',
    'Mini đã chuẩn bị sẵn ba lô và kính lúp thần kỳ rồi! 🎒',
    'Chạm vào mình để xem tớ đổi biểu cảm vui nhộn nha! ✨',
    'Học chăm chỉ mỗi ngày để nhận thật nhiều Tiền Vàng và Ngọc! 🪙',
  ];

  const posesList: MascotState[] = [
    'happy',
    'excited',
    'celebrating',
    'thinking',
    'pointing',
    'running',
    'confused',
    'sleeping',
  ];

  const handleTap = () => {
    soundManager.playClick();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    setCurrentPose(posesList[nextCount % posesList.length]);
    setBubbleText(funMessages[nextCount % funMessages.length]);
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble */}
      {showBubble && bubbleText && (
        <div className="relative mb-3 max-w-xs bg-white text-slate-800 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-2xl shadow-lg border-2 border-amber-300 animate-in fade-in zoom-in-95 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-0.5 text-[11px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Mini mách bạn:</span>
          </div>
          {bubbleText}
          {/* Arrow indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-amber-300"></div>
        </div>
      )}

      {/* Mascot visual avatar with hat and adventure gear */}
      <div
        onClick={handleTap}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isBouncing ? 'scale-110 rotate-3' : 'hover:scale-105'
        }`}
        title={`Mini (${currentPose}): Chạm vào Mini để trò chuyện & đổi trạng thái!`}
      >
        <div
          className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 p-1 shadow-xl border-4 border-white flex items-center justify-center overflow-hidden`}
        >
          {/* Decorative halo glow */}
          <div className="absolute inset-0 rounded-full bg-amber-400 opacity-25 blur-sm animate-pulse"></div>

          {/* SVG Character Representation of Mini with pose nuances */}
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Safari Adventure Hat Brim */}
            <ellipse cx="80" cy="50" rx="65" ry="16" fill="#D97706" />
            <ellipse cx="80" cy="48" rx="60" ry="13" fill="#F59E0B" />
            
            {/* Safari Hat Crown */}
            <path
              d="M40 50 C40 20, 120 20, 120 50 Z"
              fill="#F59E0B"
            />
            {/* Hat Ribbon */}
            <path
              d="M42 45 Q80 50 118 45 L119 50 Q80 55 41 50 Z"
              fill="#B45309"
            />
            {/* Hat Compass Pin Badge */}
            <circle cx="80" cy="46" r="6" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" />
            <polygon points="80,42 82,46 80,50 78,46" fill="#DC2626" />

            {/* Hair */}
            <path
              d="M48 60 Q38 75 48 85 Q56 70 65 75 Q75 62 85 70 Q95 62 105 75 Q118 68 114 85 Q122 75 112 60 Z"
              fill="#78350F"
            />

            {/* Face */}
            <ellipse cx="80" cy="85" rx="36" ry="32" fill="#FED7AA" />
            
            {/* Rosy Cheeks */}
            <ellipse cx="58" cy="92" rx="7" ry="5" fill="#FDA4AF" opacity="0.8" />
            <ellipse cx="102" cy="92" rx="7" ry="5" fill="#FDA4AF" opacity="0.8" />

            {/* Eyes according to pose */}
            {currentPose === 'sleeping' ? (
              // Sleeping eyes
              <>
                <path d="M60 83 Q65 88 70 83" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                <path d="M90 83 Q95 88 100 83" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                <text x="110" y="70" fill="#3B82F6" fontSize="14" fontWeight="bold">zZ</text>
              </>
            ) : currentPose === 'confused' ? (
              // Confused eyes: one big, one squint
              <>
                <ellipse cx="65" cy="82" rx="6" ry="8" fill="#1E293B" />
                <circle cx="67" cy="80" r="2.5" fill="#FFFFFF" />
                <path d="M90 82 Q95 78 100 82" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                {/* Question mark above */}
                <text x="108" y="70" fill="#F59E0B" fontSize="18" fontWeight="bold">?</text>
              </>
            ) : currentPose === 'celebrating' || currentPose === 'excited' ? (
              // Cheerful star eyes
              <>
                <polygon points="65,77 67,82 72,82 68,85 70,90 65,87 60,90 62,85 58,82 63,82" fill="#1E293B" />
                <circle cx="65" cy="84" r="2" fill="#FFFFFF" />
                <polygon points="95,77 97,82 102,82 98,85 100,90 95,87 90,90 92,85 88,82 93,82" fill="#1E293B" />
                <circle cx="95" cy="84" r="2" fill="#FFFFFF" />
              </>
            ) : (
              // Normal cheerful sparkling eyes
              <>
                <ellipse cx="65" cy="82" rx="5.5" ry="7.5" fill="#1E293B" />
                <circle cx="67" cy="80" r="2.5" fill="#FFFFFF" />
                <circle cx="64" cy="85" r="1.2" fill="#FFFFFF" />

                <ellipse cx="95" cy="82" rx="5.5" ry="7.5" fill="#1E293B" />
                <circle cx="97" cy="80" r="2.5" fill="#FFFFFF" />
                <circle cx="94" cy="85" r="1.2" fill="#FFFFFF" />
              </>
            )}

            {/* Eyebrows */}
            {currentPose === 'thinking' ? (
              <>
                <path d="M58 70 Q65 67 72 70" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M88 74 Q95 72 102 70" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : currentPose === 'confused' ? (
              <>
                <path d="M58 68 Q65 72 72 70" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M88 75 Q95 71 102 73" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M58 72 Q65 69 72 72" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M88 72 Q95 69 102 72" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}

            {/* Mouth */}
            {currentPose === 'thinking' ? (
              <ellipse cx="80" cy="98" rx="4" ry="4" fill="#B91C1C" />
            ) : currentPose === 'sleeping' ? (
              <line x1="75" y1="97" x2="85" y2="97" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <>
                <path
                  d="M71 96 Q80 107 89 96"
                  stroke="#B91C1C"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="#EF4444"
                />
                <path d="M77 96 L83 96 L81 99 L79 99 Z" fill="#FFFFFF" />
              </>
            )}

            {/* Vest & Scarf */}
            <path d="M50 115 L80 128 L110 115 L120 155 L40 155 Z" fill="#0284C7" />
            <path d="M68 114 L80 124 L92 114 L80 135 Z" fill="#EA580C" />
            <path d="M45 125 L65 125 L65 155 L40 155 Z" fill="#0369A1" />
            <path d="M95 125 L115 125 L120 155 L95 155 Z" fill="#0369A1" />

            {/* Golden Magnifying Glass or Pointing Hand */}
            {currentPose === 'pointing' ? (
              <>
                {/* Pointing Finger */}
                <path d="M120 115 L145 95 L142 90 L125 105 Z" fill="#FED7AA" stroke="#D97706" strokeWidth="2" />
                <circle cx="145" cy="92" r="3" fill="#FED7AA" />
              </>
            ) : currentPose === 'running' ? (
              <>
                {/* Action lines */}
                <line x1="20" y1="120" x2="35" y2="120" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="130" x2="30" y2="130" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Normal magnifying glass */}
                <circle cx="125" cy="98" r="13" stroke="#F59E0B" strokeWidth="4" fill="#E0F2FE" fillOpacity="0.6" />
                <line x1="134" y1="107" x2="146" y2="122" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
                <line x1="119" y1="93" x2="126" y2="93" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>

          {/* Floating badge effect */}
          <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 shadow-md border-2 border-white animate-bounce">
            <Heart className="w-3 h-3 fill-white text-white" />
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-700 bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-200">
          Mini Thám Hiểm
        </span>
      </div>
    </div>
  );
};
