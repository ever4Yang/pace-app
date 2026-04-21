import { type FC } from 'react';

import { useLocalSearchParams } from 'expo-router';

import useActivityLocations from '@api/activity/useActivityLocations';

import ZoomableMapUI from '@components/activityDetails/ZoomableMapUI';

const ZoomableMapScreen: FC = () => {
  const { id: activityId } = useLocalSearchParams<{ id?: string }>();

  const { data: locationsData } = useActivityLocations({ activityId });

  return <ZoomableMapUI locations={locationsData?.locations} />;
};

export default ZoomableMapScreen;
