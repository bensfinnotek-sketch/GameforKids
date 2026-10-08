import React, { ReactNode } from 'react';
import { Compass, Sparkles, ArrowLeft, Star, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BrandLogo } from '../common/BrandLogo';
import { soundManager } from '../../utils/sound';
import mathIsland from '../../assets/images/mini_math_island_1791350375195.jpg';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { navigateTo } = useGame();

  const handleGoHome = () => {
    soundManager.playClick();
    navigateTo('home');
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#fdfbf7] flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(224,242,254,.72), rgba(240,249,255,.9) 48%, rgba(253,251,247,.96)), url(${mathIsland})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      
      {/* BACKGROUND FLOATING MATH & ADVENTURE DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Soft sunlight aura from top-left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />

        {/* Floating clouds */}
        <div className="absolute top-8 left-12 text-white/80 text-4xl sm:text-5xl animate-float-slow opacity-85">
          ☁️
        </div>
        <div 
          className="absolute top-24 right-20 text-white/90 text-5xl sm:text-6xl animate-float-slow opacity-90 hidden sm:block" 
          style={{ animationDelay: '2s' }}
        >
          ☁️
        </div>
        <div 
          className="absolute bottom-32 left-10 text-white/70 text-4xl animate-float-slow hidden md:block" 
          style={{ animationDelay: '3.5s' }}
        >
          ☁️
        </div>

        {/* Floating Math Symbols with gentle animations */}
        <div className="absolute top-36 left-1/4 text-sky-400/40 text-3xl font-black rotate-12 animate-pulse motion-reduce:animate-none">
          +
        </div>
        <div className="absolute top-20 right-1/3 text-amber-400/40 text-4xl font-black -rotate-12 animate-bounce motion-reduce:animate-none" style={{ animationDuration: '6s' }}>
          ÷
        </div>
        <div className="absolute bottom-40 right-16 text-emerald-400/35 text-3xl font-black rotate-45 hidden sm:block">
          ×
        </div>
        <div className="absolute bottom-24 left-1/3 text-purple-400/35 text-3xl font-black -rotate-6 hidden lg:block">
          =
        </div>
        <div className="absolute top-1/2 left-8 text-amber-500/25 text-2xl font-black hidden xl:block">
          π
        </div>

        {/* Floating Cartoon Numbers 1, 2, 3 */}
        <div className="absolute top-48 left-16 w-10 h-10 rounded-2xl bg-amber-100/70 border border-amber-300/60 text-amber-600 font-extrabold flex items-center justify-center text-lg shadow-xs rotate-6 hidden md:flex animate-float-slow">
          1
        </div>
        <div className="absolute bottom-48 right-1/4 w-11 h-11 rounded-2xl bg-sky-100/70 border border-sky-300/60 text-sky-600 font-extrabold flex items-center justify-center text-xl shadow-xs -rotate-12 hidden lg:flex animate-float-slow" style={{ animationDelay: '1.2s' }}>
          2
        </div>
        <div className="absolute top-1/3 right-12 w-10 h-10 rounded-2xl bg-emerald-100/70 border border-emerald-300/60 text-emerald-600 font-extrabold flex items-center justify-center text-lg shadow-xs rotate-12 hidden xl:flex animate-float-slow" style={{ animationDelay: '2.5s' }}>
          3
        </div>

        {/* Geometric playful shapes */}
        <div className="absolute top-16 right-1/2 w-4 h-4 bg-amber-300/50 rounded-full animate-ping motion-reduce:animate-none" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-sky-400/40 rounded-sm rotate-45" />
        <div className="absolute top-2/3 right-8 w-5 h-5 border-2 border-dashed border-purple-300/50 rounded-full" />
      </div>

      {/* TOP HEADER: LOGO & BACK BUTTON */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        <div 
          onClick={handleGoHome} 
          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Về trang chủ Math Adventure Kids"
        >
          <BrandLogo size="md" showText={true} />
        </div>

        <button
          onClick={handleGoHome}
          className="btn-touch-target flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 hover:text-sky-600 text-caption sm:text-body-sm font-bold border border-slate-200/80 shadow-xs backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* DESKTOP LEFT COLUMN: HERO ILLUSTRATION & BRANDING */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 select-none pr-4">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-amber-300/80 shadow-xs self-start">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-caption font-extrabold text-amber-900 tracking-wide">
                Nền tảng Toán tư duy Gamification cho trẻ 4–11 tuổi
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-display text-3xl xl:text-4xl font-extrabold text-slate-900 leading-tight">
                Hành Trình Khám Phá <br />
                <span className="text-sky-600 underline decoration-amber-400 decoration-wavy decoration-2">
                  Đảo Toán Học Kỳ Thú!
                </span> 🏝️
              </h1>
              <p className="text-body text-slate-600 leading-relaxed font-medium max-w-lg">
                Biến mỗi phép tính thành một thử thách vui nhộn. Cùng Bé Thám Hiểm Mini thu thập huy hiệu, mở rương kho báu và tiến bộ mỗi ngày!
              </p>
            </div>

            {/* Immersive Island Artwork Card */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-sky-300 via-amber-200 to-emerald-200 group">
              <img
                src={mathIsland}
                alt="Đảo Toán Học Math Adventure Kids với Thám Hiểm Mini"
                className="w-full h-64 xl:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                    Khám phá bất tận
                  </span>
                  <span className="text-body-sm font-extrabold">
                    Hơn 450+ thử thách toán học sinh động
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-caption font-bold border border-white/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Cấp 1 - 10</span>
                </div>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-sky-100 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-caption font-extrabold text-slate-800">100% Kid-Safe</div>
                  <div className="text-[11px] text-slate-500 font-medium">Không quảng cáo & an toàn</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-amber-100 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
                </div>
                <div>
                  <div className="text-caption font-extrabold text-slate-800">Học mà chơi</div>
                  <div className="text-[11px] text-slate-500 font-medium">Say mê không áp lực</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (OR CENTER ON MOBILE): AUTH CARD */}
          <div className="lg:col-span-6 flex justify-center w-full">
            {children}
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-10 w-full py-4 text-center text-caption font-bold text-slate-400 select-none">
        <p>
          Math Adventure Kids © 2026 • "Biến mỗi bài Toán thành một chuyến phiêu lưu!" 🧭
        </p>
      </footer>

    </div>
  );
};
