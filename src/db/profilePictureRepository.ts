import type { SQLiteDatabase } from 'expo-sqlite';

type ProfilePictureRow = {
  id: string;
  data: string | null;
};

export function getProfilePicture(db: SQLiteDatabase): string | null {
  const row = db.getFirstSync<ProfilePictureRow>(
    'SELECT data FROM profile_picture WHERE id = ?',
    'default',
  );
  return row?.data ?? null;
}

export function upsertProfilePicture(db: SQLiteDatabase, data: string | null): void {
  db.runSync('UPDATE profile_picture SET data = ? WHERE id = ?', data, 'default');
}
