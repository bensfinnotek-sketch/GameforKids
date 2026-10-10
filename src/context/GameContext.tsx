import { fetchUserProfileFromFirestore, fetchDailyChallengesFromServer, claimDailyChallengeOnServer, logOutUser, submitLessonAttemptToFirestore, syncUserProfileToFirestore, purchaseTreasureItemOnServer } from '../firebase/auth';
import { onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
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
  INITIAL_LESSONS, 
  INITIAL_BADGES, 
  INITIAL_TREASURE_ITEMS, 
  INITIAL_DAILY_CHALLENGES, 
  INITIAL_WORLDS,
  getLevelInfo 
} from '../data/mockData';
import { soundManager } from '../utils/sound';

export interface LessonCompletionResult {
  ok: boolean;
  duplicate?: boolean;
  xpEarned?: number;
  coinEarned?: number;
  gemEarned?: number;
  stars?: number;
  accuracy?: number;
}

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
  completeLesson: (lessonId: string, score: number, totalQuestions: number, timeSpentSeconds: number) => Promise<LessonCompletionResult>;
  claimDailyChallenge: (challengeId: string) => void;
  purchaseItem: (item: TreasureItem) => Promise<{ success: boolean; message: string }>;
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
  authReady: boolean;
  loginWithAuth: (profile: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  navigateTo: (routeOrTab: string) => void;
  refreshUserProfile: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'math_adventure_kids_user_v2';
const TREASURE_STORAGE_KEY = 'math_adventure_kids_treasure_v2';

const createEmptyUserProfile = (): UserProfile => ({
  dataVersion: 2,
  id: '',
  name: 'Bé Thám Hiểm',
  role: 'student',
  avatarEmoji: '🤠',
  level: 1,
  xp: 0,
  coin: 0,
  gem: 0,
  streak: 0,
  lastActiveDate: '',
  selectedAgeGroup: '6-8',
  completedLessons: [],
  lessonStars: {},
  unlockedBadges: [],
  inventory: [],
  soundEnabled: true,
  musicEnabled: true,
  dailyStudyGoalMinutes: 20,
  history: [],
  highScores: {},
  notifications: [],
});

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

  // Daily challenges are server-authoritative. Start empty until Firebase confirms
  // the current account's state so stale local cache can never masquerade as progress.
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);

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
  const [user, setUser] = useState<UserProfile>(() => createEmptyUserProfile());

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

    const unsubscribe = firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;

      if (!firebaseUser) {
        setIsAuthenticated(false);
        setAuthReady(true);
        return;
      }

      const fallbackName =
        firebaseUser.displayName ||
        firebaseUser.email?.split('@')[0] ||
        'Bé Thám Hiểm';

      // Unlock the app immediately after Firebase confirms the session. The
      // Firestore profile is hydrated in the background so a slow network does
      // not make the whole application feel stuck on the auth gate.
      setUser({
        ...createEmptyUserProfile(),
        id: firebaseUser.uid,
        name: fallbackName,
      });
      setIsAuthenticated(true);
      setAuthReady(true);

      void (async () => {
        const existingProfile = await fetchUserProfileFromFirestore(firebaseUser.uid);
        if (!mounted) return;

        const isRealProfile = existingProfile?.dataVersion === 2;
        const mergedProfile: UserProfile = {
          ...createEmptyUserProfile(),
          ...(isRealProfile ? existingProfile : {}),
          dataVersion: 2,
          id: firebaseUser.uid,
          name: isRealProfile && existingProfile?.name ? existingProfile.name : fallbackName,
          role: isRealProfile && existingProfile?.role ? existingProfile.role : 'student',
          avatarEmoji: isRealProfile && existingProfile?.avatarEmoji ? existingProfile.avatarEmoji : '🤠',
        };

        setUser(mergedProfile);

        const trustedChallenges = await fetchDailyChallengesFromServer();
        if (trustedChallenges) setDailyChallenges(trustedChallenges as DailyChallenge[]);

        // First login, or a legacy profile from the old demo dataset: persist a clean
        // zeroed account so every user starts from their own real Firebase state.
        if (!isRealProfile) {
          await syncUserProfileToFirestore(firebaseUser.uid, mergedProfile);
        }
      })().catch((error) => {
        console.warn('Background profile hydration warning:', error);
      });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Firestore is the source of truth for account/progress data.
  // localStorage remains only a best-effort UI cache for faster rendering.
  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser || !authReady) return;

    const timer = window.setTimeout(() => {
      syncUserProfileToFirestore(auth.currentUser!.uid, user).catch((error) => {
        console.warn('Unable to persist user progress to Firestore:', error);
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [user, isAuthenticated, authReady]);

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

  const completeLesson = useCallback(async (
    lessonId: string,
    score: number,
    totalQuestions: number,
    timeSpentSeconds: number
  ) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return { ok: false };

    if (
      !Number.isInteger(score) ||
      !Number.isInteger(totalQuestions) ||
      !Number.isInteger(timeSpentSeconds) ||
      totalQuestions <= 0 ||
      score < 0 ||
      score > totalQuestions ||
      timeSpentSeconds < 0 ||
      timeSpentSeconds > 86400 ||
      totalQuestions !== lesson.totalQuestions ||
      !auth.currentUser
    ) {
      return { ok: false };
    }

    // Rewards are granted only after the trusted backend validates the attempt.
    // The browser never decides the XP/coin/gem amounts.
    const reward = await submitLessonAttemptToFirestore(auth.currentUser.uid, {
      lessonId,
      score,
      totalQuestions,
      timeSpentSeconds,
    });

    if (!reward?.ok || reward.xpEarned == null || reward.coinEarned == null || reward.gemEarned == null) {
      showReward({
        id: 'lesson-error-' + Date.now(),
        title: 'Chưa ghi nhận được kết quả',
        message: 'Kết nối máy chủ phần thưởng chưa hoàn tất. Bé chưa bị trừ hay cộng gì cả; hãy thử lại nhé.',
        icon: '⚠️',
      });
      return { ok: false };
    }

    if (reward.duplicate) {
      const latestProfile = auth.currentUser
        ? await fetchUserProfileFromFirestore(auth.currentUser.uid)
        : null;
      if (latestProfile) {
        setUser((prev) => ({ ...prev, ...latestProfile, id: auth.currentUser!.uid }));
      }
      showReward({
        id: 'lesson-duplicate-' + Date.now(),
        title: 'Bài học đã được ghi nhận',
        message: 'Kết quả này đã được lưu trước đó. Bé không nhận thưởng lần thứ hai.',
        icon: 'ℹ️',
      });
      return {
        ok: true,
        duplicate: true,
        xpEarned: 0,
        coinEarned: 0,
        gemEarned: 0,
        stars: latestProfile?.lessonStars?.[lessonId] || 0,
        accuracy: latestProfile?.history?.find((item) => item.lessonId === lessonId)?.accuracy,
      };
    }

    const xpBonus = reward.xpEarned;
    const coinBonus = reward.coinEarned;
    const gemBonus = reward.gemEarned;
    const stars = reward.stars || 1;
    const accuracy = reward.accuracy ?? Math.round((score / totalQuestions) * 100);

    setUser((prev) => {
      const newCompleted = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];
      const newLevel = Math.max(prev.level, reward.newLevel || prev.level);
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
        xp: prev.xp + xpBonus,
        level: newLevel,
        streak: reward.streak ?? prev.streak,
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

    const trustedChallenges = await fetchDailyChallengesFromServer();
    if (trustedChallenges) {
      setDailyChallenges(trustedChallenges as DailyChallenge[]);
    }

    triggerConfetti();
    return { ok: true, xpEarned: xpBonus, coinEarned: coinBonus, gemEarned: gemBonus, stars, accuracy };
  }, [lessons, submitLessonAttemptToFirestore, showReward, addNotification, triggerConfetti]);

  const claimDailyChallenge = useCallback(async (challengeId: string) => {
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (!challenge || !challenge.completed || challenge.claimed || !auth.currentUser) return;

    const reward = await claimDailyChallengeOnServer(challengeId);
    if (!reward?.ok || reward.notCompleted) {
      showReward({
        id: 'claim-error-' + Date.now(),
        title: 'Chưa thể nhận thưởng',
        message: 'Máy chủ chưa xác nhận đủ điều kiện. Bé chưa được cộng thưởng; hãy thử lại sau nhé.',
        icon: '⚠️',
      });
      const refreshed = await fetchDailyChallengesFromServer();
      if (refreshed) setDailyChallenges(refreshed as DailyChallenge[]);
      return;
    }

    const refreshedChallenges = reward.challenges || await fetchDailyChallengesFromServer();
    if (refreshedChallenges) {
      setDailyChallenges(refreshedChallenges as DailyChallenge[]);
    }

    const latestProfile = await fetchUserProfileFromFirestore(auth.currentUser.uid);
    if (latestProfile) {
      setUser((prev) => ({ ...prev, ...latestProfile, id: auth.currentUser!.uid }));
    }

    if (reward.duplicate) {
      showReward({
        id: 'claim-duplicate-' + Date.now(),
        title: 'Phần thưởng đã được nhận',
        message: 'Thử thách này đã được ghi nhận trước đó. Bé không nhận thưởng lần thứ hai.',
        icon: 'ℹ️',
      });
      return;
    }

    soundManager.playCorrect();
    triggerConfetti();
    showReward({
      id: 'claim-' + Date.now(),
      title: '🎁 Đã nhận thưởng Thử thách!',
      message: `+${reward.xpEarned || 0} XP • +${reward.gemEarned || 0} Ngọc • +${reward.coinEarned || 0} Vàng`,
      xp: reward.xpEarned,
      gem: reward.gemEarned,
      coin: reward.coinEarned,
      icon: '💎',
    });
  }, [dailyChallenges, showReward, triggerConfetti]);
  const purchaseItem = useCallback(async (item: TreasureItem) => {
    if (!auth.currentUser) {
      return { success: false, message: 'Bạn cần đăng nhập để mua vật phẩm nhé.' };
    }
    if (user.inventory.includes(item.id)) {
      return { success: false, message: 'Bạn đã sở hữu vật phẩm này rồi!' };
    }

    const result = await purchaseTreasureItemOnServer(item.id);
    if (!result?.ok) {
      if (result?.insufficientFunds) {
        const missing = Math.max(0, (result.required || item.price) - (result.balance || 0));
        const currencyName = result.currency === 'gem' ? 'ngọc' : 'vàng';
        return { success: false, message: `Chưa đủ ${currencyName}! Bé cần thêm ${missing} ${currencyName} nữa.` };
      }
      return { success: false, message: 'Chưa mua được vật phẩm do kết nối chưa ổn định. Bé hãy thử lại nhé.' };
    }
    if (result.alreadyOwned) {
      if (result.inventory) setUser((prev) => ({ ...prev, inventory: result.inventory!, coin: result.coin ?? prev.coin, gem: result.gem ?? prev.gem }));
      return { success: false, message: 'Vật phẩm này đã được sở hữu trên tài khoản rồi.' };
    }

    setUser((prev) => ({
      ...prev,
      coin: result.coin ?? prev.coin,
      gem: result.gem ?? prev.gem,
      inventory: result.inventory ?? [...prev.inventory, item.id],
    }));
    setTreasureItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, unlocked: true } : i)));

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
  }, [user.inventory, showReward, triggerConfetti, addNotification]);

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

  const refreshUserProfile = useCallback(async () => {
    if (!auth.currentUser) return;
    const latestProfile = await fetchUserProfileFromFirestore(auth.currentUser.uid);
    if (latestProfile) {
      setUser((prev) => ({ ...prev, ...latestProfile, id: auth.currentUser!.uid }));
    }
    const trustedChallenges = await fetchDailyChallengesFromServer();
    if (trustedChallenges) {
      setDailyChallenges(trustedChallenges as DailyChallenge[]);
    }
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
    setUser(createEmptyUserProfile());
    setTreasureItems(INITIAL_TREASURE_ITEMS);
    setDailyChallenges([]);
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
        authReady,
        loginWithAuth,
        logout,
        navigateTo,
        refreshUserProfile,
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
