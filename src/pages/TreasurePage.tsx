import React, { useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Gem, 
  Check, 
  ShoppingBag, 
  Shirt, 
  Filter, 
  Lock, 
  Crown,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TreasureItem } from '../types';
import { soundManager } from '../utils/sound';

export const TreasurePage: React.FC = () => {
  const { user, treasureItems, purchaseItem, equipItem } = useGame();
  const [activeFilter, setActiveFilter] = useState<'all' | 'hat' | 'backpack' | 'avatar' | 'skin'>('all');
  const [purchaseMsg, setPurchaseMsg] = useState<{ text: string; success: boolean } | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả kho báu' },
    { id: 'hat', label: 'Mũ & Nón' },
    { id: 'backpack', label: 'Ba Lô' },
    { id: 'avatar', label: 'Avatar' },
    { id: 'skin', label: 'Trang Phục' },
  ];

  const filteredItems = treasureItems.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  const handleBuy = (item: TreasureItem) => {
    const res = purchaseItem(item);
    setPurchaseMsg({ text: res.message, success: res.success });
    setTimeout(() => setPurchaseMsg(null), 4000);
  };

  const handleEquip = (item: TreasureItem) => {
    equipItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Shop Hero Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Cửa Hàng Kho Báu
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black">
              Đổi Quà & Trang Bị Thám Hiểm 🎁
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-amber-100 max-w-xl">
              Dùng tiền vàng và ngọc quý thu thập được từ các bài toán để sắm đồ diện cho Mini!
            </p>
          </div>

          {/* User Wallet Balance */}
          <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 flex items-center gap-6 self-start md:self-auto">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-bounce">🪙</span>
              <div>
                <span className="text-[11px] font-bold text-amber-200 block">Tiền Vàng</span>
                <span className="font-heading font-black text-2xl text-white">{user.coin}</span>
              </div>
            </div>
            <div className="border-l border-white/20 pl-6 flex items-center gap-2">
              <span className="text-3xl">💎</span>
              <div>
                <span className="text-[11px] font-bold text-purple-200 block">Ngọc Quý</span>
                <span className="font-heading font-black text-2xl text-white">{user.gem}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message alert if any */}
      {purchaseMsg && (
        <div className={`mb-6 p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-2 animate-in fade-in ${
          purchaseMsg.success 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          <span>{purchaseMsg.success ? '🎉' : '⚠️'}</span>
          <span>{purchaseMsg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              soundManager.playClick();
              setActiveFilter(c.id as unknown as typeof activeFilter);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
              activeFilter === c.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isOwned = user.inventory.includes(item.id);
          const isEquippedHat = user.equippedHat === item.id;
          const isEquippedPack = user.equippedBackpack === item.id;
          const isEquipped = isEquippedHat || isEquippedPack;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                isEquipped
                  ? 'border-emerald-400 ring-2 ring-emerald-200 bg-emerald-50/20'
                  : isOwned
                  ? 'border-sky-200 bg-sky-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Item Preview Card */}
                <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-amber-50 to-sky-50 flex items-center justify-center text-6xl mb-4 border border-slate-100 shadow-inner group">
                  {item.previewEmoji}

                  {isEquipped && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đang mặc
                    </span>
                  )}
                  {isOwned && !isEquipped && (
                    <span className="absolute top-2.5 right-2.5 bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      Đã sở hữu
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 font-black text-xs">
                    {item.priceType === 'gem' ? (
                      <span className="text-purple-600 flex items-center gap-0.5">
                        💎 {item.price}
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-0.5">
                        🪙 {item.price}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-heading font-black text-lg text-slate-800 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 mb-4 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                {isOwned ? (
                  item.isEquippable ? (
                    <button
                      onClick={() => handleEquip(item)}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                        isEquipped
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm'
                      }`}
                    >
                      {isEquipped ? 'Tháo ra' : 'Trang bị cho Mini 🎒'}
                    </button>
                  ) : (
                    <div className="text-center text-xs font-black text-emerald-600 py-2">
                      Đã mở khóa vĩnh viễn ✅
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 transition hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>MUA NGAY ({item.priceType === 'gem' ? `${item.price} 💎` : `${item.price} 🪙`})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
