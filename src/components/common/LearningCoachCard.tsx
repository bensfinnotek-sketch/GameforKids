import React, { useState } from 'react';
import { Brain, CheckCircle2, Lightbulb, RotateCcw, Send, Sparkles } from 'lucide-react';
import { AgeGroup } from '../../types';

type PracticeCard = {
  label: string; emoji: string; title: string; prompt: string;
  hint: string; answer: string; accepted: string[]; explanation: string;
  color: 'blue' | 'violet' | 'amber';
};

const practiceByAge: Record<AgeGroup, PracticeCard[]> = {
  '2-3': [
    { label: 'NHẬN BIẾT', emoji: '🔴', title: 'Tìm màu đỏ', prompt: 'Quả nào thường có màu đỏ: quả táo 🍎 hay quả chuối 🍌?', hint: 'Hãy nhìn màu của hai loại quả nhé.', answer: 'Quả táo', accepted: ['táo', 'quả táo', 'táo đỏ', 'apple'], explanation: 'Đúng rồi, quả táo thường có màu đỏ. Màu sắc có thể khác nhau tùy từng loại quả!', color: 'blue' },
    { label: 'ĐẾM CÙNG MINI', emoji: '🐟', title: 'Đếm chú cá', prompt: '🐟 🐟 🐟 Có tất cả mấy chú cá?', hint: 'Con chỉ tay vào từng chú cá và đếm: một, hai...', answer: '3 chú cá', accepted: ['3', 'ba', '3 chú cá', 'ba chú cá'], explanation: 'Có 3 chú cá! Mình đếm từng chú một nhé.', color: 'violet' },
    { label: 'HÌNH DẠNG', emoji: '⚽', title: 'Tìm hình tròn', prompt: 'Vật nào có dạng hình tròn: quả bóng ⚽ hay quyển sách 📘?', hint: 'Hình tròn cong đều, không có góc nhọn.', answer: 'Quả bóng', accepted: ['bóng', 'quả bóng', 'hình tròn'], explanation: 'Quả bóng có dạng tròn. Con thử tìm thêm đồ vật hình tròn quanh mình nhé!', color: 'amber' },
  ],
  '4-5': [
    { label: 'ĐẾM SỐ', emoji: '🍓', title: 'Đếm quả dâu', prompt: '🍓 🍓 🍓 🍓 Có tất cả bao nhiêu quả dâu?', hint: 'Đếm từng quả một: 1, 2, 3...', answer: '4 quả', accepted: ['4', 'bốn', '4 quả', 'bốn quả'], explanation: 'Có 4 quả dâu. Mỗi quả mình đếm một lần nhé!', color: 'blue' },
    { label: 'PHÉP CỘNG', emoji: '🍊', title: 'Giỏ cam vui vẻ', prompt: 'Có 2 quả cam, mẹ cho thêm 1 quả. Có tất cả mấy quả cam?', hint: 'Bắt đầu từ 2 rồi đếm thêm một số nữa.', answer: '3 quả', accepted: ['3', 'ba', '3 quả', 'ba quả'], explanation: '2 + 1 = 3 quả cam. Giỏi lắm!', color: 'violet' },
    { label: 'HÌNH HỌC', emoji: '🔺', title: 'Nhận ra hình tam giác', prompt: 'Hình tam giác có mấy cạnh?', hint: 'Con có thể đếm các cạnh quanh hình 🔺.', answer: '3 cạnh', accepted: ['3', 'ba', '3 cạnh', 'ba cạnh'], explanation: 'Hình tam giác có 3 cạnh và 3 góc.', color: 'amber' },
  ],
  '6-8': [
    { label: 'SỐ HỌC', emoji: '🍎', title: 'Tách số để tính nhanh', prompt: '8 + 5 = ?', hint: 'Tách 5 thành 2 + 3 để đưa 8 thành 10 trước nhé.', answer: '13', accepted: ['13', 'mười ba'], explanation: '8 + 2 = 10, rồi 10 + 3 = 13. Cách làm này giúp tính nhẩm dễ hơn!', color: 'blue' },
    { label: 'QUY LUẬT', emoji: '🧩', title: 'Tìm mảnh ghép tiếp theo', prompt: '2 · 4 · 6 · 8 · ?', hint: 'Mỗi lần dãy số tăng thêm cùng một lượng.', answer: '10', accepted: ['10', 'mười'], explanation: 'Mỗi bước tăng 2 đơn vị: 8 + 2 = 10.', color: 'violet' },
    { label: 'TOÁN ĐỜI SỐNG', emoji: '🍊', title: 'Chia đều thật công bằng', prompt: '12 quả cam chia cho 3 bạn. Mỗi bạn được mấy quả?', hint: 'Hãy chia thành 3 nhóm bằng nhau.', answer: '4 quả', accepted: ['4', 'bốn', '4 quả', 'bốn quả'], explanation: '12 ÷ 3 = 4. Có thể kiểm tra lại bằng 4 × 3 = 12.', color: 'amber' },
  ],
  '9-11': [
    { label: 'PHÉP NHÂN', emoji: '🚀', title: 'Tăng tốc tính nhẩm', prompt: '25 × 4 = ?', hint: 'Tính 100 ÷ 4 = 25 để kiểm tra, hoặc tách 25 thành 100 phần tư.', answer: '100', accepted: ['100', 'một trăm'], explanation: '25 × 4 = 100. Nhân 25 với 4 là một cách nhanh để tạo thành 100.', color: 'blue' },
    { label: 'PHÂN SỐ', emoji: '🍕', title: 'Chia sẻ chiếc pizza', prompt: 'Pizza chia thành 4 phần bằng nhau. Ăn 1 phần thì còn mấy phần?', hint: 'Lấy tổng số phần trừ đi số phần đã ăn.', answer: '3 phần', accepted: ['3', 'ba', '3 phần', 'ba phần', '3/4', 'ba phần tư'], explanation: '4 − 1 = 3 phần còn lại, tức là 3/4 chiếc pizza.', color: 'violet' },
    { label: 'TƯ DUY LOGIC', emoji: '🔢', title: 'Dãy số bí ẩn', prompt: '1, 1, 2, 3, 5, 8, ?', hint: 'Mỗi số (từ số thứ ba) bằng tổng hai số đứng ngay trước nó.', answer: '13', accepted: ['13', 'mười ba'], explanation: '5 + 8 = 13. Đây là dãy Fibonacci: mỗi số là tổng của hai số trước.', color: 'amber' },
  ],
};

