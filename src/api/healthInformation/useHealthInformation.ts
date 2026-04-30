import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import type { HealthInformation } from '@models/HealthInformation';

import { getHealthInformation } from '../../db';

import healthInformationKeys from './healthInformationKeys';

export default function useHealthInformation(): UseQueryResult<HealthInformation | null, Error> {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: healthInformationKeys.details(),
    queryFn: () => getHealthInformation(db),
  });
}
