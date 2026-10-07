import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  Lock, 
  Sparkles, 
  Star, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import { Lesson } from '../types';

interface WorldDetailPageProps {
  worldId?: string;
}

export const WorldDetailPage: React.FC<WorldDetailPageProps> = ({ worldId }) => {
  const { 
    worlds, 
    lessons, 
    user, 
    setActiveLesson, 
    navigateTo, 
    activeTab 
  } = useGame();

  // Extract worldId from prop or activeTab (e.g. "world/world-1")
  const targetWorldId = worldId || activeTab.replace(/^world\/?/, '') || 'world-1';
  const currentWorld = worlds.find((w) => w.id === targetWorldId) || worlds[0];

  const completedLessonIds = user.completedLessons || [];

  // Get lessons belonging to this world or associated by category
  const worldLessons = lessons.filter(
    (l) => l.worldId === currentWorld.id || l.category === currentWorld.category
  );

  const completedCount = worldLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = worldLessons.length > 0 
    ? Math.round((completedCount / worldLessons.length) * 100) 
    : 0;

  const handleStartLesson = (lesson: Lesson, isLocked: boolean) => {
    if (isLocked) {
      soundManager.playWrong();
      return;
    }
    soundManager.playLevelUp();
    setActiveLesson(lesson);
    navigateTo(`lesson/${lesson.id}`);
  };

  const handleBack = () => {
    soundManager.playClick();
    navigateTo('child/home');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none space-y-8">
      
      {/* Top Navigation */}
      <button
        onClick={handleBack}
        className="btn-touch-target inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-600 font-bold text-caption border border-slate-200 shadow-xs transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về Trang Chủ Thế Giới</span>
      </button>

      {/* World Hero Banner */}
      <div className={`bg-gradient-to-r ${currentWorld.bgColor} rounded-[28px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-caption font-black text-amber-300 uppercase tracking-wider">
              <span>{currentWorld.icon}</span>
              <span>Khu Vực #{currentWorld.order}</span>
            </div>

            <h1 className="text-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              {currentWorld.name}
            </h1>
            <p className="text-body-sm sm:text-body text-white/90 font-medium max-w-xl leading-relaxed">
              {currentWorld.description}
            </p>

            {/* Progress Bar in Banner */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between items-center text-caption font-black text-white/90">
                <span>Tiến độ chinh phục:</span>
                <span>{completedCount} / {worldLessons.length} bài ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3 p-0.5 shadow-inner">
                <div
                  className="bg-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Big World Icon badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-6xl shadow-2xl self-center md:self-auto flex-shrink-0 animate-bounce motion-reduce:animate-none">
            {currentWorld.icon}
          </div>
        </div>
      </div>

      {/* 1. KHÁM PHÁ & HỌC BÀI (LEARN ZONE) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black">
            1
          </div>
          <div>
            <h2 className="text-h3 font-black text-slate-900">
              Chặng 1: Khám Phá & Học Bài Mới
            </h2>
            <p className="text-caption text-slate-500 font-medium">
              Vượt qua từng bài học để thu thập sao và mở khóa chặng tiếp theo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {worldLessons.map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const stars = user.lessonStars?.[lesson.id] || 0;
            const isLocked = idx > 0 && !completedLessonIds.includes(worldLessons[idx - 1].id) && !isCompleted;
            const isCurrent = !isCompleted && !isLocked;

            return (
              <div
                key={lesson.id}
                onClick={() => handleStartLesson(lesson, isLocked)}
                className={`rounded-3xl p-5 border-2 flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 shadow-xs'
                    : isCurrent
                    ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-300/60 scale-[1.01]'
                    : isLocked
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-200 hover:border-sky-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-xs ${
                    isCompleted ? 'bg-emerald-100' : isCurrent ? 'bg-amber-100' : 'bg-slate-100'
                  }`}>
                    {lesson.thumbnailEmoji || currentWorld.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-black text-slate-800 truncate">
                        Bài {idx + 1}: {lesson.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ⭐ +{lesson.xpReward} XP
                      </span>
                      {isCompleted && (
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= stars ? 'fill-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-xs">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <button className="btn-touch-target px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-caption flex items-center gap-1.5 shadow-sm">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>HỌC</span>
                    </button>
                  ) : (
                    <span className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. PRACTICE ZONE */}
      <section className="bg-gradient-to-br from-sky-50 to-indigo-50/60 border-2 border-sky-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            ⚡
          </div>
          <div>
            <div className="text-caption font-black uppercase tracking-wider text-sky-700">Chặng 2: Vùng Rèn Luyện</div>
            <h3 className="text-h3 font-black text-slate-900 mt-0.5">Phản Xạ Tính Nhẩm Siêu Tốc</h3>
            <p className="text-caption sm:text-body-sm text-slate-600 mt-1 font-medium max-w-lg">
              Luyện tập các phép tính ngẫu nhiên của thế giới này để nâng cao chuỗi câu đúng!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            navigateTo('games');
          }}
          className="btn-touch-target px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-body-sm shadow-md transition flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>VÀO KHU LUYỆN TẬP</span>
        </button>
      </section>

      {/* 3. BOSS CHALLENGE */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
            👑
          </div>
          <div>
            <div className="text-caption font-black uppercase tracking-wider text-amber-200">Chặng 3: Trùm Cuối</div>
            <h3 className="text-h3 font-black text-white mt-0.5">Thử Thách Vương Giả {currentWorld.name}</h3>
            <p className="text-caption sm:text-body-sm text-amber-100 mt-1 font-medium max-w-lg">
              Hoàn thành 10 câu đố hóc búa để nhận Cúp Danh Dự và mở khóa rương kho báu thế giới tiếp theo!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            const bossLesson = worldLessons[worldLessons.length - 1] || worldLessons[0];
            if (bossLesson) {
              setActiveLesson(bossLesson);
              navigateTo(`lesson/${bossLesson.id}`);
            }
          }}
          className="btn-touch-target px-6 py-3.5 rounded-2xl bg-white text-orange-950 hover:bg-amber-100 font-black text-body-sm shadow-lg transition flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>KHIÊU CHIẾN BOSS ➔</span>
        </button>
      </section>

    </div>
  );
};
