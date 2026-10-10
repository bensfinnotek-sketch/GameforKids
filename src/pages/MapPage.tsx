import React, { useMemo, useState } from 'react';
import { CheckCircle2, Compass, Lock, MapPin, Play, Star, X, Trophy, Sparkles, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { World, Lesson } from '../types';
import { soundManager } from '../utils/sound';

const islandDecor = ['🌴', '🏰', '🌋', '🐚', '🗿', '🐉'];
const islandColors = [
  'from-amber-300 to-orange-500', 'from-emerald-300 to-teal-600',
  'from-rose-300 to-red-500', 'from-violet-300 to-indigo-500',
  'from-cyan-300 to-blue-500', 'from-yellow-300 to-amber-500',
];

export const MapPage: React.FC = () => {
  const { worlds, user, setActiveCategory, setActiveTab, setActiveLesson, lessons, activeAgeGroup, setActiveAgeGroup } = useGame();
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const ageLessons = useMemo(() => lessons.filter((lesson) => lesson.ageGroup === activeAgeGroup), [lessons, activeAgeGroup]);
  const completedCount = ageLessons.filter((lesson) => user.completedLessons.includes(lesson.id)).length;
  const progress = ageLessons.length ? Math.round(completedCount / ageLessons.length * 100) : 0;

  const openWorld = (world: World) => {
    soundManager.playClick();
    setSelectedWorld(world);
    setSelectedLesson(null);
  };
  const startLesson = (lesson: Lesson) => {
    soundManager.playCorrect();
    setActiveLesson(lesson);
    setActiveTab('learn');
    setSelectedWorld(null);
    setSelectedLesson(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-400 via-sky-500 to-blue-700 p-5 sm:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 opacity-35" aria-hidden="true">
          <div className="absolute -left-10 top-8 h-28 w-72 rounded-full bg-cyan-200 blur-2xl" />
          <div className="absolute right-0 top-28 h-36 w-56 rounded-full bg-blue-300 blur-2xl" />
          <div className="absolute left-1/3 bottom-4 h-20 w-72 rounded-full bg-cyan-300 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-amber-950"><Compass className="h-4 w-4" /> BẢN ĐỒ PHIÊU LƯU CỦA BÉ</span>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">Đại Dương Tri Thức 🗺️</h1>
            <p className="mt-2 max-w-xl text-sm font-semibold text-sky-50 sm:text-base">Mỗi bài học là một chuyến thám hiểm. Học xong, bản đồ sẽ ghi nhận dấu chân của con!</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[300px]">
            <div className="rounded-2xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur"><span className="block text-2xl font-black text-amber-200">{user.xp}</span><span className="text-[10px] font-bold uppercase">XP thật</span></div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur"><span className="block text-2xl font-black text-amber-200">{completedCount}</span><span className="text-[10px] font-bold uppercase">Bài đã học</span></div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur"><span className="block text-2xl font-black text-amber-200">{progress}%</span><span className="text-[10px] font-bold uppercase">Tiến độ</span></div>
          </div>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-[1.5rem] border-4 border-cyan-200/80 bg-[#078edb] shadow-inner">
          <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 20%, #67e8f9 0 2%, transparent 2.5%), radial-gradient(ellipse at 75% 60%, #38bdf8 0 2%, transparent 2.5%)', backgroundSize: '100px 75px, 130px 95px' }} />
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
            <path d="M90 320 C170 250 190 160 300 185 S420 315 500 250 S640 90 720 160 S850 300 920 95" fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="15 14" strokeLinecap="round" opacity=".95" />
          </svg>
          <div className="relative grid min-h-[410px] grid-cols-2 gap-3 p-3 sm:min-h-[430px] sm:grid-cols-3 sm:gap-5 sm:p-6">
            {worlds.map((world, index) => {
              const isUnlocked = world.isUnlocked || user.xp >= world.requiredXp;
              const worldLessons = ageLessons.filter((lesson) => lesson.worldId === world.id);
              const done = worldLessons.filter((lesson) => user.completedLessons.includes(lesson.id)).length;
              const stars = worldLessons.reduce((sum, lesson) => sum + (user.lessonStars[lesson.id] || 0), 0);
              const current = worldLessons.some((lesson) => !user.completedLessons.includes(lesson.id));
              return (
                <button key={world.id} type="button" onClick={() => openWorld(world)} className={`group relative flex min-h-[155px] flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-300 ${index % 2 === 0 ? 'sm:translate-y-4' : 'sm:-translate-y-1'} ${isUnlocked ? 'border-white/70 bg-white/15 shadow-lg backdrop-blur-sm' : 'border-white/20 bg-slate-900/20 opacity-80'}`}>
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-slate-700">{done}/{worldLessons.length} bài</span>
                  <span className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${islandColors[index % islandColors.length]} text-3xl shadow-[0_7px_0_rgba(15,23,42,.2)] ring-4 ring-cyan-100/70 transition group-hover:rotate-3 group-hover:scale-110`}>
                    {islandDecor[index % islandDecor.length]}
                    {done > 0 && <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white"><CheckCircle2 className="h-4 w-4" /></span>}
                    {!isUnlocked && <span className="absolute -bottom-1 -left-2 rounded-full bg-slate-800 p-1 text-white"><Lock className="h-3 w-3" /></span>}
                  </span>
                  <span className="mt-3 text-sm font-black leading-tight text-white drop-shadow sm:text-base">{world.name}</span>
                  <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-cyan-50"><Star className="h-3 w-3 fill-amber-300 text-amber-300" /> {stars} sao</span>
                  <span className="mt-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-sky-900">{isUnlocked ? (current ? 'TIẾP TỤC KHÁM PHÁ' : 'XEM LẠI ĐẢO') : `CẦN ${world.requiredXp} XP`}</span>
                </button>
              );
            })}
          </div>
          <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-white/20 bg-blue-950/20 px-4 py-3 text-xs font-bold text-white">
            <span>🧭 Mỗi hòn đảo mở ra những bài học phù hợp độ tuổi</span><span>🏆 Thành tích chỉ tính khi máy chủ lưu thành công</span>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl font-black text-slate-800">Hành trình học tập</h2><p className="mt-1 text-sm font-medium text-slate-500">Tiến độ tính từ tài khoản đang đăng nhập, không lấy thành tích mẫu.</p></div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600">Độ tuổi
            <select value={activeAgeGroup} onChange={(event) => setActiveAgeGroup(event.target.value as typeof activeAgeGroup)} className="rounded-xl border-2 border-sky-100 bg-sky-50 px-3 py-2 font-black text-sky-800">
              <option value="2-3">2–3 tuổi</option><option value="4-5">4–5 tuổi</option><option value="6-8">6–8 tuổi</option><option value="9-11">9–11 tuổi</option>
            </select>
          </label>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-100 p-0.5"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-500 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
        <div className="mt-2 flex justify-between text-xs font-black text-slate-500"><span>{completedCount} / {ageLessons.length} bài hoàn thành</span><span>{progress}%</span></div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-2 text-sm font-black text-emerald-900">Bài đã hoàn thành</p><p className="text-2xl font-black text-emerald-700">{completedCount}</p></div>
          <div className="rounded-2xl bg-amber-50 p-4"><Trophy className="h-5 w-5 text-amber-600" /><p className="mt-2 text-sm font-black text-amber-900">Sao đã nhận</p><p className="text-2xl font-black text-amber-700">{ageLessons.reduce((sum, lesson) => sum + (user.lessonStars[lesson.id] || 0), 0)}</p></div>
          <div className="rounded-2xl bg-sky-50 p-4"><Clock className="h-5 w-5 text-sky-600" /><p className="mt-2 text-sm font-black text-sky-900">Gợi ý cho gia đình</p><p className="mt-1 text-xs font-semibold text-sky-800">{activeAgeGroup === '2-3' ? 'Mỗi lượt 2–3 phút, học cùng người lớn.' : 'Khuyến khích học đều và nghỉ giải lao phù hợp.'}</p></div>
        </div>
      </section>

      {selectedWorld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selectedWorld.name}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border-4 border-sky-200 bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-black uppercase tracking-wider text-sky-600">Chặng {selectedWorld.order} • Bản đồ phiêu lưu</span><h2 className="mt-1 text-2xl font-black text-slate-800">{selectedWorld.icon} {selectedWorld.name}</h2><p className="mt-1 text-sm font-medium text-slate-500">{selectedWorld.description}</p></div><button onClick={() => { setSelectedWorld(null); setSelectedLesson(null); }} aria-label="Đóng" className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 space-y-3">
              {ageLessons.filter((lesson) => lesson.worldId === selectedWorld.id).map((lesson, index) => {
                const done = user.completedLessons.includes(lesson.id);
                const stars = user.lessonStars[lesson.id] || 0;
                const locked = !done && index > 0 && !user.completedLessons.includes(ageLessons.filter((item) => item.worldId === selectedWorld.id)[index - 1]?.id || '');
                return <div key={lesson.id} className={`flex items-center gap-3 rounded-2xl border-2 p-3 sm:p-4 ${done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-white'}`}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-3xl">{lesson.thumbnailEmoji}</span>
                  <div className="min-w-0 flex-1"><p className="font-black text-slate-800">{lesson.title}</p><p className="mt-1 text-xs font-semibold text-slate-500">{lesson.durationMinutes} phút • {lesson.totalQuestions} hoạt động • {done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</p><div className="mt-1 flex gap-0.5">{[1,2,3].map((n) => <Star key={n} className={`h-3.5 w-3.5 ${n <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />)}</div></div>
                  <button disabled={locked} onClick={() => startLesson(lesson)} className="shrink-0 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:from-slate-300 disabled:to-slate-300">{locked ? '🔒' : done ? 'Ôn lại' : 'Học ngay'}</button>
                </div>;
              })}
              {ageLessons.filter((lesson) => lesson.worldId === selectedWorld.id).length === 0 && <div className="rounded-2xl bg-amber-50 p-5 text-sm font-bold text-amber-900">Chặng này chưa có bài học cho độ tuổi đã chọn. Hãy chọn hòn đảo khác hoặc đổi độ tuổi.</div>}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-sky-50 p-3 text-xs font-semibold text-sky-900"><Sparkles className="h-4 w-4 shrink-0" /> Điểm thưởng chỉ được ghi nhận sau khi máy chủ xác nhận kết quả bài học.</div>
          </div>
        </div>
      )}
    </div>
  );
};
