import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Clock, 
  Target, 
  CheckCircle2, 
  Award, 
  Flame, 
  Edit3, 
  Check, 
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLevelInfo } from '../data/mockData';
import { MascotMini } from '../components/common/MascotMini';
import { soundManager } from '../utils/sound';

export const ProfilePage: React.FC = () => {
  const { user, updateUserName, setActiveTab, badges } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const levelInfo = getLevelInfo(user.xp);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (newName.trim()) {
      updateUserName(newName.trim());
    }
    setIsEditingName(false);
  };

  // Calculate learning stats from user history
  const totalTimeSeconds = user.history.reduce((acc, h) => acc + h.timeSpentSeconds, 690);
  const totalMinutes = Math.round(totalTimeSeconds / 60);
  const avgAccuracy = Math.round(
    user.history.length > 0
      ? user.history.reduce((acc, h) => acc + h.accuracy, 0) / user.history.length
      : 92
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar with equipped badge */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-300 p-1 shadow-xl border-4 border-white flex items-center justify-center text-6xl">
              {user.avatarEmoji}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              Cấp {levelInfo.level}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border-2 border-sky-400 font-bold text-slate-800 text-lg focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-800">
                    {user.name}
                  </h1>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition"
                    title="Đổi tên"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                ⭐ {levelInfo.title}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400">
              Mã thám hiểm: #{user.id.toUpperCase()} • Đã tham gia Đảo Toán Học
            </p>

            {/* Level Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{user.xp} XP</span>
                <span>Mục tiêu cấp tiếp: {levelInfo.nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-amber-400 to-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('treasure')}
              className="px-4 py-2 rounded-xl text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
            >
              🎒 Đổi trang phục Mini
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              👨‍👩‍👧 Báo cáo Phụ huynh
            </button>
          </div>

        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-sm text-center">
          <Clock className="w-6 h-6 text-sky-500 mx-auto mb-2" />
          <span className="font-heading font-black text-2xl text-slate-800">{totalMinutes} phút</span>
          <span className="text-xs font-bold text-slate-400 block mt-0.5">Thời gian học tập</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm text-center">
          <Target className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <span className="font-heading font-black text-2xl text-slate-800">{avgAccuracy}%</span>
          <span className="text-xs font-bold text-slate-400 block mt-0.5">Tỷ lệ chính xác</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-rose-100 shadow-sm text-center">
          <Flame className="w-6 h-6 text-rose-500 mx-auto mb-2" />
          <span className="font-heading font-black text-2xl text-slate-800">{user.streak} ngày</span>
          <span className="text-xs font-bold text-slate-400 block mt-0.5">Chuỗi thám hiểm</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-sm text-center">
          <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <span className="font-heading font-black text-2xl text-slate-800">{user.unlockedBadges.length}</span>
          <span className="text-xs font-bold text-slate-400 block mt-0.5">Huy hiệu đạt được</span>
        </div>
      </div>

      {/* Visual Chart Bars (Learning progress by Subject) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-black text-xl text-slate-800">
              Năng Lực Tư Duy Theo Phân Môn 📊
            </h3>
            <p className="text-xs font-semibold text-slate-400">
              Đánh giá dựa trên các bài tập và quiz bé đã giải
            </p>
          </div>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            Xuất sắc toàn diện
          </span>
        </div>

        {/* Visual Bar chart */}
        <div className="space-y-4">
          {[
            { subject: 'Toán cơ bản & Phép tính', score: 95, color: 'bg-sky-500', emoji: '🔢' },
            { subject: 'Toán tư duy & Quy luật', score: 88, color: 'bg-amber-500', emoji: '💡' },
            { subject: 'Hình học & Đo lường', score: 92, color: 'bg-emerald-500', emoji: '📐' },
            { subject: 'Logic & Trí tuệ', score: 85, color: 'bg-purple-500', emoji: '🧩' },
            { subject: 'Toán tiếng Anh & Olympic', score: 78, color: 'bg-rose-500', emoji: '🏆' },
          ].map((bar, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span>{bar.emoji}</span>
                  <span>{bar.subject}</span>
                </span>
                <span className="text-sky-600">{bar.score}% thành thạo</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`${bar.color} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${bar.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-md">
        <h3 className="font-heading font-black text-xl text-slate-800 mb-4">
          Lịch Sử Học Tập Gần Đây 📜
        </h3>

        <div className="space-y-3">
          {user.history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  {item.lessonTitle}
                </h4>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mt-0.5">
                  <span>{item.completedAt}</span>
                  <span>•</span>
                  <span>Thời gian: {Math.round(item.timeSpentSeconds / 60)} phút</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 inline-block">
                  {item.accuracy}% chính xác
                </span>
                <span className="text-[11px] font-bold text-amber-600 block mt-0.5">
                  +{item.xpEarned} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
