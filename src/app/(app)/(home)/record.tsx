import { type FC, useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

import { useIsFocused } from '@react-navigation/native';

import usePreferences from '@api/preferences/usePreferences';

import RecordUI from '@components/record/RecordUI';

import { type ActivityTaskState, ActivityType } from '@models/Activity';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActivityTask from '@tasks/ActivityTask';

const RecordScreen: FC = () => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [errorStarting, setErrorStarting] = useState(false);
  const [hasBatteryOptimization, setHasBatteryOptimization] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [activityState, setActivityState] = useState<ActivityTaskState>('notStarted');

  const router = useRouter();
  const isFocused = useIsFocused();

  const { data: preferencesData, isFetching: isFetchingPreferences } = usePreferences();

  const activityTask = ActivityTask.getInstance();

  const askPermissions = useCallback(async (): Promise<void> => {
    if (activityState !== 'notStarted') {
      return;
    }

    const foregroundPermissions = await Location.requestForegroundPermissionsAsync();
    if (!foregroundPermissions.granted) {
      setHasPermission(false);
      return;
    }

    const backgroundPermissions = await Location.requestBackgroundPermissionsAsync();
    setHasPermission(backgroundPermissions.granted);
  }, [activityState]);

  const checkPermissionsAndBattery = useCallback(async (): Promise<void> => {
    if (!isFocused) {
      return;
    }

    await askPermissions();
    try {
      const batteryAvailable = await Battery.isAvailableAsync();
      if (!batteryAvailable) {
        return;
      }

      const isOptimizationEnabled = await Battery.isLowPowerModeEnabledAsync();
      setHasBatteryOptimization(isOptimizationEnabled);
    } catch {
      setHasBatteryOptimization(true);
    }
  }, [askPermissions, isFocused]);

  const onAppStateChanged = useCallback(
    async (appState: AppStateStatus): Promise<void> => {
      if (appState !== 'active' || !isFocused || hasPermission) {
        return;
      }

      setErrorStarting(false);
      if (activityState !== 'notStarted') {
        return;
      }

      askPermissions();
    },
    [activityState, askPermissions, hasPermission, isFocused],
  );

  const onStartActivity = async (): Promise<void> => {
    try {
      const isRecording = await activityTask.isRecording();
      if (isRecording) {
        await activityTask.stopRecording();
      }

      activityTask.reset();
      await activityTask.startRecording(activityType as ActivityType);
      setActivityState('recording');
    } catch {
      setErrorStarting(true);
    }
  };

  const onPauseActivity = async (): Promise<void> => {
    await activityTask.stopRecording();

    const hasRecorded = activityTask.locations.length > 0;
    setActivityState(hasRecorded ? 'paused' : 'notStarted');
  };

  const onResumeActivity = async (): Promise<void> => {
    await activityTask.resumeRecording(activityType as ActivityType);
    setActivityState('recording');
  };

  const onStopActivity = async (): Promise<void> => {
    await activityTask.stopRecording();

    const hasRecorded = activityTask.locations.length > 0;
    setActivityState(hasRecorded ? 'stopped' : 'notStarted');
    if (hasRecorded) {
      router.push({ pathname: `/activity/save`, params: { activityType } });
    }
  };

  useEffect(() => {
    const changeSubscription = AppState.addEventListener('change', onAppStateChanged);

    return () => {
      changeSubscription.remove();
    };
  }, [onAppStateChanged]);

  useEffect(() => {
    (async () => {
      await checkPermissionsAndBattery();
    })();
  }, [checkPermissionsAndBattery]);

  useEffect(() => {
    if (isFetchingPreferences) {
      return;
    }

    setActivityType(preferencesData?.defaultActivityType || ActivityType.RUNNING);
  }, [isFetchingPreferences, preferencesData?.defaultActivityType]);

  useEffect(() => {
    if (!isFocused || activityState === 'notStarted') {
      return;
    }

    // If the task was reset externally (e.g. after saving), sync UI state back to idle
    if (activityTask.startTimestamp === 0) {
      setActivityState('notStarted');
    }
    // activityTask.startTimestamp is a non-reactive singleton property; intentionally runs on focus change only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <RecordUI
      activityType={activityType || ActivityType.RUNNING}
      activityState={activityState}
      hasPermission={hasPermission}
      errorStarting={errorStarting}
      hasBatteryOptimization={hasBatteryOptimization}
      distanceMeasurementSystem={preferencesData?.measurement || DistanceMeasurementSystem.METRIC}
      onChangeActivityType={setActivityType}
      onStartActivity={onStartActivity}
      onPauseActivity={onPauseActivity}
      onResumeActivity={onResumeActivity}
      onStopActivity={onStopActivity}
    />
  );
};

export default RecordScreen;
