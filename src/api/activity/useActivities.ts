import { useCallback } from 'react';

import { type InfiniteData, type UseQueryResult } from '@tanstack/react-query';

import useActivityTimeline from '@api/activity/useActivityTimeline';

import type { Activity } from '@models/Activity';

const PAGE_SIZE = 5;

type ActivityPage = {
  activities: Activity[];
  nextCursor: string | undefined;
};

export default function useActivities(
  page: number,
): UseQueryResult<InfiniteData<ActivityPage>, Error> {
  const select = useCallback(
    (data: Activity[]) => {
      const paginatedData: InfiniteData<ActivityPage> = {
        pages: [],
        pageParams: [],
      };

      let i = 0;
      while (i < (page + 1) * PAGE_SIZE) {
        const pageActivities = data.slice(i, i + PAGE_SIZE);
        const nextCursor =
          i + PAGE_SIZE + 1 < data.length ? data[i + PAGE_SIZE + 1].id : undefined;

        paginatedData.pages.push({ activities: pageActivities, nextCursor });
        paginatedData.pageParams.push(nextCursor);
        i += PAGE_SIZE;
      }

      return paginatedData;
    },
    [page],
  );

  return useActivityTimeline<InfiniteData<ActivityPage>>(select);
}
