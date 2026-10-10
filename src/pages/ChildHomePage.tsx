import React from 'react';
import { Flame, Star, Target, ArrowRight, Play, Sparkles, ChevronRight, Gift } from 'lucide-react';
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

  const currentLessonProgressPercent = completedIds.includes(nextLesson.id) ? 100 : 0;
  const completedToday = dailyChallenges.filter((challenge) => challenge.completed).length;
  const totalToday = dailyChallenges.length;
  const todayKey = new Date().toLocaleDateString('vi-VN');
  const studySecondsToday = (user.history || []).reduce((total, item) => {
    const completedDate = (item.completedAt || '').split(' ')[0];
    return completedDate === todayKey ? total + Math.max(0, item.timeSpentSeconds || 0) : total;
  }, 0);
  const studyMinutesToday = Math.floor(studySecondsToday / 60);
  const dailyGoalMinutes = Math.max(1, user.dailyStudyGoalMinutes || 20);
  const dailyGoalPercent = Math.min(100, Math.round((studyMinutesToday / dailyGoalMinutes) * 100));

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

      {/* 3. QUICK STATS — gọn, dễ nhìn */}
      <section aria-label="Tiến độ của bé">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => navigateTo('challenges')} className="text-left bg-white p-5 rounded-3xl border-2 border-rose-100 shadow-sm hover:border-rose-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center"><Flame className="w-5 h-5 fill-current" /></div>
              <div><p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Chuỗi học</p><p className="text-xl font-black text-slate-900">{user.streak} ngày</p></div>
            </div>
            <p className="mt-3 text-xs font-bold text-rose-600">🔥 Cùng Mini giữ chuỗi nhé!</p>
          </button>
          <button onClick={() => navigateTo('achievements')} className="text-left bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm hover:border-amber-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><Star className="w-5 h-5 fill-current" /></div>
              <div><p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Kinh nghiệm</p><p className="text-xl font-black text-slate-900">{user.xp.toLocaleString()} XP</p></div>
            </div>
            <p className="mt-3 text-xs font-bold text-amber-600">⭐ Còn {levelInfo.remainingXp} XP để lên cấp</p>
          </button>
          <button onClick={() => navigateTo('challenges')} className="text-left bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><Target className="w-5 h-5" /></div>
              <div><p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Nhiệm vụ hôm nay</p><p className="text-xl font-black text-slate-900">{totalToday > 0 ? `${completedToday} / ${totalToday}` : '—'}</p></div>
            </div>
            <p className="mt-3 text-xs font-bold text-emerald-600">🎯 Làm thêm một nhiệm vụ nhé!</p>
          </button>
        </div>
      </section>

      {/* 4. DAILY STUDY GOAL */}
      <section aria-label="Mục tiêu học tập hôm nay" className="rounded-3xl border-2 border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-2xl" aria-hidden="true">⏱️</div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Mục tiêu học tập hôm nay</h2>
              <p className="mt-1 text-sm text-slate-600">Mỗi ngày một chút, bé sẽ tiến bộ từng bước!</p>
              <p className="mt-2 text-sm font-bold text-violet-800">{studyMinutesToday} / {dailyGoalMinutes} phút đã học</p>
            </div>
          </div>
          <div className="sm:w-2/5">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Tiến độ hôm nay</span><span>{dailyGoalPercent}%</span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-violet-100" role="progressbar" aria-label="Tiến độ mục tiêu học tập hôm nay" aria-valuemin={0} aria-valuemax={100} aria-valuenow={dailyGoalPercent}>
              <div className={`h-full rounded-full transition-all duration-500 ${dailyGoalPercent >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`} style={{ width: `${dailyGoalPercent}%` }} />
            </div>
            <p className={`mt-2 text-xs font-semibold ${dailyGoalPercent >= 100 ? 'text-emerald-700' : 'text-slate-500'}`} aria-live="polite">
              {dailyGoalPercent >= 100 ? '🎉 Tuyệt vời! Bé đã hoàn thành mục tiêu hôm nay!' : `Còn ${Math.max(0, dailyGoalMinutes - studyMinutesToday)} phút nữa để hoàn thành mục tiêu.`}
            </p>
          </div>
        </div>
        <button type="button" onClick={() => navigateTo('challenges')} className="mt-4 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-extrabold text-violet-700 transition hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
          Khám phá nhiệm vụ hôm nay <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
        </button>
      </section>

      {/* 5. MATH ADVENTURE WORLD MAP NODES */}
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
          {worlds.map((world) => {
            const isUnlocked = world.isUnlocked || user.xp >= world.requiredXp;
            const worldLessonIds = lessons
              .filter((lesson) => lesson.worldId === world.id || lesson.category === world.category)
              .map((lesson) => lesson.id);
            const completedWorldLessons = worldLessonIds.filter((id) => completedIds.includes(id)).length;
            const isCompleted = worldLessonIds.length > 0 && completedWorldLessons === worldLessonIds.length;
            const isCurrent = !isCompleted && worldLessonIds.includes(nextLesson.id);

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
                  {isUnlocked ? (isCompleted ? 'Hoàn thành' : completedWorldLessons > 0 ? `${completedWorldLessons}/${worldLessonIds.length} bài` : 'Chưa bắt đầu') : `${world.requiredXp} XP`}
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

      {/* 6. KHO BÁU — một lời mời đơn giản */}
      <section aria-label="Kho báu">
        <div className="rounded-3xl border-2 border-purple-100 bg-gradient-to-r from-purple-50 via-white to-sky-50 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-purple-700"><Gift className="w-4 h-4" />Kho báu của bé</div>
              <h2 className="mt-3 text-2xl font-black text-slate-900">Mở rương và xem phần thưởng 🎁</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Khi hoàn thành bài học, bé có thể khám phá thêm huy hiệu và vật phẩm.</p>
            </div>
            <button onClick={handleOpenRewards} className="btn-touch-target shrink-0 rounded-2xl bg-purple-600 px-6 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-purple-700 active:scale-95 flex items-center justify-center gap-2"><Gift className="w-4 h-4" />Xem kho báu</button>
          </div>
        </div>
      </section>

    </div>
  );
};