const normalizeAnswer = (value: string) => value.trim().toLocaleLowerCase('vi').replace(/\\s+/g, ' ');

type LearningCoachCardProps = { ageGroup: AgeGroup };

export const LearningCoachCard: React.FC<LearningCoachCardProps> = ({ ageGroup }) => {
  const cards = practiceByAge[ageGroup];
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'try-again' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const card = cards[activeIndex];

  const checkAnswer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim()) return;
    const correct = card.accepted.includes(normalizeAnswer(answer));
    setFeedback(correct ? 'correct' : 'try-again');
    if (correct) setCompleted((previous) => previous.includes(activeIndex) ? previous : [...previous, activeIndex]);
  };

  const changeCard = () => {
    setActiveIndex((index) => (index + 1) % cards.length);
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
          <p className="coach-eyebrow">GÓC LUYỆN TẬP 3 PHÚT · {ageGroup} TUỔI</p>
          <h2>Thử thách nhỏ, tiến bộ lớn!</h2>
          <p>Bài tập được chọn theo độ tuổi. Trả lời, nhận phản hồi và khám phá cách giải cùng Mini.</p>
        </div>
        <div className="coach-sparkle" aria-hidden="true"><Sparkles size={24} /></div>
      </div>

      <div className={`coach-practice-card coach-${card.color}`}>
        <div className="coach-card-top">
          <span className="coach-topic">{card.emoji} {card.label}</span>
          <span className="coach-step">CÂU {activeIndex + 1}/{cards.length}</span>
        </div>
        <div className="coach-progress-track" role="progressbar" aria-label="Tiến độ thử thách" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={completed.length}>
          <div className="coach-progress-fill" style={{ width: `${(completed.length / cards.length) * 100}%` }} />
        </div>
        <h3>{card.title}</h3>
        <p className="coach-prompt">{card.prompt}</p>

        <form className="coach-answer-form" onSubmit={checkAnswer}>
          <label className="coach-answer-label" htmlFor="coach-answer-input">Câu trả lời của con</label>
          <div className="coach-answer-row">
            <input id="coach-answer-input" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }} placeholder="Nhập đáp án..." autoComplete="off" aria-describedby="coach-feedback-message" />
            <button className="coach-button coach-button-primary" type="submit" disabled={!answer.trim()}><Send size={16} /> Kiểm tra</button>
          </div>
        </form>

        {feedback === 'correct' && (
          <div id="coach-feedback-message" className="coach-feedback coach-answer" role="status">
            <CheckCircle2 size={20} /><div><strong>Chính xác! Con làm tốt lắm! 🎉</strong><p>{card.explanation}</p></div>
          </div>
        )}
        {feedback === 'try-again' && (
          <div id="coach-feedback-message" className="coach-feedback coach-retry" role="status">
            <span aria-hidden="true">💪</span><div><strong>Chưa đúng lần này, mình thử lại nhé!</strong><p>Đọc lại câu hỏi hoặc nhấn “Gợi ý” để có thêm manh mối.</p></div>
          </div>
        )}
        {showHint && !showSolution && feedback !== 'correct' && (
          <div className="coach-feedback coach-hint"><Lightbulb size={17} /><span>{card.hint}</span></div>
        )}
        {showSolution && (
          <div className="coach-feedback coach-answer" role="status">
            <CheckCircle2 size={20} /><div><strong>Đáp án: {card.answer}</strong><p>{card.explanation}</p></div>
          </div>
        )}

        <div className="coach-actions">
          <button type="button" className="coach-button coach-button-quiet" onClick={() => { setShowHint(true); setShowSolution(false); }}><Lightbulb size={16} /> Gợi ý</button>
          <button type="button" className="coach-button coach-button-quiet" onClick={() => { setShowSolution(true); setShowHint(false); }}>Xem lời giải</button>
          <button type="button" className="coach-button coach-button-next" onClick={changeCard}><RotateCcw size={16} /> Câu tiếp theo</button>
        </div>
      </div>
      <p className="coach-parent-note">⭐ Hoàn thành {completed.length}/{cards.length} thử thách trong lượt này. Mẹo học: hãy nói thành lời cách con suy nghĩ!</p>
    </section>
  );
};
