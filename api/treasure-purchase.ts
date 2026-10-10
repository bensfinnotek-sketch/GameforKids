import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const TREASURE_CATALOG: Record<string, { currency: 'coin' | 'gem'; price: number }> = {
  'item-hat-supermath': { currency: 'gem', price: 30 },
  'item-hat-astro': { currency: 'gem', price: 50 },
  'item-hat-crown': { currency: 'gem', price: 90 },
  'item-hat-pirate': { currency: 'coin', price: 180 },
  'item-pack-rocket': { currency: 'coin', price: 150 },
  'item-pack-magic': { currency: 'coin', price: 220 },
  'item-pack-wings': { currency: 'gem', price: 65 },
  'item-avatar-pirate': { currency: 'coin', price: 180 },
  'item-avatar-wizard': { currency: 'gem', price: 60 },
  'item-avatar-detective': { currency: 'coin', price: 200 },
  'item-skin-golden': { currency: 'gem', price: 80 },
  'item-skin-ninja': { currency: 'coin', price: 250 },
  'item-bg-galaxy': { currency: 'gem', price: 70 },
  'item-bg-underwater': { currency: 'coin', price: 160 },
  'item-sticker-dragon': { currency: 'coin', price: 90 },
  'item-sticker-unicorn': { currency: 'coin', price: 90 },
  'item-badge-superstar': { currency: 'coin', price: 120 },
  'item-special-potion': { currency: 'gem', price: 45 },
  'item-special-magnet': { currency: 'coin', price: 300 },
  'item-special-trophy': { currency: 'gem', price: 100 },
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const itemId = (body as { itemId?: unknown }).itemId;
    if (typeof itemId !== 'string' || !Object.prototype.hasOwnProperty.call(TREASURE_CATALOG, itemId)) {
      return Response.json({ error: 'Invalid treasure item' }, { status: 400 });
    }
    const item = TREASURE_CATALOG[itemId];
    const db = getFirestore(adminApp());
    const userRef = db.collection('users').doc(decoded.uid);

    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error('USER_PROFILE_NOT_FOUND');
      const user = snap.data() || {};
      const inventory = Array.isArray(user.inventory) ? user.inventory.filter((id: unknown) => typeof id === 'string') : [];
      if (inventory.includes(itemId)) {
        return { alreadyOwned: true, coin: Number(user.coin || 0), gem: Number(user.gem || 0), inventory };
      }

      const balance = Number(user[item.currency] || 0);
      if (!Number.isFinite(balance) || balance < item.price) {
        return {
          insufficientFunds: true,
          currency: item.currency,
          required: item.price,
          balance: Number.isFinite(balance) ? balance : 0,
          coin: Number(user.coin || 0),
          gem: Number(user.gem || 0),
          inventory,
        };
      }

      const nextInventory = [...inventory, itemId];
      const nextCoin = item.currency === 'coin' ? balance - item.price : Number(user.coin || 0);
      const nextGem = item.currency === 'gem' ? balance - item.price : Number(user.gem || 0);
      tx.update(userRef, {
        coin: nextCoin,
        gem: nextGem,
        inventory: nextInventory,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { alreadyOwned: false, coin: nextCoin, gem: nextGem, inventory: nextInventory };
    });

    if (result.insufficientFunds) {
      return Response.json({ ok: false, error: 'INSUFFICIENT_FUNDS', ...result }, { status: 409 });
    }
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'USER_PROFILE_NOT_FOUND') return Response.json({ error: 'Profile not found' }, { status: 404 });
    console.error('treasure-purchase error', error);
    return Response.json({ error: 'Unable to purchase treasure item' }, { status: 500 });
  }
}
