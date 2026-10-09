import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Trophy, 
  HelpCircle, 
  Volume2, 
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Flame,
  Check,
  X
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import { Lesson, QuizQuestion } from '../types';
import { getQuestionsForLesson } from '../data/mockData';

interface InteractiveLessonPageProps {
  lessonId?: string;
}

type LessonStage = 'intro' | 'explanation' | 'example' | 'practice' | 'quiz' | 'completed';

export const InteractiveLessonPage: React.FC<InteractiveLessonPageProps> = ({ lessonId }) => {
  const { 
    lessons, 
    activeLesson, 
    completeLesson, 
    triggerConfetti, 
    navigateTo, 
    activeTab,
    user
  } = useGame();

  // Find target lesson
  const targetId = lessonId || activeTab.replace(/^lesson\/?/, '') || activeLesson?.id || 'lesson-1';
  const lesson: Lesson = lessons.find((l) => l.id === targetId) || activeLesson || lessons[0];

  const questions: QuizQuestion[] = getQuestionsForLesson(lesson);

  const [currentStage, setCurrentStage] = useState<LessonStage>('intro');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [fillValue, setFillValue] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [saveError, setSaveError] = useState(false);

  const currentQ = questions[quizIndex] || questions[0];

  // Stage progress indicator
  const stages: LessonStage[] = ['intro', 'explanation', 'example', 'practice', 'quiz', 'completed'];
  const stageIndex = stages.indexOf(currentStage);
  const progressPercent = Math.round(((stageIndex + 1) / stages.length) * 100);

  const handleNextStage = () => {
    soundManager.playClick();
    if (currentStage === 'intro') setCurrentStage('explanation');
    else if (currentStage === 'explanation') setCurrentStage('example');
    else if (currentStage === 'example') setCurrentStage('practice');
    else if (currentStage === 'practice') {
      setCurrentStage('quiz');
      setQuizIndex(0);
      setFeedback(null);
      setSelectedOptionId(null);
    }
  };

  const handlePrevStage = () => {
    soundManager.playClick();
    if (currentStage === 'explanation') setCurrentStage('intro');
    else if (currentStage === 'example') setCurrentStage('explanation');
    else if (currentStage === 'practice') setCurrentStage('example');
    else if (currentStage === 'quiz') setCurrentStage('practice');
  };

  // Submit Answer in Quiz
  const handleSubmitQuizAnswer = () => {
    if (!currentQ) return;

    let isCorrect = false;

    if (currentQ.type === 'fill-number') {
      const correctVal = String(currentQ.correctFillValue ?? currentQ.options.find(o => o.isCorrect)?.text ?? '');
      isCorrect = fillValue.trim() === correctVal.trim();
    } else {
      const selected = currentQ.options.find((o) => o.id === selectedOptionId);
      isCorrect = selected?.isCorrect ?? false;
    }

    if (isCorrect) {
      soundManager.playCorrect();
      setScore((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        message: '🎉 Chính xác tuyệt vời! Bạn nhận được +10 XP!',
      });
    } else {
      soundManager.playWrong();
      setFeedback({
        isCorrect: false,
        message: '💡 Gần đúng rồi! Đừng nản lòng, hãy xem lại gợi ý nhé.',
      });
    }
  };

  const handleNextQuizQuestion = async () => {
    soundManager.playClick();
    if (quizIndex + 1 < questions.length) {
      setFeedback(null);
      setSelectedOptionId(null);
      setFillValue('');
      setShowHint(false);
      setQuizIndex((prev) => prev + 1);
      return;
    }

    // Only move to the completion screen after the server confirms the real attempt.
    const finalScore = Math.min(questions.length, score);
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - startTime) / 1000));
    setSaveError(false);
    const saved = await completeLesson(lesson.id, finalScore, questions.length, elapsedSeconds);
    if (!saved) {
      setSaveError(true);
      setFeedback({ isCorrect: false, message: 'Kết quả chưa được lưu. Hãy nhấn Tiếp tục để thử lưu lại; tiến độ chưa được cộng.' });
      return;
    }

    soundManager.playFanfare();
    triggerConfetti();
    const accuracy = finalScore / questions.length;
    const finalStars = accuracy >= 0.95 ? 3 : accuracy >= 0.8 ? 2 : 1;
    setEarnedStars(finalStars);
    setFeedback(null);
    setCurrentStage('completed');
  };

  const handleExitLesson = () => {
    soundManager.playClick();
    navigateTo('child/home');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 select-none space-y-6">
      
      {/* Top Header: Back, Lesson Title, Stage Progress */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleExitLesson}
          className="btn-touch-target flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 font-bold text-caption border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="text-caption font-extrabold text-amber-600 uppercase tracking-wider">
            {lesson.category === 'basic' ? 'Số học cơ bản' : 'Toán tư duy'}
          </div>
          <h1 className="text-h3 font-black text-slate-800 truncate">
            {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-caption font-extrabold text-amber-700">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>+{lesson.xpReward} XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider">
          <span>Tiến trình bài học</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* STAGE 1: GIỚI THIỆU (INTRODUCTION) */}
      {currentStage === 'intro' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-amber-50 p-4 rounded-3xl border border-sky-100">
            <div className="w-16 h-16 rounded-2xl bg-amber-200 text-slate-800 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              🤠
            </div>
            <div>
              <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider">Bé Thám Hiểm Mini chào bạn!</span>
              <p className="text-body-sm font-bold text-slate-700 mt-0.5">
                Hôm nay chúng ta sẽ cùng khám phá một chủ đề cực kỳ thú vị: <strong>"{lesson.title}"</strong>!
              </p>
            </div>
          </div>

          <div className="space-y-4 text-center py-4">
            <div className="w-24 h-24 rounded-3xl bg-amber-100 mx-auto flex items-center justify-center text-5xl shadow-sm">
              {lesson.thumbnailEmoji || '🌟'}
            </div>
            <h2 className="text-h2 font-black text-slate-900">
              Mục Tiêu Bài Học Hôm Nay
            </h2>
            <p className="text-body text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
              {lesson.description}
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleNextStage}
              className="btn-touch-target px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-body-sm shadow-md transition flex items-center gap-2"
            >
              <span>BẮT ĐẦU KHÁM PHÁ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: GIẢI THÍCH TRỰC QUAN (EXPLANATION) */}
      {currentStage === 'explanation' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6 animate-in fade-in">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 text-caption font-extrabold px-3.5 py-1 rounded-full uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Phần 1: Khái Niệm Trực Quan</span>
          </div>

          <h2 className="text-h2 font-black text-slate-900">
            Hãy Quan Sát Thật Kỹ Nhé! 🔍
          </h2>

          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6 text-center space-y-4">
            <div className="text-5xl tracking-widest flex items-center justify-center gap-3">
              <span>🍎</span>
              <span className="font-black text-amber-700 text-3xl">+</span>
              <span>🍎</span>
              <span>🍎</span>
              <span className="font-black text-amber-700 text-3xl">=</span>
              <span className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-amber-400 font-black text-2xl text-amber-900 flex items-center justify-center">
                3
              </span>
            </div>
            <p className="text-body-sm text-amber-950 font-bold max-w-md mx-auto">
              Khi ta có 1 quả táo và thêm 2 quả táo nữa, gộp lại ta có tất cả <strong>3 quả táo</strong> thơm ngon!
            </p>
          </div>

          <p className="text-body text-slate-600 leading-relaxed font-medium">
            Toán học giống như việc đếm đồ chơi trong ba lô thám hiểm của bạn. Cứ mỗi lần gom thêm đồ vật, số lượng lại tăng lên theo một quy luật tuyệt đẹp!
          </p>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStage}
              className="btn-touch-target px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-caption flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={handleNextStage}
              className="btn-touch-target px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-body-sm shadow-md transition flex items-center gap-2"
            >
              <span>XEM VÍ DỤ MINH HỌA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: VÍ DỤ MINH HỌA (EXAMPLE) */}
      {currentStage === 'example' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6 animate-in fade-in">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-caption font-extrabold px-3.5 py-1 rounded-full uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>Phần 2: Ví Dụ Mẫu</span>
          </div>

          <h2 className="text-h2 font-black text-slate-900">
            Ví Dụ: Chú Vịt Qua Sông 🦆
          </h2>

          <div className="p-6 rounded-3xl bg-sky-50 border-2 border-sky-200 space-y-4">
            <p className="text-body font-bold text-slate-800">
              Có <strong>4 chú vịt</strong> đang bơi ở bờ bên trái. Sau đó có thêm <strong>3 chú vịt</strong> bơi tới. Hỏi có tất cả bao nhiêu chú vịt?
            </p>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 space-y-2">
              <div className="text-caption font-black text-sky-600 uppercase">Các bước giải:</div>
              <p className="text-body-sm text-slate-700 font-medium">
                • Bước 1: Số vịt ban đầu = <strong>4</strong>
              </p>
              <p className="text-body-sm text-slate-700 font-medium">
                • Bước 2: Số vịt thêm vào = <strong>3</strong>
              </p>
              <p className="text-body-sm text-slate-700 font-medium">
                • Bước 3: Phép tính là: <strong>4 + 3 = 7</strong>
              </p>
              <div className="pt-2 text-body font-extrabold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>Đáp số: 7 chú vịt!</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStage}
              className="btn-touch-target px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-caption flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={handleNextStage}
              className="btn-touch-target px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-body-sm shadow-md transition flex items-center gap-2"
            >
              <span>THỰC HÀNH CÙNG MINI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: THỰC HÀNH (PRACTICE) */}
      {currentStage === 'practice' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6 animate-in fade-in">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-caption font-extrabold px-3.5 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phần 3: Bài Tập Thực Hành Khởi Động</span>
          </div>

          <h2 className="text-h2 font-black text-slate-900">
            Bé Hãy Chọn Đáp Án Đúng Nhé! 🎯
          </h2>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center space-y-4">
            <p className="text-h3 font-black text-slate-800">
              5 viên kẹo + 2 viên kẹo = ?
            </p>
            <div className="text-4xl">🍬 🍬 🍬 🍬 🍬 + 🍬 🍬</div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {['6', '7', '8', '9'].map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  if (opt === '7') {
                    soundManager.playCorrect();
                    alert('🎉 Quá giỏi! 5 + 2 = 7 viên kẹo chính xác!');
                    handleNextStage();
                  } else {
                    soundManager.playWrong();
                    alert('💡 Thử đếm lại xem nào! 5 viên thêm 2 viên nữa nhé!');
                  }
                }}
                className="btn-touch-target py-4 px-6 rounded-2xl bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 font-black text-xl text-slate-800 shadow-xs transition cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStage}
              className="btn-touch-target px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-caption flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={handleNextStage}
              className="btn-touch-target px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-body-sm shadow-md transition flex items-center gap-2"
            >
              <span>VÀO BÀI KIỂM TRA MINI QUIZ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: MINI QUIZ */}
      {currentStage === 'quiz' && currentQ && (
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6 animate-in fade-in">
          
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <span className="text-caption font-extrabold text-slate-500 uppercase">
              Câu hỏi {quizIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-caption font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Đúng: {score} câu
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-sky-50/70 p-6 rounded-3xl border-2 border-sky-100 text-center space-y-3">
            <h3 className="text-h3 font-black text-slate-900 leading-snug">
              {currentQ.questionText}
            </h3>

            {/* Visual counting emojis if present */}
            {currentQ.visualData?.emoji && currentQ.visualData?.count && (
              <div className="text-4xl tracking-wider py-2">
                {Array.from({ length: currentQ.visualData.count }).map((_, i) => (
                  <span key={i} className="inline-block mx-1">
                    {currentQ.visualData?.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fill Number Input */}
          {currentQ.type === 'fill-number' ? (
            <div className="max-w-xs mx-auto space-y-3 text-center">
              <label className="block text-caption font-bold text-slate-600">
                Nhập số đáp án:
              </label>
              <input
                type="number"
                value={fillValue}
                onChange={(e) => setFillValue(e.target.value)}
                placeholder="Nhập số..."
                className="w-full text-center py-4 px-6 rounded-2xl border-2 border-sky-300 text-3xl font-black text-sky-900 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
              />
            </div>
          ) : (
            /* Multiple Choice Options */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (!feedback) {
                        soundManager.playClick();
                        setSelectedOptionId(opt.id);
                      }
                    }}
                    disabled={!!feedback}
                    className={`btn-touch-target p-4 rounded-2xl border-2 text-left font-bold text-body-sm sm:text-body transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && <span className="w-3 h-3 rounded-full bg-sky-500" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div className={`p-4 rounded-2xl border-2 text-body-sm font-extrabold flex items-center justify-between animate-in zoom-in-95 ${
              feedback.isCorrect 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <span>{feedback.message}</span>
              <button
                onClick={handleNextQuizQuestion}
                className="btn-touch-target px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-caption hover:bg-slate-800 transition"
              >
                Tiếp tục ➔
              </button>
            </div>
          )}

          {/* Submit Action */}
          {!feedback && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-caption font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? currentQ.hint || 'Đọc kỹ câu hỏi nhé!' : 'Xem gợi ý'}</span>
              </button>

              <button
                onClick={handleSubmitQuizAnswer}
                disabled={currentQ.type === 'fill-number' ? !fillValue.trim() : !selectedOptionId}
                className="btn-touch-target px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-body-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                KIỂM TRA ĐÁP ÁN
              </button>
            </div>
          )}
        </div>
      )}

      {saveError && currentStage === 'quiz' && (
        <div role="alert" className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Chưa lưu được kết quả lên máy chủ. Tiến độ chưa được cập nhật; hãy thử lại khi kết nối ổn định.
        </div>
      )}

      {/* STAGE 6: HOÀN THÀNH (COMPLETED CELEBRATION) */}
      {currentStage === 'completed' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-12 border-2 border-emerald-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-5xl shadow-md animate-bounce">
            🏆
          </div>

          <div>
            <span className="text-caption font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-200">
              Hoàn Thành Xuất Sắc
            </span>
            <h2 className="text-display text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Chúc Mừng Bạn Đã Vượt Qua Bài Học!
            </h2>
            <p className="text-body text-slate-600 mt-1 font-medium">
              Bạn đã thể hiện tư duy tính toán siêu việt cùng Bé Thám Hiểm Mini!
            </p>
          </div>

          {/* Earned Stars */}
          <div className="flex justify-center items-center gap-3 py-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-12 h-12 ${
                  s <= earnedStars 
                    ? 'fill-amber-400 text-amber-500 drop-shadow-md' 
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Rewards Box */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-slate-50 p-4 rounded-3xl border border-slate-200">
            <div>
              <span className="text-caption text-slate-400 font-bold block">Kinh nghiệm</span>
              <span className="text-caption font-black text-emerald-700">Đã xác nhận</span>
            </div>
            <div>
              <span className="text-caption text-slate-400 font-bold block">Tiền vàng</span>
              <span className="text-caption font-black text-emerald-700">Đã lưu</span>
            </div>
            <div>
              <span className="text-caption text-slate-400 font-bold block">Đá quý</span>
              <span className="text-caption font-black text-emerald-700">Đã lưu</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-md mx-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                const sameAgeLessons = lessons.filter((item) => item.ageGroup === lesson.ageGroup);
                const currentPosition = sameAgeLessons.findIndex((item) => item.id === lesson.id);
                const nextLesson = [
                  ...sameAgeLessons.slice(currentPosition + 1),
                  ...sameAgeLessons.slice(0, Math.max(0, currentPosition)),
                ].find((item) => !user.completedLessons.includes(item.id) && item.id !== lesson.id);
                if (nextLesson) {
                  navigateTo(`lesson/${nextLesson.id}`);
                } else {
                  navigateTo('learn');
                }
              }}
              className="btn-touch-target flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-body-sm shadow-md transition"
            >
              HỌC BÀI TIẾP THEO ➔
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
