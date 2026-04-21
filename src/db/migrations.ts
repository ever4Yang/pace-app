import type { SQLiteDatabase } from 'expo-sqlite';

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS activities (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      type        TEXT NOT NULL,
      distance    REAL NOT NULL,
      duration    REAL NOT NULL,
      pace        REAL NOT NULL,
      calories    REAL,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS locations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
      latitude    REAL NOT NULL,
      longitude   REAL NOT NULL,
      altitude    REAL NOT NULL,
      timestamp   INTEGER NOT NULL,
      segment     INTEGER
    );

    CREATE TABLE IF NOT EXISTS preferences (
      id                    TEXT PRIMARY KEY DEFAULT 'default',
      measurement           TEXT NOT NULL DEFAULT 'metric',
      default_activity_type TEXT NOT NULL DEFAULT 'RUNNING'
    );
    INSERT OR IGNORE INTO preferences (id) VALUES ('default');

    CREATE TABLE IF NOT EXISTS health_information (
      id         TEXT PRIMARY KEY DEFAULT 'default',
      gender     TEXT,
      birth_date TEXT,
      weight     REAL
    );
    INSERT OR IGNORE INTO health_information (id) VALUES ('default');

    CREATE TABLE IF NOT EXISTS profile_picture (
      id   TEXT PRIMARY KEY DEFAULT 'default',
      data TEXT
    );
    INSERT OR IGNORE INTO profile_picture (id) VALUES ('default');
  `);

  // Migration: add language column to preferences
  const prefCols = db.getAllSync<{ name: string }>('PRAGMA table_info(preferences)');
  if (!prefCols.some((c) => c.name === 'language')) {
    db.runSync(`ALTER TABLE preferences ADD COLUMN language TEXT NOT NULL DEFAULT 'en'`);
  }
}
