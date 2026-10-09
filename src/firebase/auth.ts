import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile } from '../types';

// Configure Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Friendly error mapping for Vietnamese users
export const mapAuthError = (error: unknown): string => {
  if (!error) return 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại!';
  
  const err = error as AuthError;
  const code = err?.code || '';

  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Bạn đã đóng cửa sổ đăng nhập trước khi hoàn tất.';
    case 'auth/cancelled-popup-request':
      return 'Yêu cầu đăng nhập đã được hủy.';
    case 'auth/popup-blocked':
      return 'Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép popup và thử lại nhé!';
    case 'auth/network-request-failed':
      return 'Kiểm tra kết nối Internet của bạn và thử lại.';
    case 'auth/account-exists-with-different-credential':
      return 'Email này đã được đăng ký bằng phương thức khác.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại nhé!';
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/invalid-api-key':
      return 'Cấu hình Firebase trên bản Production chưa hợp lệ. Vui lòng kiểm tra VITE_FIREBASE_API_KEY trong Vercel rồi triển khai lại.';
    case 'auth/user-not-found':
      return 'Tài khoản chưa tồn tại. Bé hoặc Ba Mẹ hãy đăng ký tài khoản mới nhé!';
    case 'auth/email-already-in-use':
      return 'Email này đã có người đăng ký. Vui lòng đăng nhập hoặc dùng email khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá ngắn. Vui lòng đặt mật khẩu ít nhất 6 ký tự.';
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử không thành công. Hãy đợi vài phút rồi thử lại nhé!';
    case 'auth/unauthorized-domain':
      return 'Tên miền chưa được thêm vào Firebase Authentication. Hãy thêm domain hiện tại trong Firebase Console rồi thử lại.';
    case 'auth/operation-not-allowed':
      return 'Phương thức đăng nhập này chưa được kích hoạt trong Firebase Console.';
    default:
      return 'Không thể đăng nhập lúc này. Mini khuyên bạn kiểm tra lại hoặc thử sau vài giây!';
  }
};

// Check if device is mobile browser (to choose between popup and redirect)
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Configure Session Persistence (Remember Me)
export const configurePersistence = async (remember: boolean): Promise<void> => {
  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  } catch (err) {
    console.warn('Persistence configuration warning:', err);
  }
};

// Sign in with Google

export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    if (isMobileDevice()) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    throw err;
  }
};

// Check redirect result when page loads
export const checkRedirectResult = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (err) {
    console.warn('Error handling redirect result:', err);
    return null;
  }
};

// Email & Password helpers
export const signInWithEmail = async (email: string, pass: string): Promise<FirebaseUser> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const registerWithEmail = async (email: string, pass: string): Promise<FirebaseUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await sendEmailVerification(result.user);
  return result.user;
};

// Password Reset
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Resend Email Verification
export const resendVerificationEmail = async (): Promise<void> => {
  if (!auth.currentUser) throw new Error('Bạn cần đăng nhập để gửi lại email xác minh.');
  await sendEmailVerification(auth.currentUser);
};

// Logout
export const logOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Sync Firestore User Profile
export const syncUserProfileToFirestore = async (
  uid: string,
  profile: Partial<UserProfile>,
  options: { includeRewardFields?: boolean } = {}
): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const {
      xp, coin, gem, level, completedLessons, lessonStars, unlockedBadges, history, streak, lastActiveDate, dailyChallengeDate, dailyChallengeProgress, dailyChallengeClaims,
      ...clientOwnedProfile
    } = profile;

    const payload = options.includeRewardFields
      ? profile
      : clientOwnedProfile;

    await setDoc(
      userDocRef,
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore profile sync warning:', err);
  }
};

export interface TrustedLessonRewardResult {
  ok: boolean;
  duplicate?: boolean;
  xpEarned?: number;
  coinEarned?: number;
  gemEarned?: number;
  stars?: number;
  accuracy?: number;
  newLevel?: number;
  streak?: number;
}

export const submitLessonAttemptToFirestore = async (
  uid: string,
  attempt: {
    lessonId: string;
    score: number;
    totalQuestions: number;
    timeSpentSeconds: number;
  }
): Promise<TrustedLessonRewardResult | null> => {
  try {
    if (!auth.currentUser || auth.currentUser.uid !== uid) return null;

    const token = await auth.currentUser.getIdToken();
    const attemptId = `attempt-${crypto.randomUUID()}`;
    const response = await fetch('/api/lesson-attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...attempt, attemptId }),
    });

    if (!response.ok) {
      console.warn('Trusted lesson reward request failed:', response.status);
      return null;
    }

    return (await response.json()) as TrustedLessonRewardResult;
  } catch (err) {
    console.warn('Trusted lesson reward submission warning:', err);
    return null;
  }
};

