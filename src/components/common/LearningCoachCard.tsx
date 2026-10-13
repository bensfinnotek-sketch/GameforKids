import React, { useState } from 'react';
import { Brain, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';

const practiceCards = [
  {
    label: 'SỐ HỌC',
    emoji: '🍎',
    title: 'Tách số để tính nhanh',
    prompt: '8 + 5 = ?',
    hint: 'Tách 5 thành 2 + 3 để đưa 8 thành 10 trước nhé.',
    answer: '13',
    explanation: '8 + 2 = 10, rồi 10 + 3 = 13. Cách làm này giúp tính nhẩm dễ hơn!',
    color: 'blue',
  },
  {
    label: 'QUY LUẬT',
    emoji: '🧩',
    title: 'Tìm mảnh ghép tiếp theo',
    prompt: '2 · 4 · 6 · 8 · ?',
    hint: 'Mỗi lần dãy số tăng thêm cùng một lượng.',
    answer: '10',
    explanation: 'Mỗi bước tăng 2 đơn vị: 8 + 2 = 10.',
    color: 'violet',
  },
  {
    label: 'TOÁN ĐỜI SỐNG',
    emoji: '🍊',
    title: 'Chia đều thật công bằng',
    prompt: '12 quả cam chia cho 3 bạn. Mỗi bạn được mấy quả?',
    hint: 'Hãy chia thành 3 nhóm bằng nhau.',
    answer: '4 quả',
    explanation: '12 ÷ 3 = 4. Có thể kiểm tra lại bằng 4 × 3 = 12.',
    color: 'amber',
  },
];

export const LearningCoachCard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const card = practiceCards[activeIndex];

  const changeCard = () => {
    setActiveIndex((index) => (index + 1) % practiceCards.length);
    setShowHint(false);
    setShowAnswer(false);
  };

  return (
    <section className="coach-panel" aria-label="Góc luyện tập cùng Mini">
      <div className="coach-heading">
        <div className="coach-heading-icon"><Brain size={22} /></div>
        <div>
          <p className="coach-eyebrow">GÓC LUYỆN TẬP 3 PHÚT</p>
          <h2>Thử thách nhỏ, tiến bộ lớn!</h2>
          <p>Một câu đố ngắn để luyện cách suy nghĩ, không chỉ tìm đáp án.</p>
        </div>
        <div className="coach-sparkle" aria-hidden="true"><Sparkles size={24} /></div>
      </div>

      <div className={`coach-practice-card coach-${card.color}`}>
        <div className="coach-card-top">
          <span className="coach-topic">{card.emoji} {card.label}</span>
          <span className="coach-step">CÂU {activeIndex + 1}/3</span>
        </div>
        <h3>{card.title}</h3>
        <p className="coach-prompt">{card.prompt}</p>

        {showHint && !showAnswer && (
          <div className="coach-feedback coach-hint"><Lightbulb size={17} /> <span>{card.hint}</span></div>
        )}
        {showAnswer && (
          <div className="coach-feedback coach-answer">
            <span className="coach-answer-badge">✓</span>
            <div><strong>Đáp án: {card.answer}</strong><p>{card.explanation}</p></div>
          </div>
        )}

        <div className="coach-actions">
          <button type="button" className="coach-button coach-button-quiet" onClick={() => { setShowHint(true); setShowAnswer(false); }}>
            <Lightbulb size={16} /> Gợi ý
          </button>
          <button type="button" className="coach-button coach-button-primary" onClick={() => { setShowAnswer(true); setShowHint(false); }}>
            Xem lời giải
          </button>
          <button type="button" className="coach-button coach-button-next" onClick={changeCard} aria-label="Chuyển câu đố">
            <RotateCcw size={16} /> Câu khác
          </button>
        </div>
      </div>
      <p className="coach-parent-note">💡 Mẹo học: Hãy nói thành lời cách con suy nghĩ. Giải thích được cách làm quan trọng không kém đáp án đúng.</p>
    </section>
  );
};
