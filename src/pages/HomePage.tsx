import React from 'react';
import { 
  Flame, 
  Star, 
  Trophy, 
  Gem, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Gamepad2, 
  Target 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Hero } from '../components/home/Hero';
import { MascotMini } from '../components/common/MascotMini';
import { AgeSelector } from '../components/home/AgeSelector';
import { soundManager } from '../utils/sound';
import { getLevelInfo } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { 
    user, 
    setActiveTab, 
    lessons, 
    setActiveLesson, 
    badges, 
    worlds, 
    setActiveCategory 
  } = useGame();

  const levelInfo = getLevelInfo(user.xp);

  const handleContinueLearning = () => {
    soundManager.playCorrect();
    const targetLesson = lessons.find((l) => l.id === 'lesson-5') || lessons[0];
    setActiveLesson(targetLesson);
    setActiveTab('learn');
  };

  const handleParentCTA = () => {
    soundManager.playClick();
    setActiveTab('parent');
  };

  return (
    <div className="space-y-12 select-none">
      {/* 1. HERO SECTION */}
      <Hero onExploreMap={() => setActiveTab('map')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 2. QUICK STATS (4 CARDS) */}
        <section aria-label="Thống kê nhanh">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Streak */}
            <div 
              onClick={() => setActiveTab('challenges')}
              className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🔥
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-slate-800 leading-none block">
                  {user.streak} ngày
                </span>
                <span className="text-xs font-bold text-slate-400 mt-1 block">
                  Liên tiếp học tập
                </span>
              </div>
            </div>

            {/* Card 2: XP */}
            <div 
              onClick={() => setActiveTab('achievements')}
              className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                ⭐
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-amber-600 leading-none block">
                  {user.xp} XP
                </span>
                <span className="text-xs font-bold text-slate-400 mt-1 block">
                  Cấp {levelInfo.level} ({levelInfo.title})
                </span>
              </div>
            </div>

            {/* Card 3: Badges */}
            <div 
              onClick={() => setActiveTab('achievements')}
              className="bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-purple-700 leading-none block">
                  {user.unlockedBadges.length} huy hiệu
                </span>
                <span className="text-xs font-bold text-slate-400 mt-1 block">
                  Đã sưu tầm
                </span>
              </div>
            </div>

            {/* Card 4: Gems */}
            <div 
              onClick={() => setActiveTab('treasure')}
              className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                💎
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-sky-700 leading-none block">
                  {user.gem} Gem
                </span>
                <span className="text-xs font-bold text-slate-400 mt-1 block">
                  {user.coin} Tiền Vàng
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 & 4. CONTINUE LEARNING + TODAY'S MISSION (GRID) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card Lớn: TIẾP TỤC HÀNH TRÌNH */}
          <div className="lg:col-span-7 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Tiếp tục hành trình
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Cộng trong phạm vi 20 🎒
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-sky-100 max-w-md">
                Chinh phục câu đố đếm chú cá và giải phóng rương báu bí mật cùng Mini thám hiểm!
              </p>

              {/* Progress bar 70% */}
              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex justify-between text-xs font-black text-sky-100">
                  <span>Tiến độ bài học</span>
                  <span>70% hoàn thành</span>
                </div>
                <div className="w-full bg-black/25 rounded-full h-3 p-0.5 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <span className="text-xs font-black text-amber-200">
                ⭐ Thưởng: +50 XP • +10 Gem
              </span>
              <button
                onClick={handleContinueLearning}
                className="px-6 py-3.5 rounded-2xl font-black text-sm text-sky-900 bg-white hover:bg-amber-50 shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                <span>HỌC TIẾP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card: NHIỆM VỤ HÔM NAY */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-heading font-black text-lg text-slate-800">
                    Nhiệm Vụ Hôm Nay
                  </h3>
                </div>
                <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  +100 XP • +20 Gem
                </span>
              </div>

              {/* Checkboxes List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="line-through text-slate-400">Hoàn thành 3 bài toán</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-md border-2 border-slate-300 flex-shrink-0"></div>
                  <span>Chơi 1 mini game toán học</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-md border-2 border-slate-300 flex-shrink-0"></div>
                  <span>Đạt 80% chính xác trong quiz</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('challenges')}
              className="mt-6 w-full py-3 px-4 rounded-2xl font-black text-xs text-amber-800 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 transition text-center"
            >
              XEM TOÀN BỘ NHIỆM VỤ (5) ➔
            </button>
          </div>

        </section>

        {/* 5. EXPLORE WORLD (BẢN ĐỒ THẾ GIỚI 6 VÙNG) */}
        <section aria-label="Khám phá bản đồ thế giới">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Thế giới phiêu lưu
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800">
                Bản Đồ 6 Vùng Đất Kỳ Thú 🗺️
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('map')}
              className="font-black text-xs sm:text-sm text-sky-600 hover:text-sky-700 bg-white px-4 py-2 rounded-2xl border border-sky-200 shadow-xs flex items-center gap-1.5 transition"
            >
              <span>Mở bản đồ lớn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {worlds.map((w) => {
              const isUnlocked = w.isUnlocked || user.xp >= w.requiredXp;
              return (
                <div
                  key={w.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('map');
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-between ${
                    isUnlocked
                      ? 'bg-white border-sky-100 hover:border-sky-400 shadow-xs hover:shadow-lg hover:-translate-y-1'
                      : 'bg-slate-100/70 border-slate-200 opacity-60 grayscale'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-100 to-amber-100 flex items-center justify-center text-3xl mb-2 shadow-xs">
                    {w.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-xs text-slate-800 line-clamp-1">
                      {w.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                      {isUnlocked ? 'Đang mở' : `Khóa (Cần ${w.requiredXp} XP)`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. DAILY CHALLENGE NỔI BẬT */}
        <section className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-md border border-white/30 flex-shrink-0 animate-bounce">
              ⚡
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-100 tracking-wider block">
                Thử Thách Nổi Bật Hôm Nay
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                "Đánh bại 10 phép tính trong 60 giây!"
              </h3>
              <p className="text-xs font-bold text-amber-100 mt-0.5">
                Rèn luyện khả năng tính nhẩm chớp nhoáng nhận ngay +150 XP và Tiền Vàng!
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('games')}
            className="w-full md:w-auto px-7 py-3.5 rounded-2xl font-black text-amber-950 bg-white hover:bg-amber-50 shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 flex-shrink-0 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CHƠI NGAY (60s)</span>
          </button>
        </section>

        {/* 7. ACHIEVEMENTS (4 BADGE GẦN NHẤT) */}
        <section aria-label="Huy hiệu gần đây">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading font-black text-xl text-slate-800">
                Huy Hiệu Mới Đạt Được 🏅
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                Vinh danh tinh thần học hỏi không ngừng
              </p>
            </div>
            <button
              onClick={() => setActiveTab('achievements')}
              className="text-xs font-black text-purple-600 hover:underline"
            >
              Xem tất cả ({badges.length}) ➔
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.slice(0, 4).map((badge) => {
              const isUnlocked = user.unlockedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  onClick={() => setActiveTab('achievements')}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                    isUnlocked
                      ? 'bg-white border-amber-200 shadow-xs hover:shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-4xl mb-2">{badge.icon}</span>
                  <h4 className="font-heading font-black text-xs text-slate-800">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. PARENT CTA BANNER */}
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md flex-shrink-0">
              👨‍👩‍👧
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-emerald-950">
                Theo Dõi Hành Trình Học Tập Của Con
              </h3>
              <p className="text-xs font-semibold text-emerald-800 mt-1 max-w-lg">
                Xem báo cáo tỷ lệ làm bài đúng, điểm mạnh phân môn toán và cài đặt giới hạn thời gian học mỗi ngày (10–60 phút).
              </p>
            </div>
          </div>

          <button
            onClick={handleParentCTA}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 flex-shrink-0 text-xs sm:text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DÀNH CHO PHỤ HUYNH</span>
          </button>
        </section>

      </div>
    </div>
  );
};
