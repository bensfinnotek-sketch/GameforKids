import React from 'react';
import { X, Sparkles, Coins, Gem, Star } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const RewardToast: React.FC = () => {
  const { currentReward, dismissReward } = useGame();

  if (!currentReward) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-amber-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-md border-2 border-white flex-shrink-0">
            {currentReward.icon || '🎁'}
          </div>
          <div>
            <h4 className="font-heading font-black text-sm text-slate-800 leading-tight">
              {currentReward.title}
            </h4>
            <p className="text-xs font-bold text-amber-600 mt-0.5">
              {currentReward.message}
            </p>
          </div>
        </div>

        <button
          onClick={dismissReward}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
