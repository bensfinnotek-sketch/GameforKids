import React from 'react';
import { Target, Flame, Sparkles, CheckCircle2, Gift, Clock, Star } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';

const getStudyDateKey = (value: string): string => {
  const input = (value || '').trim();
  const vietnameseDate = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (vietnameseDate) {
    const [, day, month, year] = vietnameseDate;
    return year + '-' + String(Number(month)).padStart(2, '0') + '-' + String(Number(day)).padStart(2, '0');
  }
  const isoDate = input.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.getFullYear() + '-' + String(parsed.getMonth() + 1).padStart(2, '0') + '-' + String(parsed.getDate()).padStart(2, '0');
};

export const ChallengesPage: React.FC = () => {
  const { dailyChallenges, claimDailyChallenge, user, setActiveTab } = useGame();

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weekDays = daysOfWeek.map((label, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return { label, date, dateKey, isToday: dateKey === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` };
  });
  const studiedDateKeys = new Set((user.history || [])
    .map((item) => getStudyDateKey(item.completedAt))
    .filter(Boolean));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Nhiệm Vụ Mỗi Ngày
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black">
              Thử Thách & Chuỗi Ngày Học 🔥
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-orange-100 max-w-xl">
              Chăm chỉ học tập mỗi ngày để duy trì ngọn lửa thám hiểm và nhận thêm nhiều phần quà bất ngờ!
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 flex items-center gap-4">
            <Flame className="w-10 h-10 text-yellow-300 fill-yellow-300 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-orange-100 block">Chuỗi hiện tại</span>
              <span className="font-heading font-black text-2xl text-white">
                {user.streak} ngày liên tiếp
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Calendar Tracker */}
      <div className="bg-white rounded-3xl p-6 border-2 border-orange-100 shadow-md mb-8">
        <h3 className="font-heading font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
          <span>Lịch Học Tập Tuần Này</span>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            Mục tiêu: Đều đặn mỗi ngày
          </span>
        </h3>

        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {weekDays.map(({ label, date, dateKey, isToday }) => {
            const isCompleted = studiedDateKeys.has(dateKey);

            return (
              <div
                key={dateKey}
                aria-label={`${label}, ngày ${date.getDate()}/${date.getMonth() + 1}: ${isCompleted ? 'đã học' : 'chưa học'}${isToday ? ', hôm nay' : ''}`}
                className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  isToday
                    ? 'border-orange-500 bg-orange-50/70 shadow-md ring-2 ring-orange-200'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <span className="text-xs font-black text-slate-500">{label}</span>
                <span className="text-[10px] font-bold text-slate-400">{date.getDate()}/{date.getMonth() + 1}</span>
                <span className="text-2xl sm:text-3xl my-1.5" aria-hidden="true">
                  {isCompleted ? '🔥' : '⏳'}
                </span>
                <span className={`text-[10px] font-black ${
                  isCompleted ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {isCompleted ? 'Đã học' : 'Chưa'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenges List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-black text-slate-800">
            Nhiệm Vụ Hôm Nay 🎯
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Tự động làm mới vào 00:00 mỗi đêm
          </span>
        </div>

        <div className="space-y-3.5">
          {dailyChallenges.map((challenge) => {
            const isDone = challenge.completed;
            const isClaimed = challenge.claimed;
            const progressPercent = Math.min(
              100,
              Math.round((challenge.currentCount / challenge.targetCount) * 100)
            );

            return (
              <div
                key={challenge.id}
                className={`p-5 rounded-3xl border-2 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isClaimed
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : isDone
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-100 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-3xl flex-shrink-0">
                    {challenge.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-black text-base text-slate-800">
                      {challenge.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {challenge.description}
                    </p>

                    {/* Mini progress bar */}
                    <div className="w-48 bg-slate-200 rounded-full h-2 overflow-hidden mt-1">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Right Rewards & Claim Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 block">Phần thưởng</span>
                    <span className="text-xs font-black text-amber-600">
                      +{challenge.rewardXP} XP • +{challenge.rewardGem} 💎
                    </span>
                  </div>

                  <div>
                    {isClaimed ? (
                      <span className="px-4 py-2 rounded-xl text-xs font-black text-slate-400 bg-slate-200 inline-block">
                        Đã nhận thưởng
                      </span>
                    ) : isDone ? (
                      <button
                        onClick={() => claimDailyChallenge(challenge.id)}
                        className="px-5 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 animate-bounce transition"
                      >
                        NHẬN THƯỞNG 🎁
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('learn')}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition"
                      >
                        Làm ngay ({challenge.currentCount}/{challenge.targetCount})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
