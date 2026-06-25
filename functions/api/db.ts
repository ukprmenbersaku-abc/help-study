export async function ensureTables(db: any) {
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

  for (const query of tables) {
    await db.prepare(query).run();
  }

  // Alter users table to add avatar column if it's an existing database but column is missing
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN avatar TEXT;").run();
  } catch (e) {
    // Column already exists, which is expected on subsequent runs
  }
}
