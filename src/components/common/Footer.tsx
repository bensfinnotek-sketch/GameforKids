import React from 'react';
import { Compass, Heart, Shield, HelpCircle, Mail, BookOpen } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

export const Footer: React.FC = () => {
  const { setActiveTab } = useGame();

  const handleNav = (tab: string) => {
    soundManager.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-xl shadow-md">
                🧭
              </div>
              <span className="font-heading text-xl font-black text-white">
                Math <span className="text-amber-400">Adventure</span> <span className="text-emerald-400">Kids</span>
              </span>
            </div>
            
            <p className="text-sm font-bold text-amber-200">
              "Học vui – Chơi giỏi – Toán thật dễ!"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Biến mỗi bài toán thành một chuyến phiêu lưu kỳ thú cùng Mini và những người bạn. Khơi gợi đam mê toán học tự nhiên cho trẻ từ 4–11 tuổi.
            </p>
          </div>

          {/* Column 2: Khám phá */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm text-white uppercase tracking-wider">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li>
                <button onClick={() => handleNav('learn')} className="hover:text-amber-300 transition">
                  Đảo Số Học & Bài Giảng
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('games')} className="hover:text-amber-300 transition">
                  Trò Chơi Toán Học Vui Nhộn
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('challenges')} className="hover:text-amber-300 transition">
                  Nhiệm Vụ Thám Hiểm Hàng Ngày
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('treasure')} className="hover:text-amber-300 transition">
                  Cửa Hàng Kho Báu & Đổi Quà
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-amber-300 transition flex items-center gap-1.5 text-amber-300">
                  <span>Bảng Giá Gói VIP 👑</span>
                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">-50%</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Phụ huynh & Nhà trường */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm text-white uppercase tracking-wider">
              Phụ Huynh & Giáo Viên
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li>
                <button onClick={() => handleNav('parent')} className="hover:text-emerald-300 transition flex items-center gap-1">
                  <span>Dashboard Phụ huynh</span>
                  <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded">Báo cáo</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('teacher')} className="hover:text-indigo-300 transition flex items-center gap-1">
                  <span>Cổng Giáo Viên Quản Lý Lớp</span>
                  <span className="bg-indigo-500/30 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded">Lớp học</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="hover:text-slate-200 transition">
                  Quản trị hệ thống (Admin)
                </button>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Phương pháp giáo dục tư duy phản biện</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Chính sách bảo vệ trẻ em trực tuyến</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Liên hệ & Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm text-white uppercase tracking-wider">
              Hỗ Trợ & Điều Khoản
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Hướng dẫn sử dụng website</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Chính sách riêng tư (Privacy Policy)</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Điều khoản dịch vụ</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Email: lienhe@mathadventurekids.edu.vn
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Math Adventure Kids. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> dành cho thế hệ mầm non Việt Nam.
          </p>
        </div>
      </div>
    </footer>
  );
};
