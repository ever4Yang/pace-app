import { DistanceMeasurementSystem } from '../models/UnitSystem';
import i18n from '../translations/i18n';

export type DurationLabels = { h: string; min: string; sec: string };
export type UnitLabels = {
  distance: string;
  distanceLong: string;
  durationLabels: DurationLabels;
  pace: string;
  speed: string;
  elevation: string;
  calories: string;
};

export function getUnitLabels(
  distanceMeasurementSystem: DistanceMeasurementSystem,
): UnitLabels {
  const isMetric = distanceMeasurementSystem === DistanceMeasurementSystem.METRIC;
  return {
    distance: i18n.t(isMetric ? 'units.km' : 'units.mi'),
    distanceLong: i18n.t(isMetric ? 'units.km' : 'units.mi'),
    durationLabels: {
      h: i18n.t('units.h'),
      min: i18n.t('units.min'),
      sec: i18n.t('units.sec'),
    },
    pace: i18n.t(isMetric ? 'units.minPerKm' : 'units.minPerMi'),
    speed: i18n.t(isMetric ? 'units.kmPerH' : 'units.mph'),
    elevation: i18n.t(isMetric ? 'units.m' : 'units.ft'),
    calories: i18n.t('units.kcal'),
  };
}
