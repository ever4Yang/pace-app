import { useCallback } from 'react';

import { type UseQueryResult } from '@tanstack/react-query';

import useActivityTimeline from '@api/activity/useActivityTimeline';

import type { Activity } from '@models/Activity';

export default function useActivity(
  id: string | undefined,
): UseQueryResult<Activity | undefined, Error> {
  const select = useCallback(
    (data: Activity[]): Activity | undefined => {
      if (!id) {
        return undefined;
      }
      return data.find(({ id: activityId }) => activityId === id);
    },
    [id],
  );

  return useActivityTimeline<Activity | undefined>(select);
}
