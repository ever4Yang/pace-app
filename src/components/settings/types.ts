import { ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

export type ChangeDisplayPreferencesData = {
  unit: DistanceMeasurementSystem;
};

export type ChangeDefaultActivityTypeData = {
  defaultActivityType: ActivityType;
};
