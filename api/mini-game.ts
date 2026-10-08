import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getLevelInfo } from './lessonRewards';

const GAME_CONFIG = {
  'game-60s-blitz': {
    questionCount: 10,
    sessionSeconds: 60,
    rewardXP: 25,
    rewardCoin: 10,
    rewardGem: 0,
  },
  'game-speed-race': {
    questionCount: 5,
    sessionSeconds: 45,
    rewardXP: 30,
    rewardCoin: 12,
    rewardGem: 0,
  },
} as const;

type GameId = keyof typeof GAME_CONFIG;
type AgeGroup = '4-5' | '6-8' | '9-11';

type Question = {
  a: number;
  b: number;
  op: '+' | '-' | 'x';
  answer: number;
  options: number[];
};

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

function authenticate(request: Request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return getAuth(adminApp()).verifyIdToken(header.slice(7));
}

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createQuestion(seed: number, index: number, ageGroup: AgeGroup, gameId: GameId): Question {
  let state = (seed + Math.imul(index + 1, 2654435761)) >>> 0;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };

  const mode = next();
  let a = 1;
  let b = 1;
  let op: Question['op'] = '+';
  let answer = 0;

  if (gameId === 'game-speed-race') {
    if (ageGroup === '4-5') {
      a = Math.floor(next() * 5) + 1;
      b = Math.floor(next() * 5) + 1;
      op = '+';
    } else if (ageGroup === '6-8') {
      a = Math.floor(next() * 10) + 1;
      b = Math.floor(next() * 10) + 1;
      op = mode > 0.5 ? '-' : '+';
      if (op === '-' && a < b) [a, b] = [b, a];
    } else {
      a = Math.floor(next() * 11) + 2;
      b = Math.floor(next() * 11) + 2;
      if (mode > 0.7) {
        op = 'x';
      } else if (mode > 0.35) {
        op = '-';
        if (a < b) [a, b] = [b, a];
      } else {
        op = '+';
      }
    }
  } else {
    a = Math.floor(next() * 10) + 1;
    b = Math.floor(next() * 10) + 1;
    if (mode > 0.65) {
      op = 'x';
    } else if (mode > 0.3) {
      op = '-';
      if (a < b) [a, b] = [b, a];
    }
  }

  if (op === 'x') answer = a * b;
  else if (op === '-') answer = a - b;
  else answer = a + b;

  const offsets = [1, -1, 2, -2, 3];
  const options = new Set<number>([answer]);
  for (const offset of offsets) {
    if (options.size >= 4) break;
    const candidate = answer + offset;
    if (candidate >= 0) options.add(candidate);
  }

  return {
    a,
    b,
    op,
    answer,
    options: Array.from(options).sort((x, y) => x - y),
  };
}

function publicQuestion(question: Question) {
  return {
    a: question.a,
    b: question.b,
    op: question.op,
    options: question.options,
  };
}

