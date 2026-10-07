import React from 'react';
import { BookOpen, Target, ShieldCheck, Gift, Check, Sparkles } from 'lucide-react';

export const BenefitSection: React.FC = () => {
  const benefits = [
    {
      title: 'Nội dung chất lượng',
      description: 'Bài giảng chuẩn sư phạm toán học tương tác, kết hợp lý thuyết và tư duy logic phản xạ nhanh.',
      icon: '📚',
      accent: 'border-sky-200 bg-sky-50/60',
      tag: 'Chuẩn sư phạm',
    },
    {
      title: 'Học đúng trình độ',
      description: 'Lộ trình được phân chia 3 lứa tuổi rõ rệt (4–5, 6–8, 9–11) giúp bé không bị chán hay quá tải.',
      icon: '🎯',
      accent: 'border-amber-200 bg-amber-50/60',
      tag: 'Phân bậc thông minh',
    },
    {
      title: 'Môi trường an toàn',
      description: 'Không quảng cáo rác, không liên kết độc hại, bảo vệ mắt và tâm lý học tập tích cực cho bé.',
      icon: '🛡️',
      accent: 'border-emerald-200 bg-emerald-50/60',
      tag: '100% An toàn',
    },
    {
      title: 'Học tập có động lực',
      description: 'Cơ chế gamification: thăng cấp, mở rương, sưu tập huy hiệu giúp bé tự giác ngồi vào bàn học mỗi ngày.',
      icon: '🎁',
      accent: 'border-purple-200 bg-purple-50/60',
      tag: 'Tự giác & Vui vẻ',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Lý do phụ huynh tin tưởng
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Phương Pháp Học Tập Vượt Trội 💡
          </h2>
          <p className="mt-2 text-sm sm:text-base font-bold text-slate-500">
            Biến nỗi sợ môn Toán thành sự hào hứng tự nhiên qua từng cuộc phiêu lưu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 border-2 ${b.accent} shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-4 border border-white">
                  {b.icon}
                </div>
                <span className="text-[11px] font-black uppercase text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 inline-block mb-2">
                  {b.tag}
                </span>
                <h3 className="font-heading font-black text-xl text-slate-800 leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-2 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs">
                <Check className="w-4 h-4" />
                <span>Đã kiểm nghiệm</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
