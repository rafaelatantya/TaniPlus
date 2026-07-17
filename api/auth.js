import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { Redis } from '@upstash/redis';

const COOKIE_NAME = 'taniplus_session';
const USER_PREFIX = 'taniplus:user:';
const SESSION_PREFIX = 'taniplus:session:';
const DEFAULT_USERS = {
  'evantanuri@gmail.com': { name: 'Evan Tanuri', phone: '080000000001' },
  'ayubi300306@gmail.com': { name: 'Ayubi Fathan', phone: '080000000002' },
  'kakaklaras12@gmail.com': { name: 'Laras', phone: '080000000003' },
  'rafael.atantya@gmail.com': { name: 'Rafael Atantya', phone: '080000000004' },
};

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function redis(command) {
  const client = new Redis({ url: env('KV_REST_API_URL'), token: env('KV_REST_API_TOKEN'), automaticDeserialization: false });
  const [name, key, value, expiry, seconds] = command;
  if (name === 'GET') return client.get(key);
  if (name === 'DEL') return client.del(key);
  if (name === 'SET') return client.set(key, value, expiry === 'EX' ? { ex: Number(seconds) } : undefined);
  throw new Error(`Unsupported Redis command: ${name}`);
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function normalizePhone(value = '') {
  return String(value).replace(/\D/g, '');
}

function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function passwordMatches(password, stored) {
  const [salt, expectedHex] = String(stored).split(':');
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function sessionKey(token) {
  const digest = createHmac('sha256', env('SESSION_SECRET')).update(token).digest('hex');
  return `${SESSION_PREFIX}${digest}`;
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((item) => item.trim().split('=').map(decodeURIComponent)).filter(([key]) => key));
}

function publicUser(user) {
  return { id: user.id, phone: user.phone, email: user.email, name: user.name, location: user.location };
}

async function createSession(response, userId, remember) {
  const token = randomBytes(32).toString('base64url');
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  await redis(['SET', sessionKey(token), userId, 'EX', maxAge]);
  response.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`);
}

async function currentUser(request) {
  const token = parseCookies(request.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  const userId = await redis(['GET', sessionKey(token)]);
  if (!userId) return null;
  const raw = await redis(['GET', `${USER_PREFIX}${userId}`]);
  return raw ? JSON.parse(raw) : null;
}

async function register(body, response) {
  const phone = normalizePhone(body.phone);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? '');
  const name = String(body.name ?? '').trim();
  const location = String(body.location ?? '').trim();

  if (phone.length < 8 || !email.includes('@') || password.length < 8 || name.length < 2 || location.length < 3) {
    return response.status(400).json({ error: 'Data pendaftaran belum lengkap atau tidak valid.' });
  }
  if (await redis(['GET', `taniplus:user-email:${email}`]) || await redis(['GET', `taniplus:user-phone:${phone}`])) {
    return response.status(409).json({ error: 'Email atau nomor telepon sudah terdaftar.' });
  }

  const user = { id: randomUUID(), phone, email, passwordHash: passwordHash(password), name, location, createdAt: new Date().toISOString() };
  await redis(['SET', `${USER_PREFIX}${user.id}`, JSON.stringify(user)]);
  await redis(['SET', `taniplus:user-email:${email}`, user.id]);
  await redis(['SET', `taniplus:user-phone:${phone}`, user.id]);
  await createSession(response, user.id, true);
  return response.status(201).json({ user: publicUser(user) });
}

async function login(body, response) {
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const password = String(body.password ?? '');
  const lookupKey = email ? `taniplus:user-email:${email}` : `taniplus:user-phone:${phone}`;
  let userId = await redis(['GET', lookupKey]);
  if (!userId && email && DEFAULT_USERS[email] && password === env('DEFAULT_USER_PASSWORD')) {
    const defaults = DEFAULT_USERS[email];
    const seeded = {
      id: randomUUID(), email, phone: defaults.phone, name: defaults.name,
      location: 'Indonesia', passwordHash: passwordHash(password), createdAt: new Date().toISOString(),
    };
    await redis(['SET', `${USER_PREFIX}${seeded.id}`, JSON.stringify(seeded)]);
    await redis(['SET', `taniplus:user-email:${email}`, seeded.id]);
    await redis(['SET', `taniplus:user-phone:${seeded.phone}`, seeded.id]);
    userId = seeded.id;
  }
  const raw = userId ? await redis(['GET', `${USER_PREFIX}${userId}`]) : null;
  const user = raw ? JSON.parse(raw) : null;
  if (!user || !passwordMatches(password, user.passwordHash)) {
    return response.status(401).json({ error: 'Email, nomor telepon, atau password salah.' });
  }
  await createSession(response, user.id, Boolean(body.remember));
  return response.status(200).json({ user: publicUser(user) });
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  try {
    if (request.method === 'GET') {
      const user = await currentUser(request);
      return response.status(user ? 200 : 401).json(user ? { user: publicUser(user) } : { error: 'Belum login.' });
    }
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method tidak didukung.' });

    const body = request.body ?? {};
    if (body.action === 'register') return await register(body, response);
    if (body.action === 'login') return await login(body, response);
    if (body.action === 'logout') {
      const token = parseCookies(request.headers.cookie)[COOKIE_NAME];
      if (token) await redis(['DEL', sessionKey(token)]);
      response.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
      return response.status(200).json({ ok: true });
    }
    return response.status(400).json({ error: 'Action tidak valid.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Konfigurasi server atau database belum siap.' });
  }
}
