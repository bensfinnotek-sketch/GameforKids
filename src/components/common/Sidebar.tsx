import React from 'react';
import { 
  Home, 
  BookOpen, 
  Map, 
  Gamepad2, 
  Target, 
  Trophy, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Compass, 
  Flame, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  Crown,
  GraduationCap,
  Settings
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BrandLogo } from './BrandLogo';
import { soundManager } from '../../utils/sound';
import { getLevelInfo } from '../../data/mockData';

export const Sidebar: React.FC = () => {
  const { user, activeTab, setActiveTab, toggleSound, isAuthenticated } = useGame();
  const levelInfo = getLevelInfo(user.xp);

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, emoji: '🏠' },
    { id: 'learn', label: 'Học Toán', icon: BookOpen, emoji: '📚' },
    { id: 'map', label: 'Bản đồ thế giới', icon: Map, emoji: '🗺️' },
    { id: 'games', label: 'Trò chơi', icon: Gamepad2, emoji: '🎮' },
    { id: 'challenges', label: 'Thử thách ngày', icon: Target, emoji: '🎯' },
    { id: 'achievements', label: 'Thành tích', icon: Trophy, emoji: '🏆' },
    { id: 'treasure', label: 'Kho báu', icon: Sparkles, emoji: '🎁' },
    { id: 'pricing', label: 'Gói học VIP', icon: Crown, emoji: '👑' },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, emoji: '👤' },
  ];

  const handleNav = (tabId: string) => {
    soundManager.playClick();
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside 
      aria-label="Thanh điều hướng chính"
      className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r-2 border-sky-100 h-screen sticky top-0 z-30 p-4 justify-between select-none shadow-xs overflow-y-auto"
    >
      <div>
        {/* Logo Top */}
        <div 
          onClick={() => handleNav('home')} 
          className="cursor-pointer mb-5 px-2 py-1"
        >
          <BrandLogo size="md" showText={true} />
        </div>

        {/* Mascot Mini Greeting Pill */}
        <div className="mb-4 bg-gradient-to-r from-amber-50 to-sky-50 border-2 border-amber-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-slate-800 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
            🤠
          </div>
          <div className="leading-tight">
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
              Mini chào {user.name}!
            </span>
            <p className="text-caption font-bold text-slate-700">
              Hôm nay chúng ta cùng học gì nào? 🚀
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1" aria-label="Menu ứng dụng">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`btn-touch-target w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-body-sm transition-all duration-200 group ${
                  isActive
                    ? item.id === 'pricing'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.02]'
                    : item.id === 'pricing'
                    ? 'text-amber-800 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.id === 'pricing' && !isActive && (
                  <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase">
                    Sale
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Special Management Portals */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {!isAuthenticated && (
        {/* Login Page quick link */}
        <button
          onClick={() => handleNav('login')}
          className="btn-touch-target w-full p-2 rounded-xl text-caption font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 flex items-center justify-between border border-sky-200 transition"
        >
          <div className="flex items-center gap-2">
            <span>🔑</span>
            <span>Đăng nhập / Đổi tài khoản</span>
          </div>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded font-bold text-sky-600">Vào học</span>
        </button>

        )}

        {/* Parent, Teacher & Admin Links */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleNav('parent')}
            title="Khu vực phụ huynh"
            className={`btn-touch-target p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center transition border ${
              activeTab === 'parent'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Phụ huynh</span>
          </button>

          <button
            onClick={() => handleNav('teacher')}
            title="Cổng giáo viên"
            className={`btn-touch-target p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center transition border ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span>Giáo viên</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            title="Quản trị hệ thống"
            className={`btn-touch-target p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center transition border ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span>Quản trị</span>
          </button>
        </div>

        {/* Sound toggle & Level indicator */}
        <div className="flex items-center justify-between px-1 pt-1">
          <button
            onClick={toggleSound}
            aria-label={user.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="flex items-center gap-1.5 text-caption font-bold text-slate-500 hover:text-sky-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            {user.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-sky-500" />
                <span>Âm thanh</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Đã tắt</span>
              </>
            )}
          </button>

          <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Cấp {levelInfo.level}
          </span>
        </div>
      </div>
    </aside>
  );
};
