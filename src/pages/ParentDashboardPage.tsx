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
  ArrowLeft,
  BookOpen,
  History,
  Download
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

export const ParentDashboardPage: React.FC = () => {
  const { user, updateDailyGoal, setActiveTab, switchRole } = useGame();
  const [goalMinutes, setGoalMinutes] = useState(user.dailyStudyGoalMinutes || 20);
  const [savedMsg, setSavedMsg] = useState(false);

  const [historyCategory, setHistoryCategory] = useState('all');
  const [historyPeriod, setHistoryPeriod] = useState<'all' | '7' | '30'>('all');
  const [historyLimit, setHistoryLimit] = useState(5);
  const historyCategories = Array.from(new Set(user.history.map((item) => item.category)));
  const categoryFilteredHistory = historyCategory === 'all'
    ? user.history
    : user.history.filter((item) => item.category === historyCategory);
  const filteredHistory = historyPeriod === 'all'
    ? categoryFilteredHistory
    : categoryFilteredHistory.filter((item) => {
        // completedAt is stored as dd/mm/yyyy in the Vietnamese locale.
        const match = item.completedAt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (!match) return false;
        const completedDate = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
        if (Number.isNaN(completedDate.getTime())) return false;
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        startDate.setDate(startDate.getDate() - (Number(historyPeriod) - 1));
        return completedDate >= startDate && completedDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      });

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

  const handleExportHistory = () => {
    if (filteredHistory.length === 0) return;

    const escapeCsvCell = (value: string | number) => {
      let safeValue = String(value);
      // Prevent spreadsheet formula injection from user-generated text fields.
      if (/^[=+@\-\t\r]/.test(safeValue)) safeValue = `'${safeValue}`;
      return `"${safeValue.replace(/"/g, '""')}"`;
    };
    const rows = [
      ['Thời gian hoàn thành', 'Tên bài học', 'Môn học', 'Điểm', 'Tổng câu hỏi', 'Độ chính xác (%)', 'Thời gian (giây)', 'Sao đạt được'],
      ...filteredHistory.map((item) => [
        item.completedAt,
        item.lessonTitle,
        item.category,
        item.score,
        item.totalQuestions,
        Math.max(0, Math.min(100, item.accuracy)),
        Math.max(0, item.timeSpentSeconds),
        item.starsEarned
      ])
    ];
    const csv = '\uFEFF' + rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-hoc-tap-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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

      {/* Recent Learning Activity */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-sm mb-8" aria-labelledby="recent-learning-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 id="recent-learning-heading" className="font-heading text-xl font-black text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-sky-600" /> Hoạt động học tập gần đây
            </h2>
            <p className="text-sm text-slate-500 mt-1">Xem lại những bài bé đã hoàn thành gần nhất.</p>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
            {Math.min(filteredHistory.length, historyLimit)} / {filteredHistory.length} hoạt động phù hợp
          </span>
        </div>
        {user.history.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc hoạt động theo môn học">
            <button
              type="button"
              onClick={() => { setHistoryCategory('all'); setHistoryLimit(5); }}
              aria-pressed={historyCategory === 'all'}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${historyCategory === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-sky-50'}`}
            >
              Tất cả
            </button>
            {historyCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => { setHistoryCategory(category); setHistoryLimit(5); }}
                aria-pressed={historyCategory === category}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${historyCategory === category ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-sky-50'}`}
              >
                {category}
              </button>
            ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Lọc hoạt động theo khoảng thời gian">
                {([
                  { value: 'all', label: 'Mọi thời điểm' },
                  { value: '7', label: '7 ngày qua' },
                  { value: '30', label: '30 ngày qua' },
                ] as const).map((period) => (
                  <button
                    key={period.value}
                    type="button"
                    onClick={() => { setHistoryPeriod(period.value); setHistoryLimit(5); }}
                    aria-pressed={historyPeriod === period.value}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${historyPeriod === period.value ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'}`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportHistory}
              disabled={filteredHistory.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <Download className="w-4 h-4" />
              Tải báo cáo CSV
            </button>
          </div>
        )}
        {user.history.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-sky-100 p-6 text-center">
            <BookOpen className="w-9 h-9 mx-auto text-sky-500" />
            <p className="mt-3 font-bold text-slate-700">Chưa có hoạt động học tập</p>
            <p className="mt-1 text-sm text-slate-500">Khi bé hoàn thành bài học, lịch sử sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.slice(0, historyLimit).map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="rounded-xl bg-sky-50 p-3 text-sky-700 shrink-0"><BookOpen className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 break-words">{item.lessonTitle}</h3>
                    <p className="mt-1 text-xs text-slate-500">{item.category} · {item.completedAt}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{Math.floor(Math.max(0, item.timeSpentSeconds) / 60)} phút {Math.max(0, item.timeSpentSeconds) % 60} giây học tập</p>
                  </div>
                </div>
                <div className="sm:min-w-36">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">Độ chính xác</span>
                    <span className="text-sky-800">{Math.max(0, Math.min(100, item.accuracy))}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-label={`Độ chính xác bài ${item.lessonTitle}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.max(0, Math.min(100, item.accuracy))}>
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.max(0, Math.min(100, item.accuracy))}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {filteredHistory.length > 5 && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setHistoryLimit((current) => current >= filteredHistory.length ? 5 : filteredHistory.length)}
              className="rounded-xl border border-sky-200 bg-white px-5 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              aria-expanded={historyLimit >= filteredHistory.length}
            >
              {historyLimit >= filteredHistory.length ? 'Thu gọn lịch sử' : `Xem thêm ${filteredHistory.length - Math.min(historyLimit, filteredHistory.length)} hoạt động`}
            </button>
          </div>
        )}
        {user.history.length > 0 && filteredHistory.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-sky-100 p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-sky-500" />
            <p className="mt-3 font-bold text-slate-700">Chưa có hoạt động trong chủ đề này</p>
            <p className="mt-1 text-sm text-slate-500">Hãy chọn môn khác hoặc xem tất cả hoạt động.</p>
          </div>
        )}
      </section>

    </div>
  );
};
