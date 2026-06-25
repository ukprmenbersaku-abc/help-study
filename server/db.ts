import fs from 'fs';
import path from 'path';

// Load environment variables
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

const isCloudflareConfigured = !!(CF_ACCOUNT_ID && CF_DATABASE_ID && CF_API_TOKEN);

// Ensure the local data directory exists for local fallback
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const LOCAL_DB_PATH = path.join(DATA_DIR, 'local_d1.json');

// Interface of database state for local emulation
interface LocalDBState {
  users: any[];
  subjects: any[];
  tasks: any[];
  review_results: any[];
  user_progress: any[];
}

// Load local DB
function loadLocalDB(): LocalDBState {
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading local DB, resetting:', e);
    }
  }
  const defaultState: LocalDBState = {
    users: [],
    subjects: [],
    tasks: [],
    review_results: [],
    user_progress: [],
  };
  saveLocalDB(defaultState);
  return defaultState;
}

// Save local DB
function saveLocalDB(state: LocalDBState) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing local DB:', e);
  }
}

// Set up cloud tables if Cloudflare is active
export async function initializeDatabase() {
  if (isCloudflareConfigured) {
    console.log('☁️ Cloudflare D1 integration active. Initializing database tables...');
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        password TEXT,
        avatar TEXT,
        created_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        color TEXT,
        icon TEXT,
        goal TEXT,
        created_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        subject_id TEXT,
        title TEXT,
        date TEXT,
        type TEXT,
        duration REAL,
        is_completed INTEGER,
        is_important INTEGER,
        assignment TEXT,
        pages TEXT,
        memo TEXT,
        start_time TEXT,
        notification_enabled INTEGER,
        created_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS review_results (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        subject_id TEXT,
        score INTEGER,
        total INTEGER,
        date TEXT,
        created_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS user_progress (
        user_id TEXT PRIMARY KEY,
        level INTEGER,
        xp INTEGER,
        streak INTEGER,
        last_active TEXT,
        reviews_completed_count INTEGER,
        is_member INTEGER,
        badges_json TEXT,
        unlocked_titles_json TEXT,
        active_title TEXT,
        articles_read_count INTEGER
      );`
    ];

    for (const ddl of tables) {
      await executeQueryOnD1(ddl);
    }

    // Try altering users table to add avatar column if it's an existing database
    try {
      await executeQueryOnD1("ALTER TABLE users ADD COLUMN avatar TEXT;");
      console.log('✅ Altered users table to ensure avatar column exists.');
    } catch (e) {
      // Column probably already exists, safe to ignore
    }

    console.log('✅ Cloudflare D1 tables successfully verified.');
  } else {
    console.log('🏠 Local DB active (fallback). No Cloudflare credentials found.');
    loadLocalDB();
  }
}

// Execute Query Helper for real D1 HTTP API
async function executeQueryOnD1(sql: string, params: any[] = []): Promise<any[]> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DATABASE_ID}/query`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`D1 HTTP Error ${res.status}: ${text}`);
    }

    const json: any = await res.json();
    if (!json.success) {
      throw new Error(`D1 API Error: ${JSON.stringify(json.errors)}`);
    }

    // Cloudflare D1 REST query returns array in result[0].results
    if (json.result && json.result[0]) {
      return json.result[0].results || [];
    }
    return [];
  } catch (error) {
    console.error('Error executing query on Cloudflare D1:', error);
    throw error;
  }
}

