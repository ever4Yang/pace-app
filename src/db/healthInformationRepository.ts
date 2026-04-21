import type { SQLiteDatabase } from 'expo-sqlite';

import type { HealthInformation } from '@models/HealthInformation';

type HealthInformationRow = {
  id: string;
  gender: string | null;
  birth_date: string | null;
  weight: number | null;
};

export function getHealthInformation(db: SQLiteDatabase): HealthInformation | null {
  const row = db.getFirstSync<HealthInformationRow>(
    'SELECT * FROM health_information WHERE id = ?',
    'default',
  );

  if (!row || !row.gender || !row.birth_date || !row.weight) {
    return null;
  }

  return {
    gender: row.gender as HealthInformation['gender'],
    birthDate: row.birth_date,
    weight: row.weight,
  };
}

export function upsertHealthInformation(
  db: SQLiteDatabase,
  data: HealthInformation,
): void {
  db.runSync(
    'UPDATE health_information SET gender = ?, birth_date = ?, weight = ? WHERE id = ?',
    data.gender,
    data.birthDate,
    data.weight,
    'default',
  );
}
