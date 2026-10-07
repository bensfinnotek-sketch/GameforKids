// Level & XP System Utility for Math Adventure Kids

export interface LevelDetails {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  remainingXp: number;
}

// Titles based on milestone levels
export const getLevelTitle = (level: number): string => {
  if (level >= 50) return 'Đại Tôn Sư Toán Học Vũ Trụ 🌌';
  if (level >= 30) return 'Vua Thám Hiểm Toán Học 👑';
  if (level >= 20) return 'Phù Thủy Số Vô Cực 🧙‍♂️';
  if (level >= 15) return 'Huyền Thoại Toán Học ⭐';
  if (level >= 10) return 'Đại Kiện Tướng Olympic 🏆';
  if (level >= 8) return 'Bậc Thầy Đảo Toán 🏝️';
  if (level >= 6) return 'Thuyền Trưởng Tư Duy 🧭';
  if (level >= 4) return 'Chiến Binh Số Học ⚡';
  if (level >= 2) return 'Nhà Thám Hiểm Nhí 🎒';
  return 'Thám Hiểm Tập Sự 🌱';
};

// Calculate base XP needed for level L (progressive scale)
export const getXpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  // Formula: base 100 for level 2, scaling smoothly
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += Math.round(75 + (i - 1) * 35 + Math.pow(i, 1.4) * 8);
  }
  return total;
};

// Calculate current level from total XP
export const calculateLevelFromXP = (xp: number): number => {
  if (xp <= 0) return 1;
  let level = 1;
  while (level < 100 && xp >= getXpForLevel(level + 1)) {
    level++;
  }
  return level;
};

// Calculate XP details for next level
export const calculateXPForNextLevel = (xp: number) => {
  const currentLevel = calculateLevelFromXP(xp);
  const nextLevel = Math.min(100, currentLevel + 1);
  const currentLevelMinXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(nextLevel);
  const remainingXp = Math.max(0, nextLevelXp - xp);

  return {
    currentLevel,
    nextLevel,
    currentLevelXp: currentLevelMinXp,
    nextLevelXp,
    remainingXp,
  };
};

// Get progress percentage (0 - 100) towards next level
export const getLevelProgress = (xp: number): number => {
  const { currentLevelXp, nextLevelXp } = calculateXPForNextLevel(xp);
  const span = nextLevelXp - currentLevelXp;
  if (span <= 0) return 100;
  const progress = ((xp - currentLevelXp) / span) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

// Full level info object
export const getFullLevelDetails = (xp: number): LevelDetails => {
  const { currentLevel, nextLevelXp, remainingXp, currentLevelXp } = calculateXPForNextLevel(xp);
  const progressPercent = getLevelProgress(xp);
  const title = getLevelTitle(currentLevel);

  return {
    level: currentLevel,
    title,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
    remainingXp,
  };
};
