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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  profile: Partial<UserProfile>
): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        ...profile,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore profile sync warning:', err);
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
