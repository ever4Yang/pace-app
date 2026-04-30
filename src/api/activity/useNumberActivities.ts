import { useCallback } from 'react';

import { type UseQueryResult } from '@tanstack/react-query';

import useActivityTimeline from '@api/activity/useActivityTimeline';

import type { Activity } from '@models/Activity';

export default function useNumberActivities(): UseQueryResult<number, Error> {
  const select = useCallback((data: Activity[]): number => data.length, []);

  return useActivityTimeline<number>(select);
}
