import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Star, 
  Award, 
  TrendingUp, 
  Crown,
  Medal
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLevelInfo, LEADERBOARD } from '../data/mockData';

export const AchievementsPage: React.FC = () => {
  const { user, badges } = useGame();
  const levelInfo = getLevelInfo(user.xp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Profile & Level Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-4 flex flex-col items-center text-center sm:flex-row sm:text-left gap-5">
            <div className="w-24 h-24 rounded-3xl bg-white text-slate-800 flex items-center justify-center text-5xl shadow-2xl border-4 border-amber-300 flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
              {user.avatarEmoji}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {levelInfo.title}
              </div>
              <h1 className="font-heading text-3xl font-black">
                {user.name}
              </h1>
              <p className="text-xs font-semibold text-purple-200 mt-1">
                Thành viên tích cực Đảo Toán Học
              </p>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-sm font-bold text-sky-100">
              <span>Cấp độ hiện tại: <strong className="text-white text-base">Cấp {levelInfo.level}</strong></span>
              <span>{user.xp} / {levelInfo.nextLevelXp} XP</span>
            </div>

            {/* XP Bar */}
            <div className="w-full bg-black/25 rounded-full h-4 p-0.5 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${levelInfo.progressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                <span className="text-xs text-sky-200 block">Chuỗi ngày</span>
                <span className="font-heading font-black text-xl text-white flex items-center justify-center gap-1">
                  🔥 {user.streak} ngày
                </span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                <span className="text-xs text-sky-200 block">Bài hoàn thành</span>
                <span className="font-heading font-black text-xl text-white">
                  {user.completedLessons.length} bài
                </span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                <span className="text-xs text-sky-200 block">Huy hiệu đạt được</span>
                <span className="font-heading font-black text-xl text-yellow-300">
                  {user.unlockedBadges.length}/{badges.length}
                </span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                <span className="text-xs text-sky-200 block">Kho báu quy đổi</span>
                <span className="font-heading font-black text-xl text-white">
                  {user.inventory.length} món
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Badges Grid (10 badges) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-black text-slate-800">
                Bộ Sưu Tập Huy Hiệu 🏅
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Chinh phục các thử thách để mở khóa huy hiệu danh giá
              </p>
            </div>
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              Đã mở: {user.unlockedBadges.length} / {badges.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const isUnlocked = user.unlockedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                    isUnlocked
                      ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-100 hover:scale-[1.02]'
                      : 'bg-slate-50 border-slate-200 opacity-60 grayscale hover:grayscale-0'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border flex-shrink-0 ${
                    isUnlocked ? 'bg-amber-100 border-amber-300' : 'bg-slate-200 border-slate-300'
                  }`}>
                    {badge.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-black text-base text-slate-800">
                        {badge.title}
                      </h3>
                      {isUnlocked ? (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Đã mở
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Chưa mở
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl border border-amber-200">
                🏆
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-slate-800 leading-tight">
                  Bảng Vàng Tuần
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  Top các nhà thám hiểm tuần này
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    item.isUser
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-heading font-black text-xs ${
                      item.rank === 1
                        ? 'bg-amber-400 text-slate-900 shadow-sm'
                        : item.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'text-slate-400 font-bold'
                    }`}>
                      {item.rank}
                    </span>
                    <span className="text-xl">{item.avatar}</span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">Cấp {item.level}</span>
                    </div>
                  </div>

                  <span className="font-heading font-black text-xs text-amber-600">
                    {item.xp} XP
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400">
                Bảng xếp hạng cập nhật mỗi Chủ Nhật hàng tuần ✨
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
