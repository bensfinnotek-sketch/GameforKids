import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  Play, 
  ArrowLeft, 
  RotateCcw, 
  Timer, 
  Star, 
  Coins, 
  Flame,
  CheckCircle2,
  Lock,
  Car
} from 'lucide-react';
import { MINI_GAMES } from '../data/mockData';
import { MiniGame } from '../types';
import { useGame } from '../context/GameContext';
import { answerTrustedMiniGame, startTrustedMiniGame } from '../firebase/auth';
import { soundManager } from '../utils/sound';

export const GamesPage: React.FC = () => {
  const { user, triggerConfetti, refreshUserProfile } = useGame();
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);

  // GAME 1: Bắt số
  const [bubbleNumbers, setBubbleNumbers] = useState<{ id: number; value: number }[]>([]);
  const [bubbleScore, setBubbleScore] = useState(0);
  const [bubbleTimer, setBubbleTimer] = useState(25);
  const [bubbleActive, setBubbleActive] = useState(false);
  const [bubbleGameOver, setBubbleGameOver] = useState(false);

  // GAME 2: Đường đua phép tính (Speed car math race)
  const [raceActive, setRaceActive] = useState(false);
  const [carPosition, setCarPosition] = useState(10); // 10% to 90%
  const [raceQuestion, setRaceQuestion] = useState<{ a: number; b: number; ans: number; options: number[] }>({ a: 6, b: 7, ans: 13, options: [12, 13, 14, 15] });
  const [raceFinished, setRaceFinished] = useState(false);

  // GAME 3: Kho báu toán học (Safe code riddle)
  const [safeInputs, setSafeInputs] = useState<string[]>(['', '', '']);
  const [safeUnlocked, setSafeUnlocked] = useState(false);
  const [safeError, setSafeError] = useState(false);

  // GAME 4: Ghép đôi (Memory card matching)
  const [cards, setCards] = useState<{ id: number; label: string; pairId: number; flipped: boolean; matched: boolean }[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [matchScore, setMatchScore] = useState(0);

  // GAME 5: 60 Giây thử thách
  const [blitzTimer, setBlitzTimer] = useState(60);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzQuestion, setBlitzQuestion] = useState<{ a: number; b: number; op: string; answer: number }>({ a: 4, b: 3, op: '+', answer: 0 });
  const [blitzOptions, setBlitzOptions] = useState<number[]>([5, 7, 8, 9]);
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzGameOver, setBlitzGameOver] = useState(false);
  const [blitzSessionId, setBlitzSessionId] = useState<string | null>(null);
  const [blitzQuestionNumber, setBlitzQuestionNumber] = useState(1);
  const [blitzRewardMessage, setBlitzRewardMessage] = useState('');
  const [blitzSubmitting, setBlitzSubmitting] = useState(false);

  // GAME 6: Thợ săn hình học
  const [shapeTarget, setShapeTarget] = useState<'triangle' | 'circle' | 'square' | 'star'>('triangle');
  const [shapeList, setShapeList] = useState<{ id: number; type: string; emoji: string }[]>([]);
  const [shapeScore, setShapeScore] = useState(0);
  const [shapeFinished, setShapeFinished] = useState(false);

  // --- GAME 1: Bubble Logic ---
  const generateBubbles = () => {
    const list = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      value: Math.floor(Math.random() * 14) + 1,
    }));
    setBubbleNumbers(list);
  };

  const startBubbleGame = () => {
    soundManager.playCorrect();
    setBubbleScore(0);
    setBubbleTimer(25);
    setBubbleActive(true);
    setBubbleGameOver(false);
    generateBubbles();
  };

  useEffect(() => {
    if (!bubbleActive || bubbleTimer <= 0) return;
    const interval = setInterval(() => {
      setBubbleTimer((prev) => {
        if (prev <= 1) {
          setBubbleActive(false);
          setBubbleGameOver(true);
          setBlitzRewardMessage('Hết thời gian. Lượt chơi chưa hoàn tất đủ 10 câu nên chưa nhận XP/Vàng.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [bubbleActive, bubbleTimer, triggerConfetti]);

  const handleBubbleClick = (item: { id: number; value: number }) => {
    const isCorrect = item.value % 2 === 0; // Even number target
    if (isCorrect) {
      soundManager.playCorrect();
      setBubbleScore((s) => s + 10);
    } else {
      soundManager.playWrong();
      setBubbleScore((s) => Math.max(0, s - 5));
    }
    setBubbleNumbers((prev) =>
      prev.map((b) => (b.id === item.id ? { id: Date.now() + Math.random(), value: Math.floor(Math.random() * 16) + 1 } : b))
    );
  };

  // --- GAME 2: Đường đua phép tính ---
  const generateRaceQ = () => {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    const ans = a + b;
    const options = Array.from(new Set([ans, ans + 1, ans - 1, ans + 2])).slice(0, 4);
    options.sort(() => Math.random() - 0.5);
    setRaceQuestion({ a, b, ans, options });
  };

  const startRaceGame = () => {
    soundManager.playCorrect();
    setCarPosition(10);
    setRaceFinished(false);
    setRaceActive(true);
    generateRaceQ();
  };

  const handleRaceAnswer = (opt: number) => {
    if (opt === raceQuestion.ans) {
      soundManager.playCorrect();
      const nextPos = carPosition + 25;
      if (nextPos >= 90) {
        setCarPosition(100);
        setRaceFinished(true);
        setRaceActive(false);
        soundManager.playLevelUp();
        triggerConfetti();
      } else {
        setCarPosition(nextPos);
        generateRaceQ();
      }
    } else {
      soundManager.playWrong();
    }
  };

  // --- GAME 3: Kho báu toán học ---
  const handleCrackSafe = () => {
    soundManager.playClick();
    if (safeInputs[0] === '7' && safeInputs[1] === '8' && safeInputs[2] === '5') {
      soundManager.playLevelUp();
      triggerConfetti();
      setSafeUnlocked(true);
      setSafeError(false);
    } else {
      soundManager.playWrong();
      setSafeError(true);
    }
  };

  // --- GAME 4: Ghép đôi (Memory flip) ---
  const startMatchGame = () => {
    soundManager.playCorrect();
    const pairs = [
      { id: 1, label: '3 + 4', pairId: 101 },
      { id: 2, label: '7', pairId: 101 },
      { id: 3, label: '5 x 2', pairId: 102 },
      { id: 4, label: '10', pairId: 102 },
      { id: 5, label: '12 - 4', pairId: 103 },
      { id: 6, label: '8', pairId: 103 },
    ];
    pairs.sort(() => Math.random() - 0.5);
    setCards(pairs.map((p) => ({ ...p, flipped: false, matched: false })));
    setSelectedCardIds([]);
    setMatchScore(0);
  };

  const handleCardClick = (card: { id: number; pairId: number }) => {
    if (selectedCardIds.length >= 2 || selectedCardIds.includes(card.id)) return;
    soundManager.playClick();
    const newSelected = [...selectedCardIds, card.id];
    setSelectedCardIds(newSelected);

    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)));

    if (newSelected.length === 2) {
      const card1 = cards.find((c) => c.id === newSelected[0]);
      const card2 = cards.find((c) => c.id === newSelected[1]);
      if (card1 && card2 && card1.pairId === card2.pairId) {
        soundManager.playCorrect();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === card1.pairId ? { ...c, matched: true } : c))
          );
          setSelectedCardIds([]);
          setMatchScore((s) => {
            const next = s + 1;
            if (next === 3) {
              soundManager.playLevelUp();
              triggerConfetti();
            }
            return next;
          });
        }, 500);
      } else {
        soundManager.playWrong();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (newSelected.includes(c.id) ? { ...c, flipped: false } : c))
          );
          setSelectedCardIds([]);
        }, 900);
      }
    }
  };

  // --- GAME 5: 60 Giây thử thách ---
  const startBlitzGame = async () => {
    soundManager.playCorrect();
    setBlitzScore(0);
    setBlitzTimer(60);
    setBlitzActive(false);
    setBlitzGameOver(false);
    setBlitzSessionId(null);
    setBlitzQuestionNumber(1);
    setBlitzRewardMessage('');

    const session = await startTrustedMiniGame('game-60s-blitz');
    if (!session?.ok || !session.sessionId || !session.question) {
      setBlitzGameOver(true);
      setBlitzRewardMessage('Không thể tạo phiên chơi an toàn. Bé chưa nhận XP/Vàng.');
      return;
    }

    setBlitzSessionId(session.sessionId);
    setBlitzQuestion({
      a: session.question.a,
      b: session.question.b,
      op: session.question.op,
      answer: 0,
    });
    setBlitzOptions(session.question.options);
    setBlitzQuestionNumber(session.questionNumber || 1);
    setBlitzTimer(session.secondsRemaining ?? 60);
    setBlitzActive(true);
  };

  useEffect(() => {
    if (!blitzActive || blitzTimer <= 0) return;
    const interval = setInterval(() => {
      setBlitzTimer((prev) => {
        if (prev <= 1) {
          setBlitzActive(false);
          setBlitzGameOver(true);
          soundManager.playLevelUp();
          triggerConfetti();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [blitzActive, blitzTimer, triggerConfetti]);

  const handleBlitzAnswer = async (val: number) => {
    if (!blitzSessionId || !blitzActive || blitzSubmitting) return;

    setBlitzSubmitting(true);
    const result = await answerTrustedMiniGame(blitzSessionId, val);
    setBlitzSubmitting(false);
    if (!result?.ok) {
      setBlitzActive(false);
      setBlitzGameOver(true);
      setBlitzRewardMessage('Phiên chơi không còn hợp lệ. Bé chưa nhận XP/Vàng.');
      return;
    }

    if (result.correct) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    setBlitzScore(result.correctCount || 0);

    if (result.completed) {
      setBlitzActive(false);
      setBlitzGameOver(true);
      setBlitzQuestionNumber(result.totalQuestions || 10);

      if (result.rewardGranted && !result.alreadyCompleted) {
        setBlitzRewardMessage(`Đã được máy chủ xác nhận: +${result.xpEarned || 0} XP • +${result.coinEarned || 0} Vàng.`);
        await refreshUserProfile();
        triggerConfetti();
      } else if (result.alreadyCompleted) {
        setBlitzRewardMessage('Lượt chơi này đã được ghi nhận trước đó; không nhận thưởng lần thứ hai.');
      } else {
        setBlitzRewardMessage('Lượt chơi đã hoàn tất nhưng chưa đủ điều kiện nhận thưởng.');
      }
      return;
    }

    if (result.question) {
      setBlitzQuestion({
        a: result.question.a,
        b: result.question.b,
        op: result.question.op,
        answer: 0,
      });
      setBlitzOptions(result.question.options);
      setBlitzQuestionNumber(result.questionNumber || blitzQuestionNumber + 1);
      setBlitzTimer(result.secondsRemaining ?? blitzTimer);
    }
  };

  // --- GAME 6: Thợ săn hình học ---
  const startShapeGame = () => {
    soundManager.playCorrect();
    setShapeTarget('triangle');
    setShapeScore(0);
    setShapeFinished(false);
    const list = [
      { id: 1, type: 'triangle', emoji: '🔺' },
      { id: 2, type: 'circle', emoji: '🟡' },
      { id: 3, type: 'square', emoji: '🟦' },
      { id: 4, type: 'star', emoji: '⭐' },
      { id: 5, type: 'triangle', emoji: '🔺' },
      { id: 6, type: 'triangle', emoji: '🔺' },
    ];
    list.sort(() => Math.random() - 0.5);
    setShapeList(list);
  };

  const handleShapeClick = (shape: { id: number; type: string }) => {
    if (shape.type === shapeTarget) {
      soundManager.playCorrect();
      setShapeScore((s) => {
        const next = s + 1;
        if (next >= 3) {
          setShapeFinished(true);
          soundManager.playLevelUp();
          triggerConfetti();
        }
        return next;
      });
      setShapeList((prev) => prev.filter((item) => item.id !== shape.id));
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Khu Trò Chơi Toán Học 6 Cổng
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black">
              Học Mà Chơi – Đua Điểm Cùng Mini! 🎮
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-amber-100 max-w-xl">
              Thử thách phản xạ nhanh, trí nhớ và tư duy nhạy bén chơi để rèn luyện và phá kỷ lục!
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
            <span className="text-3xl">🪙</span>
            <div>
              <span className="text-xs font-bold text-amber-100 block">Vàng của bạn</span>
              <span className="font-heading font-black text-2xl text-white">{user.coin}</span>
            </div>
          </div>
        </div>
      </div>

      {/* If a game is active: Render the playable screen */}
      {selectedGame ? (
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedGame(null);
              setBubbleActive(false);
              setBlitzActive(false);
              setRaceActive(false);
            }}
            className="mb-6 flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-extrabold text-sm bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách trò chơi</span>
          </button>

          {/* GAME 1: Bắt số */}
          {selectedGame.id === 'game-catch-numbers' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                🎈 Mini Game Bắt Số Đúng
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                Quy tắc: Chạm vào <span className="text-rose-600 uppercase">SỐ CHẴN</span>!
              </h2>
              <p className="text-xs font-bold text-slate-400 mb-6">
                (Số chẵn: 2, 4, 6, 8, 10, 12, 14...)
              </p>

              {!bubbleActive && !bubbleGameOver ? (
                <div className="py-12">
                  <span className="text-7xl block mb-4 animate-bounce">🎈</span>
                  <button
                    onClick={startBubbleGame}
                    className="px-8 py-4 rounded-2xl font-black text-base sm:text-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition"
                  >
                    BẮT ĐẦU CHƠI (25 Giây) 🚀
                  </button>
                </div>
              ) : bubbleActive ? (
                <div>
                  <div className="flex items-center justify-between mb-8 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                    <div className="flex items-center gap-2 font-black text-slate-700">
                      <Timer className="w-5 h-5 text-amber-600" />
                      <span>Thời gian: {bubbleTimer}s</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-amber-600 text-lg">
                      <Star className="w-5 h-5 fill-amber-500" />
                      <span>Điểm: {bubbleScore}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 min-h-[260px] py-4">
                    {bubbleNumbers.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleBubbleClick(b)}
                        className="h-24 sm:h-28 rounded-3xl bg-gradient-to-tr from-sky-400 to-blue-500 hover:from-amber-400 hover:to-orange-500 text-white font-heading font-black text-3xl sm:text-4xl shadow-lg border-4 border-white hover:scale-110 active:scale-90 transition-all flex items-center justify-center animate-bounce"
                        style={{ animationDuration: `${2 + (b.value % 3)}s` }}
                      >
                        {b.value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-4">
                  <span className="text-6xl block">🏆</span>
                  <h3 className="font-heading font-black text-2xl text-emerald-600">
                    Hết Giờ! Bé Xuất Sắc Lắm!
                  </h3>
                  <p className="text-base font-bold text-slate-700">
                    Tổng điểm đạt được: <span className="text-amber-500 font-black">{bubbleScore} điểm</span>
                  </p>
                  <p className="text-xs font-black text-amber-600 bg-amber-50 py-2 rounded-xl border border-amber-200">
                    Điểm mini game chỉ dùng để hiển thị trong lượt chơi này. Chưa cộng XP/Vàng vào tài khoản.
                  </p>
                  <button
                    onClick={startBubbleGame}
                    className="px-6 py-3 rounded-2xl font-black text-white bg-sky-500 hover:bg-sky-600 shadow-md transition"
                  >
                    Chơi Lại Ván Nữa 🔄
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 2: Đường đua phép tính */}
          {selectedGame.id === 'game-speed-race' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-rose-300 shadow-2xl text-center">
              <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                🏎️ Đường Đua Phép Tính
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                Trả Lời Đúng Để Xe Tăng Tốc!
              </h2>

              {/* Race Track Canvas Bar */}
              <div className="my-6 relative bg-slate-900 rounded-3xl h-24 p-3 border-4 border-slate-700 flex items-center overflow-hidden">
                <div className="absolute inset-0 border-dashed border-b-2 border-white/20 top-1/2"></div>
                <div
                  className="absolute transition-all duration-500 text-4xl"
                  style={{ left: `${carPosition}%` }}
                >
                  🏎️
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl">
                  🏁
                </div>
              </div>

              {!raceActive && !raceFinished ? (
                <div className="py-8">
                  <button
                    onClick={startRaceGame}
                    className="px-8 py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-red-500 to-rose-600 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    XUẤT PHÁT ĐUA XE 🏁
                  </button>
                </div>
              ) : raceActive ? (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                    <span className="font-heading font-black text-3xl text-rose-600">
                      {raceQuestion.a} + {raceQuestion.b} = ?
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {raceQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleRaceAnswer(opt)}
                        className="py-3.5 rounded-2xl border-2 border-slate-200 font-heading font-black text-2xl hover:bg-rose-50 hover:border-rose-400 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <span className="text-6xl block">🏆</span>
                  <h3 className="font-heading font-black text-2xl text-emerald-600">
                    VỀ ĐÍCH ĐẦU TIÊN!
                  </h3>
                  <p className="text-xs font-black text-amber-600 bg-amber-50 py-2 rounded-xl border border-amber-200">
                    Lượt chơi đã hoàn tất. XP/Vàng chưa được cộng vì mini game chưa có xác thực máy chủ.
                  </p>
                  <button
                    onClick={startRaceGame}
                    className="px-6 py-3 rounded-2xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-md transition"
                  >
                    Đua Ván Mới 🔄
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 3: Kho báu toán học (Safe code) */}
          {selectedGame.id === 'game-treasure-code' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-300 shadow-2xl text-center">
              <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                🗝️ Giải Mã Mật Khẩu Rương Báu
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                Tìm 3 Chữ Số Bí Mật
              </h2>

              {!safeUnlocked ? (
                <div className="space-y-6">
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    {[
                      { q: 'Chữ số thứ 1: 12 - 5 = ?', ans: '7' },
                      { q: 'Chữ số thứ 2: 2 x 4 = ?', ans: '8' },
                      { q: 'Chữ số thứ 3: 15 : 3 = ?', ans: '5' },
                    ].map((clue, idx) => (
                      <div key={idx} className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-700">{clue.q}</span>
                        <input
                          type="text"
                          maxLength={1}
                          value={safeInputs[idx]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSafeInputs((prev) => {
                              const n = [...prev];
                              n[idx] = val;
                              return n;
                            });
                          }}
                          placeholder="?"
                          className="w-12 h-12 text-center rounded-xl border-2 border-purple-400 font-black text-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  {safeError && (
                    <p className="text-xs font-bold text-rose-600">
                      Mật mã chưa chính xác! Hãy kiểm tra lại các phép tính nhé 💪
                    </p>
                  )}

                  <button
                    onClick={handleCrackSafe}
                    className="px-8 py-3.5 rounded-2xl font-black text-base text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition"
                  >
                    MỞ KHÓA RƯƠNG BÁU 🔓
                  </button>
                </div>
              ) : (
                <div className="py-8 space-y-4">
                  <span className="text-7xl block animate-bounce">🎁</span>
                  <h3 className="font-heading font-black text-3xl text-amber-600">
                    RƯƠNG ĐÃ MỞ KHÓA!
                  </h3>
                  <p className="text-sm font-bold text-slate-600">
                    Mật khẩu chính xác là: 7 - 8 - 5
                  </p>
                  <p className="text-xs font-black text-emerald-700 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                    Rương đã mở! Phần thưởng tài khoản sẽ chỉ được trao sau khi mini game có xác thực máy chủ.
                  </p>
                  <button
                    onClick={() => {
                      setSafeUnlocked(false);
                      setSafeInputs(['', '', '']);
                    }}
                    className="px-6 py-3 rounded-2xl font-black text-white bg-purple-600 hover:bg-purple-700 shadow-md transition"
                  >
                    Chơi Lại Ván Mới 🔄
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 4: Ghép đôi (Memory cards) */}
          {selectedGame.id === 'game-math-match' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-300 shadow-2xl text-center">
              <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                🃏 Ghép Đôi Phép Tính
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mb-6">
                Lật Thẻ Tìm Cặp Phép Tính & Kết Quả
              </h2>

              {cards.length === 0 ? (
                <div className="py-8">
                  <button
                    onClick={startMatchGame}
                    className="px-8 py-4 rounded-2xl font-black text-base text-white bg-sky-500 hover:bg-sky-600 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    BẮT ĐẦU LẬT THẺ 🃏
                  </button>
                </div>
              ) : matchScore < 3 ? (
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className={`h-24 rounded-2xl font-heading font-black text-xl transition-all border-2 flex items-center justify-center ${
                        card.flipped || card.matched
                          ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                          : 'bg-sky-500 border-sky-600 text-white shadow-md'
                      }`}
                    >
                      {card.flipped || card.matched ? card.label : '❓'}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <span className="text-6xl block">🎉</span>
                  <h3 className="font-heading font-black text-2xl text-emerald-600">
                    BÉ ĐÃ GHÉP ĐÚNG TOÀN BỘ CÁC CẶP!
                  </h3>
                  <p className="text-xs font-black text-amber-600 bg-amber-50 py-2 rounded-xl border border-amber-200">
                    Hoàn thành lượt chơi! Phần thưởng tài khoản chưa được cộng.
                  </p>
                  <button
                    onClick={startMatchGame}
                    className="px-6 py-3 rounded-2xl font-black text-white bg-sky-500 hover:bg-sky-600 shadow-md transition"
                  >
                    Chơi Lại Ván Mới 🔄
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 5: 60 Giây thử thách */}
          {selectedGame.id === 'game-60s-blitz' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-yellow-300 shadow-2xl text-center">
              <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                ⚡ Thử Thách Blitz 60 Giây
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mb-6">
                Tính Nhẩm Thần Tốc Cùng Mini!
              </h2>

              {!blitzActive && !blitzGameOver ? (
                <div className="py-12">
                  <span className="text-7xl block mb-4 animate-bounce">⚡</span>
                  <button
                    onClick={startBlitzGame}
                    className="px-8 py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-yellow-500 to-amber-600 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition"
                  >
                    BẮT ĐẦU ĐUA TỐC ĐỘ ⏱️
                  </button>
                </div>
              ) : blitzActive ? (
                <div>
                  <div className="mb-3 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">🔐 Phiên chơi được máy chủ cấp câu hỏi và xác thực từng câu. XP/Vàng chỉ cộng sau khi máy chủ xác nhận.</div>
                <div className="flex items-center justify-between mb-8 bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
                    <div className="flex items-center gap-2 font-black text-slate-700">
                      <Timer className="w-5 h-5 text-amber-600" />
                      <span>Còn lại: {blitzTimer}s</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-amber-600 text-lg">
                      <Flame className="w-5 h-5 fill-rose-500 text-rose-500" />
                      <span>Đúng: {blitzScore} câu • Câu {Math.min(blitzQuestionNumber, 10)}/10</span>
                    </div>
                  </div>

                  {/* Math Formula */}
                  <div className="py-8 bg-slate-50 rounded-3xl border-2 border-slate-200 mb-6">
                    <span className="font-heading font-black text-4xl sm:text-5xl text-sky-700">
                      {blitzQuestion.a} {blitzQuestion.op} {blitzQuestion.b} = ?
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {blitzOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleBlitzAnswer(opt)}
                        disabled={blitzSubmitting}
                        className="py-4 rounded-2xl bg-white hover:bg-sky-50 border-2 border-sky-200 text-2xl font-black text-slate-800 shadow-md hover:scale-105 active:scale-95 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-4">
                  <span className="text-6xl block">⚡</span>
                  <h3 className="font-heading font-black text-2xl text-emerald-600">
                    Hết 60 Giây!
                  </h3>
                  <p className="text-base font-bold text-slate-700">
                    Bạn giải đúng được: <span className="text-amber-500 font-black">{blitzScore} câu</span>
                  </p>
                  <p className="text-xs font-black text-emerald-700 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                    {blitzRewardMessage || 'Lượt chơi được máy chủ xác thực; phần thưởng chỉ xuất hiện khi máy chủ xác nhận đủ điều kiện.'}
                  </p>
                  <button
                    onClick={startBlitzGame}
                    className="px-6 py-3 rounded-2xl font-black text-white bg-yellow-500 hover:bg-yellow-600 shadow-md transition"
                  >
                    Thử Lại Để Phá Kỷ Lục 🔄
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 6: Thợ săn hình học */}
          {selectedGame.id === 'game-shape-hunter' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-2xl text-center">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                🔺 Thợ Săn Hình Học
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                Hãy Chạm Vào Đúng <span className="text-emerald-600 uppercase">HÌNH TAM GIÁC (🔺)</span>!
              </h2>

              {shapeList.length === 0 && !shapeFinished ? (
                <div className="py-8">
                  <button
                    onClick={startShapeGame}
                    className="px-8 py-4 rounded-2xl font-black text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    BẮT ĐẦU SĂN HÌNH 🔺
                  </button>
                </div>
              ) : !shapeFinished ? (
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-4">
                    Đã tìm thấy: {shapeScore}/3 hình tam giác
                  </p>
                  <div className="grid grid-cols-3 gap-4 py-4 max-w-sm mx-auto">
                    {shapeList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleShapeClick(item)}
                        className="h-24 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-2xl text-4xl flex items-center justify-center transition hover:scale-110 active:scale-90"
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <span className="text-6xl block">🏆</span>
                  <h3 className="font-heading font-black text-2xl text-emerald-600">
                    BÉ ĐÃ SĂN ĐỦ CÁC HÌNH TAM GIÁC!
                  </h3>
                  <p className="text-xs font-black text-emerald-700 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                    Hoàn thành lượt chơi! Phần thưởng tài khoản chưa được cộng.
                  </p>
                  <button
                    onClick={startShapeGame}
                    className="px-6 py-3 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
                  >
                    Chơi Lại Ván Mới 🔄
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Games Grid List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINI_GAMES.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {game.previewEmoji}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {game.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">
                      Độ khó: {game.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-2 mb-6 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-500">
                  🎮 Điểm chơi được tính tại phiên. XP/Vàng chỉ trao khi có xác thực máy chủ.
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGame(game);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>CHƠI NGAY</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
