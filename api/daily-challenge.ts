import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getLevelInfo } from './lessonRewards';

type ChallengeDefinition = {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  rewardXP: number;
  rewardGem: number;
  rewardCoin: number;
  icon: string;
};

const CHALLENGES: ChallengeDefinition[] = [
  { id: 'dc-2', title: 'Chơi 1 mini game', description: 'Hoàn thành 1 lượt mini game được máy chủ xác thực.', targetCount: 1, rewardXP: 40, rewardGem: 5, rewardCoin: 20, icon: '🎮' },

  { id: 'dc-1', title: 'Hoàn thành 3 bài học', description: 'Hoàn thành 3 lượt học được máy chủ ghi nhận trong ngày.', targetCount: 3, rewardXP: 60, rewardGem: 10, rewardCoin: 30, icon: '📚' },
  { id: 'dc-3', title: 'Đạt độ chính xác 100%', description: 'Đạt 100% trong ít nhất 1 bài quiz được máy chủ xác nhận.', targetCount: 1, rewardXP: 50, rewardGem: 8, rewardCoin: 25, icon: '🎯' },
  { id: 'dc-4', title: 'Trả lời đúng 10 câu hỏi', description: 'Tích lũy 10 câu trả lời đúng từ các bài học được ghi nhận hôm nay.', targetCount: 10, rewardXP: 70, rewardGem: 12, rewardCoin: 35, icon: '✨' },
  { id: 'dc-5', title: 'Học liên tục 15 phút', description: 'Tích lũy ít nhất 15 phút thời gian học được máy chủ ghi nhận.', targetCount: 15, rewardXP: 80, rewardGem: 15, rewardCoin: 40, icon: '⏱️' },
];

function adminApp() {
  if (getApps().length) return getApps()[0];
  const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !key) {
    throw new Error('Missing Firebase Admin environment variables');
  }
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: key,
    }),
  });
}

function todayInVietnam() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return values.year + '-' + values.month + '-' + values.day;
}

function buildChallenges(user: Record<string, any>, today: string) {
  const progress = user.dailyChallengeDate === today && user.dailyChallengeProgress && typeof user.dailyChallengeProgress === 'object'
    ? user.dailyChallengeProgress
    : {};
  const claims = user.dailyChallengeDate === today && user.dailyChallengeClaims && typeof user.dailyChallengeClaims === 'object'
    ? user.dailyChallengeClaims
    : {};

  return CHALLENGES.map((challenge) => {
    const currentCount = Math.max(0, Number(progress[challenge.id] || 0));
    return {
      ...challenge,
      currentCount: Math.min(currentCount, challenge.targetCount),
      completed: currentCount >= challenge.targetCount,
      claimed: claims[challenge.id] === true,
    };
  });
}

async function authenticate(request: Request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return getAuth(adminApp()).verifyIdToken(header.slice(7));
}

export async function GET(request: Request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) return Response.json({ error: 'Missing authentication token' }, { status: 401 });

    const db = getFirestore(adminApp());
    const snap = await db.collection('users').doc(decoded.uid).get();
    if (!snap.exists) return Response.json({ error: 'Profile not found' }, { status: 404 });

    const today = todayInVietnam();
    return Response.json({ ok: true, date: today, challenges: buildChallenges(snap.data() || {}, today) });
  } catch (error) {
    console.error('daily-challenge GET error', error);
    return Response.json({ error: 'Unable to load daily challenges' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    return Response.json({ error: 'Content-Type must be application/json' }, { status: 415 });
  }

  try {
    const decoded = await authenticate(request);
    if (!decoded) return Response.json({ error: 'Missing authentication token' }, { status: 401 });

    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    const challengeId = typeof body.challengeId === 'string' ? body.challengeId : '';
    const challenge = CHALLENGES.find((item) => item.id === challengeId);
    if (!challenge) return Response.json({ error: 'Invalid daily challenge' }, { status: 400 });

    const db = getFirestore(adminApp());
    const userRef = db.collection('users').doc(decoded.uid);
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error('USER_PROFILE_NOT_FOUND');

      const user = snap.data() || {};
      const today = todayInVietnam();
      const progress = user.dailyChallengeDate === today && user.dailyChallengeProgress && typeof user.dailyChallengeProgress === 'object'
        ? { ...user.dailyChallengeProgress }
        : {};
      const claims = user.dailyChallengeDate === today && user.dailyChallengeClaims && typeof user.dailyChallengeClaims === 'object'
        ? { ...user.dailyChallengeClaims }
        : {};

      const currentCount = Number(progress[challenge.id] || 0);
      if (claims[challenge.id] === true) {
        return { duplicate: true, xpEarned: 0, coinEarned: 0, gemEarned: 0, newLevel: Number(user.level || 1), streak: Number(user.streak || 0), challenges: buildChallenges(user, today) };
      }
      if (currentCount < challenge.targetCount) {
        return { notCompleted: true, xpEarned: 0, coinEarned: 0, gemEarned: 0, newLevel: Number(user.level || 1), streak: Number(user.streak || 0), challenges: buildChallenges(user, today) };
      }

      claims[challenge.id] = true;
      const newXp = Number(user.xp || 0) + challenge.rewardXP;
      const newLevel = Math.max(Number(user.level || 1), getLevelInfo(newXp).level);

      tx.update(userRef, {
        xp: newXp,
        level: newLevel,
        coin: Number(user.coin || 0) + challenge.rewardCoin,
        gem: Number(user.gem || 0) + challenge.rewardGem,
        dailyChallengeDate: today,
        dailyChallengeProgress: progress,
        dailyChallengeClaims: claims,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        duplicate: false,
        xpEarned: challenge.rewardXP,
        coinEarned: challenge.rewardCoin,
        gemEarned: challenge.rewardGem,
        newLevel,
        streak: Number(user.streak || 0),
        challenges: buildChallenges({ ...user, dailyChallengeDate: today, dailyChallengeProgress: progress, dailyChallengeClaims: claims }, today),
      };
    });

    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'USER_PROFILE_NOT_FOUND') return Response.json({ error: 'Profile not found' }, { status: 404 });
    console.error('daily-challenge POST error', error);
    return Response.json({ error: 'Unable to claim daily challenge' }, { status: 500 });
  }
}
