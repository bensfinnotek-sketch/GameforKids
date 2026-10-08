export type AgeGroup = '4-5' | '6-8' | '9-11';

export type SubjectCategory = 
  | 'basic'        // Toán cơ bản & Số học
  | 'thinking'     // Toán tư duy
  | 'geometry'     // Hình học & Đo lường
  | 'logic'        // Logic & Trí tuệ
  | 'english-math' // Toán tiếng Anh
  | 'olympic';     // Olympic Math

export type MascotState = 
  | 'happy' 
  | 'thinking' 
  | 'excited' 
  | 'celebrating' 
  | 'confused' 
  | 'sleeping' 
  | 'running' 
  | 'pointing';

export type QuestionType = 
  | 'multiple-choice' 
  | 'visual-counting' 
  | 'true-false' 
  | 'fill-number' 
  | 'match-pairs'
  | 'drag-drop'
  | 'ordering';

export interface AvatarConfig {
  baseEmoji: string;
  hat?: string;
  backpack?: string;
  skin?: string;
  background?: string;
  frame?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  rewardXp: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: SubjectCategory;
  ageGroup: AgeGroup;
  level: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Thử thách';
  xpReward: number;
  coinReward: number;
  gemReward: number;
  durationMinutes: number;
  thumbnailEmoji: string;
  worldId: string;
  totalQuestions: number;
  requiredLessonId?: string;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  type?: QuestionType;
  questionText: string;
  hint?: string;
  explanation?: string;
  visualType?: 'apples' | 'shapes' | 'numbers' | 'stars' | 'cubes' | 'formula' | 'fish';
  visualData?: {
    count?: number;
    emoji?: string;
    items?: string[];
    shape?: string;
    expression?: string;
  };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  correctFillValue?: number | string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'accuracy' | 'game' | 'mastery';
  requiredCount: number;
  unlockedAt?: string;
}

export interface TreasureItem {
  id: string;
  name: string;
  description: string;
  priceType: 'coin' | 'gem';
  price: number;
  category: 'avatar' | 'hat' | 'backpack' | 'skin' | 'background' | 'sticker' | 'special';
  previewEmoji: string;
  isEquippable: boolean;
  unlocked: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardXP: number;
  rewardGem: number;
  rewardCoin?: number;
  icon: string;
}

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  coinReward: number;
  previewEmoji: string;
  accentColor: string;
  difficulty: string;
  howToPlay: string;
}

export interface WorldNode {
  id: string;
  name: string;
  lessonId?: string;
  level: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  stars: number; // 0..3
}

export interface World {
  id: string;
  order: number;
  name: string;
  description: string;
  icon: string;
  category: SubjectCategory;
  bgColor: string;
  accentColor: string;
  requiredXp: number;
  isUnlocked: boolean;
  lessons: Lesson[];
  nodes: WorldNode[];
}

export interface StudyHistoryItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  category: SubjectCategory;
  completedAt: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  accuracy: number;
  starsEarned: number; // 1..3
  timeSpentSeconds: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  isRead: boolean;
  type: 'badge' | 'streak' | 'xp' | 'treasure' | 'level';
}

export interface UserProfile {
  /** Version of the persisted account schema. 2+ means real Firebase-backed data. */
  dataVersion?: number;
  id: string;
  name: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  avatarEmoji: string;
  avatarImage?: string;
  equippedHat?: string;
  equippedBackpack?: string;
  equippedSkin?: string;
  level: number;
  xp: number;
  coin: number;
  gem: number;
  streak: number;
  lastActiveDate: string;
  selectedAgeGroup: AgeGroup;
  completedLessons: string[]; // lesson ids
  lessonStars: Record<string, number>; // lessonId -> 1..3 stars
  unlockedBadges: string[]; // badge ids
  inventory: string[]; // treasure item ids
  soundEnabled: boolean;
  musicEnabled: boolean;
  dailyStudyGoalMinutes: number;
  history: StudyHistoryItem[];
  highScores: Record<string, number>; // gameId -> score
  notifications: NotificationItem[];
}