// Unified query wrapper supporting both real D1 and Local JSON
export async function executeQuery(sql: string, params: any[] = []): Promise<any[]> {
  if (isCloudflareConfigured) {
    return executeQueryOnD1(sql, params);
  }

  // Local emulation layer
  const db = loadLocalDB();
  const normalizedSql = sql.trim().replace(/\s+/g, ' ').toUpperCase();

  // 1. SELECT * FROM users WHERE id = ?
  if (normalizedSql.includes('SELECT * FROM USERS WHERE ID =')) {
    const userId = params[0];
    const user = db.users.find(u => u.id === userId);
    return user ? [user] : [];
  }

  // 2. INSERT INTO users (id, password, created_at) VALUES (?, ?, ?) or with avatar column
  if (normalizedSql.includes('INSERT INTO USERS')) {
    let id, password, avatar, created_at;
    if (params.length === 4) {
      [id, password, avatar, created_at] = params;
    } else {
      [id, password, created_at] = params;
      avatar = null;
    }
    // Remove duplicate
    db.users = db.users.filter(u => u.id !== id);
    db.users.push({ id, password, avatar, created_at });
    saveLocalDB(db);
    return [];
  }

  // 2b. UPDATE users SET avatar = ? WHERE id = ?
  if (normalizedSql.includes('UPDATE USERS SET AVATAR =')) {
    const [avatar, id] = params;
    const user = db.users.find(u => u.id === id);
    if (user) {
      user.avatar = avatar;
      saveLocalDB(db);
    }
    return [];
  }

  // 3. SELECT * FROM subjects WHERE user_id = ?
  if (normalizedSql.includes('SELECT * FROM SUBJECTS WHERE USER_ID =')) {
    const userId = params[0];
    return db.subjects.filter(s => s.user_id === userId);
  }

  // 4. SELECT * FROM tasks WHERE user_id = ?
  if (normalizedSql.includes('SELECT * FROM TASKS WHERE USER_ID =')) {
    const userId = params[0];
    return db.tasks.filter(t => t.user_id === userId);
  }

  // 5. SELECT * FROM review_results WHERE user_id = ?
  if (normalizedSql.includes('SELECT * FROM REVIEW_RESULTS WHERE USER_ID =')) {
    const userId = params[0];
    return db.review_results.filter(r => r.user_id === userId);
  }

  // 6. SELECT * FROM user_progress WHERE user_id = ?
  if (normalizedSql.includes('SELECT * FROM USER_PROGRESS WHERE USER_ID =')) {
    const userId = params[0];
    const prog = db.user_progress.find(p => p.user_id === userId);
    return prog ? [prog] : [];
  }

  // 7. Clear old subjects for user and insert new ones
  if (normalizedSql.includes('DELETE FROM SUBJECTS WHERE USER_ID =')) {
    const userId = params[0];
    db.subjects = db.subjects.filter(s => s.user_id !== userId);
    saveLocalDB(db);
    return [];
  }
  if (normalizedSql.includes('INSERT INTO SUBJECTS')) {
    const [id, user_id, name, color, icon, goal, created_at] = params;
    db.subjects.push({ id, user_id, name, color, icon, goal, created_at });
    saveLocalDB(db);
    return [];
  }

  // 8. Clear old tasks for user and insert new ones
  if (normalizedSql.includes('DELETE FROM TASKS WHERE USER_ID =')) {
    const userId = params[0];
    db.tasks = db.tasks.filter(t => t.user_id !== userId);
    saveLocalDB(db);
    return [];
  }
  if (normalizedSql.includes('INSERT INTO TASKS')) {
    const [
      id, user_id, subject_id, title, date, type, duration, 
      is_completed, is_important, assignment, pages, memo, 
      start_time, notification_enabled, created_at
    ] = params;
    db.tasks.push({
      id, user_id, subject_id, title, date, type, duration,
      is_completed, is_important, assignment, pages, memo,
      start_time, notification_enabled, created_at
    });
    saveLocalDB(db);
    return [];
  }

  // 9. Clear old review results for user and insert new ones
  if (normalizedSql.includes('DELETE FROM REVIEW_RESULTS WHERE USER_ID =')) {
    const userId = params[0];
    db.review_results = db.review_results.filter(r => r.user_id !== userId);
    saveLocalDB(db);
    return [];
  }
  if (normalizedSql.includes('INSERT INTO REVIEW_RESULTS')) {
    const [id, user_id, subject_id, score, total, date, created_at] = params;
    db.review_results.push({ id, user_id, subject_id, score, total, date, created_at });
    saveLocalDB(db);
    return [];
  }

  // 10. Replace/Update user progress
  if (normalizedSql.includes('INSERT OR REPLACE INTO USER_PROGRESS') || normalizedSql.includes('REPLACE INTO USER_PROGRESS')) {
    const [
      user_id, level, xp, streak, last_active, 
      reviews_completed_count, is_member, badges_json, 
      unlocked_titles_json, active_title, articles_read_count
    ] = params;
    db.user_progress = db.user_progress.filter(p => p.user_id !== user_id);
    db.user_progress.push({
      user_id, level, xp, streak, last_active,
      reviews_completed_count, is_member, badges_json,
      unlocked_titles_json, active_title, articles_read_count
    });
    saveLocalDB(db);
    return [];
  }

  console.warn('Unhandled SQL query in Local Fallback:', sql, params);
  return [];
}
