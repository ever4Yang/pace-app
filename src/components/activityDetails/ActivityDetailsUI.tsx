import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'expo-router';
import { BackHandler } from 'react-native';

import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useActivityLocations from '@api/activity/useActivityLocations';
import useActivityMapSnapshot from '@api/activity/useActivityMapSnapshot';

import ActivityDetails from '@components/common/activity/ActivityDetails';
import { ActivityIndicator, Text } from '@components/ui';

import type { Activity, ActivitySummary } from '@models/Activity';
import type { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

import EditActivityBottomSheet from './EditActivityBottomSheet';
import ZoomableMap from './ZoomableMapUI';

const Wrapper = styled.ScrollView`
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingActivityText = styled(Text)`
  font-size: 16px;
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

type Props = {
  activity: Activity | undefined;
  distanceMeasurementSystem: DistanceMeasurementSystem;
  onDeleteActivity: () => void;
};

const FullscreenMapOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`;

const ActivityDetailsUI: FC<Props> = ({
  activity,
  distanceMeasurementSystem,
  onDeleteActivity,
}) => {
  const editActivityBottomSheetRef = useRef<BottomSheetModal>(null);
  const [isFullscreenMapVisible, setIsFullscreenMapVisible] = useState(false);

  const router = useRouter();
  const theme = useTheme();

  const {
    data: mapSnapshotData,
    isLoading: isMapSnapshotLoading,
    isError: isMapSnapshotError,
  } = useActivityMapSnapshot({
    activityId: activity?.id,
    mapSnapshotTheme: theme.dark ? 'dark' : 'light',
  });

  const {
    data: activityLocationsData,
    isLoading: isActivityLocationsLoading,
    isError: isActivityLocationsError,
  } = useActivityLocations({
    activityId: activity?.id,
  });

  const showFullscreenMap = useCallback((): void => {
    setIsFullscreenMapVisible(true);
  }, []);

  const hideFullscreenMap = useCallback((): void => {
    setIsFullscreenMapVisible(false);
  }, []);

  useEffect(() => {
    if (!isFullscreenMapVisible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      hideFullscreenMap();
      return true;
    });
    return () => subscription.remove();
  }, [isFullscreenMapVisible, hideFullscreenMap]);

  const goToEditActivity = useCallback((): void => {
    editActivityBottomSheetRef.current?.dismiss();

    if (!activity) {
      return;
    }

    router.push(`/activity/${activity.id}/edit`);
  }, [activity, router]);

  const deleteActivity = useCallback((): void => {
    editActivityBottomSheetRef.current?.dismiss();

    if (!activity) {
      return;
    }

    onDeleteActivity();
  }, [activity, onDeleteActivity]);

  const goBack = useCallback((): void => {
    router.back();
  }, [router]);

  if (!activity) {
    return (
      <>
        <Wrapper
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <ActivityIndicator size="large" />
          <LoadingActivityText>{i18n.t('activityDetails.activityLoading')}</LoadingActivityText>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <ActivityDetails
        summary={activity?.summary as ActivitySummary | null}
        mapSnapshot={mapSnapshotData?.mapSnapshot ?? undefined}
        mapSnapshotFetching={isMapSnapshotLoading}
        mapSnapshotError={isMapSnapshotError}
        locations={activityLocationsData?.locations}
        locationsFetching={isActivityLocationsLoading}
        locationsError={isActivityLocationsError}
        distanceMeasurementSystem={distanceMeasurementSystem}
        onEdit={() => {
          editActivityBottomSheetRef.current?.present();
        }}
        onPressMap={showFullscreenMap}
        onGoBack={goBack}
      />
      <EditActivityBottomSheet
        ref={editActivityBottomSheetRef}
        onEditActivity={goToEditActivity}
        onDeleteActivity={deleteActivity}
      />
      {isFullscreenMapVisible && (
        <FullscreenMapOverlay>
          <ZoomableMap
            locations={activityLocationsData?.locations}
            onClose={hideFullscreenMap}
          />
        </FullscreenMapOverlay>
      )}
    </>
  );
};

export default ActivityDetailsUI;
