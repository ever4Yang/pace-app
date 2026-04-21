import type { SQLiteDatabase } from 'expo-sqlite';

import type { Activity, ActivityLocation, ActivitySummary, ActivityType } from '@models/Activity';

type ActivityRow = {
  id: string;
  name: string;
  type: string;
  distance: number;
  duration: number;
  pace: number;
  calories: number | null;
  created_at: string;
  updated_at: string;
};

type LocationRow = {
  id: number;
  activity_id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
  segment: number | null;
};

function rowToActivity(row: ActivityRow): Activity {
  const summary: ActivitySummary = {
    name: row.name,
    type: row.type as ActivityType,
    distance: row.distance,
    duration: row.duration,
    pace: row.pace,
    calories: row.calories ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return {
    id: row.id,
    userId: '',
    encryptionKey: '',
    mapFileLocation: '',
    summary,
    createdAt: row.created_at,
  };
}

export function insertActivity(
  db: SQLiteDatabase,
  activity: {
    id: string;
    name: string;
    type: string;
    distance: number;
    duration: number;
    pace: number;
    calories?: number;
    created_at: string;
    updated_at: string;
  },
): void {
  db.runSync(
    `INSERT INTO activities (id, name, type, distance, duration, pace, calories, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    activity.id,
    activity.name,
    activity.type,
    activity.distance,
    activity.duration,
    activity.pace,
    activity.calories ?? null,
    activity.created_at,
    activity.updated_at,
  );
}

export function updateActivity(
  db: SQLiteDatabase,
  id: string,
  fields: {
    name?: string;
    type?: string;
    distance?: number;
    duration?: number;
    pace?: number;
    calories?: number;
    updated_at?: string;
  },
): void {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return;

  const setClauses = entries.map(([k]) => `${k} = ?`).join(', ');
  const values = entries.map(([, v]) => v);

  db.runSync(`UPDATE activities SET ${setClauses} WHERE id = ?`, ...values, id);
}

export function deleteActivity(db: SQLiteDatabase, id: string): void {
  db.runSync('DELETE FROM activities WHERE id = ?', id);
}

export function getAllActivities(db: SQLiteDatabase): Activity[] {
  const rows = db.getAllSync<ActivityRow>(
    'SELECT * FROM activities ORDER BY created_at DESC',
  );
  return rows.map(rowToActivity);
}

export function getActivityById(db: SQLiteDatabase, id: string): Activity | null {
  const row = db.getFirstSync<ActivityRow>('SELECT * FROM activities WHERE id = ?', id);
  return row ? rowToActivity(row) : null;
}

export function getOldestActivityDate(db: SQLiteDatabase): string | null {
  const row = db.getFirstSync<{ created_at: string }>(
    'SELECT created_at FROM activities ORDER BY created_at ASC LIMIT 1',
  );
  return row?.created_at ?? null;
}

export function insertLocations(
  db: SQLiteDatabase,
  activityId: string,
  locations: ActivityLocation[],
): void {
  db.withTransactionSync(() => {
    for (const loc of locations) {
      db.runSync(
        `INSERT INTO locations (activity_id, latitude, longitude, altitude, timestamp, segment)
         VALUES (?, ?, ?, ?, ?, ?)`,
        activityId,
        loc.latitude,
        loc.longitude,
        loc.altitude,
        loc.timestamp,
        loc.segment ?? null,
      );
    }
  });
}

export function getLocationsByActivityId(
  db: SQLiteDatabase,
  activityId: string,
): ActivityLocation[] {
  const rows = db.getAllSync<LocationRow>(
    'SELECT * FROM locations WHERE activity_id = ? ORDER BY timestamp ASC',
    activityId,
  );

  return rows.map((row) => ({
    latitude: row.latitude,
    longitude: row.longitude,
    altitude: row.altitude,
    timestamp: row.timestamp,
    segment: row.segment ?? undefined,
  }));
}
