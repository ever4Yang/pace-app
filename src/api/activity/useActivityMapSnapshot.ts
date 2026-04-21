import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string | undefined;
  mapSnapshotTheme: 'light' | 'dark';
};

export default function useActivityMapSnapshot({
  activityId,
  mapSnapshotTheme,
}: Args): UseQueryResult<{ mapSnapshot: string | null }, Error> {
  return useQuery({
    queryKey: activitiesKeys.mapSnapshot(activityId, mapSnapshotTheme),
    queryFn: async () => {
      if (!activityId) {
        return { mapSnapshot: null };
      }

      const path = `${FileSystem.documentDirectory}maps/${activityId}_${mapSnapshotTheme}.jpg`;
      const info = await FileSystem.getInfoAsync(path);

      if (!info.exists) {
        return { mapSnapshot: null };
      }

      const data = await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return { mapSnapshot: `data:image/jpeg;base64,${data}` };
    },
    enabled: Boolean(activityId && mapSnapshotTheme),
  });
}
