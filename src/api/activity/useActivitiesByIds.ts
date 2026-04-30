import { useCallback } from 'react';

import { type UseQueryResult } from '@tanstack/react-query';

import useActivityTimeline from '@api/activity/useActivityTimeline';

import type { Activity } from '@models/Activity';

export default function useActivitiesByIds(
  activitiesIds: string[],
): UseQueryResult<Activity[], Error> {
  const select = useCallback(
    (data: Activity[]): Activity[] => {
      return data.filter(({ id }) => activitiesIds.includes(id));
    },
    [activitiesIds],
  );

  return useActivityTimeline<Activity[]>(select);
}
