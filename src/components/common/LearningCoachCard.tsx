import React, { useState } from 'react';
import { Brain, CheckCircle2, Lightbulb, RotateCcw, Send, Sparkles } from 'lucide-react';

type PracticeCard = {
  label: string; emoji: string; title: string; prompt: string;
  hint: string; answer: string; accepted: string[]; explanation: string;
  color: 'blue' | 'violet' | 'amber';
};

const practiceCards: PracticeCard[] = [
  {
    label: 'SỐ HỌC', emoji: '🍎', title: 'Tách số để tính nhanh',
    prompt: '8 + 5 = ?', hint: 'Tách 5 thành 2 + 3 để đưa 8 thành 10 trước nhé.',
    answer: '13', accepted: ['13'],
    explanation: '8 + 2 = 10, rồi 10 + 3 = 13. Cách làm này giúp tính nhẩm dễ hơn!',
    color: 'blue',
  },
  {
    label: 'QUY LUẬT', emoji: '🧩', title: 'Tìm mảnh ghép tiếp theo',
    prompt: '2 · 4 · 6 · 8 · ?', hint: 'Mỗi lần dãy số tăng thêm cùng một lượng.',
    answer: '10', accepted: ['10'],
    explanation: 'Mỗi bước tăng 2 đơn vị: 8 + 2 = 10.',
    color: 'violet',
  },
  {
    label: 'TOÁN ĐỜI SỐNG', emoji: '🍊', title: 'Chia đều thật công bằng',
    prompt: '12 quả cam chia cho 3 bạn. Mỗi bạn được mấy quả?',
    hint: 'Hãy chia thành 3 nhóm bằng nhau.',
    answer: '4 quả', accepted: ['4', '4 quả', '4 quả cam'],
    explanation: '12 ÷ 3 = 4. Có thể kiểm tra lại bằng 4 × 3 = 12.',
    color: 'amber',
  },
];

const normalizeAnswer = (value: string) => value.trim().toLocaleLowerCase('vi').replace(/\\s+/g, ' ');

export const LearningCoachCard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'try-again' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const card = practiceCards[activeIndex];
  const isCompleted = completed.includes(activeIndex);

  const checkAnswer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim()) return;
    const correct = card.accepted.includes(normalizeAnswer(answer));
    setFeedback(correct ? 'correct' : 'try-again');
    if (correct) setCompleted((previous) => previous.includes(activeIndex) ? previous : [...previous, activeIndex]);
  };

  const changeCard = () => {
    setActiveIndex((index) => (index + 1) % practiceCards.length);
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  return (
    <section className="coach-panel" aria-label="Góc luyện tập cùng Mini">
      <div className="coach-heading">
        <div className="coach-heading-icon"><Brain size={22} /></div>
        <div>
          <p className="coach-eyebrow">GÓC LUYỆN TẬP 3 PHÚT</p>
          <h2>Thử thách nhỏ, tiến bộ lớn!</h2>
          <p>Trả lời câu hỏi, nhận phản hồi và khám phá cách giải cùng Mini.</p>
        </div>
        <div className="coach-sparkle" aria-hidden="true"><Sparkles size={24} /></div>
      </div>

      <div className={`coach-practice-card coach-${card.color}`}>
        <div className="coach-card-top">
          <span className="coach-topic">{card.emoji} {card.label}</span>
          <span className="coach-step">CÂU {activeIndex + 1}/{practiceCards.length}</span>
        </div>
        <div className="coach-progress-track" role="progressbar" aria-label="Tiến độ thử thách" aria-valuemin={0} aria-valuemax={practiceCards.length} aria-valuenow={completed.length}>
          <div className="coach-progress-fill" style={{ width: `${(completed.length / practiceCards.length) * 100}%` }} />
        </div>
        <h3>{card.title}</h3>
        <p className="coach-prompt">{card.prompt}</p>

        <form className="coach-answer-form" onSubmit={checkAnswer}>
          <label className="coach-answer-label" htmlFor="coach-answer-input">Câu trả lời của con</label>
          <div className="coach-answer-row">
            <input
              id="coach-answer-input"
              value={answer}
              onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }}
              placeholder="Nhập đáp án..."
              autoComplete="off"
              aria-describedby="coach-feedback-message"
            />
            <button className="coach-button coach-button-primary" type="submit" disabled={!answer.trim()}>
              <Send size={16} /> Kiểm tra
            </button>
          </div>
        </form>

        {feedback === 'correct' && (
          <div id="coach-feedback-message" className="coach-feedback coach-answer" role="status">
            <CheckCircle2 size={20} />
            <div><strong>Chính xác! Con làm tốt lắm! 🎉</strong><p>{card.explanation}</p></div>
          </div>
        )}
        {feedback === 'try-again' && (
          <div id="coach-feedback-message" className="coach-feedback coach-retry" role="status">
            <span aria-hidden="true">💪</span>
            <div><strong>Chưa đúng lần này, mình thử lại nhé!</strong><p>Đọc lại câu hỏi hoặc nhấn “Gợi ý” để có thêm manh mối.</p></div>
          </div>
        )}
        {showHint && !showSolution && feedback !== 'correct' && (
          <div className="coach-feedback coach-hint"><Lightbulb size={17} /> <span>{card.hint}</span></div>
        )}
        {showSolution && (
          <div className="coach-feedback coach-answer" role="status">
            <CheckCircle2 size={20} />
            <div><strong>Đáp án: {card.answer}</strong><p>{card.explanation}</p></div>
          </div>
        )}

        <div className="coach-actions">
          <button type="button" className="coach-button coach-button-quiet" onClick={() => { setShowHint(true); setShowSolution(false); }}>
            <Lightbulb size={16} /> Gợi ý
          </button>
          <button type="button" className="coach-button coach-button-quiet" onClick={() => { setShowSolution(true); setShowHint(false); }}>
            Xem lời giải
          </button>
          <button type="button" className="coach-button coach-button-next" onClick={changeCard}>
            <RotateCcw size={16} /> Câu tiếp theo
          </button>
        </div>
      </div>
      <p className="coach-parent-note">⭐ Hoàn thành {completed.length}/{practiceCards.length} thử thách trong lượt này. Mẹo học: hãy nói thành lời cách con suy nghĩ!</p>
    </section>
  );
};
