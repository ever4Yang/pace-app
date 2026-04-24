import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import { useSQLiteContext } from 'expo-sqlite';

import type { Activity, ActivityLocation, ActivitySummary } from '@models/Activity';

import { insertActivity, insertLocations } from '../../db';

import activitiesKeys from './activitiesKeys';

type Args = {
  summary: ActivitySummary;
  locations: ActivityLocation[];
  mapSnapshot: string;
  mapSnapshotDark: string;
};

async function writeMapSnapshot(activityId: string, theme: 'light' | 'dark', dataUri: string): Promise<void> {
  if (!dataUri) {
    return;
  }

  const dir = `${FileSystem.documentDirectory}maps/`;
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  const base64 = dataUri.replace(/^data:image\/\w+;base64,/, '');
  if (!base64) {
    return;
  }

  await FileSystem.writeAsStringAsync(`${dir}${activityId}_${theme}.jpg`, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export default function useCreateActivity(): UseMutationResult<Activity, unknown, Args, unknown> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: activitiesKeys.create(),
    mutationFn: async ({ summary, locations, mapSnapshot, mapSnapshotDark }: Args) => {
      const id = Crypto.randomUUID();
      const now = new Date().toISOString();

      insertActivity(db, {
        id,
        name: summary.name,
        type: summary.type,
        distance: summary.distance,
        duration: summary.duration,
        pace: summary.pace,
        calories: summary.calories,
        created_at: summary.createdAt || now,
        updated_at: summary.updatedAt || now,
      });

      if (locations.length > 0) {
        insertLocations(db, id, locations);
      }

      await writeMapSnapshot(id, 'light', mapSnapshot);
      await writeMapSnapshot(id, 'dark', mapSnapshotDark);

      return {
        id,
        userId: '',
        encryptionKey: '',
        mapFileLocation: '',
        summary,
        createdAt: summary.createdAt || now,
      };
    },
    onError: (error) => {
      console.error('[useCreateActivity] mutation failed:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activitiesKeys.timeline() });
    },
  });
}
