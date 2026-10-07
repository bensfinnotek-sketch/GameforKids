import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AgeGroup } from '../types';
import { soundManager } from '../utils/sound';

export const AgesPage: React.FC = () => {
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
    description: string;
  }[] = [
    {
      id: '4-5',
      title: 'Nhà thám hiểm tí hon',
      ageRange: '4–5 tuổi',
      subtitle: 'Bước đầu làm quen thế giới số học kỳ diệu',
      badgeEmoji: '🐣',
      topics: [
        'Đếm đồ vật & quả ngọt từ 1 đến 10',
        'Nhận biết số lượng & chữ số',
        'Màu sắc rực rỡ & Hình khối cơ bản',
        'So sánh to hơn, nhỏ hơn, cao thấp',
      ],
      description: 'Chương trình được thiết kế với hình ảnh hoạt hình to lớn, âm thanh vui nhộn giúp bé mầm non hào hứng làm quen với Toán học tự nhiên.',
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
        'Phép cộng & trừ trong phạm vi 20 và 100',
        'Bảng cửu chương nhân chia cơ bản',
        'Đo lường, xem đồng hồ & Cân bập bênh',
        'Bài toán có lời văn giàu trí tưởng tượng',
        'Logic suy luận & Chuỗi quy luật hình',
      ],
      description: 'Giúp học sinh lớp 1, 2, 3 giải quyết nhanh các bài toán trường lớp và phát triển khả năng tính nhẩm tự tin qua từng màn chơi.',
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
        'Phân số, số thập phân & Tỷ số phần trăm',
        'Số học nâng cao & Dãy số có quy luật',
        'Logic suy luận loại trừ & Bảng chân lý',
        'Hình học không gian, chu vi & diện tích',
        'Đề thi thử Olympic Toán TIMO, SASMO, HKIMO',
      ],
      description: 'Thử thách trí tuệ đỉnh cao cho học sinh lớp 4, 5 với các phương pháp giải toán tư duy hiện đại không rập khuôn máy móc.',
      gradient: 'from-purple-400/10 via-purple-300/20 to-pink-400/10',
      borderColor: 'border-purple-300',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25',
    },
  ];

  const handleSelect = (group: AgeGroup) => {
    soundManager.playCorrect();
    setActiveAgeGroup(group);
    setActiveTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 select-none">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Phân Tầng Theo Năng Lực
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-slate-800 tracking-tight">
          Chọn Hành Trình Của Bạn 🎯
        </h1>
        <p className="mt-3 text-sm sm:text-base font-bold text-slate-500">
          Hãy chọn cấp độ độ tuổi phù hợp để Mini điều chỉnh độ khó và nội dung vừa vặn nhất cho bé!
        </p>
      </div>

      {/* 3 Interactive Age Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ageCards.map((card) => {
          const isSelected = activeAgeGroup === card.id;

          return (
            <div
              key={card.id}
              className={`relative rounded-3xl p-7 bg-gradient-to-b ${card.gradient} border-4 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 ring-4 ring-sky-200 shadow-2xl scale-[1.02]'
                  : `${card.borderColor} shadow-lg hover:shadow-2xl hover:-translate-y-2`
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3.5 right-6 bg-sky-500 text-white font-black text-[11px] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đang chọn
                </div>
              )}

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl border-2 border-white">
                    {card.badgeEmoji}
                  </div>
                  <span className="font-heading font-black text-sm text-slate-800 bg-white/95 px-4 py-1.5 rounded-full border border-slate-200 shadow-xs">
                    {card.ageRange}
                  </span>
                </div>

                <h2 className="font-heading text-2xl font-black text-slate-800 leading-snug">
                  {card.title}
                </h2>
                <p className="text-xs font-bold text-slate-500 mt-1 mb-4">
                  {card.subtitle}
                </p>

                <p className="text-xs font-semibold text-slate-600 mb-6 leading-relaxed bg-white/60 p-3.5 rounded-2xl border border-white">
                  {card.description}
                </p>

                {/* Topics checklist */}
                <div className="space-y-2.5 mb-8">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                    Nội dung trọng tâm:
                  </span>
                  {card.topics.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-700">
                      <span className="text-amber-500 font-extrabold text-base leading-none">✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelect(card.id)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-white text-sm shadow-md transition-all flex items-center justify-center gap-2 ${card.buttonColor} hover:scale-[1.02] active:scale-95`}
              >
                <span>CHỌN CẤP ĐỘ NÀY 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
