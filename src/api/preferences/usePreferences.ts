import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { Preferences } from '@models/Preferences';

import { getPreferences } from '../../db';

import preferencesKeys from './preferencesKeys';

export default function usePreferences(): UseQueryResult<Preferences, Error> {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: preferencesKeys.details(),
    queryFn: () => getPreferences(db),
  });
}
