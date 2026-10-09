import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Play, 
  Filter, 
  ChevronRight,
  Star,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Lesson, SubjectCategory, AgeGroup } from '../types';
import { QuizPage } from './QuizPage';
import { soundManager } from '../utils/sound';

export const LearnPage: React.FC = () => {
  const { 
    lessons, 
    user, 
    activeAgeGroup, 
    setActiveAgeGroup, 
    activeCategory, 
    setActiveCategory,
    activeLesson,
    setActiveLesson,
    setActiveTab 
  } = useGame();

  const [searchQuery, setSearchQuery] = useState('');

  // Category menu items for tabs
  const subjectTabs: { id: SubjectCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất cả', icon: '🌟' },
    { id: 'basic', label: 'Số học & Phép tính', icon: '🔢' },
    { id: 'thinking', label: 'Toán tư duy', icon: '💡' },
    { id: 'geometry', label: 'Hình học', icon: '📐' },
    { id: 'logic', label: 'Logic', icon: '🧩' },
    { id: 'english-math', label: 'Toán tiếng Anh', icon: '🇬🇧' },
    { id: 'olympic', label: 'Olympic Math', icon: '🏆' },
  ];

  // Age group selector options
  const ageOptions: { id: AgeGroup; label: string; sub: string }[] = [
    { id: '4-5', label: '4–5 tuổi', sub: 'Tí hon' },
    { id: '6-8', label: '6–8 tuổi', sub: 'Nhí' },
    { id: '9-11', label: '9–11 tuổi', sub: 'Tài năng' },
  ];

  // Filter lessons based on active category, age group, and search query
  const filteredLessons = lessons.filter((l) => {
    const matchAge = l.ageGroup === activeAgeGroup;
    const matchCategory = activeCategory === 'all' || l.category === activeCategory;
    const matchSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAge && matchCategory && matchSearch;
  });

  const handleStartLesson = (lesson: Lesson) => {
    soundManager.playCorrect();
    setActiveLesson(lesson);
  };

  // If currently taking a quiz on a lesson, render QuizPage
  if (activeLesson) {
    return (
      <QuizPage
        key={activeLesson.id}
        lesson={activeLesson}
        onBack={() => setActiveLesson(null)}
      />
    );
  }

  const completedCount = filteredLessons.filter((l) => user.completedLessons.includes(l.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Lộ trình tương tác
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black">
              Con đường Toán học của bạn 🎒
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-sky-100 max-w-xl">
              Chọn một nhiệm vụ để tiếp tục thu thập điểm XP, Tiền Vàng và Huy Hiệu cùng Mini!
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 flex items-center gap-6 self-start md:self-auto">
            <div>
              <span className="text-[11px] font-bold text-sky-200 block">Đã hoàn thành</span>
              <span className="font-heading font-black text-2xl text-yellow-300">
                {completedCount}/{filteredLessons.length} bài
              </span>
            </div>
            <div className="border-l border-white/20 pl-6">
              <button
                onClick={() => setActiveTab('ages')}
                className="text-left group"
              >
                <span className="text-[11px] font-bold text-sky-200 block group-hover:underline">Độ tuổi (Đổi)</span>
                <span className="font-heading font-black text-xl text-white">
                  {activeAgeGroup} tuổi ➔
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROADMAP NODES PATHWAY (Phần 11 Current Path) */}
      <section aria-label="Lộ trình học tập" className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-black text-base text-slate-800 flex items-center gap-2">
            <span>🗺️ Hành Trình Chặng Hiện Tại</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Hoàn thành từng bài để mở khóa bài tiếp theo
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {filteredLessons.slice(0, 5).map((l, idx) => {
            const isCompleted = user.completedLessons.includes(l.id);
            const isCurrent = !isCompleted && (idx === 0 || user.completedLessons.includes(filteredLessons[idx - 1]?.id));
            const isLocked = !isCompleted && !isCurrent;
            const stars = user.lessonStars[l.id] || 0;

            return (
              <React.Fragment key={l.id}>
                <div
                  onClick={() => !isLocked && handleStartLesson(l)}
                  className={`flex flex-col items-center flex-shrink-0 cursor-pointer p-3 rounded-2xl border-2 transition-all ${
                    isCurrent
                      ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-300 scale-105'
                      : isCompleted
                      ? 'border-emerald-300 bg-emerald-50/60'
                      : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                  style={{ minWidth: '130px' }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs mb-2 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : isLocked ? <Lock className="w-5 h-5 text-slate-400" /> : l.thumbnailEmoji}
                  </div>

                  <span className="font-heading font-black text-xs text-slate-800 text-center line-clamp-1">
                    {l.title}
                  </span>

                  {/* Stars display */}
                  <div className="flex items-center gap-0.5 mt-1 text-xs">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {idx < 4 && idx < filteredLessons.length - 1 && (
                  <div className="w-8 h-1 bg-slate-200 rounded-full flex-shrink-0"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* SUBJECT FILTER TABS */}
      <section aria-label="Bộ lọc chủ đề">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjectTabs.map((tab) => {
            const isActive = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(tab.id);
                }}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* LESSON CARDS GRID */}
      <section aria-label="Danh sách bài học">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400">
            Tìm thấy <strong className="text-slate-800 font-black">{filteredLessons.length}</strong> bài học ({activeAgeGroup} tuổi)
          </span>

          <input
            type="text"
            placeholder="Tìm kiếm bài học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-64 px-3.5 py-2 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none text-xs font-bold text-slate-800 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const stars = user.lessonStars[lesson.id] || 0;

            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-3xl p-5 border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/15' : 'border-sky-100'
                }`}
              >
                <div>
                  {/* Top Bar: Icon, Stars, Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl shadow-xs">
                      {lesson.thumbnailEmoji}
                    </div>

                    {/* Stars Earned */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      lesson.difficulty === 'Dễ'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : lesson.difficulty === 'Trung bình'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {lesson.difficulty}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-slate-800 leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1 mb-4 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                {/* Footer details & Action */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-amber-600 flex items-center gap-1">
                      ⭐ +{lesson.xpReward} XP
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 font-bold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.durationMinutes} phút
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartLesson(lesson)}
                    className={`w-full py-3 px-4 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/25 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'ÔN TẬP LẠI (⭐ LẤY 3 SAO)' : 'HỌC NGAY 🚀'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
