import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  ArrowRight,
  Flame,
  Star,
  MapPin,
  Heart
} from 'lucide-react';
import { Lesson, QuizQuestion } from '../types';
import { getQuestionsForLesson } from '../data/mockData';
import { useGame } from '../context/GameContext';
import { MascotMini } from '../components/common/MascotMini';
import { soundManager } from '../utils/sound';

interface QuizPageProps {
  lesson: Lesson;
  onBack: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ lesson, onBack }) => {
  const { completeLesson, triggerConfetti, setActiveTab, setActiveLesson, lessons, user } = useGame();
  
  const [questions] = useState<QuizQuestion[]>(() => getQuestionsForLesson(lesson));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [completionResult, setCompletionResult] = useState<{ duplicate?: boolean; xpEarned?: number; coinEarned?: number; gemEarned?: number; stars?: number } | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [streakInQuiz, setStreakInQuiz] = useState(0);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || !currentQ) return;

    const chosenOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const correct = chosenOption?.isCorrect ?? false;

    setIsAnswerSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      setScore((prev) => prev + 1);
      setStreakInQuiz((prev) => prev + 1);
      triggerConfetti();
    } else {
      soundManager.playWrong();
      setStreakInQuiz(0);
    }
  };

  const handleRetryQuestion = () => {
    soundManager.playClick();
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
  };

  const handleNext = async () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Completed entire quiz!
      // React state updates asynchronously; include the last answer, which was just checked.
      const actualScore = score + (isCorrect ? 1 : 0);
      const elapsedSeconds = Math.max(0, Math.round((Date.now() - startTime) / 1000));
      setFinalScore(actualScore);
      setFinalElapsedSeconds(elapsedSeconds);
      setSaveError(false);
      const result = await completeLesson(lesson.id, actualScore, questions.length, elapsedSeconds);
      if (result.ok) {
        setCompletionResult(result);
        setStarsEarned(result.stars || 0);
        setIsFinished(true);
      } else {
        setSaveError(true);
      }
    }
  };

  // If Finished Modal Screen (Phần 12 & Phần 44)
  if (isFinished) {
    const accuracy = Math.round((finalScore / questions.length) * 100);

    const handleNextLesson = () => {
      soundManager.playClick();
      const sameAgeLessons = lessons.filter((l) => l.ageGroup === lesson.ageGroup);
      const currentPosition = sameAgeLessons.findIndex((l) => l.id === lesson.id);
      const nextL = [
        ...sameAgeLessons.slice(currentPosition + 1),
        ...sameAgeLessons.slice(0, Math.max(0, currentPosition)),
      ].find((l) => !user.completedLessons.includes(l.id) && l.id !== lesson.id);
      if (nextL) {
        setActiveLesson(nextL);
      } else {
        onBack();
      }
    };

    const handleBackToMap = () => {
      soundManager.playClick();
      setActiveLesson(null);
      setActiveTab('map');
    };

    return (
      <div className="max-w-xl mx-auto px-4 py-12 select-none animate-in zoom-in-95">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-2xl text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 mx-auto flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce">
            🏆
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              HOÀN THÀNH NHIỆM VỤ!
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-800">
              Xuất Sắc Lắm Bé Ơi! 🎉
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Bài học: <strong className="text-sky-600">{lesson.title}</strong>
            </p>

            {/* Stars rating */}
            <div className="flex items-center justify-center gap-2 mt-4 text-3xl">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-9 h-9 transition-transform ${
                    s <= starsEarned
                      ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md'
                      : 'text-slate-300 fill-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Reward cards */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400">Độ chính xác</span>
              <span className="text-2xl font-black text-emerald-600">{accuracy}%</span>
              <span className="text-[10px] font-bold text-slate-400">{finalScore}/{questions.length} câu</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200">
              <span className="text-xs font-bold text-slate-400">Điểm XP</span>
              <span className="text-2xl font-black text-amber-500">+{completionResult?.xpEarned ?? 0}</span>
              <span className="text-[10px] font-bold text-slate-400">XP đã xác nhận</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400">Kho báu</span>
              <span className="text-xl font-black text-purple-600">+{completionResult?.gemEarned ?? 0} 💎</span>
              <span className="text-[10px] font-bold text-slate-400">+{completionResult?.coinEarned ?? 0} 🪙</span>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 p-3.5 rounded-2xl text-xs font-black text-emerald-900">
            {completionResult?.duplicate
              ? 'Kết quả bài học đã được lưu trước đó; hệ thống không cộng thưởng lần hai.'
              : 'Kết quả bài học đã được máy chủ xác nhận và lưu vào tài khoản.'}
            <span className="block mt-1 font-bold">Thời gian làm bài: {finalElapsedSeconds} giây</span>
          </div>

      {/* Buttons: VỀ BẢN ĐỒ / HỌC BÀI TIẾP */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBackToMap}
              className="w-full py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm text-sky-800 bg-sky-100 hover:bg-sky-200 transition flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>VỀ BẢN ĐỒ</span>
            </button>

            <button
              onClick={handleNextLesson}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 transition flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <span>HỌC BÀI TIẾP ➔</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 select-none">
      {/* Top Header Controls: Back, Progress, XP reward */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-extrabold text-xs sm:text-sm bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách bài</span>
        </button>

        <div className="flex items-center gap-3">
          {streakInQuiz > 1 && (
            <div className="flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-black animate-pulse">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>Chuỗi {streakInQuiz} câu đúng!</span>
            </div>
          )}

          <div className="text-xs font-black text-slate-600 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
            Tiến độ: <span className="text-sky-600 font-black">{currentIndex + 1}</span> / {questions.length}
          </div>

          <div className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            ⭐ +{lesson.xpReward} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3.5 p-0.5 mb-8 shadow-inner">
        <div
          className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {saveError && (
        <div role="alert" className="mb-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Chưa lưu được kết quả lên máy chủ. Bài học chưa được đánh dấu hoàn thành; hãy nhấn Tiếp tục để thử lưu lại khi có kết nối.
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xl relative overflow-hidden">
        
        {/* Mascot Mini with encouragement banner */}
        <div className="flex items-center gap-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
            🤠
          </div>
          <div>
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
              Mini đồng hành:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              {currentQ.hint && showHint
                ? `💡 Gợi ý: ${currentQ.hint}`
                : 'Đọc kỹ câu hỏi và chạm vào đáp án bạn cho là chính xác nhất nhé!'}
            </p>
          </div>
          {!showHint && currentQ.hint && (
            <button
              onClick={() => setShowHint(true)}
              className="ml-auto text-xs font-black text-amber-800 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-xl transition flex-shrink-0"
            >
              Gợi ý
            </button>
          )}
        </div>

        {/* Question Title */}
        <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-800 leading-snug mb-6">
          {currentQ.questionText}
        </h3>

        {/* Visual Graphic Representation */}
        {currentQ.visualData && (
          <div className="mb-8 p-6 bg-gradient-to-b from-sky-50 to-white rounded-3xl border-2 border-sky-200/60 flex flex-col items-center justify-center text-center">
            
            {/* Visual Fish or Apples Counting */}
            {(currentQ.visualType === 'apples' || currentQ.visualType === 'fish') && currentQ.visualData.count && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: currentQ.visualData.count }).map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 bg-white rounded-2xl shadow-md border-2 border-amber-200 flex items-center justify-center text-3xl animate-bounce hover:scale-110 cursor-pointer transition-transform"
                    style={{ animationDelay: `${i * 0.08}s` }}
                    title={`Chạm vào để đếm: ${i + 1}`}
                  >
                    {currentQ.visualData?.emoji || '🍎'}
                  </div>
                ))}
              </div>
            )}

            {/* Visual Shapes Sequence */}
            {currentQ.visualType === 'shapes' && currentQ.visualData.items && (
              <div className="flex items-center gap-3 text-3xl flex-wrap justify-center">
                {currentQ.visualData.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200 text-3xl"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* Mathematical Formula / Expression */}
            {currentQ.visualData.expression && (
              <div className="font-heading font-black text-2xl sm:text-3xl text-sky-700 tracking-wider bg-white px-6 py-3 rounded-2xl shadow-xs border-2 border-sky-300">
                {currentQ.visualData.expression}
              </div>
            )}
          </div>
        )}

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700';

            if (isSelected && !isAnswerSubmitted) {
              optionStyles = 'bg-sky-50 border-sky-500 ring-2 ring-sky-300 text-sky-900 shadow-md';
            } else if (isAnswerSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 text-emerald-900 shadow-md';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-amber-50 border-amber-400 text-amber-900';
              } else {
                optionStyles = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
              }
            }

            const letter = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isAnswerSubmitted}
                className={`p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-heading font-black text-sm flex items-center justify-center ${
                    isSelected ? 'bg-sky-500 text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}>
                    {letter}
                  </div>
                  <span className="text-base sm:text-lg">{option.text}</span>
                </div>

                {isAnswerSubmitted && option.isCorrect && (
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner (Phần 12 KHI ĐÚNG / KHI SAI) */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 animate-in fade-in ${
            isCorrect ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-amber-50 border-2 border-amber-300'
          }`}>
            <span className="text-3xl flex-shrink-0">{isCorrect ? '🎉' : '💪'}</span>
            <div>
              <h4 className="font-heading font-black text-base text-slate-800">
                {isCorrect ? 'TUYỆT VỜI! 🎉 Câu trả lời đã được tính vào điểm bài học.' : 'Suýt nữa rồi! 💪 Hãy thử lại nhé.'}
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                {isCorrect
                  ? currentQ.options.find((o) => o.id === selectedOptionId)?.explanation || 'Bé giải toán cực kỳ thông minh!'
                  : currentQ.hint || 'Gợi ý: Hãy quan sát kỹ lại số lượng hoặc phép tính nhé!'}
              </p>
            </div>
          </div>
        )}

        {/* Action Bottom Button */}
        <div className="pt-2 flex items-center justify-between">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOptionId}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-md flex items-center justify-center gap-2 ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25 hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>KIỂM TRA ĐÁP ÁN ✨</span>
            </button>
          ) : isCorrect ? (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <span>TIẾP TỤC ➔</span>
            </button>
          ) : (
            <div className="w-full flex gap-3">
              <button
                onClick={handleRetryQuestion}
                className="flex-1 py-3.5 rounded-2xl font-black text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>THỬ LẠI</span>
              </button>
              <button
                onClick={handleNext}
                className="py-3.5 px-5 rounded-2xl font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 transition text-sm"
              >
                Bỏ qua
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
