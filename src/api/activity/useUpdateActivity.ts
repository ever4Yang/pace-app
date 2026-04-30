import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { Activity, ActivitySummary } from '@models/Activity';

import { updateActivity } from '../../db';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string;
  summary: ActivitySummary;
};

export default function useUpdateActivity(): UseMutationResult<void, unknown, Args, unknown> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: activitiesKeys.update(),
    mutationFn: ({ activityId, summary }: Args) => {
      updateActivity(db, activityId, {
        name: summary.name,
        type: summary.type,
        distance: summary.distance,
        duration: summary.duration,
        pace: summary.pace,
        calories: summary.calories,
        updated_at: new Date().toISOString(),
      });
      return Promise.resolve();
    },
    onMutate: async ({ activityId, summary }) => {
      await queryClient.cancelQueries({ queryKey: activitiesKeys.timeline() });
      const previousActivities = queryClient.getQueryData<Activity[]>(activitiesKeys.timeline());

      queryClient.setQueryData(
        activitiesKeys.timeline(),
        (previousActivities ?? []).map((activity) => {
          if (activity.id !== activityId) return activity;
          return { ...activity, summary: { ...activity.summary, ...summary } };
        }),
      );

      return { previousActivities };
    },
    onError: (_, __, context) => {
      if (!context) return;
      queryClient.setQueryData(activitiesKeys.timeline(), context.previousActivities);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activitiesKeys.timeline() });
    },
  });
}
