import React, { type FC, useMemo } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { Text } from '@components/ui';

import i18n from '@translations/i18n';

import { version } from '../../../package.json';
import {
  DisplayPreferencesButton,
  HealthInformationButton,
  LanguageButton,
  SportPreferencesButton,
} from './buttons';

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Version = styled(Text)`
  align-self: center;
  margin-top: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SettingsUI: FC = () => {
  const theme = useTheme();

  const scrollViewContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: theme.sizes.outerPadding,
      backgroundColor: theme.colors.background,
    }),
    [theme],
  );

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={scrollViewContainerStyle}>
        <DisplayPreferencesButton />
        <HealthInformationButton />
        <SportPreferencesButton />
        <LanguageButton />
      </ScrollView>
      <Version>{i18n.t('settings.version', { version })}</Version>
    </Wrapper>
  );
};

export default SettingsUI;
