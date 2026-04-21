import React, { type FC, useCallback } from 'react';

import { useRouter } from 'expo-router';

import { useTheme } from '@theme';

import usePreferences from '@api/preferences/usePreferences';

import { PreferencesIcon } from '@components/icons';
import { ActivityIndicator } from '@components/ui';

import i18n from '@translations/i18n';

import {
  ConfigureWrapper,
  EntryWrapper,
  ICON_SIZE,
  IconWrapper,
  Label,
  SecondaryLabel,
} from './common';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  zh: '中文',
};

const LanguageButton: FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const { data: preferencesData, isFetching } = usePreferences();

  const onPress = useCallback((): void => {
    router.push('/settings/language');
  }, [router]);

  return (
    <EntryWrapper onPress={onPress}>
      <IconWrapper>
        <PreferencesIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
      </IconWrapper>
      <ConfigureWrapper>
        <Label>{i18n.t('settings.buttons.language')}</Label>
        {!preferencesData && isFetching ? (
          <ActivityIndicator />
        ) : (
          <SecondaryLabel>
            {LANGUAGE_LABELS[preferencesData?.language ?? 'en'] ?? 'English'}
          </SecondaryLabel>
        )}
      </ConfigureWrapper>
    </EntryWrapper>
  );
};

export default LanguageButton;
