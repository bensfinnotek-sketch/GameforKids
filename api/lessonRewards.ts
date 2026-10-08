export interface LessonReward { xpReward:number; coinReward:number; gemReward:number; totalQuestions:number; }
export const LESSON_REWARDS: Record<string, LessonReward> = {
  "lesson-1": {
    "xpReward": 30,
    "coinReward": 15,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-2": {
    "xpReward": 35,
    "coinReward": 20,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-3": {
    "xpReward": 40,
    "coinReward": 20,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-4": {
    "xpReward": 45,
    "coinReward": 25,
    "gemReward": 8,
    "totalQuestions": 3
  },
  "lesson-4b": {
    "xpReward": 35,
    "coinReward": 15,
    "gemReward": 5,
    "totalQuestions": 3
  },
  "lesson-4c": {
    "xpReward": 40,
    "coinReward": 20,
    "gemReward": 6,
    "totalQuestions": 3
  },
  "lesson-5": {
    "xpReward": 50,
    "coinReward": 30,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-6": {
    "xpReward": 55,
    "coinReward": 30,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-7": {
    "xpReward": 60,
    "coinReward": 35,
    "gemReward": 12,
    "totalQuestions": 3
  },
  "lesson-8": {
    "xpReward": 65,
    "coinReward": 40,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-9": {
    "xpReward": 60,
    "coinReward": 35,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-10": {
    "xpReward": 70,
    "coinReward": 45,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-11": {
    "xpReward": 80,
    "coinReward": 50,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-11b": {
    "xpReward": 65,
    "coinReward": 35,
    "gemReward": 12,
    "totalQuestions": 3
  },
  "lesson-11c": {
    "xpReward": 55,
    "coinReward": 30,
    "gemReward": 10,
    "totalQuestions": 3
  },
  "lesson-11d": {
    "xpReward": 60,
    "coinReward": 35,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-12": {
    "xpReward": 75,
    "coinReward": 45,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-13": {
    "xpReward": 85,
    "coinReward": 50,
    "gemReward": 18,
    "totalQuestions": 3
  },
  "lesson-14": {
    "xpReward": 80,
    "coinReward": 50,
    "gemReward": 15,
    "totalQuestions": 3
  },
  "lesson-15": {
    "xpReward": 90,
    "coinReward": 60,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-16": {
    "xpReward": 95,
    "coinReward": 65,
    "gemReward": 22,
    "totalQuestions": 3
  },
  "lesson-17": {
    "xpReward": 110,
    "coinReward": 70,
    "gemReward": 25,
    "totalQuestions": 3
  },
  "lesson-18": {
    "xpReward": 90,
    "coinReward": 55,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-19": {
    "xpReward": 85,
    "coinReward": 50,
    "gemReward": 18,
    "totalQuestions": 3
  },
  "lesson-20": {
    "xpReward": 120,
    "coinReward": 80,
    "gemReward": 30,
    "totalQuestions": 3
  },
  "lesson-21": {
    "xpReward": 80,
    "coinReward": 50,
    "gemReward": 18,
    "totalQuestions": 3
  },
  "lesson-22": {
    "xpReward": 85,
    "coinReward": 55,
    "gemReward": 20,
    "totalQuestions": 3
  },
  "lesson-23": {
    "xpReward": 100,
    "coinReward": 65,
    "gemReward": 25,
    "totalQuestions": 3
  },
  "lesson-24": {
    "xpReward": 85,
    "coinReward": 50,
    "gemReward": 15,
    "totalQuestions": 3
  }
};
export function getLevelInfo(xp:number){const t=[[0,1],[100,2],[250,3],[500,4],[800,5],[1200,6],[1700,7],[2300,8],[3000,9],[4000,10]] as const;let level=1;for(const [min,l] of t)if(xp>=min)level=l;return {level};}
