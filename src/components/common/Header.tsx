import React, { useState } from 'react';
import { 
  Bell, 
  Flame, 
  Coins, 
  Gem, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  UserCheck, 
  Sparkles,
  Check,
  CheckCheck,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BrandLogo } from './BrandLogo';
import { getLevelInfo } from '../../data/mockData';
import { soundManager } from '../../utils/sound';

export const Header: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { user, activeTab, setActiveTab, toggleSound, markAllNotificationsRead, logout } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('math-adventure-theme') === 'dark'; } catch { return false; }
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    try { localStorage.setItem('math-adventure-theme', darkMode ? 'dark' : 'light'); } catch { /* private browsing */ }
  }, [darkMode]);

  const levelInfo = getLevelInfo(user.xp);
  const unreadCount = user.notifications.filter((n) => !n.isRead).length;

  const handleNav = (tabId: string) => {
    soundManager.playClick();
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', emoji: '🏠' },
    { id: 'learn', label: 'Học Toán', emoji: '📚' },
    { id: 'map', label: 'Bản đồ', emoji: '🗺️' },
    { id: 'games', label: 'Trò chơi', emoji: '🎮' },
    { id: 'challenges', label: 'Thử thách', emoji: '🎯' },
    { id: 'achievements', label: 'Thành tích', emoji: '🏆' },
    { id: 'treasure', label: 'Kho báu', emoji: '🎁' },
    { id: 'pricing', label: 'Gói VIP', emoji: '👑' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-sky-100 shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo (visible on mobile / when sidebar is hidden) */}
          <div 
            onClick={() => handleNav('home')}
            className="cursor-pointer"
          >
            <BrandLogo size="md" showText={true} />
          </div>

          {/* Desktop Nav Items (visible on non-sidebar views or xl screens) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-black text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.03]'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-white/80'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Stats & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Currency Counters */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Streak */}
              <div 
                title={`${user.streak} ngày học liên tiếp`}
                onClick={() => handleNav('challenges')}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 px-3 py-1.5 rounded-full text-rose-600 text-xs font-black cursor-pointer shadow-xs transition"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>{user.streak} ngày</span>
              </div>

              {/* XP */}
              <div 
                title="Điểm kinh nghiệm"
                onClick={() => handleNav('achievements')}
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 px-3 py-1.5 rounded-full text-amber-700 text-xs font-black cursor-pointer shadow-xs transition"
              >
                <span className="text-sm">⭐</span>
                <span>{user.xp} XP</span>
              </div>

              {/* Coins */}
              <div 
                title="Tiền vàng thám hiểm"
                onClick={() => handleNav('treasure')}
                className="flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100/80 border border-yellow-200 px-3 py-1.5 rounded-full text-yellow-800 text-xs font-black cursor-pointer shadow-xs transition"
              >
                <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>{user.coin}</span>
              </div>

              {/* Gems */}
              <div 
                title="Ngọc quý bí ẩn"
                onClick={() => handleNav('treasure')}
                className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 px-3 py-1.5 rounded-full text-purple-700 text-xs font-black cursor-pointer shadow-xs transition"
              >
                <Gem className="w-4 h-4 text-purple-500" />
                <span>{user.gem}</span>
              </div>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setNotificationsOpen(!notificationsOpen);
                }}
                aria-label="Thông báo"
                className="relative p-2 rounded-2xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition border border-slate-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-sky-100 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-slate-800">
                        Thông Báo Mới 🔔
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-bold text-sky-600 hover:underline"
                      >
                        Đã đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {user.notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6">
                        Chưa có thông báo nào mới!
                      </p>
                    ) : (
                      user.notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                            n.isRead ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-sky-50/70 border-sky-200'
                          }`}
                        >
                          <span className="text-2xl flex-shrink-0">{n.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-xs text-slate-800">{n.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                            <span className="text-[9px] font-bold text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Light / Dark appearance */}
            <button
              onClick={() => setDarkMode((value) => !value)}
              aria-label={darkMode ? 'Bật chế độ sáng' : 'Bật chế độ tối'}
              title={darkMode ? 'Chế độ tối — nhấn để chuyển sang sáng' : 'Chế độ sáng — nhấn để chuyển sang tối'}
              className="p-2 rounded-2xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition border border-slate-200"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              aria-label={user.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className="p-2 rounded-2xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition border border-slate-200"
              title={user.soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
            >
              {user.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-sky-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Login Link button for quick access to /login */}
            <button
              onClick={() => handleNav('login')}
              className="btn-touch-target hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-caption font-extrabold border border-sky-200 transition cursor-pointer"
              title="Đăng nhập tài khoản Math Adventure Kids"
            >
              <span>Đăng nhập</span>
            </button>

            {/* Secure Logout */}
            <button
              onClick={async () => {
                soundManager.playClick();
                await logout();
              }}
              className="hidden md:flex btn-touch-target items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-caption font-extrabold border border-rose-200 transition cursor-pointer"
              title="Đăng xuất an toàn"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>

            {/* Avatar & User Mini Pill */}
            <button
              onClick={() => handleNav('profile')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl shadow-sm hover:shadow transition group"
            >
              <div className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center text-lg shadow-inner">
                {user.avatarEmoji}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-black leading-tight">
                  Lv.{levelInfo.level} • {user.name}
                </div>
                <div className="text-[10px] font-semibold text-amber-100">
                  {user.xp} XP
                </div>
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-2xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-sky-100 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2">
          {/* Quick Mobile Wallet Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4 bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Streak</span>
              <span className="text-xs font-black text-rose-500">🔥 {user.streak}d</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">XP</span>
              <span className="text-xs font-black text-amber-600">⭐ {user.xp}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Vàng</span>
              <span className="text-xs font-black text-yellow-600">🪙 {user.coin}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Ngọc</span>
              <span className="text-xs font-black text-purple-600">💎 {user.gem}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl font-black text-xs text-left transition ${
                    isActive 
                      ? 'bg-sky-500 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => handleNav('profile')}
              className="btn-touch-target w-full text-caption font-bold text-sky-800 bg-sky-100/80 px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-2 border border-sky-200"
            >
              <span>👤 Hồ sơ & bảo mật tài khoản</span>
            </button>
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                soundManager.playClick();
                await logout();
              }}
              className="btn-touch-target w-full text-caption font-extrabold text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-2 border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="btn-touch-target text-caption font-bold text-sky-700 bg-sky-50 px-3.5 py-2 rounded-xl flex items-center gap-1.5"
              >
                👤 Đổi tài khoản
              </button>
              <button
                onClick={() => handleNav('parent')}
                className="btn-touch-target text-caption font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200"
              >
                👨‍👩‍👧 Phụ huynh
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNav('teacher')}
                className="btn-touch-target text-caption font-bold text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-200 text-center"
              >
                👩‍🏫 Giáo viên
              </button>
              <button
                onClick={() => handleNav('admin')}
                className="btn-touch-target text-caption font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-center"
              >
                ⚙️ Quản trị hệ thống
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
