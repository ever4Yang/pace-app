import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { Preferences } from '@models/Preferences';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import { upsertPreferences } from '../../db';

import preferencesKeys from './preferencesKeys';

type Args = {
  measurement: DistanceMeasurementSystem;
};

export default function useUpdateDisplayPreferences(): UseMutationResult<
  void,
  unknown,
  Args,
  unknown
> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: preferencesKeys.updateDisplayPreferences(),
    mutationFn: ({ measurement }: Args) => {
      upsertPreferences(db, { measurement });
      return Promise.resolve();
    },
    onMutate: async ({ measurement }) => {
      await queryClient.cancelQueries({ queryKey: preferencesKeys.details() });
      const previousPreferences = queryClient.getQueryData<Preferences>(preferencesKeys.details());

      if (previousPreferences) {
        queryClient.setQueryData(preferencesKeys.details(), {
          ...previousPreferences,
          measurement,
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
