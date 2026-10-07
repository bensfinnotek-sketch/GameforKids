import React from 'react';
import { Target, CheckCircle2, Gift, Sparkles, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

export const DailyChallengeWidget: React.FC = () => {
  const { dailyChallenges, claimDailyChallenge, setActiveTab } = useGame();

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl border border-amber-200">
            🎯
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-slate-800 leading-tight">
              Nhiệm Vụ Hôm Nay
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Hoàn thành để nhận thêm Vàng và Ngọc quý!
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('challenges')}
          className="text-xs font-black text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition"
        >
          Xem tất cả ➔
        </button>
      </div>

      <div className="space-y-3">
        {dailyChallenges.slice(0, 3).map((c) => {
          const isDone = c.completed;
          const isClaimed = c.claimed;

          return (
            <div
              key={c.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isClaimed
                  ? 'bg-slate-50 border-slate-200 opacity-70'
                  : isDone
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 leading-tight">
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Tiến độ: {c.currentCount}/{c.targetCount}
                    </span>
                    <span className="text-[11px] font-black text-amber-600">
                      +{c.rewardXP} XP • +{c.rewardGem} 💎
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {isClaimed ? (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
                    Đã nhận
                  </span>
                ) : isDone ? (
                  <button
                    onClick={() => claimDailyChallenge(c.id)}
                    className="px-3.5 py-1.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 animate-pulse transition"
                  >
                    NHẬN THƯỞNG 🎁
                  </button>
                ) : (
                  <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
                    Chưa xong
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
