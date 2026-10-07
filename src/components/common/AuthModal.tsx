import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  GraduationCap, 
  ShieldAlert, 
  Mail, 
  Lock, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserName, switchRole, resetProgress, setActiveTab } = useGame();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | 'teacher' | 'admin'>(user.role);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarEmoji);
  const [parentCaptchaAnswer, setParentCaptchaAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const avatars = ['🤠', '👧', '👦', '🦁', '🐱', '🚀', '🧙‍♂️', '👑', '🐬', '⭐'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (selectedRole === 'parent') {
      if (parentCaptchaAnswer.trim() !== '15') {
        setErrorMessage('Xác minh phụ huynh chưa đúng (7 + 8 = 15). Vui lòng thử lại!');
        return;
      }
    }

    if (selectedRole === 'admin') {
      if (passwordInput && passwordInput !== 'admin123' && passwordInput !== '123456') {
        setErrorMessage('Mật mã quản trị chưa đúng (gợi ý demo: admin123).');
        return;
      }
    }

    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
    }
    
    switchRole(selectedRole);

    // Navigate to appropriate workspace if parent/teacher/admin
    if (selectedRole === 'parent') setActiveTab('parent');
    else if (selectedRole === 'teacher') setActiveTab('teacher');
    else if (selectedRole === 'admin') setActiveTab('admin');

    onClose();
  };

  const handleQuickDemo = (role: 'student' | 'parent' | 'teacher' | 'admin') => {
    soundManager.playLevelUp();
    setSelectedRole(role);
    if (role === 'student') {
      updateUserName('Bé Bo Bo');
      switchRole('student');
      setActiveTab('home');
    } else if (role === 'parent') {
      updateUserName('Mẹ Thảo Vy');
      switchRole('parent');
      setActiveTab('parent');
    } else if (role === 'teacher') {
      updateUserName('Cô Mai Hương');
      switchRole('teacher');
      setActiveTab('teacher');
    } else if (role === 'admin') {
      updateUserName('Admin Hệ Thống');
      switchRole('admin');
      setActiveTab('admin');
    }
    onClose();
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ thám hiểm về mặc định?')) {
      resetProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-sky-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-caption font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Math Adventure Kids
          </div>
          <h3 className="text-h2 font-black text-slate-900">
            {authMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
          </h3>
          <p className="text-body-sm text-slate-500 mt-1">
            Chọn vai trò phù hợp để trải nghiệm giao diện tối ưu nhất
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`btn-touch-target px-6 py-2 rounded-xl text-caption font-bold transition ${
                authMode === 'login'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setAuthMode('register');
                setErrorMessage('');
              }}
              className={`btn-touch-target px-6 py-2 rounded-xl text-caption font-bold transition ${
                authMode === 'register'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        </div>

        {/* 4 Role Selector Buttons */}
        <div className="mb-6">
          <label className="block text-caption font-extrabold text-slate-700 uppercase tracking-wider mb-2">
            Chọn vai trò của bạn:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'student', title: 'Học Sinh', emoji: '🎒', color: 'sky' },
              { id: 'parent', title: 'Phụ Huynh', emoji: '👨‍👩‍👧', color: 'emerald' },
              { id: 'teacher', title: 'Giáo Viên', emoji: '👩‍🏫', color: 'indigo' },
              { id: 'admin', title: 'Quản Trị', emoji: '⚙️', color: 'slate' },
            ].map((r) => {
              const isSel = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedRole(r.id as any);
                    setErrorMessage('');
                  }}
                  className={`btn-touch-target p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition text-center ${
                    isSel
                      ? 'border-sky-500 bg-sky-50 text-sky-800 font-extrabold shadow-xs scale-102'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 font-bold'
                  }`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-body-sm leading-tight">{r.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-caption mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Trải nghiệm nhanh (Không cần mật khẩu):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-amber-100 text-[11px] font-bold border border-amber-200 transition"
            >
              🎒 Bé Học Sinh
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('parent')}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-emerald-100 text-[11px] font-bold border border-amber-200 transition"
            >
              👨‍👩‍👧 Phụ Huynh
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('teacher')}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-indigo-100 text-[11px] font-bold border border-amber-200 transition"
            >
              👩‍🏫 Giáo Viên
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-200 text-[11px] font-bold border border-amber-200 transition"
            >
              ⚙️ Quản Trị
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-caption font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên hiển thị:
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nhập tên..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none text-body-sm font-bold text-slate-800"
              required
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-caption font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Số điện thoại:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none text-body-sm font-medium text-slate-800"
                />
              </div>
            </div>
          )}

          {selectedRole === 'student' && (
            <div>
              <label className="block text-caption font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Chọn biểu tượng đại diện của bé:
              </label>
              <div className="flex flex-wrap gap-2">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedAvatar(av);
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                      selectedAvatar === av
                        ? 'bg-amber-400 text-white scale-110 shadow-md ring-2 ring-amber-500'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedRole === 'parent' && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-caption mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Xác minh phụ huynh: Hãy giải phép tính bảo vệ</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body font-black text-slate-800">7 + 8 = ?</span>
                <input
                  type="text"
                  placeholder="Đáp án..."
                  value={parentCaptchaAnswer}
                  onChange={(e) => {
                    setParentCaptchaAnswer(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-28 px-3 py-2 rounded-xl border border-emerald-300 font-bold text-center text-body-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          {selectedRole === 'admin' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-caption font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật mã quản trị hệ thống (Mặc định demo: admin123):
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-body-sm font-medium focus:outline-none"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-caption text-rose-600 font-bold">{errorMessage}</p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="btn-touch-target flex-1 py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 transition text-body-sm text-center flex items-center justify-center gap-2"
            >
              <span>{authMode === 'login' ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-touch-target py-3 px-4 rounded-2xl font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition text-caption flex items-center justify-center gap-1.5"
              title="Đặt lại toàn bộ dữ liệu demo về ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
