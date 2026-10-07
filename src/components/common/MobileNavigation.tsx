import React from 'react';
import { Home, BookOpen, Map, Gamepad2, Crown, User } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

export const MobileNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useGame();

  const navs = [
    { id: 'home', label: 'Trang chủ', icon: Home, emoji: '🏠' },
    { id: 'learn', label: 'Học Toán', icon: BookOpen, emoji: '📚' },
    { id: 'map', label: 'Bản đồ', icon: Map, emoji: '🗺️' },
    { id: 'games', label: 'Trò chơi', icon: Gamepad2, emoji: '🎮' },
    { id: 'pricing', label: 'Gói VIP', icon: Crown, emoji: '👑' },
    { id: 'profile', label: 'Hồ sơ', icon: User, emoji: '👤' },
  ];

  const handleSelect = (id: string) => {
    soundManager.playClick();
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Thanh điều hướng di động"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-sky-100 px-1 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-around select-none safe-bottom-padding"
    >
      {navs.map((n) => {
        const Icon = n.icon;
        const isActive = activeTab === n.id;
        const isVip = n.id === 'pricing';

        return (
          <button
            key={n.id}
            onClick={() => handleSelect(n.id)}
            aria-label={n.label}
            className={`btn-touch-target flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all duration-200 ${
              isActive
                ? isVip
                  ? 'text-amber-600 scale-105 font-black'
                  : 'text-sky-600 scale-105 font-black'
                : isVip
                ? 'text-amber-500 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition ${
                isActive
                  ? isVip
                    ? 'bg-amber-100 text-amber-600 shadow-xs ring-1 ring-amber-300'
                    : 'bg-sky-100 text-sky-600 shadow-xs ring-1 ring-sky-300'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-label mt-0.5 tracking-tight">{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
