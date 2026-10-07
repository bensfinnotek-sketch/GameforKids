import React from 'react';
import { 
  Calculator, 
  Brain, 
  Shapes, 
  Puzzle, 
  Languages, 
  Award, 
  ChevronRight, 
  Sparkles,
  CheckCircle2 
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SubjectCategory } from '../../types';
import { soundManager } from '../../utils/sound';

export const SubjectSelector: React.FC = () => {
  const { lessons, user, setActiveCategory, setActiveTab } = useGame();

  const subjects: {
    id: SubjectCategory;
    name: string;
    description: string;
    icon: typeof Calculator;
    emoji: string;
    bgColor: string;
    accentColor: string;
    badgeText: string;
  }[] = [
    {
      id: 'basic',
      name: 'Toán cơ bản',
      description: 'Số học, cộng trừ nhân chia và các phép tính quen thuộc hàng ngày.',
      icon: Calculator,
      emoji: '🔢',
      bgColor: 'bg-sky-50 hover:bg-sky-100/70 border-sky-200',
      accentColor: 'text-sky-600',
      badgeText: 'Cơ bản vững chắc',
    },
    {
      id: 'thinking',
      name: 'Toán tư duy',
      description: 'Rèn luyện khả năng quan sát, phân tích quy luật và giải quyết bài toán mở.',
      icon: Brain,
      emoji: '💡',
      bgColor: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200',
      accentColor: 'text-amber-600',
      badgeText: 'Tư duy nhạy bén',
    },
    {
      id: 'geometry',
      name: 'Hình học & Đo lường',
      description: 'Khám phá hình phẳng, hình khối 3D, chu vi, diện tích và chiếc cân thần kỳ.',
      icon: Shapes,
      emoji: '📐',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200',
      accentColor: 'text-emerald-600',
      badgeText: 'Không gian sống động',
    },
    {
      id: 'logic',
      name: 'Logic & Trí tuệ',
      description: 'Phát triển lập luận loại trừ, mê cung số học và các bài toán trinh thám.',
      icon: Puzzle,
      emoji: '🧩',
      bgColor: 'bg-purple-50 hover:bg-purple-100/70 border-purple-200',
      accentColor: 'text-purple-600',
      badgeText: 'Thử thách IQ',
    },
    {
      id: 'english-math',
      name: 'Toán tiếng Anh',
      description: 'Học thuật ngữ toán học quốc tế và giải bài toán song ngữ vui nhộn.',
      icon: Languages,
      emoji: '🇬🇧',
      bgColor: 'bg-teal-50 hover:bg-teal-100/70 border-teal-200',
      accentColor: 'text-teal-600',
      badgeText: 'Hội nhập quốc tế',
    },
    {
      id: 'olympic',
      name: 'Olympic Math',
      description: 'Kho đề thi đấu trí tuệ TIMO, HKIMO, SASMO dành cho bạn nhỏ đam mê thử thách.',
      icon: Award,
      emoji: '🏆',
      bgColor: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200',
      accentColor: 'text-rose-600',
      badgeText: 'Đỉnh cao chinh phục',
    },
  ];

  const handleSelectSubject = (id: SubjectCategory) => {
    soundManager.playClick();
    setActiveCategory(id);
    setActiveTab('learn');
  };

  return (
    <section className="py-12 sm:py-16 bg-[#f7faff] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Chương trình toàn diện
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Chọn nhiệm vụ hôm nay 🎒
            </h2>
            <p className="mt-1 text-sm sm:text-base font-bold text-slate-500">
              6 phân môn được thiết kế khoa học theo phương pháp vừa học vừa phiêu lưu.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveTab('learn');
            }}
            className="self-start md:self-auto font-black text-sm text-sky-600 hover:text-sky-700 bg-white px-4 py-2 rounded-2xl border border-sky-200 shadow-sm hover:shadow flex items-center gap-1.5 transition"
          >
            <span>Xem tất cả bài học</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => {
            const subjectLessons = lessons.filter((l) => l.category === s.id);
            const completedInSubject = subjectLessons.filter((l) =>
              user.completedLessons.includes(l.id)
            ).length;
            const totalXP = subjectLessons.reduce((acc, curr) => acc + curr.xpReward, 0);
            const progressPercent =
              subjectLessons.length > 0
                ? Math.round((completedInSubject / subjectLessons.length) * 100)
                : 0;

            return (
              <div
                key={s.id}
                onClick={() => handleSelectSubject(s.id)}
                className={`group relative rounded-3xl p-6 border-2 ${s.bgColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar with Icon and Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl border border-slate-100 group-hover:scale-110 transition-transform">
                      {s.emoji}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200">
                      {s.badgeText}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-800 group-hover:text-sky-600 transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 mb-5 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* Progress & XP Info */}
                <div className="pt-4 border-t border-slate-200/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-500">
                      {completedInSubject}/{subjectLessons.length} bài học
                    </span>
                    <span className="text-amber-600 flex items-center gap-1 font-extrabold">
                      ⭐ +{totalXP} XP
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-slate-400">
                      Tiến độ: {progressPercent}%
                    </span>
                    <span className="text-xs font-black text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Vào học ngay ➔
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
