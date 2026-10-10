import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const ANSWER_KEY = [1, 1, 1, 0, 1, 2, 2, 1, 2, 2] as const;
const QUESTION_IDS = ['g1-01', 'g1-02', 'g1-03', 'g1-04', 'g1-05', 'g1-06', 'g1-07', 'g1-08', 'g1-09', 'g1-10'] as const;

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


export async function GET(request: Request) {
  try {
    const header = request.headers.get('authorization') || '';
    if (!header.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing authentication token' }, { status: 401 });
    }

    const decoded = await getAuth(adminApp()).verifyIdToken(header.slice(7));
    const url = new URL(request.url);
    const requestedLimit = Number(url.searchParams.get('limit') || 20);
    const limit = Number.isInteger(requestedLimit) ? Math.min(50, Math.max(1, requestedLimit)) : 20;
    const snapshot = await getFirestore(adminApp())
      .collection('users')
      .doc(decoded.uid)
      .collection('examAttempts')
      .orderBy('submittedAt', 'desc')
      .limit(limit)
      .get();

    const attempts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const submittedAt = data.submittedAt?.toMillis?.() ?? null;
      return {
        id: doc.id,
        examId: data.examId === 'grade-1-math-practice-v1' ? data.examId : 'unknown',
        score: Number.isFinite(data.score) ? data.score : 0,
        correctCount: Number.isFinite(data.correctCount) ? data.correctCount : 0,
        answeredCount: Number.isFinite(data.answeredCount) ? data.answeredCount : 0,
        totalQuestions: Number.isFinite(data.totalQuestions) ? data.totalQuestions : 10,
        timeSpentSeconds: Number.isFinite(data.timeSpentSeconds) ? data.timeSpentSeconds : 0,
        submittedAt,
      };
    });

    return Response.json({ ok: true, attempts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('Firebase ID token') || message.includes('Decoding Firebase ID token')) {
      return Response.json({ error: 'Invalid authentication token' }, { status: 401 });
    }
    console.error('exam-attempt history error', error);
    return Response.json({ error: 'Unable to load exam history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    return Response.json({ error: 'Content-Type must be application/json' }, { status: 415 });
  }

  try {
    const header = request.headers.get('authorization') || '';
    if (!header.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing authentication token' }, { status: 401 });
    }

    const decoded = await getAuth(adminApp()).verifyIdToken(header.slice(7));
    const body = await request.json();
    const answers = body.answers;
    const timeSpentSeconds = Number(body.timeSpentSeconds);

    if (
      !answers || typeof answers !== 'object' || Array.isArray(answers) ||
      !Number.isInteger(timeSpentSeconds) || timeSpentSeconds < 0 || timeSpentSeconds > 720
    ) {
      return Response.json({ error: 'Invalid exam result' }, { status: 400 });
    }

    const answerKeys = Object.keys(answers);
    if (answerKeys.some((id) => !(QUESTION_IDS as readonly string[]).includes(id))) {
      return Response.json({ error: 'Unknown question' }, { status: 400 });
    }
    if (answerKeys.some((id) => !Number.isInteger(answers[id]) || answers[id] < 0 || answers[id] > 3)) {
      return Response.json({ error: 'Invalid answer option' }, { status: 400 });
    }

    const normalizedAnswers: Record<string, number> = {};
    for (const id of QUESTION_IDS) {
      if (Object.prototype.hasOwnProperty.call(answers, id)) normalizedAnswers[id] = answers[id];
    }
    const correctCount = QUESTION_IDS.reduce(
      (sum, id, index) => sum + (normalizedAnswers[id] === ANSWER_KEY[index] ? 1 : 0),
      0,
    );
    const db = getFirestore(adminApp());
    const attemptRef = db.collection('users').doc(decoded.uid).collection('examAttempts').doc();

    await attemptRef.set({
      examId: 'grade-1-math-practice-v1',
      uid: decoded.uid,
      answers: normalizedAnswers,
      answeredCount: Object.keys(normalizedAnswers).length,
      correctCount,
      score: correctCount * 10,
      totalQuestions: QUESTION_IDS.length,
      timeSpentSeconds,
      submittedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      ok: true,
      attemptId: attemptRef.id,
      correctCount,
      score: correctCount * 10,
      answeredCount: Object.keys(normalizedAnswers).length,
      totalQuestions: QUESTION_IDS.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('Firebase ID token')) {
      return Response.json({ error: 'Invalid authentication token' }, { status: 401 });
    }
    console.error('exam-attempt persistence error', error);
    return Response.json({ error: 'Unable to save exam result' }, { status: 500 });
  }
}