function todayInVietnam() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    return Response.json({ error: 'Content-Type must be application/json' }, { status: 415 });
  }

  try {
    const decoded = await authenticate(request);
    if (!decoded) return Response.json({ error: 'Missing authentication token' }, { status: 401 });

    const body = await request.json();
    const action = typeof body.action === 'string' ? body.action : '';
    const db = getFirestore(adminApp());
    const userRef = db.collection('users').doc(decoded.uid);

    if (action === 'start') {
      const gameId = body.gameId as GameId;
      if (!Object.prototype.hasOwnProperty.call(GAME_CONFIG, gameId)) {
        return Response.json({ error: 'Invalid mini-game' }, { status: 400 });
      }

      const userSnap = await userRef.get();
      if (!userSnap.exists) return Response.json({ error: 'Profile not found' }, { status: 404 });
      const user = userSnap.data() || {};
      const selectedAgeGroup: AgeGroup =
        user.selectedAgeGroup === '4-5' || user.selectedAgeGroup === '9-11'
          ? user.selectedAgeGroup
          : '6-8';
      const config = GAME_CONFIG[gameId];
      const sessionRef = userRef.collection('miniGameSessions').doc();
      const seed = hashSeed(sessionRef.id);
      const firstQuestion = createQuestion(seed, 0, selectedAgeGroup, gameId);
      const now = Date.now();

      await sessionRef.set({
        gameId,
        uid: decoded.uid,
        seed,
        ageGroup: selectedAgeGroup,
        questionIndex: 0,
        correctCount: 0,
        status: 'active',
        startedAtMs: now,
        expiresAtMs: now + config.sessionSeconds * 1000,
        createdAt: FieldValue.serverTimestamp(),
      });

      return Response.json({
        ok: true,
        sessionId: sessionRef.id,
        gameId,
        question: publicQuestion(firstQuestion),
        questionNumber: 1,
        totalQuestions: config.questionCount,
        secondsRemaining: config.sessionSeconds,
      });
    }

    if (action !== 'answer') {
      return Response.json({ error: 'Invalid mini-game action' }, { status: 400 });
    }

    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
    const value = Number(body.value);
    if (!/^[A-Za-z0-9_-]{10,100}$/.test(sessionId) || !Number.isInteger(value)) {
      return Response.json({ error: 'Invalid mini-game answer' }, { status: 400 });
    }

    const sessionRef = userRef.collection('miniGameSessions').doc(sessionId);
    const result = await db.runTransaction(async (tx) => {
      const sessionSnap = await tx.get(sessionRef);
      if (!sessionSnap.exists) throw new Error('SESSION_NOT_FOUND');

      const session = sessionSnap.data() || {};
      const gameId = session.gameId as GameId;
      if (!Object.prototype.hasOwnProperty.call(GAME_CONFIG, gameId) || session.uid !== decoded.uid) throw new Error('SESSION_INVALID');
      const config = GAME_CONFIG[gameId];
      const ageGroup: AgeGroup = session.ageGroup === '4-5' || session.ageGroup === '9-11' ? session.ageGroup : '6-8';

      if (session.status === 'completed') {
        return {
          completed: true,
          alreadyCompleted: true,
          correctCount: Number(session.correctCount || 0),
          rewardGranted: true,
        };
      }
      if (session.status !== 'active') throw new Error('SESSION_CLOSED');

      const questionIndex = Number(session.questionIndex || 0);
      if (questionIndex >= config.questionCount) throw new Error('SESSION_CLOSED');

      const now = Date.now();
      if (now > Number(session.expiresAtMs || 0)) {
        tx.update(sessionRef, { status: 'expired', updatedAt: FieldValue.serverTimestamp() });
        return { completed: true, expired: true, correctCount: Number(session.correctCount || 0), rewardGranted: false };
      }

      const seed = Number(session.seed);
      const question = createQuestion(seed, questionIndex, ageGroup, gameId);
      const isCorrect = value === question.answer;
      const nextCorrect = Number(session.correctCount || 0) + (isCorrect ? 1 : 0);
      const nextIndex = questionIndex + 1;
      const finished = nextIndex >= config.questionCount;

      if (!finished) {
        tx.update(sessionRef, {
          questionIndex: nextIndex,
          correctCount: nextCorrect,
          updatedAt: FieldValue.serverTimestamp(),
        });
        const nextQuestion = createQuestion(seed, nextIndex, ageGroup, gameId);
        return {
          completed: false,
          correct: isCorrect,
          correctCount: nextCorrect,
          question: publicQuestion(nextQuestion),
          questionNumber: nextIndex + 1,
          totalQuestions: config.questionCount,
          secondsRemaining: Math.max(0, Math.ceil((Number(session.expiresAtMs) - now) / 1000)),
        };
      }

      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) throw new Error('USER_PROFILE_NOT_FOUND');
      const user = userSnap.data() || {};
      const claims = user.dailyChallengeDate === todayInVietnam() && user.dailyChallengeClaims && typeof user.dailyChallengeClaims === 'object'
        ? { ...user.dailyChallengeClaims }
        : {};
      const progress = user.dailyChallengeDate === todayInVietnam() && user.dailyChallengeProgress && typeof user.dailyChallengeProgress === 'object'
        ? { ...user.dailyChallengeProgress }
        : {};

      const newXp = Number(user.xp || 0) + config.rewardXP;
      const newLevel = Math.max(Number(user.level || 1), getLevelInfo(newXp).level);
      const newCoin = Number(user.coin || 0) + config.rewardCoin;
      const newGem = Number(user.gem || 0) + config.rewardGem;
      const highScores = user.highScores && typeof user.highScores === 'object' ? { ...user.highScores } : {};
      highScores[GAME_ID] = Math.max(Number(highScores[GAME_ID] || 0), nextCorrect);
      const date = todayInVietnam();
      progress['dc-2'] = Number(progress['dc-2'] || 0) + 1;

      tx.update(sessionRef, {
        questionIndex: nextIndex,
        correctCount: nextCorrect,
        status: 'completed',
        completedAt: FieldValue.serverTimestamp(),
        rewardGranted: true,
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.update(userRef, {
        xp: newXp,
        level: newLevel,
        coin: newCoin,
        gem: newGem,
        dailyChallengeDate: date,
        dailyChallengeProgress: progress,
        dailyChallengeClaims: claims,
        highScores,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        completed: true,
        correct: isCorrect,
        correctCount: nextCorrect,
        rewardGranted: true,
        xpEarned: config.rewardXP,
        coinEarned: config.rewardCoin,
        gemEarned: config.rewardGem,
        newLevel,
      };
    });

    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'SESSION_NOT_FOUND' || message === 'SESSION_INVALID') return Response.json({ error: 'Mini-game session not found' }, { status: 404 });
    if (message === 'SESSION_CLOSED') return Response.json({ error: 'Mini-game session is closed' }, { status: 409 });
    if (message === 'USER_PROFILE_NOT_FOUND') return Response.json({ error: 'Profile not found' }, { status: 404 });
    console.error('mini-game session error', error);
    return Response.json({ error: 'Unable to process mini-game session' }, { status: 500 });
  }
}
