import React, { type FC, useRef } from 'react';

import { type MapRef } from '@maplibre/maplibre-react-native';
import styled from 'styled-components/native';

import ActivityMap from '@components/common/activity/ActivityMap';
import { ActivityIndicator } from '@components/ui';

import type { ActivityLocation } from '@models/Activity';

const ActivityIndicatorWrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledActivityMap = styled(ActivityMap)`
  position: absolute;

  top: -${({ theme }) => 2 * theme.sizes.activityMapSnapshot.height}px;
  left: -${({ theme }) => 2 * theme.sizes.activityMapSnapshot.width}px;
  width: ${({ theme }) => theme.sizes.activityMapSnapshot.width}px;
  height: ${({ theme }) => theme.sizes.activityMapSnapshot.height}px;
`;

export type Props = {
  tileUrl: string;
  locations: ActivityLocation[];
  onMapSnapshot: (snapshotImageUri: string) => void;
  hideIndicator?: boolean;
};

const SnapshotMap: FC<Props> = ({ tileUrl, locations, onMapSnapshot, hideIndicator }) => {
  const mapRef = useRef<MapRef | null>(null);

  const takeSnapshot = async (): Promise<void> => {
    const uri = await mapRef.current?.createStaticMapImage({ output: 'file' });
    onMapSnapshot(uri ?? '');
  };

  return (
    <>
      {!hideIndicator && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator />
        </ActivityIndicatorWrapper>
      )}
      <StyledActivityMap
        ref={mapRef}
        tileUrl={tileUrl}
        locations={locations}
        attributionPosition={{ top: -20, left: -20 }}
        onDidFinishRenderingFrameFully={takeSnapshot}
      />
    </>
  );
};

export default SnapshotMap;
