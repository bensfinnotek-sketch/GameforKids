import React, { useState } from 'react';
import { Mail, User, ArrowRight, Loader2, Sparkles, Check, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { MascotBadge } from '../components/auth/MascotBadge';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { AuthDivider } from '../components/auth/AuthDivider';
import { PasswordInput } from '../components/auth/PasswordInput';
import { AuthErrorAlert } from '../components/auth/AuthErrorAlert';
import { AuthSuccessAlert } from '../components/auth/AuthSuccessAlert';
import { 
  signInWithGoogle, 
  registerWithEmail, 
  mapAuthError,
  syncUserProfileToFirestore 
} from '../firebase/auth';
import { soundManager } from '../utils/sound';

export const RegisterPage: React.FC = () => {
  const { loginWithAuth, navigateTo } = useGame();
  
  const [role, setRole] = useState<'student' | 'parent' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Google Registration
  const handleGoogleSignUp = async () => {
    try {
      soundManager.playClick();
      setGoogleLoading(true);
      setErrorMessage(null);

      const user = await signInWithGoogle();
      if (user) {
        soundManager.playLevelUp();
        setSuccessMessage('Đăng ký Google thành công! Đang thiết lập hồ sơ...');

        const finalProfile = {
          id: user.uid,
          name: name.trim() || user.displayName || user.email?.split('@')[0] || 'Bé Thám Hiểm',
          role,
          avatarEmoji: role === 'student' ? '🤠' : role === 'parent' ? '👨‍👩‍👧' : '👩‍🏫',
        };

        await syncUserProfileToFirestore(user.uid, finalProfile);

        setTimeout(() => {
          loginWithAuth(finalProfile);
        }, 600);
      }
    } catch (err) {
      console.error('Google Sign-up error:', err);
      soundManager.playWrong();
      setErrorMessage(mapAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Email Registration
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (password !== confirmPassword) {
      soundManager.playWrong();
      setErrorMessage('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
      return;
    }

    if (!agreeTerms) {
      soundManager.playWrong();
      setErrorMessage('Vui lòng đồng ý với Điều khoản và Cam kết an toàn cho trẻ nhỏ.');
      return;
    }

    try {
      soundManager.playClick();
      setLoading(true);
      setErrorMessage(null);

      const user = await registerWithEmail(email.trim(), password);
      soundManager.playLevelUp();
      setSuccessMessage('Đăng ký thành công! Đang khởi tạo hành trình phiêu lưu...');

      const finalProfile = {
        id: user.uid,
        name: name.trim() || email.split('@')[0],
        role,
        avatarEmoji: role === 'student' ? '🤠' : role === 'parent' ? '👨‍👩‍👧' : '👩‍🏫',
      };

      await syncUserProfileToFirestore(user.uid, finalProfile);

      setTimeout(() => {
        loginWithAuth(finalProfile);
      }, 700);

    } catch (err) {
      console.error('Email Sign-up error:', err);
      soundManager.playWrong();
      setErrorMessage(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* REGISTER CARD */}
      <div className="w-full max-w-[480px] bg-white rounded-[28px] p-6 sm:p-9 shadow-xl shadow-sky-950/5 border-2 border-sky-100/90 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Mascot Avatar */}
        <div className="mb-4">
          <MascotBadge size="md" bubbleMessage="Chào mừng thành viên mới gia nhập!" />
        </div>

        {/* Headings */}
        <div className="text-center mb-6 space-y-1.5">
          <h2 className="text-h2 font-black text-slate-900 tracking-tight">
            Đăng ký tài khoản miễn phí
          </h2>
          <p className="text-body-sm text-slate-500 font-medium leading-snug">
            Khám phá thế giới toán học diệu kỳ cùng Math Adventure Kids
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-5">
          <label className="block text-caption font-bold text-slate-700 tracking-wide mb-2 text-center">
            Bạn đăng ký tài khoản cho ai?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'student', label: 'Bé học sinh', icon: '🎒' },
              { id: 'parent', label: 'Phụ huynh', icon: '👨‍👩‍👧' },
              { id: 'teacher', label: 'Giáo viên', icon: '👩‍🏫' },
            ].map((r) => {
              const isSel = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setRole(r.id as any);
                  }}
                  className={`btn-touch-target p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition text-center ${
                    isSel
                      ? 'border-sky-500 bg-sky-50 text-sky-800 font-extrabold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 font-bold'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-caption">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3 mb-4">
          <AuthErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
          <AuthSuccessAlert message={successMessage} />
        </div>

        {/* Google Registration */}
        <GoogleLoginButton
          onClick={handleGoogleSignUp}
          loading={googleLoading}
          disabled={loading}
          text="Đăng ký với Google"
        />

        <AuthDivider label="hoặc đăng ký bằng email" />

        {/* Registration Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-3.5">
          
          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="block text-caption font-bold text-slate-700 tracking-wide">
              {role === 'student' ? 'Tên của bé' : 'Họ và tên của bạn'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || googleLoading}
                placeholder={role === 'student' ? 'Ví dụ: Bé Bảo Nam' : 'Ví dụ: Nguyễn Văn An'}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-body-sm font-semibold text-slate-800 placeholder-slate-400 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="block text-caption font-bold text-slate-700 tracking-wide">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading || googleLoading}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-body-sm font-semibold text-slate-800 placeholder-slate-400 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <PasswordInput
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
            label="Mật khẩu (ít nhất 6 ký tự)"
            placeholder="Tạo mật khẩu an toàn..."
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <PasswordInput
            id="reg-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || googleLoading}
            label="Nhập lại mật khẩu"
            placeholder="Xác nhận lại mật khẩu..."
            autoComplete="new-password"
          />

          {/* Agreement Checkbox */}
          <div className="pt-1">
            <label className="btn-touch-target flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded-md text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer accent-sky-600"
              />
              <span className="text-[11px] text-slate-600 leading-tight">
                Tôi đồng ý với <strong>Điều khoản sử dụng</strong> và cam kết <strong>Bảo vệ an toàn thông tin trẻ nhỏ (Kid-Safe)</strong>.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="btn-touch-target w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 hover:from-emerald-600 hover:to-teal-700 text-white text-body-sm font-extrabold shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <>
                <span>Bắt đầu hành trình ngay 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-caption text-slate-500 font-semibold">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('login');
              }}
              className="text-sky-600 hover:text-sky-700 font-extrabold hover:underline"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
};
