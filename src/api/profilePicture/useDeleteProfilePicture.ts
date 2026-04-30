import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { upsertProfilePicture } from '../../db';

import profilePictureKeys from './profilePictureKeys';

export default function useDeleteProfilePicture(): UseMutationResult<void, unknown, void, unknown> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: profilePictureKeys.delete(),
    mutationFn: () => {
      upsertProfilePicture(db, null);
      return Promise.resolve();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profilePictureKeys.details() });
      const previousProfilePicture = queryClient.getQueryData<string | null>(
        profilePictureKeys.details(),
      );
      queryClient.setQueryData(profilePictureKeys.details(), null);
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
