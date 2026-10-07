import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { AgeGroup } from '../../types';
import { soundManager } from '../../utils/sound';

export const AgeSelector: React.FC = () => {
  const { activeAgeGroup, setActiveAgeGroup, setActiveTab } = useGame();

  const ageCards: {
    id: AgeGroup;
    title: string;
    ageRange: string;
    subtitle: string;
    badgeEmoji: string;
    topics: string[];
    gradient: string;
    borderColor: string;
    buttonColor: string;
  }[] = [
    {
      id: '4-5',
      title: 'Nhà thám hiểm tí hon',
      ageRange: '4–5 tuổi',
      subtitle: 'Bước đầu làm quen thế giới số học kỳ diệu',
      badgeEmoji: '🐣',
      topics: [
        'Làm quen với số từ 1 đến 10',
        'Tập đếm đồ vật sinh động',
        'Nhận biết hình vuông, tròn, tam giác',
        'So sánh to hơn, nhỏ hơn, cao thấp',
      ],
      gradient: 'from-amber-400/10 via-amber-300/20 to-orange-400/10',
      borderColor: 'border-amber-300',
      buttonColor: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
    },
    {
      id: '6-8',
      title: 'Nhà thám hiểm nhí',
      ageRange: '6–8 tuổi',
      subtitle: 'Xây nền tảng tư duy toán tiểu học vững chắc',
      badgeEmoji: '🦊',
      topics: [
        'Cộng trừ nhanh trong phạm vi 20 & 100',
        'Bảng nhân chia cơ bản trực quan',
        'Hình học & Đo lường thực tế',
        'Bài toán có lời văn giàu trí tưởng tượng',
      ],
      gradient: 'from-sky-400/10 via-sky-300/20 to-blue-400/10',
      borderColor: 'border-sky-300',
      buttonColor: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/25',
    },
    {
      id: '9-11',
      title: 'Nhà thám hiểm tài năng',
      ageRange: '9–11 tuổi',
      subtitle: 'Bứt phá tư duy logic và toán thi đấu Olympic',
      badgeEmoji: '🦅',
      topics: [
        'Toán tư duy đa chiều & Phân số',
        'Logic suy luận & Chuỗi quy luật',
        'Diện tích, chu vi & Hình khối 3D',
        'Bài toán Olympic TIMO, SASMO, HKIMO',
      ],
      gradient: 'from-purple-400/10 via-purple-300/20 to-pink-400/10',
      borderColor: 'border-purple-300',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25',
    },
  ];

  const handleSelectAge = (group: AgeGroup) => {
    soundManager.playClick();
    setActiveAgeGroup(group);
    setActiveTab('learn');
  };

  return (
    <section className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Lộ trình cá nhân hóa
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Bạn đang ở cấp độ nào? 🎯
          </h2>
          <p className="mt-2 text-sm sm:text-base font-bold text-slate-500">
            Chọn nhóm tuổi phù hợp để Mini đưa bạn đến những hòn đảo thử thách vừa sức và cuốn hút nhất!
          </p>
        </div>

        {/* 3 Age Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ageCards.map((card) => {
            const isSelected = activeAgeGroup === card.id;

            return (
              <div
                key={card.id}
                className={`relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b ${card.gradient} border-4 ${
                  isSelected ? 'border-sky-500 ring-4 ring-sky-200' : card.borderColor
                } shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Active selection ribbon */}
                {isSelected && (
                  <div className="absolute -top-3.5 right-6 bg-sky-500 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đang chọn
                  </div>
                )}

                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl border-2 border-white">
                      {card.badgeEmoji}
                    </div>
                    <span className="font-black text-sm text-slate-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      {card.ageRange}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-black text-slate-800 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 mb-5">
                    {card.subtitle}
                  </p>

                  {/* Topic list */}
                  <div className="space-y-2.5 mb-6">
                    {card.topics.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-700">
                        <span className="text-amber-500 text-base leading-none">✓</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectAge(card.id)}
                  className={`w-full py-3.5 px-5 rounded-2xl font-black text-white text-sm shadow-md transition-all flex items-center justify-center gap-2 ${card.buttonColor} hover:scale-[1.02] active:scale-95`}
                >
                  <span>KHÁM PHÁ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
