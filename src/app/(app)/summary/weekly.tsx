import React, { type FC, useCallback, useMemo, useState } from 'react';

import {
  differenceInCalendarWeeks,
  endOfWeek,
  startOfDay,
  startOfWeek,
  subMinutes,
  subWeeks,
} from 'date-fns';
import { useSQLiteContext } from 'expo-sqlite';

import useActivitiesByIds from '@api/activity/useActivitiesByIds';
import useActivityTimeline from '@api/activity/useActivityTimeline';
import usePreferences from '@api/preferences/usePreferences';

import SummaryUI from '@components/summary/SummaryUI';

import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { getOldestActivityDate } from '../../../db';

const WeeklySummaryScreen: FC = () => {
  const [activityIds, setActivityIds] = useState<string[]>([]);
  const db = useSQLiteContext();

  const { data: preferencesData } = usePreferences();
  const { data: activityTimelineData } = useActivityTimeline();
  const { data: activitiesData } = useActivitiesByIds(activityIds);

  const today = useMemo(() => {
    const date = new Date();
    return subMinutes(startOfDay(date), date.getTimezoneOffset());
  }, []);

  const createdAt = useMemo(() => {
    const oldest = getOldestActivityDate(db);
    return oldest ? new Date(oldest) : new Date(today.getFullYear(), 0, 1);
  }, [db, today]);

  const weeksSinceJoined = useMemo(() => {
    let startWeekDate = subMinutes(
      startOfWeek(today, { weekStartsOn: 1 }),
      today.getTimezoneOffset(),
    );

    const weeks = [];
    while (differenceInCalendarWeeks(startWeekDate, createdAt) >= 0) {
      const lastWeekDate = endOfWeek(startWeekDate, { weekStartsOn: 1 });
      weeks.push({ start: startWeekDate, end: lastWeekDate });
      startWeekDate = subWeeks(startWeekDate, 1);
    }

    return weeks;
  }, [today, createdAt]);

  const onLoadWeekActivities = useCallback(
    async (startDate: Date | undefined, endDate: Date | undefined): Promise<void> => {
      if (!startDate || !endDate || !activityTimelineData) {
        return;
      }

      const activityIdsToLoad = activityTimelineData
        .filter(({ createdAt: activityCreatedAt }) => {
          const createdAtDate = new Date(activityCreatedAt);
          return createdAtDate >= startDate && createdAtDate <= endDate;
        })
        .map(({ id }) => id);

      setActivityIds(activityIdsToLoad);
    },
    [activityTimelineData],
  );

  return (
    <SummaryUI
      today={today}
      timePeriods={weeksSinceJoined}
      activities={activitiesData}
      period="week"
      distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
      onLoadTimePeriodActivities={onLoadWeekActivities}
    />
  );
};

export default WeeklySummaryScreen;
