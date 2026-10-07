import React from 'react';
import { Trophy, Flame, CheckCircle, Award, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getLevelInfo } from '../../data/mockData';

export const UserStatsWidget: React.FC = () => {
  const { user, setActiveTab } = useGame();
  const levelInfo = getLevelInfo(user.xp);

  return (
    <section className="py-10 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Stats Card */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-20 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left User Level & XP Info */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white text-slate-800 flex items-center justify-center text-3xl shadow-lg border-2 border-amber-300">
                  {user.avatarEmoji}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 bg-amber-400/30 text-amber-200 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300/40">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {levelInfo.title}
                  </div>
                  <h3 className="font-heading font-black text-2xl text-white leading-tight">
                    {user.name} • Cấp {levelInfo.level}
                  </h3>
                  <p className="text-xs font-bold text-sky-100">
                    {user.xp} / {levelInfo.nextLevelXp} XP để lên cấp kế tiếp
                  </p>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-black/20 rounded-full h-3.5 p-0.5 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-sky-200">
                  <span>Cấp {levelInfo.level}</span>
                  <span>{levelInfo.progressPercent}%</span>
                  <span>Cấp {levelInfo.level + 1}</span>
                </div>
              </div>
            </div>

            {/* Right Quick Metric Pills */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Metric 1: XP */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 rounded-xl bg-amber-400/30 flex items-center justify-center text-xl mb-1">
                  ⭐
                </div>
                <span className="font-heading font-black text-xl text-yellow-300">
                  {user.xp.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-sky-100 mt-0.5">
                  Tổng điểm XP
                </span>
              </div>

              {/* Metric 2: Streak */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 rounded-xl bg-rose-400/30 flex items-center justify-center text-xl mb-1">
                  🔥
                </div>
                <span className="font-heading font-black text-xl text-white">
                  {user.streak} ngày
                </span>
                <span className="text-[11px] font-bold text-sky-100 mt-0.5">
                  Chuỗi học tập
                </span>
              </div>

              {/* Metric 3: Completed */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/30 flex items-center justify-center text-xl mb-1">
                  ✅
                </div>
                <span className="font-heading font-black text-xl text-white">
                  {user.completedLessons.length} bài
                </span>
                <span className="text-[11px] font-bold text-sky-100 mt-0.5">
                  Đã hoàn thành
                </span>
              </div>

              {/* Metric 4: Badges */}
              <div 
                onClick={() => setActiveTab('achievements')}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/20 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-400/30 flex items-center justify-center text-xl mb-1">
                  🏅
                </div>
                <span className="font-heading font-black text-xl text-white">
                  {user.unlockedBadges.length} huy hiệu
                </span>
                <span className="text-[11px] font-bold text-sky-100 mt-0.5 underline">
                  Xem bảng vàng
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
