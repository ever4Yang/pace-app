import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { upsertProfilePicture } from '../../db';

import profilePictureKeys from './profilePictureKeys';

type Args = {
  profilePicture: string;
};

export default function useUpdateProfilePicture(): UseMutationResult<void, unknown, Args, unknown> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profilePictureKeys.update(),
    mutationFn: ({ profilePicture }: Args) => {
      upsertProfilePicture(db, profilePicture);
      return Promise.resolve();
    },
    onMutate: async ({ profilePicture }) => {
      await queryClient.cancelQueries({ queryKey: profilePictureKeys.details() });
      const previousProfilePicture = queryClient.getQueryData<string | null>(
        profilePictureKeys.details(),
      );
      queryClient.setQueryData(profilePictureKeys.details(), profilePicture);
      return { previousProfilePicture };
    },
    onError: (_, __, context) => {
      if (!context) return;
      queryClient.setQueryData(profilePictureKeys.details(), context.previousProfilePicture);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profilePictureKeys.details() });
    },
  });
}
