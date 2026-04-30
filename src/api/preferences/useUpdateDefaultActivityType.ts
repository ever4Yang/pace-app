import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { ActivityType } from '@models/Activity';
import type { Preferences } from '@models/Preferences';

import { upsertPreferences } from '../../db';

import preferencesKeys from './preferencesKeys';

type Args = {
  defaultActivityType: ActivityType;
};

export default function useUpdateDefaultActivityType(): UseMutationResult<
  void,
  unknown,
  Args,
  unknown
> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: preferencesKeys.updateDefaultActivityType(),
    mutationFn: ({ defaultActivityType }: Args) => {
      upsertPreferences(db, { default_activity_type: defaultActivityType });
      return Promise.resolve();
    },
    onMutate: async ({ defaultActivityType }) => {
      await queryClient.cancelQueries({ queryKey: preferencesKeys.details() });
      const previousPreferences = queryClient.getQueryData<Preferences>(preferencesKeys.details());

      if (previousPreferences) {
        queryClient.setQueryData(preferencesKeys.details(), {
          ...previousPreferences,
          defaultActivityType,
        });
      }

      return { previousPreferences };
    },
    onError: (_, __, context) => {
      if (!context) return;
      queryClient.setQueryData(preferencesKeys.details(), context.previousPreferences);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: preferencesKeys.details() });
    },
  });
}
