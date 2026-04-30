import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { Activity } from '@models/Activity';

import { getAllActivities } from '../../db';

import activitiesKeys from './activitiesKeys';

export type ActivityTimelineData = {
  activities: Activity[];
  nextCursor: string | undefined;
};

export default function useActivityTimeline<T = Activity[]>(
  select?: (data: Activity[]) => T,
): UseQueryResult<T, Error> {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: activitiesKeys.timeline(),
    queryFn: () => getAllActivities(db),
    select,
  });
}
