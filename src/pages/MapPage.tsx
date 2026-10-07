import React, { useState } from 'react';
import { 
  Lock, 
  Play, 
  Sparkles, 
  Star, 
  X, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { World, WorldNode } from '../types';
import { soundManager } from '../utils/sound';

export const MapPage: React.FC = () => {
  const { worlds, user, setActiveCategory, setActiveTab, setActiveLesson, lessons } = useGame();
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(null);

  const handleWorldClick = (w: World) => {
    soundManager.playClick();
    setSelectedWorld(w);
    setSelectedNode(null);
  };

  const handleNodeClick = (node: WorldNode) => {
    soundManager.playClick();
    setSelectedNode(node);
  };

  const handleEnterWorld = (w: World) => {
    if (!w.isUnlocked && user.xp < w.requiredXp) {
      soundManager.playWrong();
      return;
    }
    soundManager.playCorrect();
    setActiveCategory(w.category);
    setActiveTab('learn');
    setSelectedWorld(null);
  };

  const handleStartNodeLesson = (node: WorldNode) => {
    if (node.isLocked) {
      soundManager.playWrong();
      return;
    }
    if (node.lessonId) {
      const targetLesson = lessons.find((l) => l.id === node.lessonId);
      if (targetLesson) {
        soundManager.playCorrect();
        setActiveLesson(targetLesson);
        setActiveTab('learn');
        setSelectedWorld(null);
        setSelectedNode(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none">
      
      {/* Top Map Header */}
      <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        {/* Floating clouds */}
        <div className="absolute top-4 left-10 text-3xl opacity-60 animate-float-slow pointer-events-none">☁️</div>
        <div className="absolute top-12 right-20 text-4xl opacity-70 animate-float-slow pointer-events-none" style={{ animationDelay: '1.5s' }}>☁️</div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              Bản Đồ Hành Trình 6 Vùng Đất
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black">
              Khám Phá Thế Giới Toán Học 🗺️
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-sky-100 max-w-xl">
              Chinh phục các thử thách theo từng hòn đảo để mở khóa kho báu và lâu đài huyền thoại!
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 flex items-center gap-4">
            <span className="text-3xl">⭐</span>
            <div>
              <span className="text-[11px] font-bold text-sky-200 block">XP hiện tại</span>
              <span className="font-heading font-black text-2xl text-yellow-300">
                {user.xp} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Worlds Grid (6 Chapters) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {worlds.map((world) => {
          const isUnlocked = world.isUnlocked || user.xp >= world.requiredXp;
          const completedInWorld = world.nodes.filter((n) => user.completedLessons.includes(n.lessonId || '')).length;
          const totalStars = world.nodes.reduce((acc, n) => acc + (user.lessonStars[n.lessonId || ''] || 0), 0);
          const maxStars = world.nodes.length * 3;

          return (
            <div
              key={world.id}
              onClick={() => handleWorldClick(world)}
              className={`group relative rounded-3xl p-6 border-4 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-sky-100 hover:border-sky-400 shadow-md hover:shadow-2xl hover:-translate-y-1.5'
                  : 'bg-slate-100/80 border-slate-200 opacity-70 grayscale hover:grayscale-0'
              }`}
            >
              <div>
                {/* World Icon & Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${world.bgColor} shadow-md flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform`}>
                    {world.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mở khóa
                    </span>
                  ) : (
                    <span className="text-[11px] font-black text-slate-500 bg-slate-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Cần {world.requiredXp} XP
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-black uppercase tracking-wider text-sky-600 mb-1">
                  Chương {world.order}
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-800 group-hover:text-sky-600 transition-colors">
                  {world.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 mb-5 line-clamp-2">
                  {world.description}
                </p>

                {/* Stars and Level Progress */}
                <div className="flex items-center justify-between text-xs font-black text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-4">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{totalStars} / {maxStars} sao</span>
                  </span>
                  <span>
                    {completedInWorld} / {world.nodes.length} bài
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterWorld(world);
                }}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/25 group-hover:scale-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isUnlocked ? 'KHÁM PHÁ VÙNG ĐẤT' : 'CHƯA MỞ KHÓA'}</span>
                {isUnlocked && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* World Modal Detail Dialog (Popup when clicking a World node) */}
      {selectedWorld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-sky-300 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <button
              onClick={() => setSelectedWorld(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Đóng popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedWorld.bgColor} flex items-center justify-center text-3xl text-white shadow-lg`}>
                {selectedWorld.icon}
              </div>
              <div>
                <span className="text-xs font-black uppercase text-sky-600 tracking-wider">
                  Chương {selectedWorld.order} • Bản đồ phiêu lưu
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800">
                  {selectedWorld.name}
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {selectedWorld.description}
                </p>
              </div>
            </div>

            {/* Nodes inside this world (Interactive Roadmap) */}
            <div className="space-y-3 mb-6">
              <h4 className="font-heading font-black text-sm text-slate-700 uppercase tracking-wider">
                Các thử thách trong vùng đất:
              </h4>

              <div className="space-y-2.5">
                {selectedWorld.nodes.map((node, idx) => {
                  const isDone = user.completedLessons.includes(node.lessonId || '');
                  const stars = user.lessonStars[node.lessonId || ''] || 0;

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        selectedNode?.id === node.id
                          ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-300'
                          : isDone
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : node.isLocked
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl font-heading font-black text-sm flex items-center justify-center shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : node.isLocked
                            ? 'bg-slate-300 text-slate-600'
                            : 'bg-sky-500 text-white'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="font-heading font-black text-sm text-slate-800">
                            {node.name}
                          </h5>
                          <span className="text-[11px] font-bold text-slate-400">
                            Cấp độ {node.level}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Stars */}
                        <div className="flex items-center gap-0.5 text-sm">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= stars
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>

                        {node.isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartNodeLesson(node);
                            }}
                            className="px-3.5 py-1.5 rounded-xl font-black text-xs text-white bg-sky-500 hover:bg-sky-600 shadow-sm"
                          >
                            {isDone ? 'Ôn lại' : 'Học'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleEnterWorld(selectedWorld)}
                className="flex-1 py-3.5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 transition text-center flex items-center justify-center gap-2"
              >
                <span>VÀO THẾ GIỚI TOÁN HỌC 🚀</span>
              </button>
              <button
                onClick={() => setSelectedWorld(null)}
                className="py-3 px-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition text-xs"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
