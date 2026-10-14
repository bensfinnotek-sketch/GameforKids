import React from 'react';
import islandImage from '../../assets/images/mini_math_island_1791350375195.jpg';
import mascotImage from '../../assets/images/mini_mascot_avatar_1791350392100.jpg';
import { Sparkles, Play, ArrowRight, Star, Trophy, ShieldCheck, Flame } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

export const Hero: React.FC<{ onExploreMap: () => void }> = ({ onExploreMap }) => {
  const { setActiveTab, user } = useGame();

  const handleStartAdventure = () => {
    soundManager.playCorrect();
    setActiveTab('learn');
  };

  const handlePlayTrial = () => {
    soundManager.playClick();
    setActiveTab('games');
  };

  return (
    <section className="home-hero relative overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-100 to-[#f8fbff] pt-6 pb-12 sm:pt-10 sm:pb-16 select-none">
      {/* Decorative floating cartoon clouds & stars */}
      <div className="hero-sun" aria-hidden="true" />
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="absolute top-6 left-10 text-white/70 text-4xl animate-float-slow pointer-events-none">☁️</div>
      <div className="absolute top-20 right-16 text-white/80 text-5xl animate-float-slow pointer-events-none" style={{ animationDelay: '1.5s' }}>☁️</div>
      <div className="absolute bottom-20 left-1/4 text-white/50 text-3xl animate-float-slow pointer-events-none" style={{ animationDelay: '2.5s' }}>☁️</div>
      
      {/* Sparkle stars */}
      <div className="absolute top-12 left-1/3 text-amber-200 text-2xl pointer-events-none">✨</div>
      <div className="absolute top-36 right-1/4 text-yellow-300 text-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="absolute top-24 right-10 text-amber-200 text-xl animate-pulse pointer-events-none">✨</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 hero-copy">
            
            {/* Top Pill Tag: Personalization Greeting */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-amber-300 shadow-sm">
              <span className="text-xl">👋</span>
              <span className="text-xs sm:text-sm font-black text-amber-800 tracking-wide">
                Chào {user.name}! Bạn đã học liên tiếp {user.streak} ngày rồi đó!
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-sky-950 tracking-tight leading-[1.08] hero-title">
              CHINH PHỤC <br />
              <span className="text-teal-700 underline decoration-wavy decoration-amber-300">
                THẾ GIỚI TOÁN HỌC!
              </span> 🏝️
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl font-bold text-sky-900/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Mỗi phép tính là một bước tiến. <br className="hidden sm:inline" />
              Mỗi thử thách là một kho báu. 🎒✨
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={handleStartAdventure}
                className="w-full sm:w-auto min-h-14 px-7 py-4 rounded-2xl font-black text-base sm:text-lg text-amber-950 bg-amber-300 hover:bg-amber-200 shadow-md shadow-amber-900/10 hover:shadow-lg active:scale-[0.99] transition duration-200 border-2 border-white flex items-center justify-center gap-2.5 group"
              >
                <span>🚀 BẮT ĐẦU PHIÊU LƯU</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handlePlayTrial}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl font-black text-base text-sky-900 bg-white/95 hover:bg-white border-2 border-sky-200/80 shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>🎮 CHƠI THỬ</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-bold text-sky-900/80">
              <div className="flex items-center gap-1.5 bg-white/80 px-3.5 py-1.5 rounded-full border border-white/90">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>+1,000 bài tập sinh động</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>Học nhận Vàng & Huy hiệu</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% An toàn cho trẻ nhỏ</span>
              </div>
            </div>

          </div>

          {/* Right Visual Mascot & Island Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md sm:max-w-lg hero-artwork">
              
              {/* Island Illustration Card */}
              <div className="hero-island-card relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-gradient-to-tr from-sky-300 via-amber-200 to-emerald-200 group">
                <img
                  src={islandImage}
                  alt="Đảo Toán Học Math Adventure Kids với Thám Hiểm Mini"
                  className="w-full h-72 sm:h-80 md:h-96 object-cover object-center hero-island-image"
                />

                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                {/* Floating Coin on island */}
                <div className="absolute top-4 left-4 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 ">
                  <span>🪙</span>
                  <span>+50 Vàng chờ đón</span>
                </div>

                {/* Island Caption */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-heading font-black text-lg text-white drop-shadow">
                      Đảo Kho Báu Tri Thức
                    </h3>
                    <p className="text-xs font-semibold text-amber-200">
                      Cùng Mini vượt qua 6 quần đảo câu đố!
                    </p>
                  </div>
                  <span className="text-3xl">🏝️</span>
                </div>
              </div>

              {/* Floating Mini Mascot Stamp on Corner */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block">
                <div className="hero-mascot-stamp w-20 h-20 rounded-2xl bg-white p-1 shadow-xl border-2 border-amber-300 rotate-[-6deg] hover:rotate-0 transition-transform">
                  <img
                    src={mascotImage}
                    alt="Mini Mascot Avatar"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
