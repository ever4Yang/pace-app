import React, { forwardRef, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  type MapProps,
  type MapRef,
  Marker,
} from '@maplibre/maplibre-react-native';
import styled from 'styled-components/native';

import { getBounds, getLineCoordinatesFromSegments } from '@activity';
import { useTheme } from '@theme';

import type { ActivityLocation } from '@models/Activity';

const StartMarker = styled.View`
  width: ${({ theme }) => theme.sizes.outerPadding}px;
  height: ${({ theme }) => theme.sizes.outerPadding}px;

  border-radius: 10px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.white};

  background-color: ${({ theme }) => theme.colors.green};
`;

const EndMarker = styled(StartMarker)`
  background-color: ${({ theme }) => theme.colors.red};
`;

type Props = {
  tileUrl: string;
  locations: ActivityLocation[] | null | undefined;
  style?: StyleProp<ViewStyle>;
  attributionPosition?: MapProps['attributionPosition'];
  onDidFinishRenderingFrameFully?: () => void;
};

const ActivityMap = forwardRef<MapRef, Props>(
  ({ tileUrl, locations, style, attributionPosition, onDidFinishRenderingFrameFully }, ref) => {
    const theme = useTheme();

    const bounds = useMemo(() => {
      if (!locations) {
        return [];
      }

      return getBounds(locations);
    }, [locations]);

    const { segmentsCoordinates, inBetweenSegmentsCoordinates } = useMemo(() => {
      if (!locations) {
        return { segmentsCoordinates: [], inBetweenSegmentsCoordinates: [] };
      }

      return getLineCoordinatesFromSegments(locations);
    }, [locations]);

    const padding = theme.sizes.activityMapSnapshot.padding;

    return (
      <Map
        ref={ref}
        style={style}
        mapStyle={tileUrl}
        logo={false}
        attributionPosition={attributionPosition || { bottom: 8, right: 8 }}
        attribution
        onDidFinishRenderingFrameFully={onDidFinishRenderingFrameFully}>
        <Camera
          bounds={[bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]]}
          padding={{ top: padding, right: padding, bottom: padding, left: padding }}
          duration={0}
        />
        <GeoJSONSource
          id="activityCoordinates"
          data={{
            type: 'FeatureCollection',
            features: segmentsCoordinates.map((segmentCoordinates) => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: segmentCoordinates,
              },
            })),
          }}>
          {segmentsCoordinates.map((_, index) => (
            <Layer
              key={`line-layer-${index}`}
              type="line"
              id={`locations-${index}`}
              style={{
                lineColor: theme.colors.purple,
                lineWidth: 5,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          ))}
        </GeoJSONSource>
        <GeoJSONSource
          id="inBetweenSegments"
          data={{
            type: 'FeatureCollection',
            features: inBetweenSegmentsCoordinates.map((inBetweenCoordinates) => ({
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: inBetweenCoordinates },
            })),
          }}>
          {inBetweenSegmentsCoordinates.map((_, index) => (
            <Layer
              key={`in-between-line-layer-${index}`}
              type="line"
              id={`inBetween-${index}`}
              style={{
                lineDasharray: [2, 2],
                lineColor: theme.colors.purple,
                lineWidth: 5,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          ))}
        </GeoJSONSource>
        <Marker lngLat={segmentsCoordinates[0][0] as [number, number]}>
          <StartMarker />
        </Marker>
        <Marker
          lngLat={
            segmentsCoordinates[segmentsCoordinates.length - 1][
              segmentsCoordinates[segmentsCoordinates.length - 1].length - 1
            ] as [number, number]
          }>
          <EndMarker />
        </Marker>
      </Map>
    );
  },
);

ActivityMap.displayName = 'ActivityMap';

export default ActivityMap;