export interface TrustedMiniGameQuestion {
  a: number;
  b: number;
  op: '+' | '-' | 'x';
  options: number[];
}

export interface TrustedMiniGameResult {
  ok: boolean;
  completed?: boolean;
  correct?: boolean;
  alreadyCompleted?: boolean;
  expired?: boolean;
  rewardGranted?: boolean;
  correctCount?: number;
  question?: TrustedMiniGameQuestion;
  questionNumber?: number;
  totalQuestions?: number;
  secondsRemaining?: number;
  xpEarned?: number;
  coinEarned?: number;
  gemEarned?: number;
  sessionId?: string;
}

export const startTrustedMiniGame = async (gameId: string): Promise<TrustedMiniGameResult | null> => {
  try {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken();
    const response = await fetch('/api/mini-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'start', gameId }),
    });
    if (!response.ok) return null;
    return (await response.json()) as TrustedMiniGameResult;
  } catch (err) {
    console.warn('Trusted mini-game start warning:', err);
    return null;
  }
};

export const answerTrustedMiniGame = async (
  sessionId: string,
  value: number,
  expectedQuestionIndex: number
): Promise<TrustedMiniGameResult | null> => {
  try {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken();
    // Reuse the same request ID on retry so the server can return the original result.
    const requestBody = JSON.stringify({
      action: 'answer',
      sessionId,
      value,
      expectedQuestionIndex,
      requestId: crypto.randomUUID(),
    });

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch('/api/mini-game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: \`Bearer \${token}\`,
          },
          body: requestBody,
        });
        if (response.ok) return (await response.json()) as TrustedMiniGameResult;
        // A 5xx may happen after the transaction committed; retry with the same request ID.
        if (response.status < 500 || attempt === 1) return null;
      } catch (err) {
        if (attempt === 1) throw err;
      }
    }
    return null;
  } catch (err) {
    console.warn('Trusted mini-game answer warning:', err);
    return null;
  }
};;

export interface TrustedDailyChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardXP: number;
  rewardGem: number;
  rewardCoin: number;
  icon: string;
}

export interface TrustedDailyChallengeResult {
  ok: boolean;
  duplicate?: boolean;
  notCompleted?: boolean;
  xpEarned?: number;
  coinEarned?: number;
  gemEarned?: number;
  newLevel?: number;
  streak?: number;
  date?: string;
  challenges?: TrustedDailyChallenge[];
}

export const fetchDailyChallengesFromServer = async (): Promise<TrustedDailyChallenge[] | null> => {
  try {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken();
    const response = await fetch('/api/daily-challenge', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { challenges?: TrustedDailyChallenge[] };
    return Array.isArray(data.challenges) ? data.challenges : null;
  } catch (err) {
    console.warn('Trusted daily challenge fetch warning:', err);
    return null;
  }
};

export const claimDailyChallengeOnServer = async (
  challengeId: string
): Promise<TrustedDailyChallengeResult | null> => {
  try {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken();
    const response = await fetch('/api/daily-challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ challengeId }),
    });
    if (!response.ok) return null;
    return (await response.json()) as TrustedDailyChallengeResult;
  } catch (err) {
    console.warn('Trusted daily challenge claim warning:', err);
    return null;
  }
};

export const fetchUserProfileFromFirestore = async (
  uid: string
): Promise<Partial<UserProfile> | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as Partial<UserProfile>;
    }
    return null;
  } catch (err) {
    console.warn('Firestore profile fetch warning:', err);
    return null;
  }
};


export const fetchAllUserProfilesFromFirestore = async (): Promise<UserProfile[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((item) => item.data() as UserProfile);
  } catch (err) {
    console.warn('Firestore user list fetch warning:', err);
    return [];
  }
};

export const fetchStudentProfilesFromFirestore = async (): Promise<UserProfile[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'users'), where('role', '==', 'student'))
    );
    return snapshot.docs.map((item) => item.data() as UserProfile);
  } catch (err) {
    console.warn('Firestore student roster fetch warning:', err);
    return [];
  }
};
