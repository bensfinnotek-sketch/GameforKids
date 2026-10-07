import React from 'react';
import { X, HelpCircle, Phone, Mail, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { loginWithAuth } = useGame();

  if (!isOpen) return null;

  const handleQuickLogin = (role: 'student' | 'parent' | 'teacher' | 'admin') => {
    soundManager.playLevelUp();
    if (role === 'student') {
      loginWithAuth({ name: 'Bé Bo Bo', role: 'student', level: 3 });
    } else if (role === 'parent') {
      loginWithAuth({ name: 'Mẹ Thảo Vy', role: 'parent' });
    } else if (role === 'teacher') {
      loginWithAuth({ name: 'Cô Mai Hương', role: 'teacher' });
    } else {
      loginWithAuth({ name: 'Quản Trị Viên', role: 'admin' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-sky-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="btn-touch-target absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Đóng hỗ trợ"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
            💬
          </div>
          <h3 className="text-h3 font-black text-slate-900">
            Trung Tâm Hỗ Trợ Đăng Nhập
          </h3>
          <p className="text-body-sm text-slate-500 mt-1 font-medium">
            Đội ngũ Math Adventure Kids luôn sẵn sàng hỗ trợ Ba Mẹ và các bé 24/7
          </p>
        </div>

        {/* Quick Demo Login Option */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-caption mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Trải nghiệm ngay với tài khoản mẫu (1-chạm):</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3 font-medium">
            Nếu đang thử nghiệm tính năng hoặc mạng chậm, bạn có thể vào ngay với một trong các vai trò sau:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('student')}
              className="btn-touch-target py-2 px-3 rounded-xl bg-white hover:bg-amber-100/60 text-slate-800 text-caption font-bold border border-amber-200 text-left flex items-center gap-2 transition"
            >
              <span>🎒</span>
              <span>Bé Học Sinh</span>
            </button>
            <button
              onClick={() => handleQuickLogin('parent')}
              className="btn-touch-target py-2 px-3 rounded-xl bg-white hover:bg-emerald-100/60 text-slate-800 text-caption font-bold border border-amber-200 text-left flex items-center gap-2 transition"
            >
              <span>👨‍👩‍👧</span>
              <span>Phụ Huynh</span>
            </button>
            <button
              onClick={() => handleQuickLogin('teacher')}
              className="btn-touch-target py-2 px-3 rounded-xl bg-white hover:bg-indigo-100/60 text-slate-800 text-caption font-bold border border-amber-200 text-left flex items-center gap-2 transition"
            >
              <span>👩‍🏫</span>
              <span>Giáo Viên</span>
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="btn-touch-target py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-caption font-bold border border-amber-200 text-left flex items-center gap-2 transition"
            >
              <span>⚙️</span>
              <span>Quản Trị</span>
            </button>
          </div>
        </div>

        {/* Contact channels */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-caption font-bold text-slate-500 uppercase">Tổng đài phụ huynh miễn phí</div>
              <div className="text-body-sm font-black text-slate-800">1900 6868 (8:00 - 21:00)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-caption font-bold text-slate-500 uppercase">Hộp thư hỗ trợ kỹ thuật</div>
              <div className="text-body-sm font-black text-slate-800">hotro@mathadventurekids.edu.vn</div>
            </div>
          </div>
        </div>

        {/* FAQ note */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-relaxed font-medium">
          💡 <strong>Mẹo nhỏ:</strong> Nếu bé quên mật khẩu, Ba Mẹ hãy dùng chức năng <strong>"Quên mật khẩu"</strong> để nhận link đặt lại qua email hoặc đăng nhập nhanh bằng tài khoản <strong>Google</strong> đã liên kết.
        </div>
      </div>
    </div>
  );
};
