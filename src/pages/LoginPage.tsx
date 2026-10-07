import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { MascotBadge } from '../components/auth/MascotBadge';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { AuthDivider } from '../components/auth/AuthDivider';
import { PasswordInput } from '../components/auth/PasswordInput';
import { AuthErrorAlert } from '../components/auth/AuthErrorAlert';
import { AuthSuccessAlert } from '../components/auth/AuthSuccessAlert';
import { SupportModal } from '../components/auth/SupportModal';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  configurePersistence, 
  mapAuthError,
} from '../firebase/auth';
import { soundManager } from '../utils/sound';

export const LoginPage: React.FC = () => {
  const { navigateTo } = useGame();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      soundManager.playClick();
      setGoogleLoading(true);
      setErrorMessage(null);
      await configurePersistence(rememberMe);

      const user = await signInWithGoogle();
      if (user) {
        soundManager.playLevelUp();
        // GameProvider listens to Firebase Auth and loads the real Firestore profile.
        // We intentionally do not create a second client-side session here.
        setSuccessMessage('Đăng nhập Google thành công! Đang mở hành trình học tập...');
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
      soundManager.playWrong();
      setErrorMessage(mapAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Email & Password Sign-in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    try {
      soundManager.playClick();
      setLoading(true);
      setErrorMessage(null);
      await configurePersistence(rememberMe);

      await signInWithEmail(email.trim(), password);
      soundManager.playLevelUp();
      setSuccessMessage('Đăng nhập thành công! Đang mở hành trình học tập...');

    } catch (err) {
      console.error('Email Sign-in error:', err);
      soundManager.playWrong();
      setErrorMessage(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* LOGIN CARD */}
      <div className="w-full max-w-[460px] bg-white rounded-[28px] p-6 sm:p-9 shadow-xl shadow-sky-950/5 border-2 border-sky-100/90 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Mascot Avatar at top center */}
        <div className="mb-4">
          <MascotBadge size="md" bubbleMessage="Chào bạn! Sẵn sàng phiêu lưu chưa?" />
        </div>

        {/* Headings */}
        <div className="text-center mb-6 space-y-1.5">
          <h2 className="text-h2 font-black text-slate-900 tracking-tight">
            Chào mừng bé quay trở lại!
          </h2>
          <p className="text-body-sm text-slate-500 font-medium leading-snug">
            Đăng nhập để tiếp tục hành trình khám phá toán học cùng Math Adventure Kids
          </p>
        </div>

        {/* Error / Success Notifications */}
        <div className="space-y-3 mb-4">
          <AuthErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
          <AuthSuccessAlert message={successMessage} />
        </div>

        {/* Google Sign In Button */}
        <GoogleLoginButton
          onClick={handleGoogleSignIn}
          loading={googleLoading}
          disabled={loading}
        />

        {/* Divider */}
        <AuthDivider label="hoặc đăng nhập bằng email" />

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-caption font-bold text-slate-700 tracking-wide">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading || googleLoading}
                placeholder="Nhập email của bạn..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-body-sm font-semibold text-slate-800 placeholder-slate-400 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password input */}
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
            label="Mật khẩu"
            placeholder="Nhập mật khẩu..."
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="btn-touch-target flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer accent-sky-600"
              />
              <span className="text-caption font-bold text-slate-600">
                Ghi nhớ đăng nhập
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('forgot-password');
              }}
              className="btn-touch-target text-caption font-bold text-sky-600 hover:text-sky-700 hover:underline transition"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="btn-touch-target w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-body-sm font-extrabold shadow-md shadow-sky-500/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang mở hành trình học tập...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Prompts: Register & Resend Confirmation */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2.5">
          <p className="text-caption text-slate-500 font-semibold">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('register');
              }}
              className="text-sky-600 hover:text-sky-700 font-extrabold hover:underline"
            >
              Đăng ký miễn phí ngay
            </button>
          </p>

          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Chưa nhận được email kích hoạt?{' '}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('resend-confirmation');
              }}
              className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
            >
              Gửi lại
            </button>
            . Vẫn không được? Nhấn{' '}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSupportModalOpen(true);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
            >
              Hỗ trợ
            </button>{' '}
            để được hỗ trợ.
          </p>
        </div>

      </div>

      {/* Support Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </AuthLayout>
  );
};
