import buildSummary from './buildSummary';
import convertPaceInMilesPerHour from './convertPaceInMilesPerHour';
import convertPaceInMinutesPerKmToKmPerHour from './convertPaceInMinutesPerKmToKmPerHour';
import convertPaceInMinutesPerMiles from './convertPaceInMinutesPerMiles';
import convertPaceKmPerHourToMinutesPerKm from './convertPaceKmPerHourToMinutesPerKm';
import {
  formatCalories,
  formatDistance,
  formatDuration,
  formatElevation,
  formatPace,
  formatSpeed,
  formatStopwatchDuration,
} from './format';
import getBounds from './getBounds';
import getCalories from './getCalories';
import getCumulativeDistanceInMeters from './getCumulativeDistanceInMeters';
import getDistanceInKilometers, {
  computeDistanceBetweenPointsInMeters,
} from './getDistanceInKilometers';
import getDurationInSeconds from './getDurationInSeconds';
import getElevationGainInMeters from './getElevationGainInMeters';
import getElevationInMeters from './getElevationInMeters';
import getFilteredLocations from './getFilteredLocations';
import getLineCoordinatesFromSegments from './getLineCoordinatesFromSegments';
import getMovingDurationInSeconds from './getMovingDurationInSeconds';
import getPaceInMinutesPerKilometers from './getPaceInMinutesPerKilometers';
import getSpeedInKilometersPerHour from './getSpeedInKilometersPerHour';
import getSplits from './getSplitPace';
import getPaceHistogram from './histogram/getPaceHistogram';
import getSpeedHistogram from './histogram/getSpeedHistogram';
import {
  prepareDataHistogram,
  binarySearch as searchDistance,
  smoothHistogram,
} from './histogram/helpers';
import type { Histogram as HistogramImported } from './histogram/types';
import { Split as SplitActivity } from './types';
import updateSummary from './updateSummary';
import { convertKilogramsToPounds, convertPoundsToKilograms } from './utils';
import { getUnitLabels } from './useUnitLabels';
import type { DurationLabels, UnitLabels } from './useUnitLabels';

export {
  buildSummary,
  computeDistanceBetweenPointsInMeters,
  convertKilogramsToPounds,
  convertPaceInMilesPerHour,
  convertPaceInMinutesPerKmToKmPerHour,
  convertPaceInMinutesPerMiles,
  convertPaceKmPerHourToMinutesPerKm,
  convertPoundsToKilograms,
  formatCalories,
  formatDistance,
  formatDuration,
  formatStopwatchDuration,
  formatElevation,
  formatPace,
  formatSpeed,
  getBounds,
  getCalories,
  getCumulativeDistanceInMeters,
  getDistanceInKilometers,
  getDurationInSeconds,
  getElevationGainInMeters,
  getElevationInMeters,
  getFilteredLocations,
  getLineCoordinatesFromSegments,
  getMovingDurationInSeconds,
  getPaceHistogram,
  getPaceInMinutesPerKilometers,
  getSpeedInKilometersPerHour,
  getSpeedHistogram,
  getSplits,
  prepareDataHistogram,
  searchDistance,
  smoothHistogram,
  updateSummary,
  getUnitLabels,
};

export type Split = SplitActivity;
export type Histogram = HistogramImported;
export type { DurationLabels, UnitLabels };
