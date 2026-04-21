import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { getProfilePicture } from '../../db';

import profilePictureKeys from './profilePictureKeys';

export default function useProfilePicture(): UseQueryResult<string | null, Error> {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: profilePictureKeys.details(),
    queryFn: () => getProfilePicture(db),
  });
}
