// Types for local TypeScript compilation safety
type PagesFunction = any;
import { ensureTables } from '../db';

export const onRequestPost: PagesFunction = async (context: any) => {
  const { request, env } = context;
  try {
    await ensureTables(env.DB);

    const body = await request.json() as any;
    const { userId, subjects, tasks, reviewResults, userProgress } = body;

    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'userId is required' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const nowStr = new Date().toISOString();

    // 1. Sync Subjects
    if (Array.isArray(subjects)) {
      await env.DB.prepare('DELETE FROM subjects WHERE user_id = ?').bind(userId).run();
      for (const s of subjects) {
        await env.DB.prepare(
          'INSERT INTO subjects (id, user_id, name, color, icon, goal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(s.id, userId, s.name, s.color, s.icon || null, s.goal || '', nowStr).run();
      }
    }

    // 2. Sync Tasks
    if (Array.isArray(tasks)) {
      await env.DB.prepare('DELETE FROM tasks WHERE user_id = ?').bind(userId).run();
      for (const t of tasks) {
        await env.DB.prepare(
          'INSERT INTO tasks (id, user_id, subject_id, title, date, type, duration, is_completed, is_important, assignment, pages, memo, start_time, notification_enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          t.id,
          userId,
          t.subjectId || '',
          t.title || '',
          t.date || '',
          t.type || 'STUDY',
          t.duration !== undefined ? t.duration : null,
          t.isCompleted ? 1 : 0,
          t.isImportant ? 1 : 0,
          t.assignment || null,
          t.pages || null,
          t.memo || null,
          t.startTime || null,
          t.notificationEnabled ? 1 : 0,
          nowStr
        ).run();
      }
    }

    // 3. Sync Review Results
    if (Array.isArray(reviewResults)) {
      await env.DB.prepare('DELETE FROM review_results WHERE user_id = ?').bind(userId).run();
      for (const r of reviewResults) {
        const uniqueId = `${userId}_${r.subjectId}_${new Date(r.date).getTime()}`;
        await env.DB.prepare(
          'INSERT INTO review_results (id, user_id, subject_id, score, total, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(uniqueId, userId, r.subjectId, r.score, r.total, r.date, nowStr).run();
      }
    }

    // 4. Sync User Progress
    if (userProgress) {
      const p = userProgress;
      const badgesJson = JSON.stringify(p.badges || []);
      const unlockedTitlesJson = JSON.stringify(p.unlockedTitles || []);
      
      // Use INSERT OR REPLACE / INSERT INTO ... ON CONFLICT
      // sqlite/D1 supports INSERT OR REPLACE INTO
      await env.DB.prepare(
        'INSERT OR REPLACE INTO user_progress (user_id, level, xp, streak, last_active, reviews_completed_count, is_member, badges_json, unlocked_titles_json, active_title, articles_read_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
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
      ).run();

      // Also update the users.avatar column if provided in userProgress
      if (p.avatarIcon !== undefined) {
        await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(p.avatarIcon, userId).run();
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'データがクラウド（D1）に保存されました！' }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
};

// Handle CORS Preflight requests
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
