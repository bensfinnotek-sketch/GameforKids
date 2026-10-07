import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/sound';
import { AgeGroup } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserName, setActiveAgeGroup, triggerConfetti } = useGame();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState(user.name);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(user.selectedAgeGroup || '6-8');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarEmoji);

  if (!isOpen) return null;

  const avatars = ['🤠', '👧', '👦', '🦁', '🐱', '🚀', '🧙‍♂️', '👑', '🐬', '⭐'];

  const handleNext = () => {
    soundManager.playClick();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finished onboarding!
      if (childName.trim()) updateUserName(childName.trim());
      setActiveAgeGroup(selectedAge);
      soundManager.playLevelUp();
      triggerConfetti();
      onClose();
    }
  };

  const handleBack = () => {
    soundManager.playClick();
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 animate-in zoom-in-95">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-heading font-black text-xs flex items-center justify-center">
              {step}/4
            </span>
            <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
              Khởi động thám hiểm
            </span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-6 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-amber-400' : 'bg-slate-200'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* STEP 1: Chào mừng */}
        {step === 1 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-amber-100 text-6xl mx-auto flex items-center justify-center border-4 border-amber-300 shadow-lg animate-bounce">
              🤠
            </div>
            <h2 className="font-heading text-3xl font-black text-slate-800">
              Chào Mừng Bạn Đến Với Math Adventure! 🎉
            </h2>
            <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-sm mx-auto">
              Mình là Mini! Chúng mình sẽ cùng nhau giải các câu đố toán học vui nhộn, săn lùng kho báu và mở khóa những vùng đất huyền bí!
            </p>
          </div>
        )}

        {/* STEP 2: Chọn độ tuổi */}
        {step === 2 && (
          <div className="py-2 space-y-4 text-center">
            <h2 className="font-heading text-2xl font-black text-slate-800">
              Bạn bao nhiêu tuổi rồi? 🎒
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Chọn nhóm tuổi để Mini chuẩn bị các bài học vừa vặn nhất cho bạn nhé:
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { id: '4-5', title: '4–5 tuổi', sub: 'Tí hon 🐣' },
                { id: '6-8', title: '6–8 tuổi', sub: 'Nhí 🦊' },
                { id: '9-11', title: '9–11 tuổi', sub: 'Tài năng 🦅' },
              ].map((age) => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id as unknown as AgeGroup)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition ${
                    selectedAge === age.id
                      ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md ring-2 ring-amber-300'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="font-heading font-black text-base">{age.title}</span>
                  <span className="text-xs font-bold text-slate-500 mt-1">{age.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Tên & Avatar */}
        {step === 3 && (
          <div className="py-2 space-y-4">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-black text-slate-800">
                Bạn tên là gì và thích Avatar nào? ⭐
              </h2>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Tên của bạn:
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Chọn hình đại diện yêu thích:
              </label>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition ${
                      selectedAvatar === av
                        ? 'bg-amber-400 scale-110 shadow-lg ring-2 ring-amber-500'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Sẵn sàng */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-white text-5xl mx-auto flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
              🚀
            </div>
            <h2 className="font-heading text-3xl font-black text-slate-800">
              Tuyệt Vời, {childName}!
            </h2>
            <p className="text-sm font-semibold text-slate-600 max-w-sm mx-auto">
              Ba lô đã sẵn sàng, la bàn đã chỉ hướng. Hãy cùng Mini bắt đầu chuyến phiêu lưu Đảo Toán Học ngay bây giờ!
            </p>
          </div>
        )}

        {/* Bottom controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="py-3 px-5 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-100 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            className="py-3.5 px-7 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 transition flex items-center gap-2 hover:scale-105 active:scale-95 text-sm"
          >
            <span>{step === 4 ? 'KHÁM PHÁ NGAY 🚀' : 'TIẾP THEO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
