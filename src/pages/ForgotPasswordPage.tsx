import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { MascotBadge } from '../components/auth/MascotBadge';
import { AuthErrorAlert } from '../components/auth/AuthErrorAlert';
import { AuthSuccessAlert } from '../components/auth/AuthSuccessAlert';
import { sendPasswordReset, mapAuthError } from '../firebase/auth';
import { soundManager } from '../utils/sound';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useGame();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      soundManager.playClick();
      setLoading(true);
      setErrorMessage(null);

      await sendPasswordReset(email.trim());
      soundManager.playLevelUp();
      setSentSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      soundManager.playWrong();
      setErrorMessage(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    soundManager.playClick();
    navigateTo('login');
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[440px] bg-white rounded-[28px] p-6 sm:p-9 shadow-xl shadow-sky-950/5 border-2 border-sky-100/90 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Mascot Avatar */}
        <div className="mb-4">
          <MascotBadge size="md" bubbleMessage="Đừng lo, Mini sẽ giúp bạn!" />
        </div>

        {/* Headings */}
        <div className="text-center mb-6 space-y-1.5">
          <h2 className="text-h2 font-black text-slate-900 tracking-tight">
            Quên mật khẩu?
          </h2>
          <p className="text-body-sm text-slate-500 font-medium leading-relaxed">
            Nhập email của bạn. Chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu an toàn.
          </p>
        </div>

        {/* Notifications */}
        <div className="space-y-3 mb-4">
          <AuthErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
          {sentSuccess && (
            <AuthSuccessAlert message="Đã gửi email khôi phục mật khẩu! Ba Mẹ hãy kiểm tra hòm thư (kể cả hộp thư Rác/Spam nhé)." />
          )}
        </div>

        {sentSuccess ? (
          <div className="space-y-4 pt-2 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              ✉️
            </div>
            <p className="text-body-sm text-slate-600 font-medium">
              Vui lòng nhấn vào liên kết trong email gửi tới <strong>{email}</strong> để tạo mật khẩu mới.
            </p>
            <button
              onClick={handleBackToLogin}
              className="btn-touch-target w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-body-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="block text-caption font-bold text-slate-700 tracking-wide">
                Email tài khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  placeholder="Nhập email của bạn..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-body-sm font-semibold text-slate-800 placeholder-slate-400 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-touch-target w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-body-sm font-extrabold shadow-md shadow-sky-500/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang gửi email...</span>
                </>
              ) : (
                <>
                  <span>Gửi email đặt lại mật khẩu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="btn-touch-target text-caption font-bold text-slate-500 hover:text-sky-600 flex items-center justify-center gap-1.5 mx-auto transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại đăng nhập</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </AuthLayout>
  );
};
