import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { convertPoundsToKilograms } from '@activity';

import type { HealthInformation } from '@models/HealthInformation';
import type { Preferences } from '@models/Preferences';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import { upsertHealthInformation } from '../../db';

import healthInformationKeys from './healthInformationKeys';

type Args = {
  healthInformation: HealthInformation;
  preferences: Preferences | undefined;
};

export default function useUpdateHealthInformation(): UseMutationResult<
  void,
  unknown,
  Args,
  unknown
> {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: healthInformationKeys.update(),
    mutationFn: ({ healthInformation, preferences }: Args) => {
      const normalizedWeight =
        preferences?.measurement === DistanceMeasurementSystem.IMPERIAL
          ? convertPoundsToKilograms(healthInformation.weight)
          : healthInformation.weight;

      upsertHealthInformation(db, { ...healthInformation, weight: normalizedWeight });
      return Promise.resolve();
    },
    onMutate: async ({ healthInformation, preferences }) => {
      await queryClient.cancelQueries({ queryKey: healthInformationKeys.details() });
      const previousHealthInformation = queryClient.getQueryData<HealthInformation | null>(
        healthInformationKeys.details(),
      );

      const normalizedWeight =
        preferences?.measurement === DistanceMeasurementSystem.IMPERIAL
          ? convertPoundsToKilograms(healthInformation.weight)
          : healthInformation.weight;

      queryClient.setQueryData(healthInformationKeys.details(), {
        ...healthInformation,
        weight: normalizedWeight,
      });

      return { previousHealthInformation };
    },
    onError: (_, __, context) => {
      if (!context) return;
      queryClient.setQueryData(healthInformationKeys.details(), context.previousHealthInformation);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: healthInformationKeys.details() });
    },
  });
}
