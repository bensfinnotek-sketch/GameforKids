import React, { useEffect, useState } from 'react';
import { Brain, CheckCircle2, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import { AgeGroup } from '../../types';

type PracticeCard = {
  label: string;
  emoji: string;
  title: string;
  prompt: string;
  hint: string;
  answer: string;
  accepted: string[];
  choices: string[];
  explanation: string;
  color: 'blue' | 'violet' | 'amber';
};

const practiceByAge: Record<AgeGroup, PracticeCard[]> = {
  '2-3': [
    { label: 'NHẬN BIẾT', emoji: '🔴', title: 'Tìm màu đỏ', prompt: 'Quả nào thường có màu đỏ: quả táo 🍎 hay quả chuối 🍌?', hint: 'Hãy nhìn màu của hai loại quả nhé.', answer: 'Quả táo', accepted: ['quả táo'], choices: ['Quả táo', 'Quả chuối'], explanation: 'Đúng rồi, quả táo thường có màu đỏ. Màu sắc có thể khác nhau tùy từng loại quả!', color: 'blue' },
    { label: 'ĐẾM CÙNG MINI', emoji: '🐟', title: 'Đếm chú cá', prompt: '🐟 🐟 🐟 Có tất cả mấy chú cá?', hint: 'Con chỉ tay vào từng chú cá và đếm: một, hai...', answer: '3 chú cá', accepted: ['3 chú cá', 'ba chú cá'], choices: ['2 chú cá', '3 chú cá', '4 chú cá'], explanation: 'Có 3 chú cá! Mình đếm từng chú một nhé.', color: 'violet' },
    { label: 'HÌNH DẠNG', emoji: '⚽', title: 'Tìm hình tròn', prompt: 'Vật nào có dạng hình tròn: quả bóng ⚽ hay quyển sách 📘?', hint: 'Hình tròn cong đều, không có góc nhọn.', answer: 'Quả bóng', accepted: ['quả bóng'], choices: ['Quả bóng', 'Quyển sách'], explanation: 'Quả bóng có dạng tròn. Con thử tìm thêm đồ vật hình tròn quanh mình nhé!', color: 'amber' },
    { label: 'SO SÁNH', emoji: '🐘', title: 'Bạn nào to hơn?', prompt: 'Con vật nào thường to hơn: 🐘 voi hay 🐭 chuột?', hint: 'Hãy nghĩ đến con vật có thân hình rất lớn.', answer: 'Con voi', accepted: ['con voi'], choices: ['Con voi', 'Con chuột'], explanation: 'Con voi to hơn con chuột rất nhiều. Mình đã biết cách so sánh to và nhỏ!', color: 'blue' },
    { label: 'ĐẾM ĐỒ VẬT', emoji: '⭐', title: 'Đếm ngôi sao', prompt: '⭐ ⭐ Có mấy ngôi sao?', hint: 'Chạm hoặc chỉ vào từng ngôi sao khi đếm.', answer: '2 ngôi sao', accepted: ['2 ngôi sao', 'hai ngôi sao'], choices: ['1 ngôi sao', '2 ngôi sao', '3 ngôi sao'], explanation: 'Có 2 ngôi sao. Đếm chậm rãi giúp mình không bỏ sót nhé!', color: 'violet' },
  ],
  '4-5': [
    { label: 'ĐẾM SỐ', emoji: '🍓', title: 'Đếm quả dâu', prompt: '🍓 🍓 🍓 🍓 Có tất cả bao nhiêu quả dâu?', hint: 'Đếm từng quả một: 1, 2, 3...', answer: '4 quả', accepted: ['4 quả', 'bốn quả'], choices: ['3 quả', '4 quả', '5 quả'], explanation: 'Có 4 quả dâu. Mỗi quả mình đếm một lần nhé!', color: 'blue' },
    { label: 'PHÉP CỘNG', emoji: '🍊', title: 'Giỏ cam vui vẻ', prompt: 'Có 2 quả cam, mẹ cho thêm 1 quả. Có tất cả mấy quả cam?', hint: 'Bắt đầu từ 2 rồi đếm thêm một số nữa.', answer: '3 quả', accepted: ['3 quả', 'ba quả'], choices: ['2 quả', '3 quả', '4 quả'], explanation: '2 + 1 = 3 quả cam. Giỏi lắm!', color: 'violet' },
    { label: 'HÌNH HỌC', emoji: '🔺', title: 'Hình tam giác', prompt: 'Hình tam giác có mấy cạnh?', hint: 'Con có thể đếm các cạnh quanh hình 🔺.', answer: '3 cạnh', accepted: ['3 cạnh', 'ba cạnh'], choices: ['2 cạnh', '3 cạnh', '4 cạnh'], explanation: 'Hình tam giác có 3 cạnh và 3 góc.', color: 'amber' },
    { label: 'SO SÁNH SỐ', emoji: '🐞', title: 'Ai có nhiều hơn?', prompt: 'Nhóm A có 🐞🐞, nhóm B có 🐞🐞🐞. Nhóm nào nhiều bọ rùa hơn?', hint: 'Đếm từng nhóm rồi so sánh 2 và 3.', answer: 'Nhóm B', accepted: ['nhóm b'], choices: ['Nhóm A', 'Nhóm B', 'Hai nhóm bằng nhau'], explanation: 'Nhóm B có 3 con, nhóm A có 2 con. Ba nhiều hơn hai một đơn vị.', color: 'blue' },
    { label: 'PHÉP TRỪ', emoji: '🎈', title: 'Bóng bay bay mất', prompt: 'Có 5 quả bóng, 1 quả bay đi. Còn lại mấy quả?', hint: 'Bớt đi 1 nghĩa là đếm lùi một số.', answer: '4 quả', accepted: ['4 quả', 'bốn quả'], choices: ['3 quả', '4 quả', '5 quả'], explanation: '5 − 1 = 4. Khi bớt đi một đồ vật, số lượng giảm một.', color: 'violet' },
    { label: 'QUY LUẬT', emoji: '🔵', title: 'Màu tiếp theo', prompt: '🔵 🔴 🔵 🔴 🔵 ... Màu nào tiếp theo?', hint: 'Hai màu xanh và đỏ thay phiên nhau.', answer: 'Màu đỏ', accepted: ['màu đỏ'], choices: ['Màu xanh', 'Màu đỏ', 'Màu vàng'], explanation: 'Dãy màu luân phiên xanh, đỏ nên sau màu xanh là màu đỏ.', color: 'amber' },
  ],
  '6-8': [
    { label: 'SỐ HỌC', emoji: '🍎', title: 'Tách số để tính nhanh', prompt: '8 + 5 = ?', hint: 'Tách 5 thành 2 + 3 để đưa 8 thành 10 trước nhé.', answer: '13', accepted: ['13', 'mười ba'], choices: ['12', '13', '14'], explanation: '8 + 2 = 10, rồi 10 + 3 = 13. Cách làm này giúp tính nhẩm dễ hơn!', color: 'blue' },
    { label: 'QUY LUẬT', emoji: '🧩', title: 'Mảnh ghép tiếp theo', prompt: '2 · 4 · 6 · 8 · ?', hint: 'Mỗi lần dãy số tăng thêm cùng một lượng.', answer: '10', accepted: ['10', 'mười'], choices: ['9', '10', '12'], explanation: 'Mỗi bước tăng 2 đơn vị: 8 + 2 = 10.', color: 'violet' },
    { label: 'TOÁN ĐỜI SỐNG', emoji: '🍊', title: 'Chia đều thật công bằng', prompt: '12 quả cam chia cho 3 bạn. Mỗi bạn được mấy quả?', hint: 'Hãy chia thành 3 nhóm bằng nhau.', answer: '4 quả', accepted: ['4 quả', 'bốn quả'], choices: ['3 quả', '4 quả', '6 quả'], explanation: '12 ÷ 3 = 4. Có thể kiểm tra lại bằng 4 × 3 = 12.', color: 'amber' },
    { label: 'PHÉP TRỪ', emoji: '🚀', title: 'Tính hiệu', prompt: '35 − 17 = ?', hint: 'Từ 35 trừ 10 trước, rồi trừ tiếp 7.', answer: '18', accepted: ['18', 'mười tám'], choices: ['17', '18', '19'], explanation: '35 − 10 = 25; 25 − 7 = 18.', color: 'blue' },
    { label: 'BẢNG NHÂN', emoji: '🐙', title: 'Bạch tuộc chăm chỉ', prompt: '4 con bạch tuộc, mỗi con có 8 xúc tu. Có tất cả bao nhiêu xúc tu?', hint: 'Cộng 8 bốn lần hoặc tính 4 × 8.', answer: '32', accepted: ['32', 'ba mươi hai'], choices: ['24', '32', '36'], explanation: '4 × 8 = 32 xúc tu. Phép nhân là cách cộng lặp lại nhanh chóng.', color: 'violet' },
    { label: 'ĐO LƯỜNG', emoji: '📏', title: 'Đổi đơn vị', prompt: '1 mét bằng bao nhiêu xăng-ti-mét?', hint: 'Một mét gồm 10 đoạn, mỗi đoạn dài 10 cm.', answer: '100 cm', accepted: ['100 cm', '100 xăng ti mét', '100'], choices: ['10 cm', '100 cm', '1.000 cm'], explanation: '1 m = 100 cm. Nhớ mối quan hệ này sẽ giúp đo chiều dài dễ dàng hơn.', color: 'amber' },
  ],
  '9-11': [
    { label: 'PHÉP NHÂN', emoji: '🚀', title: 'Tăng tốc tính nhẩm', prompt: '25 × 4 = ?', hint: 'Nhân 25 với 2 được 50, rồi nhân đôi lần nữa.', answer: '100', accepted: ['100', 'một trăm'], choices: ['75', '100', '125'], explanation: '25 × 4 = 100. Nhân 25 với 4 là một cách nhanh để tạo thành 100.', color: 'blue' },
    { label: 'PHÂN SỐ', emoji: '🍕', title: 'Chia sẻ chiếc pizza', prompt: 'Pizza chia thành 4 phần bằng nhau. Ăn 1 phần thì còn mấy phần?', hint: 'Lấy tổng số phần trừ đi số phần đã ăn.', answer: '3 phần', accepted: ['3 phần', 'ba phần'], choices: ['1 phần', '2 phần', '3 phần'], explanation: '4 − 1 = 3 phần còn lại, tức là 3/4 chiếc pizza.', color: 'violet' },
    { label: 'TƯ DUY LOGIC', emoji: '🔢', title: 'Dãy số bí ẩn', prompt: '1, 1, 2, 3, 5, 8, ?', hint: 'Mỗi số từ số thứ ba bằng tổng hai số ngay trước nó.', answer: '13', accepted: ['13', 'mười ba'], choices: ['11', '13', '15'], explanation: '5 + 8 = 13. Đây là dãy Fibonacci: mỗi số là tổng của hai số trước.', color: 'amber' },
    { label: 'PHÂN SỐ', emoji: '🍰', title: 'Cộng hai phân số', prompt: '1/4 + 2/4 = ?', hint: 'Hai phân số cùng mẫu số: cộng tử số, giữ nguyên mẫu số.', answer: '3/4', accepted: ['3/4', 'ba phần tư'], choices: ['2/4', '3/4', '3/8'], explanation: '1/4 + 2/4 = (1 + 2)/4 = 3/4.', color: 'blue' },
    { label: 'CHU VI', emoji: '📐', title: 'Viền khu vườn', prompt: 'Hình chữ nhật dài 8 m, rộng 3 m. Chu vi là bao nhiêu?', hint: 'Chu vi hình chữ nhật bằng 2 × (dài + rộng).', answer: '22 m', accepted: ['22 m', '22 mét', '22'], choices: ['11 m', '22 m', '24 m'], explanation: 'Chu vi = 2 × (8 + 3) = 2 × 11 = 22 m.', color: 'violet' },
    { label: 'TỈ LỆ', emoji: '🧃', title: 'Pha nước trái cây', prompt: 'Tỉ lệ si-rô và nước là 1 : 3. Nếu dùng 2 cốc si-rô thì cần mấy cốc nước?', hint: 'Nhân cả hai phần của tỉ lệ với 2.', answer: '6 cốc', accepted: ['6 cốc', 'sáu cốc'], choices: ['3 cốc', '5 cốc', '6 cốc'], explanation: 'Tỉ lệ 1 : 3 nhân 2 thành 2 : 6, vậy cần 6 cốc nước.', color: 'amber' },
  ],
};

const normalizeAnswer = (value: string) =>
  value.trim().toLocaleLowerCase('vi').replace(/\s+/g, ' ');

type LearningCoachCardProps = { ageGroup: AgeGroup };

export const LearningCoachCard: React.FC<LearningCoachCardProps> = ({ ageGroup }) => {
  const cards = practiceByAge[ageGroup];
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'try-again' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  // A new age group is a new practice session; never carry answers across age groups.
  useEffect(() => {
    setActiveIndex(0);
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setCompleted([]);
  }, [ageGroup]);

  const card = cards[activeIndex];

  const checkAnswer = (choice: string) => {
    setAnswer(choice);
    const correct = card.accepted.includes(normalizeAnswer(choice));
    setFeedback(correct ? 'correct' : 'try-again');
    if (correct) {
      setCompleted((previous) => previous.includes(activeIndex) ? previous : [...previous, activeIndex]);
    }
  };

  const changeCard = () => {
    setActiveIndex((index) => (index + 1) % cards.length);
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const resetPractice = () => {
    setActiveIndex(0);
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setCompleted([]);
  };

  return (
    <section className="coach-panel" aria-label="Góc luyện tập cùng Mini">
      <div className="coach-heading">
        <div className="coach-heading-icon"><Brain size={22} /></div>
        <div>
          <p className="coach-eyebrow">NGÂN HÀNG 24 CÂU · {ageGroup} TUỔI</p>
          <h2>Thử thách nhỏ, tiến bộ lớn!</h2>
          <p>Khám phá câu hỏi theo độ tuổi, nhận phản hồi tức thì và xem cách giải từng bước cùng Mini.</p>
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
        <p id="coach-prompt" className="coach-prompt">{card.prompt}</p>

        <div className="coach-choice-list" role="group" aria-label="Chọn đáp án" aria-describedby="coach-prompt">
          {card.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              disabled={feedback === 'correct'}
              className={`coach-choice min-h-14 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 focus-visible:ring-offset-2 motion-reduce:transition-none ${ageGroup === '2-3' ? 'min-h-16 text-base' : ''} ${answer === choice ? 'coach-choice-selected' : ''} ${feedback === 'correct' && answer === choice ? 'coach-choice-correct' : ''}`}
              onClick={() => checkAnswer(choice)}
              aria-pressed={answer === choice}
            >
              <span>{choice}</span>
              {feedback === 'correct' && answer === choice && <CheckCircle2 size={18} />}
            </button>
          ))}
        </div>

        {feedback === 'correct' && (
          <div className="coach-feedback coach-answer" role="status">
            <CheckCircle2 size={20} /><div><strong>Chính xác! Con làm tốt lắm! 🎉</strong><p>{card.explanation}</p></div>
          </div>
        )}
        {feedback === 'try-again' && (
          <div className="coach-feedback coach-retry" role="status">
            <span aria-hidden="true">💪</span><div><strong>Chưa đúng lần này, mình thử lại nhé!</strong><p>Đọc lại câu hỏi hoặc nhấn “Gợi ý” để có thêm manh mối.</p></div>
          </div>
        )}
        {showHint && !showSolution && feedback !== 'correct' && (
          <div className="coach-feedback coach-hint" role="status"><Lightbulb size={17} /><span>{card.hint}</span></div>
        )}
        {showSolution && (
          <div className="coach-feedback coach-answer" role="status">
            <CheckCircle2 size={20} /><div><strong>Đáp án: {card.answer}</strong><p>{card.explanation}</p></div>
          </div>
        )}

        <div className="coach-actions">
          <button type="button" className="coach-button coach-button-quiet min-h-12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 focus-visible:ring-offset-2 motion-reduce:transition-none" onClick={() => { setShowHint(true); setShowSolution(false); }}><Lightbulb size={16} /> Gợi ý</button>
          <button type="button" className="coach-button coach-button-quiet min-h-12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 focus-visible:ring-offset-2 motion-reduce:transition-none" onClick={() => { setShowSolution(true); setShowHint(false); }}>Xem lời giải</button>
          {completed.length === cards.length ? (
            <button type="button" className="coach-button coach-button-next min-h-12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 focus-visible:ring-offset-2 motion-reduce:transition-none" onClick={resetPractice}><RotateCcw size={16} /> Luyện lại từ đầu</button>
          ) : (
            <button type="button" className="coach-button coach-button-next min-h-12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500 focus-visible:ring-offset-2 motion-reduce:transition-none" onClick={changeCard}><RotateCcw size={16} /> Câu tiếp theo</button>
          )}
        </div>
      </div>
      <p className="coach-parent-note">⭐ Đã trả lời đúng {completed.length}/{cards.length} câu trong lượt này. Đây là tiến độ luyện tập trong phiên, chưa cộng XP hoặc thay đổi hồ sơ tài khoản.</p>
    </section>
  );
};
