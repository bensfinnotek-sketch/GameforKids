import React from 'react';
import { 
  Flame, 
  Star, 
  Trophy, 
  Target, 
  ArrowRight, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Compass, 
  ChevronRight,
  Award,
  Gamepad2,
  Gift,
  BookOpen
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getFullLevelDetails } from '../utils/levelUtils';
import { soundManager } from '../utils/sound';
import { World, Lesson } from '../types';

export const ChildHomePage: React.FC = () => {
  const { 
    user, 
    lessons, 
    worlds, 
    dailyChallenges, 
    setActiveLesson, 
    navigateTo 
  } = useGame();

  const levelInfo = getFullLevelDetails(user.xp);

  // Determine current active lesson for "TIẾP TỤC HỌC"
  const completedIds = user.completedLessons || [];
  const nextLesson: Lesson = 
    lessons.find((l) => !completedIds.includes(l.id)) || 
    lessons[0] || 
    {
      id: 'lesson-1',
      title: 'Đếm quả táo cùng Thám hiểm Mini',
      description: 'Làm quen với các con số qua hình ảnh quả táo.',
      category: 'basic',
      ageGroup: '6-8',
      level: 1,
      difficulty: 'Dễ',
      xpReward: 50,
      coinReward: 20,
      gemReward: 5,
      durationMinutes: 5,
      thumbnailEmoji: '🍎',
      worldId: 'world-1',
      totalQuestions: 5,
    };

  const currentLessonProgressPercent = completedIds.includes(nextLesson.id) ? 100 : 75;

  const handleContinueLearning = () => {
    soundManager.playLevelUp();
    setActiveLesson(nextLesson);
    navigateTo(`lesson/${nextLesson.id}`);
  };

  const handleOpenWorld = (world: World) => {
    soundManager.playClick();
    if (!world.isUnlocked && user.xp < world.requiredXp) {
      soundManager.playWrong();
      return;
    }
    navigateTo(`world/${world.id}`);
  };

  const handleOpenGames = () => {
    soundManager.playClick();
    navigateTo('games');
  };

  const handleOpenRewards = () => {
    soundManager.playClick();
    navigateTo('treasure');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 select-none">
      
      {/* 1. GREETING & HERO PROFILE BAR */}
      <section className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Floating background clouds & sparkles */}
        <div className="absolute top-2 right-12 text-3xl opacity-50 animate-float-slow pointer-events-none">☁️</div>
        <div className="absolute bottom-2 left-1/3 text-2xl opacity-40 animate-float-slow pointer-events-none">✨</div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chuyến thám hiểm hôm nay</span>
            </div>
            
            <h1 className="text-display text-2xl sm:text-4xl font-black tracking-tight text-white">
              👋 Chào {user.name || 'bạn'}!
            </h1>
            <p className="text-body-sm sm:text-body text-sky-100 font-medium max-w-xl">
              Sẵn sàng cho chuyến phiêu lưu toán học hôm nay chưa? Mini đã chuẩn bị rất nhiều kho báu cho bạn! 🎒✨
            </p>
          </div>

          {/* Child Avatar Box */}
          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-white/25 self-start md:self-auto shadow-md">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-200 text-slate-800 flex items-center justify-center text-3xl shadow-inner ring-4 ring-white/50">
                {user.avatarEmoji || '🤠'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                Lv.{levelInfo.level}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-black uppercase text-amber-300 block">
                {levelInfo.title}
              </span>
              <div className="text-sm font-extrabold text-white">
                {user.xp.toLocaleString()} XP
              </div>
              <div className="w-28 sm:w-32 bg-white/30 rounded-full h-2 mt-1.5 overflow-hidden">
                <div 
                  className="bg-amber-300 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTINUE LEARNING CARD (NỔI BẬT NHẤT) */}
      <section aria-label="Tiếp tục học">
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border-3 border-amber-300 rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden transition-transform duration-200 hover:shadow-2xl">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 text-caption font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-950" />
                <span>Nhiệm Vụ Đang Tiến Hành</span>
              </div>

              <div>
                <h2 className="text-h2 font-black text-slate-900 tracking-tight">
                  🌟 {nextLesson.title}
                </h2>
                <p className="text-body-sm text-slate-600 mt-1 font-medium">
                  {nextLesson.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1 max-w-lg">
                <div className="flex justify-between items-center text-caption font-extrabold text-slate-600">
                  <span>Tiến độ bài học:</span>
                  <span className="text-amber-600">{currentLessonProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-3.5 p-0.5 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${currentLessonProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* CTA Continue Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleContinueLearning}
                className="btn-touch-target px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white text-body-sm sm:text-body font-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>TIẾP TỤC HỌC</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUICK STATS ROW (4 CARDS) */}
      <section aria-label="Chỉ số học tập">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Streak Card */}
          <div 
            onClick={() => {
              soundManager.playClick();
              navigateTo('challenges');
            }}
            className="bg-white p-5 rounded-3xl border-2 border-rose-100 shadow-xs hover:border-rose-300 hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption font-extrabold text-slate-400 uppercase tracking-wider">Chuỗi Học</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
                <Flame className="w-5 h-5 fill-rose-500" />
              </div>
            </div>
            <div className="text-h1 font-black text-slate-900">{user.streak} ngày</div>
            <p className="text-[11px] font-bold text-rose-600 mt-1">
              🔥 Giữ vững phong độ mỗi ngày!
            </p>
          </div>

          {/* XP Card */}
          <div 
            onClick={() => {
              soundManager.playClick();
              navigateTo('achievements');
            }}
            className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-xs hover:border-amber-300 hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption font-extrabold text-slate-400 uppercase tracking-wider">Kinh Nghiệm</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
            </div>
            <div className="text-h1 font-black text-slate-900">{user.xp.toLocaleString()} XP</div>
            <p className="text-[11px] font-bold text-amber-600 mt-1">
              Còn {levelInfo.remainingXp} XP để lên Cấp {levelInfo.level + 1}
            </p>
          </div>

          {/* Level Card */}
          <div 
            onClick={() => {
              soundManager.playClick();
              navigateTo('profile');
            }}
            className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-xs hover:border-sky-300 hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption font-extrabold text-slate-400 uppercase tracking-wider">Cấp Độ</span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-500">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="text-h1 font-black text-slate-900">Cấp {levelInfo.level}</div>
            <p className="text-[11px] font-bold text-sky-600 mt-1 truncate">
              {levelInfo.title}
            </p>
          </div>

          {/* Today Goal Card */}
          <div 
            onClick={() => {
              soundManager.playClick();
              navigateTo('challenges');
            }}
            className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption font-extrabold text-slate-400 uppercase tracking-wider">Mục Tiêu Hôm Nay</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="text-h1 font-black text-slate-900">3 / 5 câu</div>
            <p className="text-[11px] font-bold text-emerald-600 mt-1">
              🎯 Sắp hoàn thành mục tiêu ngày!
            </p>
          </div>

        </div>
      </section>

      {/* 4. MATH ADVENTURE WORLD MAP NODES */}
      <section aria-label="Bản đồ thế giới">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-h2 font-black text-slate-900 flex items-center gap-2">
              <span>🗺️ Thế Giới Toán Học</span>
              <span className="text-caption font-extrabold bg-sky-100 text-sky-700 px-3 py-1 rounded-full uppercase">
                8 Khu Vực
              </span>
            </h2>
            <p className="text-body-sm text-slate-500 font-medium mt-0.5">
              Chạm vào bất kỳ thế giới nào để khám phá danh sách bài học và thử thách trùm cuối!
            </p>
          </div>

          <button
            onClick={() => navigateTo('map')}
            className="text-caption font-extrabold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition"
          >
            <span>Xem bản đồ lớn</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable / Responsive Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {worlds.map((world, idx) => {
            const isUnlocked = world.isUnlocked || user.xp >= world.requiredXp;
            const isCompleted = idx === 0;
            const isCurrent = idx === 1;

            return (
              <div
                key={world.id}
                onClick={() => handleOpenWorld(world)}
                className={`relative rounded-3xl p-4 border-2 flex flex-col items-center text-center justify-between cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-400 animate-pulse-glow'
                    : isUnlocked
                    ? 'border-slate-200 bg-white hover:border-sky-300 shadow-xs'
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                {/* Node Top Status Indicator */}
                <div className="mb-2">
                  {isCompleted ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-[11px] font-black flex items-center justify-center animate-bounce shadow-xs">
                      ✨
                    </span>
                  ) : isUnlocked ? (
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-[11px] font-black flex items-center justify-center">
                      🔓
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[11px] font-black flex items-center justify-center">
                      🔒
                    </span>
                  )}
                </div>

                {/* World Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-2xl mb-2">
                  {world.icon}
                </div>

                {/* World Title */}
                <h3 className="text-caption font-black text-slate-800 leading-tight">
                  {world.name}
                </h3>

                {/* Progress / Requirement */}
                <span className="text-[10px] font-bold text-slate-400 mt-1">
                  {isUnlocked ? (isCompleted ? 'Hoàn thành' : 'Đang học') : `${world.requiredXp} XP`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TODAY'S MINI GAME ARCADE */}
      <section aria-label="Game toán hôm nay">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-h2 font-black text-slate-900 flex items-center gap-2">
              <span>🎮 Game Hôm Nay</span>
              <span className="text-caption font-extrabold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase">
                Vừa Chơi Vừa Luyện Trí
              </span>
            </h2>
            <p className="text-body-sm text-slate-500 font-medium mt-0.5">
              Rèn luyện phản xạ tính toán và nhận thêm điểm XP hấp dẫn!
            </p>
          </div>

          <button
            onClick={handleOpenGames}
            className="text-caption font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
          >
            <span>Xem tất cả game</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              id: 'game-catch-numbers',
              title: 'Bắt Bóng Số Đúng',
              emoji: '🎈',
              desc: 'Chạm nhanh vào các bong bóng mang phép tính chính xác trước khi bay mất!',
              reward: '+40 XP',
              color: 'from-sky-400 to-blue-500',
            },
            {
              id: 'game-60s-blitz',
              title: 'Thử Thách 60 Giây',
              emoji: '⚡',
              desc: 'Tăng tốc độ tính nhẩm tối đa với chuỗi phép tính liên hoàn gay cấn!',
              reward: '+60 XP',
              color: 'from-amber-400 to-orange-500',
            },
            {
              id: 'game-treasure-code',
              title: 'Mật Mã Kho Báu',
              emoji: '🔐',
              desc: 'Giải các câu đố quy luật để mở khóa rương châu báu chứa đầy tiền vàng.',
              reward: '+50 XP',
              color: 'from-emerald-400 to-teal-500',
            },
          ].map((game) => (
            <div
              key={game.id}
              onClick={handleOpenGames}
              className="bg-white rounded-3xl p-5 border-2 border-slate-100 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {game.emoji}
                  </div>
                  <span className="text-caption font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    ⭐ {game.reward}
                  </span>
                </div>

                <h3 className="text-body font-black text-slate-800">
                  {game.title}
                </h3>
                <p className="text-caption text-slate-500 mt-1 font-medium leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-caption font-bold text-sky-600 group-hover:text-sky-700">
                <span>CHƠI NGAY</span>
                <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NEW BADGES & REWARDS SHOWCASE */}
      <section aria-label="Huy hiệu & Phần thưởng">
        <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-caption font-extrabold uppercase tracking-wider text-amber-300">
              <Award className="w-4 h-4" />
              <span>Huy Hiệu & Kho Báu Độc Quyền</span>
            </div>
            <h2 className="text-h2 font-black text-white">
              Bé Đã Đạt Được 8 Huy Hiệu Danh Giá! 🏅
            </h2>
            <p className="text-body-sm text-purple-100 font-medium max-w-xl">
              Đổi xu vàng lấy mũ thám hiểm, ba lô phản lực và trang phục phát sáng trong Cửa hàng Kho báu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenRewards}
              className="btn-touch-target px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-body-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Mở Kho Báu Ngay</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
