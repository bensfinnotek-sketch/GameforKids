import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { LESSON_REWARDS } from './lessonRewards';

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
    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const lessonId = typeof body.lessonId === 'string' ? body.lessonId : '';
    if (!Object.prototype.hasOwnProperty.call(LESSON_REWARDS, lessonId)) {
      return Response.json({ error: 'Invalid lesson' }, { status: 400 });
    }

    const db = getFirestore(adminApp());
    const userRef = db.collection('users').doc(decoded.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return Response.json({ error: 'Profile not found' }, { status: 404 });

    const now = Date.now();
    const sessionRef = userRef.collection('lessonSessions').doc();
    await sessionRef.set({
      uid: decoded.uid,
      lessonId,
      status: 'active',
      startedAtMs: now,
      expiresAtMs: now + 4 * 60 * 60 * 1000,
      createdAt: FieldValue.serverTimestamp(),
    });
    return Response.json({ ok: true, sessionId: sessionRef.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('Firebase ID token') || message.includes('Decoding Firebase ID token')) {
      return Response.json({ error: 'Invalid authentication token' }, { status: 401 });
    }
    console.error('lesson-session start error', error);
    return Response.json({ error: 'Unable to start lesson session' }, { status: 500 });
  }
}
