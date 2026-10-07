import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Target, 
  AlertCircle, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Settings, 
  Sliders, 
  Award,
  ArrowLeft
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

export const ParentDashboardPage: React.FC = () => {
  const { user, updateDailyGoal, setActiveTab, switchRole } = useGame();
  const [goalMinutes, setGoalMinutes] = useState(user.dailyStudyGoalMinutes || 20);
  const [savedMsg, setSavedMsg] = useState(false);

  const totalTimeSeconds = user.history.reduce((acc, h) => acc + h.timeSpentSeconds, 0);
  const totalMinutes = Math.round(totalTimeSeconds / 60);
  const avgAccuracy = user.history.length > 0
    ? Math.round(user.history.reduce((acc, h) => acc + h.accuracy, 0) / user.history.length)
    : null;

  const categoryStats = user.history.reduce<Record<string, { total: number; accuracy: number }>>((acc, item) => {
    const current = acc[item.category] || { total: 0, accuracy: 0 };
    current.total += 1;
    current.accuracy += item.accuracy;
    acc[item.category] = current;
    return acc;
  }, {});
  const rankedCategories = Object.entries(categoryStats)
    .map(([category, stats]) => ({ category, accuracy: Math.round(stats.accuracy / stats.total), total: stats.total }))
    .sort((a, b) => b.accuracy - a.accuracy);
  const strongestCategory = rankedCategories[0];
  const focusCategory = rankedCategories.length > 1 ? rankedCategories[rankedCategories.length - 1] : null;

  const handleSaveGoal = () => {
    soundManager.playClick();
    updateDailyGoal(goalMinutes);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleReturnStudent = () => {
    soundManager.playClick();
    switchRole('student');
    setActiveTab('home');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Parent Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white text-emerald-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Góc Dành Riêng Cho Phụ Huynh
            </div>
            <h1 className="text-display text-2xl sm:text-4xl font-black">
              Báo Cáo Học Tập Của Bé {user.name} 👨‍👩‍👧
            </h1>
            <p className="text-body-sm sm:text-body font-medium text-emerald-100 max-w-xl">
              Theo dõi sự tiến bộ, điểm mạnh tư duy và quản lý thời lượng tương tác màn hình lành mạnh cho con.
            </p>
          </div>

          <button
            onClick={handleReturnStudent}
            className="btn-touch-target self-start md:self-auto px-5 py-3 rounded-2xl font-bold text-sm text-emerald-950 bg-white hover:bg-emerald-50 shadow-md transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Chế độ Bé học</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Tổng thời gian học</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading font-black text-3xl text-slate-800">{totalMinutes} phút</span>
          <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Dữ liệu từ lịch sử học tập
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-sky-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Bài đã hoàn thành</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading font-black text-3xl text-slate-800">
            {user.completedLessons.length} bài
          </span>
          <p className="text-xs font-semibold text-sky-600 mt-1">
            Dữ liệu thực tế từ tài khoản
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Độ chính xác trung bình</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading font-black text-3xl text-slate-800">{avgAccuracy === null ? '—' : `${avgAccuracy}%`}</span>
          <p className="text-xs font-semibold text-amber-600 mt-1">
            {avgAccuracy === null ? 'Chưa đủ dữ liệu để đánh giá' : 'Tính từ các lần làm bài đã lưu'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Chuỗi ngày kiên trì</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading font-black text-3xl text-slate-800">
            {user.streak} ngày
          </span>
          <p className="text-xs font-semibold text-rose-600 mt-1">
            Thói quen học tập rất tốt
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left: Strengths & Focus Areas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-sm">
            <h2 className="font-heading text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span>Đánh Giá Năng Lực & Khuyến Nghị</span>
            </h2>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-sm mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Điểm mạnh từ dữ liệu thật:</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                {strongestCategory ? (
                  <>
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                      🟢 {strongestCategory.category}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {strongestCategory.accuracy}% chính xác qua {strongestCategory.total} lần hoàn thành.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-600">Chưa có đủ lịch sử học tập để tạo đánh giá.</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-amber-700 font-black text-sm mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>Chủ đề cần luyện thêm:</span>
              </div>
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
                {focusCategory ? (
                  <p className="text-xs text-slate-600">
                    {focusCategory.category}: {focusCategory.accuracy}% chính xác qua {focusCategory.total} lần hoàn thành.
                  </p>
                ) : (
                  <p className="text-xs text-slate-600">Cần thêm dữ liệu từ các bài đã làm.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parental Controls & Screen Time Goal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-sm">
            <h3 className="font-heading font-black text-xl text-slate-800 mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <span>Thiết Lập Thời Gian Học</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Khuyến nghị của chuyên gia giáo dục mầm non & tiểu học: 20–30 phút/ngày là thời lượng tối ưu.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-black text-slate-700 mb-2">
                  <span>Mục tiêu mỗi ngày:</span>
                  <span className="text-emerald-700 text-sm font-extrabold">{goalMinutes} phút/ngày</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={goalMinutes}
                  onChange={(e) => setGoalMinutes(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>10 phút (Nhẹ nhàng)</span>
                  <span>30 phút</span>
                  <span>60 phút (Tối đa)</span>
                </div>
              </div>

              {savedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-black rounded-xl border border-emerald-200 text-center animate-in fade-in">
                  ✓ Đã lưu cài đặt thời lượng học tập!
                </div>
              )}

              <button
                onClick={handleSaveGoal}
                className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
              >
                LƯU THIẾT LẬP THỜI LƯỢNG
              </button>
            </div>
          </div>

          {/* Expert Pedagogical Note */}
          <div className="bg-cyan-50/80 rounded-3xl p-6 border-2 border-cyan-200">
            <span className="text-2xl block mb-2">💡</span>
            <h4 className="font-heading font-black text-sm text-cyan-950 mb-1">
              Lời Khuyên Từ Chuyên Gia Sư Phạm:
            </h4>
            <p className="text-xs text-cyan-900 leading-relaxed font-semibold">
              "Hãy khen ngợi quá trình và sự kiên trì của trẻ ('Con đã rất tập trung suy nghĩ!') thay vì chỉ khen kết quả thông minh. Điều này hình thành tư duy phát triển bền bỉ (Growth Mindset)."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
