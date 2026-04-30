import React, { type FC } from 'react';

import { useLocale } from '@translations/LocaleProvider';

import useLocalizedMapStyle from '@utils/useLocalizedMapStyle';

import { MAPTILER_URL_LIGHT } from '../../consts';
import SnapshotMap, { type Props } from './SnapshotMap';

const LightMapSnapshot: FC<Omit<Props, 'tileUrl'>> = (props) => {
  const { locale } = useLocale();
  const tileUrl = useLocalizedMapStyle(MAPTILER_URL_LIGHT, locale);
  return <SnapshotMap tileUrl={tileUrl} {...props} />;
};

export default LightMapSnapshot;
