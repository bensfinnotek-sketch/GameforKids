import { onAuthStateChanged, fetchUserProfileFromFirestore, logOutUser } from '../firebase/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  Lesson, 
  TreasureItem, 
  Badge, 
  DailyChallenge, 
  AgeGroup, 
  SubjectCategory, 
  StudyHistoryItem,
  NotificationItem,
  World
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_LESSONS, 
  INITIAL_BADGES, 
  INITIAL_TREASURE_ITEMS, 
  INITIAL_DAILY_CHALLENGES, 
  INITIAL_WORLDS,
  getLevelInfo 
} from '../data/mockData';
import { soundManager } from '../utils/sound';

export interface RewardNotification {
  id: string;
  title: string;
  message: string;
  xp?: number;
  coin?: number;
  gem?: number;
  badge?: string;
  icon?: string;
}

interface GameContextType {
  user: UserProfile;
  lessons: Lesson[];
  badges: Badge[];
  treasureItems: TreasureItem[];
  dailyChallenges: DailyChallenge[];
  worlds: World[];
  currentReward: RewardNotification | null;
  levelUpModalData: { oldLevel: number; newLevel: number; title: string } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAgeGroup: AgeGroup;
  setActiveAgeGroup: (group: AgeGroup) => void;
  activeCategory: SubjectCategory | 'all';
  setActiveCategory: (cat: SubjectCategory | 'all') => void;
  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson | null) => void;
  // Actions
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  completeLesson: (lessonId: string, score: number, totalQuestions: number, timeSpentSeconds: number) => void;
  claimDailyChallenge: (challengeId: string) => void;
  purchaseItem: (item: TreasureItem) => { success: boolean; message: string };
  equipItem: (item: TreasureItem) => void;
  toggleSound: () => void;
  switchRole: (role: 'student' | 'parent' | 'teacher' | 'admin') => void;
  updateUserName: (name: string) => void;
  closeLevelUpModal: () => void;
  dismissReward: () => void;
  triggerConfetti: () => void;
  resetProgress: () => void;
  updateDailyGoal: (minutes: number) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, icon: string, type: NotificationItem['type']) => void;
  isAuthenticated: boolean;
  loginWithAuth: (profile: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  navigateTo: (routeOrTab: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'math_adventure_kids_user_v2';
const TREASURE_STORAGE_KEY = 'math_adventure_kids_treasure_v2';
const CHALLENGES_STORAGE_KEY = 'math_adventure_kids_challenges_v2';

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Firebase is the authentication source of truth. Local storage is used only for UI preferences/cache.
  const [lessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [badges] = useState<Badge[]>(INITIAL_BADGES);
  const [worlds] = useState<World[]>(INITIAL_WORLDS);

  const [treasureItems, setTreasureItems] = useState<TreasureItem[]>(() => {
    try {
      const saved = localStorage.getItem(TREASURE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TREASURE_ITEMS;
  });

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(CHALLENGES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DAILY_CHALLENGES;
  });

  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      if (
        path === 'child/home' || 
        path.startsWith('world/') || 
        path.startsWith('lesson/') ||
        ['login', 'register', 'forgot-password', 'resend-confirmation', 'child/home', 'parent', 'teacher', 'admin', 'pricing', 'learn', 'map', 'games', 'challenges', 'achievements', 'treasure', 'profile'].includes(path)
      ) {
        return path;
      }
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const navigateTo = useCallback((tabOrRoute: string) => {
    soundManager.playClick();
    setActiveTabState(tabOrRoute);
    if (typeof window !== 'undefined' && window.history) {
      const cleanPath = tabOrRoute === 'home' ? '/' : `/${tabOrRoute}`;
      if (window.location.pathname !== cleanPath) {
        window.history.pushState(null, '', cleanPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    navigateTo(tab);
  }, [navigateTo]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'home';
      setActiveTabState(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroup>(user.selectedAgeGroup || '6-8');
  const [activeCategory, setActiveCategory] = useState<SubjectCategory | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [currentReward, setCurrentReward] = useState<RewardNotification | null>(null);
  const [levelUpModalData, setLevelUpModalData] = useState<{ oldLevel: number; newLevel: number; title: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (!mounted) return;
      if (!firebaseUser) {
        setIsAuthenticated(false);
        setAuthReady(true);
        return;
      }
      const profile = await fetchUserProfileFromFirestore(firebaseUser.uid);
      if (!mounted) return;
      setUser((prev) => ({
        ...prev,
        id: firebaseUser.uid,
        name: profile?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || prev.name,
        role: profile?.role || 'student',
        avatarEmoji: profile?.avatarEmoji || prev.avatarEmoji,
      }));
      setIsAuthenticated(true);
      setAuthReady(true);
    });
    return () => { mounted = false; unsubscribe(); };
  }, []);

  // Sync sound manager with user preference
  useEffect(() => {
    soundManager.setEnabled(user.soundEnabled);
  }, [user.soundEnabled]);

  // Persist user to localStorage
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to cache user UI state', e);
    }
  }, [user, isAuthenticated]);

  // Persist treasure items
  useEffect(() => {
    try {
      localStorage.setItem(TREASURE_STORAGE_KEY, JSON.stringify(treasureItems));
    } catch {
      // ignore
    }
  }, [treasureItems]);

  // Persist daily challenges
  useEffect(() => {
    try {
      localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(dailyChallenges));
    } catch {
      // ignore
    }
  }, [dailyChallenges]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#fbbf24', '#f97316', '#a855f7', '#34d399'],
      });
    } catch {
      // ignore
    }
  }, []);

  const addNotification = useCallback((
    title: string, 
    message: string, 
    icon: string, 
    type: NotificationItem['type']
  ) => {
    setUser((prev) => ({
      ...prev,
      notifications: [
        {
          id: 'notif-' + Date.now(),
          title,
          message,
          time: 'Vừa xong',
          icon,
          isRead: false,
          type,
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const checkLevelUp = useCallback((oldXp: number, newXp: number, currentLevel: number) => {
    const oldInfo = getLevelInfo(oldXp);
    const newInfo = getLevelInfo(newXp);
    if (newInfo.level > currentLevel || newInfo.level > oldInfo.level) {
      soundManager.playLevelUp();
      triggerConfetti();
      setLevelUpModalData({
        oldLevel: currentLevel,
        newLevel: newInfo.level,
        title: newInfo.title,
      });

      addNotification(
        `🎉 Lên Cấp ${newInfo.level}!`,
        `Bạn đã đạt danh hiệu "${newInfo.title}". Nhận ngay +100 Tiền Vàng & +20 Ngọc!`,
        '⭐',
        'level'
      );

      return newInfo.level;
    }
    return currentLevel;
  }, [triggerConfetti, addNotification]);

  const showReward = useCallback((reward: RewardNotification) => {
    setCurrentReward(reward);
    soundManager.playCoin();
    setTimeout(() => {
      setCurrentReward((prev) => (prev?.id === reward.id ? null : prev));
    }, 4500);
  }, []);

  const addXP = useCallback((amount: number, reason?: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = checkLevelUp(prev.xp, newXp, prev.level);
      showReward({
        id: 'xp-' + Date.now(),
        title: reason || 'Nhận điểm kinh nghiệm!',
        message: `+${amount} XP thám hiểm`,
        xp: amount,
        icon: '⭐',
      });
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  }, [checkLevelUp, showReward]);

  const addCoins = useCallback((amount: number) => {
    setUser((prev) => ({
      ...prev,
      coin: prev.coin + amount,
    }));
  }, []);

  const addGems = useCallback((amount: number) => {
    setUser((prev) => ({
      ...prev,
      gem: prev.gem + amount,
    }));
  }, []);

  const completeLesson = useCallback((
    lessonId: string, 
    score: number, 
    totalQuestions: number, 
    timeSpentSeconds: number
  ) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const accuracy = Math.round((score / totalQuestions) * 100);
    
    // Star Calculation:
    // 3 stars: accuracy >= 95%
    // 2 stars: accuracy >= 80%
    // 1 star: completed
    let stars = 1;
    if (accuracy >= 95) stars = 3;
    else if (accuracy >= 80) stars = 2;

    const xpBonus = lesson.xpReward + (stars === 3 ? 20 : stars === 2 ? 10 : 0);
    const coinBonus = lesson.coinReward;
    const gemBonus = lesson.gemReward;

    setUser((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const newXp = prev.xp + xpBonus;
      const newLevel = checkLevelUp(prev.xp, newXp, prev.level);

      const historyItem: StudyHistoryItem = {
        id: 'hist-' + Date.now(),
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        category: lesson.category,
        completedAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        score,
        totalQuestions,
        xpEarned: xpBonus,
        accuracy,
        starsEarned: stars,
        timeSpentSeconds,
      };

      // Check badge unlocks
      const newBadges = [...prev.unlockedBadges];
      if (newCompleted.length >= 1 && !newBadges.includes('badge-starter')) {
        newBadges.push('badge-starter');
        addNotification('🏅 Mở khóa Huy hiệu!', 'Bạn đã nhận huy hiệu: 🌟 Người mới bắt đầu', '🌟', 'badge');
      }
      if (accuracy === 100 && !newBadges.includes('badge-perfect-100')) {
        newBadges.push('badge-perfect-100');
        addNotification('🏅 Mở khóa Huy hiệu!', 'Bạn đã nhận huy hiệu: 🎯 100% Chính xác', '🎯', 'badge');
      }
      if (newCompleted.length >= 7 && !newBadges.includes('badge-super-plus')) {
        newBadges.push('badge-super-plus');
        addNotification('🏅 Mở khóa Huy hiệu!', 'Bạn đã nhận huy hiệu: ➕ Siêu cộng thần tốc', '➕', 'badge');
      }

      showReward({
        id: 'lesson-finish-' + Date.now(),
        title: '🎉 Hoàn thành bài học!',
        message: `+${xpBonus} XP • +${coinBonus} Vàng • +${gemBonus} Ngọc (${stars}⭐)`,
        xp: xpBonus,
        coin: coinBonus,
        gem: gemBonus,
        icon: '🏆',
      });

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        coin: prev.coin + coinBonus,
        gem: prev.gem + gemBonus,
        completedLessons: newCompleted,
        lessonStars: {
          ...prev.lessonStars,
          [lessonId]: Math.max(prev.lessonStars[lessonId] || 0, stars),
        },
        unlockedBadges: newBadges,
        history: [historyItem, ...prev.history],
      };
    });

    // Update daily challenges count
    setDailyChallenges((prev) =>
      prev.map((c) => {
        if (c.id === 'dc-1') {
          const nextCount = c.currentCount + 1;
          return {
            ...c,
            currentCount: nextCount,
            completed: nextCount >= c.targetCount,
          };
        }
        if (c.id === 'dc-3' && accuracy === 100) {
          return {
            ...c,
            completed: true,
          };
        }
        return c;
      })
    );

    triggerConfetti();
  }, [lessons, checkLevelUp, showReward, triggerConfetti, addNotification]);

  const claimDailyChallenge = useCallback((challengeId: string) => {
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (!challenge || !challenge.completed || challenge.claimed) return;

    soundManager.playCorrect();
    triggerConfetti();

    setDailyChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, claimed: true } : c))
    );

    setUser((prev) => {
      const newXp = prev.xp + challenge.rewardXP;
      const newLevel = checkLevelUp(prev.xp, newXp, prev.level);
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        gem: prev.gem + challenge.rewardGem,
        coin: prev.coin + (challenge.rewardCoin || 20),
      };
    });

    showReward({
      id: 'claim-' + Date.now(),
      title: '🎁 Đã nhận thưởng Thử thách!',
      message: `+${challenge.rewardXP} XP • +${challenge.rewardGem} Ngọc`,
      xp: challenge.rewardXP,
      gem: challenge.rewardGem,
      icon: '💎',
    });
  }, [dailyChallenges, checkLevelUp, showReward, triggerConfetti]);

  const purchaseItem = useCallback((item: TreasureItem) => {
    if (user.inventory.includes(item.id)) {
      return { success: false, message: 'Bạn đã sở hữu vật phẩm này rồi!' };
    }

    if (item.priceType === 'coin' && user.coin < item.price) {
      return { success: false, message: `CHƯA ĐỦ TIỀN VÀNG! Cần thêm ${item.price - user.coin} vàng nữa.` };
    }
    if (item.priceType === 'gem' && user.gem < item.price) {
      return { success: false, message: `CHƯA ĐỦ GEM! Cần thêm ${item.price - user.gem} ngọc quý nữa.` };
    }

    // Deduct and add to inventory
    setUser((prev) => ({
      ...prev,
      coin: item.priceType === 'coin' ? prev.coin - item.price : prev.coin,
      gem: item.priceType === 'gem' ? prev.gem - item.price : prev.gem,
      inventory: [...prev.inventory, item.id],
    }));

    setTreasureItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, unlocked: true } : i))
    );

    soundManager.playCoin();
    triggerConfetti();

    showReward({
      id: 'buy-' + Date.now(),
      title: '🎉 Mua sắm thành công!',
      message: `Bạn đã mở khóa ${item.name}`,
      icon: item.previewEmoji,
    });

    addNotification(
      '🎁 Kho báu mới!',
      `Bạn vừa mở khóa thành công "${item.name}". Hãy vào trang phục để diện ngay!`,
      item.previewEmoji,
      'treasure'
    );

    return { success: true, message: `Đã mở khóa ${item.name} thành công!` };
  }, [user, showReward, triggerConfetti, addNotification]);

  const equipItem = useCallback((item: TreasureItem) => {
    soundManager.playClick();
    setUser((prev) => {
      if (item.category === 'hat') {
        const isAlready = prev.equippedHat === item.id;
        return { ...prev, equippedHat: isAlready ? undefined : item.id };
      }
      if (item.category === 'backpack') {
        const isAlready = prev.equippedBackpack === item.id;
        return { ...prev, equippedBackpack: isAlready ? undefined : item.id };
      }
      if (item.category === 'skin') {
        const isAlready = prev.equippedSkin === item.id;
        return { ...prev, equippedSkin: isAlready ? undefined : item.id };
      }
      return prev;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setUser((prev) => {
      const nextVal = !prev.soundEnabled;
      soundManager.setEnabled(nextVal);
      if (nextVal) soundManager.playClick();
      return { ...prev, soundEnabled: nextVal };
    });
  }, []);

  const switchRole = useCallback((_role: 'student' | 'parent' | 'teacher' | 'admin') => {
    soundManager.playClick();
    // Role changes are server-controlled. This action is intentionally a no-op for clients.
  }, []);

  const updateUserName = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, name }));
  }, []);

  const updateDailyGoal = useCallback((minutes: number) => {
    setUser((prev) => ({ ...prev, dailyStudyGoalMinutes: minutes }));
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setLevelUpModalData(null);
  }, []);

  const dismissReward = useCallback(() => {
    setCurrentReward(null);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  }, []);

  const loginWithAuth = useCallback((profile: Partial<UserProfile>) => {
    setIsAuthenticated(true);
    setUser((prev) => ({
      ...prev,
      ...profile,
    }));
    const targetRole = profile.role || user.role || 'student';
    if (targetRole === 'parent') {
      navigateTo('parent');
    } else if (targetRole === 'teacher') {
      navigateTo('teacher');
    } else if (targetRole === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('child/home');
    }
  }, [navigateTo, user.role]);

  const logout = useCallback(async () => {
    try {
      await logOutUser();
    } catch {}
    setIsAuthenticated(false);
    navigateTo('login');
  }, [navigateTo]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TREASURE_STORAGE_KEY);
    localStorage.removeItem(CHALLENGES_STORAGE_KEY);
    setUser(INITIAL_USER);
    setTreasureItems(INITIAL_TREASURE_ITEMS);
    setDailyChallenges(INITIAL_DAILY_CHALLENGES);
  }, []);

  return (
    <GameContext.Provider
      value={{
        user,
        lessons,
        badges,
        treasureItems,
        dailyChallenges,
        worlds,
        currentReward,
        levelUpModalData,
        activeTab,
        setActiveTab,
        activeAgeGroup,
        setActiveAgeGroup,
        activeCategory,
        setActiveCategory,
        activeLesson,
        setActiveLesson,
        addXP,
        addCoins,
        addGems,
        completeLesson,
        claimDailyChallenge,
        purchaseItem,
        equipItem,
        toggleSound,
        switchRole,
        updateUserName,
        closeLevelUpModal,
        dismissReward,
        triggerConfetti,
        resetProgress,
        updateDailyGoal,
        markAllNotificationsRead,
        addNotification,
        isAuthenticated,
        loginWithAuth,
        logout,
        navigateTo,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
