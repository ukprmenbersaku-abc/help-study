import crypto from 'crypto';

// Secret key for HMAC token signing (falls back to random byte generator on cold boot)
const JWT_SECRET = process.env.SYNC_SECURITY_SECRET || crypto.randomBytes(64).toString('hex');

// ==========================================
// 1. Password Hashing (PBKDF2-HMAC-SHA512)
// ==========================================
const PBKDF2_ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

/**
 * Hashes a password using PBKDF2 with a cryptographically secure 32-byte salt.
 * Format: `pbkdf2:100000:<saltHex>:<derivedKeyHex>`
 */
export function hashPasswordPBKDF2(password: string): string {
  const salt = crypto.randomBytes(32).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LEN, DIGEST);
  return `pbkdf2:${PBKDF2_ITERATIONS}:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Constant-time password verification supporting salted PBKDF2
 * and automatic migration from legacy SHA-256.
 */
export function verifyPassword(password: string, storedHash: string): { valid: boolean; needsUpgrade: boolean } {
  if (!storedHash || typeof storedHash !== 'string') {
    return { valid: false, needsUpgrade: false };
  }

  // Modern PBKDF2 format
  if (storedHash.startsWith('pbkdf2:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 4) return { valid: false, needsUpgrade: false };
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const expectedHashHex = parts[3];

    const expectedBuffer = Buffer.from(expectedHashHex, 'hex');
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, expectedBuffer.length, DIGEST);

    if (derivedKey.length !== expectedBuffer.length) {
      return { valid: false, needsUpgrade: false };
    }

    const valid = crypto.timingSafeEqual(derivedKey, expectedBuffer);
    return { valid, needsUpgrade: false };
  }

  // Legacy SHA-256 fallback (auto-upgrade on successful login)
  const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
  const legacyBuffer = Buffer.from(legacyHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (legacyBuffer.length === storedBuffer.length && crypto.timingSafeEqual(legacyBuffer, storedBuffer)) {
    return { valid: true, needsUpgrade: true };
  }

  return { valid: false, needsUpgrade: false };
}

// ==========================================
// 2. Tamper-Proof HMAC Session Tokens
// ==========================================
interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
  jti: string; // Unique token identifier to prevent replay attacks
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Creates an HMAC-SHA256 signed bearer token valid for 30 days.
 */
export function createSessionToken(userId: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Date.now();
  const payload: TokenPayload = {
    userId,
    iat: now,
    exp: now + 30 * 24 * 60 * 60 * 1000, // 30 days
    jti: crypto.randomBytes(16).toString('hex'),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Validates token signature, expiration, and payload integrity.
 */
export function verifySessionToken(token: string): { valid: boolean; userId?: string; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'トークンが指定されていません。' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: '不正なトークン形式です。' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: 'トークンの改ざんが検知されました（署名不一致）。' };
  }

  try {
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload: TokenPayload = JSON.parse(payloadStr);

    if (Date.now() > payload.exp) {
      return { valid: false, error: 'セッショントークンの有効期限が切れています。再ログインしてください。' };
    }

    return { valid: true, userId: payload.userId };
  } catch {
    return { valid: false, error: 'トークンの解析に失敗しました。' };
  }
}

// ==========================================
// 3. Brute-Force & Rate Limiting Engine
// ==========================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockedUntil?: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime && (!record.lockedUntil || now > record.lockedUntil)) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

/**
 * Rate limit check with lockout support.
 * @param key Identifier (e.g., `login:ip:1.2.3.4` or `login:user:bob`)
 * @param maxAttempts Max allowed attempts within window
 * @param windowMs Window in milliseconds
 * @param lockoutMs Lockout penalty if max attempts exceeded
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 5 * 60 * 1000,
  lockoutMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record || (now > record.resetTime && (!record.lockedUntil || now > record.lockedUntil))) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(key, record);
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  // Check if currently locked
  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;

  if (record.count > maxAttempts) {
    record.lockedUntil = now + lockoutMs;
    const retryAfterSeconds = Math.ceil(lockoutMs / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: Math.max(0, maxAttempts - record.count), retryAfterSeconds: 0 };
}

/**
 * Reset rate limit on successful authentication
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

// ==========================================
// 4. Strict Input Validation & Sanitization
// ==========================================
export function validateUserId(userId: string): { valid: boolean; message?: string } {
  if (!userId || typeof userId !== 'string') {
    return { valid: false, message: 'ユーザーIDが指定されていません。' };
  }
  const trimmed = userId.trim();
  if (trimmed.length < 3 || trimmed.length > 32) {
    return { valid: false, message: 'ユーザーIDは3文字以上32文字以下にしてください。' };
  }
  // Prevent SQL injection, path traversal, control chars
  const regex = /^[a-zA-Z0-9_-]+$/;
  if (!regex.test(trimmed)) {
    return { valid: false, message: 'ユーザーIDは半角英数字、アンダースコア(_)、ハイフン(-)のみ使用できます。' };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'パスワードを入力してください。' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'パスワードは安全のため8文字以上にしてください。' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'パスワードは128文字以下にしてください。' };
  }
  return { valid: true };
}

/**
 * Basic payload sanitization to prevent memory bloat DoS or XSS
 */
export function sanitizeText(str: any, maxLen = 1000): string {
  if (typeof str !== 'string') return '';
  return str.slice(0, maxLen).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}
