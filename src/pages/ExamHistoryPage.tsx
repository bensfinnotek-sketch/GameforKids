import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock3, History, RefreshCw, Trophy, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { fetchExamAttemptHistory } from '../firebase/auth';
import type { TrustedExamAttemptHistoryItem } from '../firebase/auth';

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return 'Thời gian chưa có';
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  return `${Math.floor(safeSeconds / 60)} phút ${safeSeconds % 60} giây`;
};

export const ExamHistoryPage: React.FC = () => {
  const { setActiveTab, isAuthenticated, authReady } = useGame();
  const [attempts, setAttempts] = useState<TrustedExamAttemptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'needs-practice'>('all');

  const loadHistory = useCallback(async () => {
    if (!authReady) return;
    if (!isAuthenticated) {
      setAttempts([]);
      setLoading(false);
      setError('Đăng nhập để xem lịch sử luyện thi của tài khoản.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await fetchExamAttemptHistory(20);
    if (result === null) {
      setError('Chưa tải được lịch sử. Hãy kiểm tra kết nối rồi thử lại.');
    } else {
      setAttempts(result);
    }
    setLoading(false);
  }, [authReady, isAuthenticated]);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
    : 0;
  const bestScore = attempts.length
    ? Math.max(...attempts.map((attempt) => attempt.score))
    : 0;
  const latestScoreChange = attempts.length > 1
    ? attempts[0].score - attempts[1].score
    : null;

  const filteredAttempts = attempts.filter((attempt) => {
    if (scoreFilter === 'high') return attempt.score >= 80;
    if (scoreFilter === 'needs-practice') return attempt.score < 80;
    return true;
  });

  return (
    <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
      <button onClick={() => setActiveTab('exam')} className="mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white">
        <ArrowLeft className="h-4 w-4" /> Quay lại phòng luyện thi
      </button>
      <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-xl">
        <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><History className="h-7 w-7" /></div>
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">Lịch sử luyện thi</h1>
              <p className="mt-1 text-sm text-blue-50">Theo dõi điểm số qua từng lần làm bài của bé.</p>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-500">Hiển thị tối đa 20 lần làm bài gần nhất.</p>
            <button onClick={() => void loadHistory()} disabled={loading || !isAuthenticated} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
            </button>
          </div>
          {loading ? (
            <div className="rounded-2xl bg-sky-50 p-8 text-center font-bold text-sky-800">Đang tải lịch sử luyện thi…</div>
          ) : error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="font-bold text-amber-900">{error}</p>
              {isAuthenticated && <button onClick={() => void loadHistory()} className="mt-4 rounded-xl bg-amber-500 px-4 py-2 font-black text-white">Thử lại</button>}
            </div>
          ) : attempts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-sky-100 p-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-sky-500" />
              <h2 className="mt-3 text-lg font-black text-slate-800">Chưa có lượt thi nào</h2>
              <p className="mt-1 text-sm text-slate-500">Bắt đầu làm bài thi thử để kết quả xuất hiện tại đây nhé!</p>
              <button onClick={() => setActiveTab('exam')} className="mt-4 rounded-xl bg-sky-600 px-5 py-3 font-black text-white">Bắt đầu luyện thi</button>
            </div>
          ) : (
            <>
              <section aria-label="Tổng quan tiến bộ" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <article className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-700"><BarChart3 className="h-4 w-4" /> Điểm trung bình</div>
                  <div className="mt-2 text-3xl font-black text-indigo-950">{averageScore}<span className="ml-1 text-base font-bold text-indigo-600">/100</span></div>
                  <p className="mt-1 text-xs font-medium text-indigo-700">Dựa trên {attempts.length} lượt gần nhất</p>
                </article>
                <article className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-700"><Trophy className="h-4 w-4" /> Điểm cao nhất</div>
                  <div className="mt-2 text-3xl font-black text-amber-950">{bestScore}<span className="ml-1 text-base font-bold text-amber-600">/100</span></div>
                  <p className="mt-1 text-xs font-medium text-amber-700">Thành tích tốt nhất trong danh sách</p>
                </article>
                <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700"><TrendingUp className="h-4 w-4" /> So với lần trước</div>
                  {latestScoreChange === null ? (
                    <div className="mt-2 text-lg font-black text-emerald-950">Cần thêm lượt thi</div>
                  ) : (
                    <div className="mt-2 text-3xl font-black text-emerald-950">
                      {latestScoreChange > 0 ? '+' : ''}{latestScoreChange}
                      <span className="ml-1 text-base font-bold text-emerald-700">điểm</span>
                    </div>
                  )}
                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    {latestScoreChange === null ? 'Làm thêm bài để xem sự thay đổi' : latestScoreChange > 0 ? 'Điểm tăng so với lượt ngay trước' : latestScoreChange < 0 ? 'Tiếp tục luyện tập để cải thiện nhé' : 'Điểm giữ nguyên so với lượt trước'}
                  </p>
                </article>
              </section>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-black text-slate-700"><Target className="h-4 w-4 text-sky-600" /> Các lượt làm bài</div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc lượt thi theo điểm số">
                  {([
                    { value: 'all', label: 'Tất cả' },
                    { value: 'high', label: 'Từ 80 điểm' },
                    { value: 'needs-practice', label: 'Dưới 80 điểm' },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setScoreFilter(option.value)}
                      aria-pressed={scoreFilter === option.value}
                      className={`rounded-full px-3 py-2 text-xs font-bold transition ${scoreFilter === option.value ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-sky-50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mb-3 text-xs font-semibold text-slate-500">Đang hiển thị {filteredAttempts.length}/{attempts.length} lượt thi.</p>
              {filteredAttempts.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-sky-100 p-6 text-center">
                  <Target className="mx-auto h-8 w-8 text-sky-500" />
                  <p className="mt-3 font-bold text-slate-700">Chưa có lượt thi phù hợp</p>
                  <p className="mt-1 text-sm text-slate-500">Thử bộ lọc khác để xem các kết quả còn lại.</p>
                </div>
              ) : (
                <div className="space-y-3">
                {filteredAttempts.map((attempt) => {
                  const accuracy = attempt.totalQuestions > 0 ? Math.round(attempt.correctCount / attempt.totalQuestions * 100) : 0;
                  return (
                    <article key={attempt.id} className="rounded-2xl border border-slate-100 p-4 transition hover:border-sky-200 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><Trophy className="h-6 w-6" /></div>
                          <div>
                            <h2 className="font-black text-slate-800">Lần làm bài #{attempts.length - attempts.findIndex((item) => item.id === attempt.id)}</h2>
                            <p className="mt-1 text-sm text-slate-500">{formatDate(attempt.submittedAt)}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500"><Clock3 className="mr-1 inline h-3.5 w-3.5" /> {formatDuration(attempt.timeSpentSeconds)} · {attempt.answeredCount}/{attempt.totalQuestions} câu đã trả lời</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-5 rounded-xl bg-sky-50 px-4 py-3 sm:min-w-44">
                          <div><div className="text-xs font-bold text-sky-700">Điểm số</div><div className="text-2xl font-black text-sky-900">{attempt.score}/100</div></div>
                          <div className="text-right"><div className="text-xs font-bold text-slate-500">Chính xác</div><div className="font-black text-slate-800">{accuracy}%</div></div>
                        </div>
                      </div>
                    </article>
                  );
                })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};
