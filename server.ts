import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { initializeDatabase, executeQuery } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Helper function to hash passwords with Node.js built-in crypto (no native deps)
  function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
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
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // User Registration
  app.post('/api/auth/register', async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ success: false, message: 'ユーザーIDとパスワードは必須です。' });
    }

    try {
      // Check if user already exists
      const existing = await executeQuery('SELECT * FROM users WHERE id = ?', [userId]);
      if (existing && existing.length > 0) {
        return res.status(400).json({ success: false, message: 'このユーザーIDは既に登録されています。' });
      }

      const hashedPassword = hashPassword(password);
      const nowStr = new Date().toISOString();
      await executeQuery(
        'INSERT INTO users (id, password, created_at) VALUES (?, ?, ?)',
        [userId, hashedPassword, nowStr]
      );

      res.json({ success: true, message: 'ユーザー登録が完了しました。' });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'エラーが発生しました: ' + error.message });
    }
  });

  // User Login
  app.post('/api/auth/login', async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ success: false, message: 'ユーザーIDとパスワードは必須です。' });
    }

    try {
      const users = await executeQuery('SELECT * FROM users WHERE id = ?', [userId]);
      if (!users || users.length === 0) {
        return res.status(400).json({ success: false, message: 'ユーザーIDまたはパスワードが正しくありません。' });
      }

      const user = users[0];
      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return res.status(400).json({ success: false, message: 'ユーザーIDまたはパスワードが正しくありません。' });
      }

      res.json({ 
        success: true, 
        message: 'ログインに成功しました！',
        user: { id: user.id }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'エラーが発生しました: ' + error.message });
    }
  });

  // Data Pull
  app.get('/api/sync/pull', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
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

  // Data Push
  app.post('/api/sync/push', async (req, res) => {
    const { userId, subjects, tasks, reviewResults, userProgress } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    try {
      const nowStr = new Date().toISOString();

      // 1. Sync Subjects
      if (Array.isArray(subjects)) {
        await executeQuery('DELETE FROM subjects WHERE user_id = ?', [userId]);
        for (const s of subjects) {
          await executeQuery(
            'INSERT INTO subjects (id, user_id, name, color, icon, goal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [s.id, userId, s.name, s.color, s.icon || null, s.goal || '', nowStr]
          );
        }
      }

      // 2. Sync Tasks
      if (Array.isArray(tasks)) {
        await executeQuery('DELETE FROM tasks WHERE user_id = ?', [userId]);
        for (const t of tasks) {
          await executeQuery(
            'INSERT INTO tasks (id, user_id, subject_id, title, date, type, duration, is_completed, is_important, assignment, pages, memo, start_time, notification_enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              t.id,
              userId,
              t.subjectId || '',
              t.title || '',
              t.date || '',
              t.type || 'STUDY',
              t.duration || null,
              t.isCompleted ? 1 : 0,
              t.isImportant ? 1 : 0,
              t.assignment || null,
              t.pages || null,
              t.memo || null,
              t.startTime || null,
              t.notificationEnabled ? 1 : 0,
              nowStr
            ]
          );
        }
      }

      // 3. Sync Review Results
      if (Array.isArray(reviewResults)) {
        await executeQuery('DELETE FROM review_results WHERE user_id = ?', [userId]);
        for (const r of reviewResults) {
          const uniqueId = `${userId}_${r.subjectId}_${new Date(r.date).getTime()}`;
          await executeQuery(
            'INSERT INTO review_results (id, user_id, subject_id, score, total, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uniqueId, userId, r.subjectId, r.score, r.total, r.date, nowStr]
          );
        }
      }

      // 4. Sync User Progress
      if (userProgress) {
        const p = userProgress;
        const badgesJson = JSON.stringify(p.badges || []);
        const unlockedTitlesJson = JSON.stringify(p.unlockedTitles || []);
        await executeQuery(
          'INSERT OR REPLACE INTO user_progress (user_id, level, xp, streak, last_active, reviews_completed_count, is_member, badges_json, unlocked_titles_json, active_title, articles_read_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            userId,
            p.level || 1,
            p.xp || 0,
            p.streak || 0,
            p.lastActive || null,
            p.reviewsCompletedCount || 0,
            p.isMember ? 1 : 0,
            badgesJson,
            unlockedTitlesJson,
            p.activeTitle || null,
            p.articlesReadCount || 0
          ]
        );
      }

      res.json({ success: true, message: 'データがクラウド（D1）に保存されました！' });
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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
