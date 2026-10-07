import React from 'react';
import { Star, Gem, Coins, Trophy, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

export const RewardShowcaseSection: React.FC = () => {
  const { setActiveTab } = useGame();

  const rewards = [
    {
      name: 'Điểm Kinh Nghiệm (XP)',
      icon: '⭐',
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      description: 'Nhận sau mỗi câu trả lời đúng để thăng cấp danh hiệu thám hiểm.',
      example: '+50 XP',
    },
    {
      name: 'Ngọc Quý (Gems)',
      icon: '💎',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      description: 'Đá quý giá trị mở khóa trang phục đặc biệt và mũ phép thuật.',
      example: '+10 Gems',
    },
    {
      name: 'Tiền Vàng (Coins)',
      icon: '🪙',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      description: 'Tích lũy tiền vàng để sắm ba lô tên lửa và các vật phẩm trang trí.',
      example: '+30 Coins',
    },
    {
      name: 'Huy Hiệu Danh Dự',
      icon: '🏆',
      color: 'bg-rose-100 border-rose-300 text-rose-800',
      description: 'Vinh danh chuỗi học tập kiên trì và thành tích giải toán thần tốc.',
      example: 'Mở khóa Badge!',
    },
    {
      name: 'Rương Kho Báu',
      icon: '🎁',
      color: 'bg-teal-100 border-teal-300 text-teal-800',
      description: 'Mở rương bí mật khi hoàn thành các chặng phiêu lưu trên bản đồ.',
      example: 'Quà bất ngờ',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-amber-50/50 to-[#f7faff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Hệ thống Gamification
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Học Là Có Thưởng! 🎁✨
          </h2>
          <p className="mt-2 text-sm sm:text-base font-bold text-slate-500">
            Mỗi nỗ lực và sự tập trung của trẻ đều được ghi nhận tức thì với những phần quà hào hứng.
          </p>
        </div>

        {/* 5 Reward Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {rewards.map((r, i) => (
            <div
              key={i}
              className={`rounded-3xl p-5 border-2 ${r.color} shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl mb-3 border border-white mx-auto">
                  {r.icon}
                </div>
                <h3 className="font-heading font-black text-base text-slate-800 text-center leading-snug">
                  {r.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 text-center mt-2 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 text-center">
                <span className="inline-block bg-white text-slate-800 font-black text-xs px-3 py-1 rounded-full shadow-xs border border-slate-200">
                  {r.example}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner to Visit Treasure Store */}
        <div className="mt-10 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="text-5xl">🧸</span>
            <div>
              <h3 className="font-heading font-black text-2xl text-white">
                Ghé thăm Cửa Hàng Kho Báu của Mini!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-100 mt-1">
                Dùng Vàng và Ngọc đổi ngay Mũ Siêu Toán, Ba Lô Tên Lửa và Avatar độc quyền.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('treasure');
            }}
            className="w-full md:w-auto px-7 py-3.5 rounded-2xl font-black text-amber-900 bg-white hover:bg-amber-50 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 flex-shrink-0 text-sm"
          >
            <span>KHÁM PHÁ KHO BÁU</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
