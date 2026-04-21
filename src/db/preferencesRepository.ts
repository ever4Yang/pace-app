import type { SQLiteDatabase } from 'expo-sqlite';

import type { Preferences } from '@models/Preferences';
import { DistanceMeasurementSystem } from '@models/UnitSystem';
import { ActivityType } from '@models/Activity';

type PreferencesRow = {
  id: string;
  measurement: string;
  default_activity_type: string;
  language: string;
};

export function getPreferences(db: SQLiteDatabase): Preferences {
  const row = db.getFirstSync<PreferencesRow>('SELECT * FROM preferences WHERE id = ?', 'default');

  return {
    id: 'default',
    measurement: (row?.measurement ?? 'metric') as DistanceMeasurementSystem,
    defaultActivityType: (row?.default_activity_type ?? ActivityType.RUNNING) as ActivityType,
    language: row?.language ?? 'en',
  };
}

export function upsertPreferences(
  db: SQLiteDatabase,
  fields: {
    measurement?: DistanceMeasurementSystem;
    default_activity_type?: ActivityType;
    language?: string;
  },
): void {
  if (fields.measurement !== undefined) {
    db.runSync(
      'UPDATE preferences SET measurement = ? WHERE id = ?',
      fields.measurement,
      'default',
    );
  }

  if (fields.default_activity_type !== undefined) {
    db.runSync(
      'UPDATE preferences SET default_activity_type = ? WHERE id = ?',
      fields.default_activity_type,
      'default',
    );
  }

  if (fields.language !== undefined) {
    db.runSync(
      'UPDATE preferences SET language = ? WHERE id = ?',
      fields.language,
      'default',
    );
  }
}
