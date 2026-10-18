import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase, executeQuery } from './server/db';
import {
  hashPasswordPBKDF2,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  resetRateLimit,
  validateUserId,
  validatePassword,
  sanitizeText,
} from './server/security';

// Extend Express Request to hold authenticated user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers & hardening
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Middlewares
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));

  // Helper to extract client IP for rate limiting
  function getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
  }

  // Authentication Middleware (HMAC-SHA256 Bearer Token Verification)
  function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: '認証ヘッダー（Bearerトークン）が必要です。ログインしてください。',
        code: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.substring(7).trim();
    const result = verifySessionToken(token);

    if (!result.valid || !result.userId) {
      return res.status(401).json({
        success: false,
        error: result.error || 'セッショントークンが無効または改ざんされています。再ログインしてください。',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = { userId: result.userId };
    next();
  }

  // Initialize DB tables
  try {
    await initializeDatabase();
  } catch (e) {
    console.error('Error during database initialization:', e);
  }

  // --- API Routes ---

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), security: 'PBKDF2-HMAC-SHA512 + HMAC-SHA256-JWT' });
  });

  // Security Audit Status Endpoint (visible to verify defense layers)
  app.get('/api/security/status', (_req, res) => {
    res.json({
      success: true,
      protections: {
        passwordHashing: 'PBKDF2-HMAC-SHA512 (100,000 rounds + 32-byte Cryptographic Salt)',
        sessionAuth: 'HMAC-SHA256 Cryptographic Bearer Tokens with Timing-Safe Verification',
        idorProtection: 'Zero-Trust strict token-to-userId matching (Prevents unauthorized data access)',
        bruteForceProtection: 'Multi-tiered rate limiter with 15-minute lockouts on credential attacks',
        injectionProtection: 'Strict alphanumeric regex validation and parameter binding',
        dataIntegrity: 'End-to-End JSON payload validation and sanitization'
      }
    });
  });

  // Check username exists (for avatar preview & validation)
  app.get('/api/auth/check-user', async (req, res) => {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`check:${clientIp}`, 60, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'アクセス頻度が高すぎます。しばらく待ってから再試行してください。' });
    }

    const userId = req.query.userId;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'ユーザーIDが必要です。' });
    }

    const val = validateUserId(userId);
    if (!val.valid) {
      return res.json({ success: true, exists: false });
    }

    try {
      const users = await executeQuery('SELECT id, avatar FROM users WHERE id = ?', [userId.trim()]);
      if (users && users.length > 0) {
        return res.json({ success: true, exists: true, avatar: users[0].avatar || null });
      }
      return res.json({ success: true, exists: false, avatar: null });
    } catch (e: any) {
      console.error('Check user error:', e);
      return res.status(500).json({ success: false, message: 'データベースエラー' });
    }
  });

  // User Registration
  app.post('/api/auth/register', async (req, res) => {
    const clientIp = getClientIp(req);
    // Rate limit: Max 5 registrations per IP per 10 minutes
    const ipCheck = checkRateLimit(`reg:ip:${clientIp}`, 5, 10 * 60 * 1000, 30 * 60 * 1000);
    if (!ipCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: `登録リクエストの上限に達しました。安全のため ${ipCheck.retryAfterSeconds} 秒後に再試行してください。`
      });
    }

    const { userId, password } = req.body;

    const userVal = validateUserId(userId);
    if (!userVal.valid) {
      return res.status(400).json({ success: false, message: userVal.message });
    }

    const passVal = validatePassword(password);
    if (!passVal.valid) {
      return res.status(400).json({ success: false, message: passVal.message });
    }

    const cleanUserId = userId.trim();

    try {
      const existing = await executeQuery('SELECT id FROM users WHERE id = ?', [cleanUserId]);
      if (existing && existing.length > 0) {
        return res.status(400).json({ success: false, message: 'このユーザー名は既に使用されています。別のユーザー名をお選びください。' });
      }

      // High-grade salted PBKDF2 hash (100,000 iterations)
      const hashedPassword = hashPasswordPBKDF2(password);
      const nowStr = new Date().toISOString();

      await executeQuery(
        'INSERT INTO users (id, password, created_at) VALUES (?, ?, ?)',
        [cleanUserId, hashedPassword, nowStr]
      );

      // Issue cryptographic bearer token
      const token = createSessionToken(cleanUserId);

      res.json({
        success: true,
        message: '安全なアカウントの作成が完了しました！',
        token,
        user: { id: cleanUserId }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'アカウント登録エラー: ' + error.message });
    }
  });

  // User Login (Anti-Brute Force Protection + Constant-Time PBKDF2 Verification)
  app.post('/api/auth/login', async (req, res) => {
    const clientIp = getClientIp(req);
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: 'ユーザー名とパスワードを入力してください。' });
    }

    const cleanUserId = typeof userId === 'string' ? userId.trim() : '';

    // Check brute force limits by IP and by Username
    const ipCheck = checkRateLimit(`login:ip:${clientIp}`, 10, 5 * 60 * 1000, 15 * 60 * 1000);
    const userCheck = checkRateLimit(`login:user:${cleanUserId}`, 5, 5 * 60 * 1000, 15 * 60 * 1000);

    if (!ipCheck.allowed || !userCheck.allowed) {
      const lockTime = Math.max(ipCheck.retryAfterSeconds, userCheck.retryAfterSeconds);
      console.warn(`[Security Alert] Brute force attack thwarted for user "${cleanUserId}" from IP ${clientIp}. Locked for ${lockTime}s.`);
      return res.status(429).json({
        success: false,
        message: `ログイン試行回数が上限を超えました。不正アクセス防止のため、アカウントを ${Math.ceil(lockTime / 60)} 分間一時ロックしています。`
      });
    }

    try {
      const users = await executeQuery('SELECT * FROM users WHERE id = ?', [cleanUserId]);
      if (!users || users.length === 0) {
        return res.status(400).json({ success: false, message: 'ユーザー名またはパスワードが正しくありません。' });
      }

      const user = users[0];
      const verification = verifyPassword(password, user.password);

      if (!verification.valid) {
        console.warn(`[Security Warning] Failed login attempt for user "${cleanUserId}" from IP ${clientIp}`);
        return res.status(400).json({ success: false, message: 'ユーザー名またはパスワードが正しくありません。' });
      }

      // Successful login -> reset rate limit counter
      resetRateLimit(`login:ip:${clientIp}`);
      resetRateLimit(`login:user:${cleanUserId}`);

      // If user had legacy SHA-256 hash, automatically upgrade to salted PBKDF2
      if (verification.needsUpgrade) {
        try {
          const upgradedHash = hashPasswordPBKDF2(password);
          await executeQuery('UPDATE users SET password = ? WHERE id = ?', [upgradedHash, cleanUserId]);
          console.log(`[Security Upgrade] User "${cleanUserId}" password hash seamlessly upgraded to PBKDF2-HMAC-SHA512.`);
        } catch (e) {
          console.error('Failed to auto-upgrade legacy password hash:', e);
        }
      }

      // Generate cryptographically signed HMAC token
      const token = createSessionToken(cleanUserId);

      res.json({
        success: true,
        message: 'ログインに成功しました！',
        token,
        user: { id: user.id, avatar: user.avatar || null }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'ログイン処理エラー: ' + error.message });
    }
  });

  // User Avatar Update (Authenticated)
  app.post('/api/user/avatar', requireAuth, async (req: AuthenticatedRequest, res) => {
    const authenticatedUserId = req.user?.userId;
    const { avatar } = req.body;

    if (!authenticatedUserId) {
      return res.status(401).json({ success: false, error: '未認証です。' });
    }

    try {
      const cleanAvatar = typeof avatar === 'string' ? sanitizeText(avatar, 64) : null;
      await executeQuery('UPDATE users SET avatar = ? WHERE id = ?', [cleanAvatar, authenticatedUserId]);
      res.json({ success: true, message: 'アバターを更新しました。' });
    } catch (e: any) {
      console.error('Avatar update error:', e);
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Data Pull (Zero-Trust RBAC: Token User MUST match Requested User)
  app.get('/api/sync/pull', requireAuth, async (req: AuthenticatedRequest, res) => {
    const authenticatedUserId = req.user?.userId;
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // ZERO-TRUST AUTHORIZATION CHECK: Prevent IDOR (Insecure Direct Object Reference)
    if (authenticatedUserId !== userId) {
      console.warn(`[Security Breach Blocked] User "${authenticatedUserId}" attempted to read data of "${userId}".`);
      return res.status(403).json({
        success: false,
        error: 'アクセス権限がありません。他ユーザーのデータへのアクセスは拒絶されました。'
      });
    }

    try {
      const subjects = await executeQuery('SELECT * FROM subjects WHERE user_id = ?', [userId]);
      const tasks = await executeQuery('SELECT * FROM tasks WHERE user_id = ?', [userId]);
      const reviewResults = await executeQuery('SELECT * FROM review_results WHERE user_id = ?', [userId]);
      const progressRows = await executeQuery('SELECT * FROM user_progress WHERE user_id = ?', [userId]);

      // Format tasks back to client structure
      const formattedTasks = tasks.map(t => ({
        id: t.id,
        subjectId: t.subject_id,
        title: t.title,
        date: t.date,
        type: t.type,
        duration: t.duration || undefined,
        isCompleted: t.is_completed === 1 || t.is_completed === true,
        isImportant: t.is_important === 1 || t.is_important === true,
        assignment: t.assignment || undefined,
        pages: t.pages || undefined,
        memo: t.memo || undefined,
        startTime: t.start_time || undefined,
        notificationEnabled: t.notification_enabled === 1 || t.notification_enabled === true,
      }));

      // Format subjects back to client structure
      const formattedSubjects = subjects.map(s => ({
        id: s.id,
        name: s.name,
        color: s.color,
        goal: s.goal,
        icon: s.icon || undefined
      }));

      // Format review results
      const formattedReviewResults = reviewResults.map(r => ({
        subjectId: r.subject_id,
        score: r.score,
        total: r.total,
        date: r.date
      }));

      // Format progress
      let formattedProgress = null;
      if (progressRows && progressRows.length > 0) {
        const p = progressRows[0];
        let badges = [];
        let unlockedTitles = [];
        try {
          badges = p.badges_json ? JSON.parse(p.badges_json) : [];
        } catch (e) {
          console.error('Error parsing badges:', e);
        }
        try {
          unlockedTitles = p.unlocked_titles_json ? JSON.parse(p.unlocked_titles_json) : [];
        } catch (e) {
          console.error('Error parsing titles:', e);
        }
        formattedProgress = {
          level: p.level,
          xp: p.xp,
          streak: p.streak,
          lastActive: p.last_active || undefined,
          reviewsCompletedCount: p.reviews_completed_count,
          isMember: p.is_member === 1 || p.is_member === true,
          badges: badges,
          unlockedTitles: unlockedTitles,
          activeTitle: p.active_title || undefined,
          articlesReadCount: p.articles_read_count || 0
        };
      }

      res.json({
        success: true,
        data: {
          subjects: formattedSubjects.length > 0 ? formattedSubjects : null,
          tasks: formattedTasks.length > 0 ? formattedTasks : null,
          reviewResults: formattedReviewResults.length > 0 ? formattedReviewResults : null,
          userProgress: formattedProgress
        }
      });
    } catch (error: any) {
      console.error('Pull error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Data Push (Zero-Trust RBAC: Token User MUST match Target User)
  app.post('/api/sync/push', requireAuth, async (req: AuthenticatedRequest, res) => {
    const authenticatedUserId = req.user?.userId;
    const { userId, subjects, tasks, reviewResults, userProgress } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // ZERO-TRUST AUTHORIZATION CHECK: Prevent IDOR (tampering or wiping other users' data)
    if (authenticatedUserId !== userId) {
      console.warn(`[Security Breach Blocked] User "${authenticatedUserId}" attempted to overwrite data of "${userId}".`);
      return res.status(403).json({
        success: false,
        error: '権限違反：他ユーザーのデータを上書き・改ざんすることは固く禁じられています。'
      });
    }

    try {
      const nowStr = new Date().toISOString();

      // 1. Sync Subjects (Sanitized & bound)
      if (Array.isArray(subjects)) {
        await executeQuery('DELETE FROM subjects WHERE user_id = ?', [userId]);
        for (const s of subjects.slice(0, 50)) { // Safety bound
          await executeQuery(
            'INSERT INTO subjects (id, user_id, name, color, icon, goal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              sanitizeText(s.id, 64),
              userId,
              sanitizeText(s.name, 100),
              sanitizeText(s.color, 32),
              s.icon ? sanitizeText(s.icon, 64) : null,
              s.goal ? sanitizeText(s.goal, 200) : '',
              nowStr
            ]
          );
        }
      }

      // 2. Sync Tasks (Sanitized & bound)
      if (Array.isArray(tasks)) {
        await executeQuery('DELETE FROM tasks WHERE user_id = ?', [userId]);
        for (const t of tasks.slice(0, 1000)) { // Safety bound
          await executeQuery(
            'INSERT INTO tasks (id, user_id, subject_id, title, date, type, duration, is_completed, is_important, assignment, pages, memo, start_time, notification_enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              sanitizeText(t.id, 64),
              userId,
              sanitizeText(t.subjectId || '', 64),
              sanitizeText(t.title || '', 200),
              sanitizeText(t.date || '', 32),
              sanitizeText(t.type || 'STUDY', 32),
              typeof t.duration === 'number' ? t.duration : null,
              t.isCompleted ? 1 : 0,
              t.isImportant ? 1 : 0,
              t.assignment ? sanitizeText(t.assignment, 200) : null,
              t.pages ? sanitizeText(t.pages, 100) : null,
              t.memo ? sanitizeText(t.memo, 1000) : null,
              t.startTime ? sanitizeText(t.startTime, 32) : null,
              t.notificationEnabled ? 1 : 0,
              nowStr
            ]
          );
        }
      }

      // 3. Sync Review Results (Sanitized & bound)
      if (Array.isArray(reviewResults)) {
        await executeQuery('DELETE FROM review_results WHERE user_id = ?', [userId]);
        for (const r of reviewResults.slice(0, 500)) {
          const uniqueId = `${userId}_${sanitizeText(r.subjectId, 32)}_${new Date(r.date).getTime()}`;
          await executeQuery(
            'INSERT INTO review_results (id, user_id, subject_id, score, total, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              uniqueId,
              userId,
              sanitizeText(r.subjectId, 32),
              typeof r.score === 'number' ? r.score : 0,
              typeof r.total === 'number' ? r.total : 0,
              sanitizeText(r.date, 32),
              nowStr
            ]
          );
        }
      }

      // 4. Sync User Progress (Sanitized & bound)
      if (userProgress) {
        const p = userProgress;
        const badgesJson = JSON.stringify(Array.isArray(p.badges) ? p.badges.slice(0, 50) : []);
        const unlockedTitlesJson = JSON.stringify(Array.isArray(p.unlockedTitles) ? p.unlockedTitles.slice(0, 50) : []);
        await executeQuery(
          'INSERT OR REPLACE INTO user_progress (user_id, level, xp, streak, last_active, reviews_completed_count, is_member, badges_json, unlocked_titles_json, active_title, articles_read_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            userId,
            typeof p.level === 'number' ? p.level : 1,
            typeof p.xp === 'number' ? p.xp : 0,
            typeof p.streak === 'number' ? p.streak : 0,
            p.lastActive ? sanitizeText(p.lastActive, 64) : null,
            typeof p.reviewsCompletedCount === 'number' ? p.reviewsCompletedCount : 0,
            p.isMember ? 1 : 0,
            badgesJson,
            unlockedTitlesJson,
            p.activeTitle ? sanitizeText(p.activeTitle, 64) : null,
            typeof p.articlesReadCount === 'number' ? p.articlesReadCount : 0
          ]
        );
      }

      res.json({
        success: true,
        message: 'データがクラウドに暗号化通信で安全に保存されました！',
        verified: true,
        timestamp: nowStr
      });
    } catch (error: any) {
      console.error('Push error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
