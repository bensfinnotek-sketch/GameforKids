export interface LessonReward { title:string; category:string; xpReward:number; coinReward:number; gemReward:number; totalQuestions:number; }
export const LESSON_REWARDS: Record<string, LessonReward> = {
  "lesson-1": {
    "title": "Đếm quả táo cùng Thám hiểm Mini",
    "category": "basic",
    "xpReward": 30,
    "coinReward": 15,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-2": {
    "title": "Nhận biết các hình khối vui nhộn",
    "category": "geometry",
    "xpReward": 35,
    "coinReward": 20,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-3": {
    "title": "So sánh: To hơn hay Nhỏ hơn?",
    "category": "logic",
    "xpReward": 40,
    "coinReward": 20,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-4": {
    "title": "Phép cộng đầu tiên trong giỏ hoa quả",
    "category": "basic",
    "xpReward": 45,
    "coinReward": 25,
    "gemReward": 8,
    "totalQuestions": 3
  },
  "lesson-4b": {
    "title": "Đếm chú vịt con bơi lội",
    "category": "basic",
    "xpReward": 35,
    "coinReward": 15,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-4c": {
    "title": "Sắc màu cầu vồng và hình học",
    "category": "geometry",
    "xpReward": 40,
    "coinReward": 20,
    "gemReward": 6,
    "totalQuestions": 3
  },
  "lesson-5": {
    "title": "Cộng trong phạm vi 20",
    "category": "basic",
    "xpReward": 50,
    "coinReward": 30,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-6": {
    "title": "Bí mật Phép Trừ qua thung lũng bí ẩn",
    "category": "basic",
    "xpReward": 55,
    "coinReward": 30,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-7": {
    "title": "Bảng nhân 2 và 5: Bước nhảy của chú ếch",
    "category": "basic",
    "xpReward": 60,
    "coinReward": 35,
    "gemReward": 12,
    "totalQuestions": 3
  },
  "lesson-8": {
    "title": "Toán tư duy: Tìm quy luật chuỗi hình",
    "category": "thinking",
    "xpReward": 65,
    "coinReward": 40,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-9": {
    "title": "Đo lường & Cân nặng: Chiếc cân bập bênh",
    "category": "geometry",
    "xpReward": 60,
    "coinReward": 35,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-10": {
    "title": "Toán tiếng Anh: Numbers & Operations",
    "category": "english-math",
    "xpReward": 70,
    "coinReward": 45,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-11": {
    "title": "Olympic Math Nhí: Bài toán đố xe bus",
    "category": "olympic",
    "xpReward": 80,
    "coinReward": 50,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-11b": {
    "title": "Phép chia chia kẹo công bằng",
    "category": "basic",
    "xpReward": 65,
    "coinReward": 35,
    "gemReward": 12,
    "totalQuestions": 3
  },
  "lesson-11c": {
    "title": "Xem đồng hồ và thời gian của Mini",
    "category": "geometry",
    "xpReward": 55,
    "coinReward": 30,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-11d": {
    "title": "Logic mê cung số học",
    "category": "logic",
    "xpReward": 60,
    "coinReward": 35,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-12": {
    "title": "Phép Nhân & Chia nhiều chữ số",
    "category": "basic",
    "xpReward": 75,
    "coinReward": 45,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-13": {
    "title": "Vương quốc Phân số: Miếng bánh pizza",
    "category": "thinking",
    "xpReward": 85,
    "coinReward": 50,
    "gemReward": 18,
    "totalQuestions": 3
  },
  "lesson-14": {
    "title": "Diện tích & Chu vi khu vườn hình học",
    "category": "geometry",
    "xpReward": 80,
    "coinReward": 50,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-15": {
    "title": "Logic suy luận: Ai là người nói thật?",
    "category": "logic",
    "xpReward": 90,
    "coinReward": 60,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-16": {
    "title": "English Math: Fractions & Word Problems",
    "category": "english-math",
    "xpReward": 95,
    "coinReward": 65,
    "gemReward": 22,
    "totalQuestions": 3
  },
  "lesson-17": {
    "title": "Olympic TIMO/HKIMO: Dãy số có quy luật",
    "category": "olympic",
    "xpReward": 110,
    "coinReward": 70,
    "gemReward": 25,
    "totalQuestions": 3
  },
  "lesson-18": {
    "title": "Hình học không gian: Đếm khối lập phương bí mật",
    "category": "geometry",
    "xpReward": 90,
    "coinReward": 55,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-19": {
    "title": "Toán xác suất vui: Vòng quay may mắn",
    "category": "thinking",
    "xpReward": 85,
    "coinReward": 50,
    "gemReward": 18,
    "totalQuestions": 3
  },
  "lesson-20": {
    "title": "Olympic Math: Bài toán gà và chó kinh điển",
    "category": "olympic",
    "xpReward": 120,
    "coinReward": 80,
    "gemReward": 30,
    "totalQuestions": 3
  },
  "lesson-21": {
    "title": "Phân số tối giản & So sánh quy đồng",
    "category": "thinking",
    "xpReward": 80,
    "coinReward": 50,
    "gemReward": 18,
    "totalQuestions": 3
  },
  "lesson-22": {
    "title": "Hình thang và Diện tích đặc biệt",
    "category": "geometry",
    "xpReward": 85,
    "coinReward": 55,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-23": {
    "title": "Toán chuyển động: Hai xe ngược chiều",
    "category": "thinking",
    "xpReward": 100,
    "coinReward": 65,
    "gemReward": 25,
    "totalQuestions": 3
  },
  "lesson-24": {
    "title": "Số nguyên âm trên bậc thang nhiệt độ",
    "category": "basic",
    "xpReward": 85,
    "coinReward": 50,
    "gemReward": 15,
    "totalQuestions": 3
  }
};
export function getLevelInfo(xp:number){const t=[[0,1],[100,2],[250,3],[500,4],[800,5],[1200,6],[1700,7],[2300,8],[3000,9],[4000,10]] as const;let level=1;for(const [min,l] of t)if(xp>=min)level=l;return {level};}
