import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import { useSQLiteContext } from 'expo-sqlite';

import { deleteActivity } from '../../db';

import activitiesKeys from './activitiesKeys';

type Args = {
  activityId: string;
};

export default function useDeleteActivity(): UseMutationResult<void, unknown, Args, unknown> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: activitiesKeys.delete(),
    mutationFn: async ({ activityId }: Args) => {
      deleteActivity(db, activityId);

      const dir = `${FileSystem.documentDirectory}maps/`;
      await FileSystem.deleteAsync(`${dir}${activityId}_light.jpg`, { idempotent: true });
      await FileSystem.deleteAsync(`${dir}${activityId}_dark.jpg`, { idempotent: true });
    },
    onMutate: async ({ activityId }) => {
      await queryClient.cancelQueries({ queryKey: activitiesKeys.timeline() });
      const previousActivities = queryClient.getQueryData<Activity[]>(activitiesKeys.timeline());

      queryClient.setQueryData(
        activitiesKeys.timeline(),
        (previousActivities ?? []).filter(({ id }) => id !== activityId),
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

// local type for optimistic update context
type Activity = { id: string };
