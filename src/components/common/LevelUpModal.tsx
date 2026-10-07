import React from 'react';
import { Trophy, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, closeLevelUpModal, setActiveTab } = useGame();

  if (!levelUpModalData) return null;

  const handleContinue = () => {
    soundManager.playClick();
    closeLevelUpModal();
  };

  const handleExploreTreasure = () => {
    soundManager.playClick();
    closeLevelUpModal();
    setActiveTab('treasure');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-white to-sky-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center animate-in zoom-in-95">
        
        {/* Glow & Sparkles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-2 shadow-xl border-4 border-white flex items-center justify-center animate-bounce">
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Chúc mừng thám hiểm nhí!
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
            LÊN CẤP {levelUpModalData.newLevel}! 🎉
          </h2>

          <p className="mt-2 text-base font-bold text-slate-700">
            Danh hiệu mới: <span className="text-sky-600 font-extrabold">{levelUpModalData.title}</span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Bạn đã mở khóa thêm nhiều nhiệm vụ và phần thưởng giá trị trên Đảo Toán Học!
          </p>

          {/* Rewards granted */}
          <div className="mt-6 bg-white p-4 rounded-2xl border-2 border-amber-200/80 shadow-inner grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              <span className="text-2xl">🪙</span>
              <span className="text-xs font-bold text-slate-500">Thưởng cấp độ</span>
              <span className="text-sm font-black text-amber-600">+100 Tiền Vàng</span>
            </div>
            <div className="flex flex-col items-center bg-purple-50 p-2.5 rounded-xl border border-purple-100">
              <span className="text-2xl">💎</span>
              <span className="text-xs font-bold text-slate-500">Thưởng cấp độ</span>
              <span className="text-sm font-black text-purple-600">+20 Ngọc Bích</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleContinue}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5"
            >
              TIẾP TỤC KHÁM PHÁ ⭐
            </button>
            <button
              onClick={handleExploreTreasure}
              className="w-full py-3 px-4 rounded-2xl font-extrabold text-sky-700 bg-sky-100/80 hover:bg-sky-200/80 border border-sky-200 transition text-sm flex items-center justify-center gap-1.5"
            >
              <span>Xem Kho Báu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
