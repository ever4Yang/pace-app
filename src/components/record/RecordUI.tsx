import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import type { LocationObject } from 'expo-location';
import { useRouter } from 'expo-router';

import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  type TrackUserLocation,
  type TrackUserLocationChangeEvent,
  UserLocation,
} from '@maplibre/maplibre-react-native';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { useLocale } from '@translations/LocaleProvider';

import ActivityTypeBottomSheet from '@components/common/activity/ActivityTypeBottomSheet';

import { type ActivityTaskState, ActivityType } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import ActivityTask, { ActivityListener } from '@tasks/ActivityTask';

import useLocalizedMapStyle from '@utils/useLocalizedMapStyle';

import { MAPTILER_URL_DARK, MAPTILER_URL_LIGHT } from '../../consts';
import ActivityRunning from './ActivityRunning';
import ActivityStart from './ActivityStart';
import AskPermissions from './AskPermissions';
import BackButton from './BackButton';
import BatteryModeWarningModal from './BatteryModeWarningModal';
import PermissionsLoading from './PermissionsLoading';
import RecenterMapButton from './RecenterMapButton';

const Wrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const StyledMapView = styled(Map)`
  flex: 1;

  width: 100%;
`;

type Props = {
  activityType: ActivityType;
  hasPermission: boolean | null;
  errorStarting: boolean;
  hasBatteryOptimization: boolean;
  activityState: ActivityTaskState;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onChangeActivityType: (activityType: ActivityType) => void;
  onStartActivity: () => Promise<void>;
  onPauseActivity: () => Promise<void>;
  onResumeActivity: () => Promise<void>;
  onStopActivity: () => Promise<void>;
};

const RecordUI: FC<Props> = ({
  activityType,
  hasPermission,
  errorStarting,
  hasBatteryOptimization,
  activityState,
  distanceMeasurementSystem,
  onChangeActivityType,
  onStartActivity,
  onPauseActivity,
  onResumeActivity,
  onStopActivity,
}) => {
  const activityTypeBottomSheetRef = useRef<BottomSheetModal>(null);

  const [batteryOptimizationModalOpen, setBatteryOptimizationModalOpen] =
    useState(hasBatteryOptimization);
  const [mapReady, setMapReady] = useState(Platform.OS === 'ios');
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [trackUserLocation, setTrackUserLocation] = useState<TrackUserLocation | undefined>(
    'course',
  );

  const router = useRouter();
  const theme = useTheme();
  const { locale } = useLocale();
  const styleURL = useLocalizedMapStyle(
    theme.dark ? MAPTILER_URL_DARK : MAPTILER_URL_LIGHT,
    locale,
  );

  const onRecenterMap = useCallback((): void => {
    setTrackUserLocation('course');
  }, []);

  const onMapFullyRendered = useCallback((): void => {
    setMapReady(true);
    onRecenterMap();
  }, [onRecenterMap]);

  const onTrackUserLocationChange = useCallback(
    (event: { nativeEvent: TrackUserLocationChangeEvent }): void => {
      const mode = event.nativeEvent.trackUserLocation ?? undefined;
      setTrackUserLocation(mode);
    },
    [],
  );

  const onNewLocations: ActivityListener = useCallback((locations: LocationObject[]): void => {
    const newCoordinates = locations.map(({ coords: { latitude, longitude } }) => [
      longitude,
      latitude,
    ]);
    setCoordinates((prevCoordinates) => prevCoordinates.concat(newCoordinates));
  }, []);

  const startActivity = useCallback((): void => {
    setCoordinates([]);
    onStartActivity();
  }, [onStartActivity]);

  const stopActivity = useCallback((): void => {
    ActivityTask.getInstance().removeListener(onNewLocations);
    onStopActivity();
  }, [onNewLocations, onStopActivity]);

  useEffect(() => {
    ActivityTask.getInstance().addListener(onNewLocations);

    return () => {
      ActivityTask.getInstance().removeListener(onNewLocations);
    };
  }, [onNewLocations]);

  useEffect(() => {
    if (activityState !== 'notStarted') {
      return;
    }

    setBatteryOptimizationModalOpen(hasBatteryOptimization);
  }, [activityState, hasBatteryOptimization]);

  if (hasPermission === null) {
    return (
      <Wrapper>
        <PermissionsLoading />
      </Wrapper>
    );
  }

  if (hasPermission === false || errorStarting) {
    return (
      <Wrapper>
        <AskPermissions />
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <StyledMapView
          mapStyle={styleURL}
          logo={false}
          attribution
          attributionPosition={{ bottom: 8, right: 8 }}
          onDidFinishRenderingMapFully={onMapFullyRendered}>
          {mapReady && <UserLocation heading />}
          <Camera
            trackUserLocation={trackUserLocation}
            zoom={18}
            duration={0}
            onTrackUserLocationChange={onTrackUserLocationChange}
          />
          {mapReady && coordinates.length > 1 && (
            <GeoJSONSource
              id="activityCoordinates"
              data={{
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: { type: 'LineString', coordinates },
                  },
                ],
              }}>
              <Layer
                type="line"
                id="locations"
                style={{ lineColor: theme.colors.purple, lineWidth: 5 }}
              />
            </GeoJSONSource>
          )}
        </StyledMapView>
        <RecenterMapButton onPress={onRecenterMap} />
        <BackButton onPress={() => router.push('/')} />
        {activityState === 'notStarted' && (
          <ActivityStart
            activityType={activityType}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onStartActivity={startActivity}
            onOpenActivityTypeSheet={() => {
              activityTypeBottomSheetRef.current?.present();
            }}
          />
        )}
        {(activityState === 'recording' || activityState === 'paused') && (
          <ActivityRunning
            activityType={activityType}
            activityState={activityState}
            distanceMeasurementSystem={distanceMeasurementSystem}
            onPauseActivity={onPauseActivity}
            onResumeActivity={onResumeActivity}
            onStopActivity={stopActivity}
          />
        )}
      </Wrapper>
      <ActivityTypeBottomSheet
        ref={activityTypeBottomSheetRef}
        onChangeActivityType={(type) => {
          onChangeActivityType(type);
          activityTypeBottomSheetRef.current?.dismiss();
        }}
      />
      <BatteryModeWarningModal
        isOpen={batteryOptimizationModalOpen}
        onClose={() => setBatteryOptimizationModalOpen(false)}
      />
    </>
  );
};

export default RecordUI;
