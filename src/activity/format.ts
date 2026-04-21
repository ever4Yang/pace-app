import { DistanceMeasurementSystem } from '../models/UnitSystem';
import convertPaceInMilesPerHour from './convertPaceInMilesPerHour';

export function formatDistance(
  distanceInKilometers: number,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideDecimals?: boolean,
  unitLabel?: string,
): string {
  const distance =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? distanceInKilometers
      : distanceInKilometers * 0.621371;

  const roundedDistance = hideDecimals ? Math.round(distance) : Math.round(distance * 100) / 100;

  const unit =
    unitLabel ??
    (distanceMeasurementSystem === DistanceMeasurementSystem.METRIC ? 'km' : 'mi');

  return `${roundedDistance}${unit}`;
}

export function formatDuration(
  durationInSeconds: number,
  hideSeconds?: boolean,
  unitH?: string,
  unitMin?: string,
  unitSec?: string,
): string {
  'worklet';
  const hours = Math.trunc(durationInSeconds / 3600);
  const minutes = Math.trunc((durationInSeconds - hours * 3600) / 60);
  const seconds = Math.trunc(durationInSeconds - hours * 3600 - minutes * 60);

  const h = unitH ?? 'h';
  const m = unitMin ?? 'min';
  const s = unitSec ?? 'sec';

  const hoursMinutes = `${hours}${h} ${minutes}${m}`;
  if (hideSeconds) {
    return hoursMinutes;
  }

  return `${hoursMinutes} ${seconds}${s}`;
}

export function formatStopwatchDuration(durationInSeconds: number): string {
  const hours = Math.trunc(durationInSeconds / 3600);
  const minutes = Math.trunc((durationInSeconds - hours * 3600) / 60);
  const seconds = Math.trunc(durationInSeconds - hours * 3600 - minutes * 60);

  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`;
}

export function formatElevation(
  elevationInMeters: number | undefined,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideUnit?: boolean,
  unitLabel?: string,
): string {
  'worklet';

  if (typeof elevationInMeters === 'undefined') {
    return '';
  }

  const { elevation, unit } =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? { elevation: elevationInMeters, unit: unitLabel ?? 'm' }
      : { elevation: elevationInMeters * 3.28084, unit: unitLabel ?? 'ft' };

  const roundedElevation = Math.round(elevation);
  return `${roundedElevation}${hideUnit ? '' : unit}`;
}

export function formatPace(
  paceInMinutesPerKilometers: number | undefined,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideUnit?: boolean,
  unitLabel?: string,
): string {
  'worklet';

  if (typeof paceInMinutesPerKilometers === 'undefined') {
    return '';
  }

  const { pace, unit } =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? { pace: paceInMinutesPerKilometers, unit: unitLabel ?? 'min/km' }
      : { pace: paceInMinutesPerKilometers, unit: unitLabel ?? 'min/mi' };

  const roundedPace = Math.round(pace * 100) / 100;
  return `${roundedPace.toFixed(2).replace('.', ':')}${hideUnit ? '' : unit}`;
}

export function formatSpeed(
  speedInKilometerPerHour: number | undefined,
  distanceMeasurementSystem: DistanceMeasurementSystem,
  hideUnit?: boolean,
  unitLabel?: string,
): string {
  'worklet';

  if (typeof speedInKilometerPerHour === 'undefined') {
    return '';
  }

  const { speed, unit } =
    distanceMeasurementSystem === DistanceMeasurementSystem.METRIC
      ? { speed: speedInKilometerPerHour, unit: unitLabel ?? 'km/h' }
      : { speed: convertPaceInMilesPerHour(speedInKilometerPerHour), unit: unitLabel ?? 'mph' };

  const roundedSpeed = Math.round(speed * 10) / 10;
  return `${roundedSpeed.toFixed(1)}${hideUnit ? '' : unit}`;
}

export function formatCalories(calories: number, unitLabel?: string): string {
  return `${Math.round(calories)}${unitLabel ?? 'kcal'}`;
}
