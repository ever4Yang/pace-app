import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { Preferences } from '@models/Preferences';

import { upsertPreferences } from '../../db';

import preferencesKeys from './preferencesKeys';

type Args = {
  language: string;
};

export default function useUpdateLanguage(): UseMutationResult<void, unknown, Args, unknown> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: preferencesKeys.updateLanguage(),
    mutationFn: ({ language }: Args) => {
      upsertPreferences(db, { language });
      return Promise.resolve();
    },
    onMutate: async ({ language }) => {
      await queryClient.cancelQueries({ queryKey: preferencesKeys.details() });
      const previousPreferences = queryClient.getQueryData<Preferences>(preferencesKeys.details());

      if (previousPreferences) {
        queryClient.setQueryData(preferencesKeys.details(), {
          ...previousPreferences,
          language,
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
