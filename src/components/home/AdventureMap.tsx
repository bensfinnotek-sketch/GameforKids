import React, { useState } from 'react';
import { Compass, Lock, CheckCircle2, Play, Sparkles, MapPin } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

interface Zone {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredCompleted: number;
  unlocked: boolean;
  categoryLink: 'basic' | 'thinking' | 'geometry' | 'logic' | 'olympic';
  color: string;
  position: { x: number; y: number };
}

export const AdventureMap: React.FC = () => {
  const { user, setActiveCategory, setActiveTab } = useGame();
  const [selectedZone, setSelectedZone] = useState<string>('island-numbers');

  const completedCount = user.completedLessons.length;

  const zones: Zone[] = [
    {
      id: 'island-numbers',
      name: 'Đảo Số Học',
      emoji: '🏝️',
      description: 'Nơi khởi đầu của mọi nhà thám hiểm, làm quen cùng các con số rực rỡ.',
      requiredCompleted: 0,
      unlocked: true,
      categoryLink: 'basic',
      color: 'bg-emerald-500',
      position: { x: 12, y: 70 },
    },
    {
      id: 'city-calc',
      name: 'Thành Phố Phép Tính',
      emoji: '🔢',
      description: 'Khu đô thị sầm uất với các tòa tháp cộng trừ nhân chia siêu tốc.',
      requiredCompleted: 2,
      unlocked: completedCount >= 2,
      categoryLink: 'basic',
      color: 'bg-sky-500',
      position: { x: 35, y: 35 },
    },
    {
      id: 'forest-logic',
      name: 'Rừng Logic',
      emoji: '🧩',
      description: 'Khu rừng xanh thẳm ẩn chứa các quy luật bí ẩn và câu đố trí tuệ.',
      requiredCompleted: 4,
      unlocked: completedCount >= 4,
      categoryLink: 'logic',
      color: 'bg-amber-500',
      position: { x: 58, y: 65 },
    },
    {
      id: 'mountain-geometry',
      name: 'Núi Hình Học',
      emoji: '📐',
      description: 'Đỉnh núi cao vút được ghép bởi các lăng kính đa giác tuyệt đẹp.',
      requiredCompleted: 5,
      unlocked: completedCount >= 5,
      categoryLink: 'geometry',
      color: 'bg-indigo-500',
      position: { x: 78, y: 30 },
    },
    {
      id: 'arena-olympic',
      name: 'Đấu Trường Olympic',
      emoji: '🏆',
      description: 'Vũ đài vinh quang nơi các kiện tướng so tài những bài toán đỉnh cao.',
      requiredCompleted: 7,
      unlocked: completedCount >= 7,
      categoryLink: 'olympic',
      color: 'bg-rose-500',
      position: { x: 92, y: 65 },
    },
  ];

  const currentZoneData = zones.find((z) => z.id === selectedZone) || zones[0];

  const handleZoneClick = (z: Zone) => {
    soundManager.playClick();
    setSelectedZone(z.id);
  };

  const handleEnterZone = (z: Zone) => {
    if (!z.unlocked) {
      soundManager.playWrong();
      return;
    }
    soundManager.playCorrect();
    setActiveCategory(z.categoryLink);
    setActiveTab('learn');
  };

  return (
    <section id="adventure-map-section" className="py-12 sm:py-16 bg-gradient-to-b from-[#f7faff] via-sky-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2 shadow-sm">
            <Compass className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '10s' }} />
            Hành trình thám hiểm
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Bản Đồ Phiêu Lưu Đảo Toán Học 🗺️
          </h2>
          <p className="mt-2 text-sm sm:text-base font-bold text-slate-500">
            Chinh phục từng khu vực để mở khóa bí mật kho báu tiếp theo trên bản đồ!
          </p>
        </div>

        {/* The Game Map Canvas Container */}
        <div className="relative bg-gradient-to-br from-sky-200 via-emerald-100 to-amber-100 rounded-3xl p-4 sm:p-8 border-4 border-white shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
          
          {/* Subtle Map Water & Island Background Waves Pattern */}
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Decorative Sea Creatures */}
          <div className="absolute top-12 left-1/4 text-3xl opacity-70 animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>🐬</div>
          <div className="absolute bottom-16 right-1/4 text-4xl opacity-75 animate-bounce pointer-events-none" style={{ animationDuration: '5s' }}>⛵</div>
          <div className="absolute top-20 right-12 text-2xl opacity-60 pointer-events-none">⭐</div>

          {/* Connected SVG Pathways */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path
              d="M 12% 70% Q 25% 45%, 35% 35% T 58% 65% T 78% 30% T 92% 65%"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
              strokeDasharray="10 8"
              className="drop-shadow-sm"
            />
            {/* Highlighted unlocked path segment */}
            <path
              d="M 12% 70% Q 25% 45%, 35% 35%"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeDasharray="10 8"
            />
          </svg>

          {/* Interactive Zone Nodes */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-4 my-auto py-6">
            {zones.map((zone, idx) => {
              const isSelected = selectedZone === zone.id;
              const isUnlocked = zone.unlocked;

              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 group ${
                    isSelected ? 'scale-110 -translate-y-2' : 'hover:scale-105'
                  }`}
                >
                  {/* Pin or mascot icon above active */}
                  {isSelected && (
                    <div className="absolute -top-7 flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md animate-bounce border border-white">
                      <MapPin className="w-3 h-3 text-red-600 fill-red-600" />
                      <span>Mini ở đây!</span>
                    </div>
                  )}

                  {/* Main Zone Node Circle */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center p-2 shadow-xl border-4 transition-all duration-300 ${
                      isUnlocked
                        ? `${isSelected ? 'border-amber-400 ring-4 ring-amber-200' : 'border-white'} ${zone.color} text-white`
                        : 'border-slate-300 bg-slate-300/80 text-slate-500 grayscale'
                    }`}
                  >
                    <div className="relative w-full h-full bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl filter drop-shadow">
                        {zone.emoji}
                      </span>

                      {/* Lock overlay if not unlocked */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-800/60 rounded-2xl flex items-center justify-center text-white">
                          <Lock className="w-6 h-6 text-amber-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Zone Name Label */}
                  <div className="mt-3 text-center">
                    <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800 drop-shadow-sm">
                      {zone.name}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                        Đã mở khóa
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/90 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                        Khóa (Cần {zone.requiredCompleted} bài)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Card for Selected Zone */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl border border-amber-200 flex-shrink-0">
                {currentZoneData.emoji}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-heading font-black text-lg text-slate-800">
                    {currentZoneData.name}
                  </h3>
                  {currentZoneData.unlocked ? (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Sẵn sàng khám phá
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Hoàn thành {currentZoneData.requiredCompleted - completedCount} nhiệm vụ nữa để mở khóa
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500 mt-0.5 max-w-xl">
                  {currentZoneData.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleEnterZone(currentZoneData)}
              disabled={!currentZoneData.unlocked}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 flex-shrink-0 ${
                currentZoneData.unlocked
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{currentZoneData.unlocked ? 'TIẾP TỤC HÀNH TRÌNH' : 'ĐANG KHÓA'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
