import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { ActivityLocation } from '@models/Activity';

import { getLocationsByActivityId } from '../../db';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string | undefined;
};

export default function useActivityLocations({
  activityId,
}: Args): UseQueryResult<{ locations: ActivityLocation[] }, Error> {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: activitiesKeys.locations(activityId),
    queryFn: () => ({ locations: getLocationsByActivityId(db, activityId!) }),
    enabled: Boolean(activityId),
  });
}
