import React, { type FC, useCallback } from 'react';

import Checkbox from 'expo-checkbox';

import styled from 'styled-components/native';

import { useTheme } from '@theme';

import usePreferences from '@api/preferences/usePreferences';
import useUpdateLanguage from '@api/preferences/useUpdateLanguage';

import { Text } from '@components/ui';

import { useLocale } from '@translations/LocaleProvider';

const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.sizes.outerPadding}px;
`;

const OptionWrapper = styled.Pressable<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-width: ${({ isSelected }) => (isSelected ? 2 : 1)}px;
  border-color: ${({ theme }) => theme.colors.purple};
  border-radius: 10px;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const Label = styled(Text)`
  font-size: 16px;
  margin-left: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

const LanguageScreen: FC = () => {
  const theme = useTheme();
  const { setLocale } = useLocale();

  const { data: preferencesData } = usePreferences();
  const { mutate: updateLanguage } = useUpdateLanguage();

  const currentLanguage = preferencesData?.language ?? 'en';

  const onSelect = useCallback(
    (code: string): void => {
      updateLanguage({ language: code });
      setLocale(code);
    },
    [updateLanguage, setLocale],
  );

  return (
    <Wrapper>
      {LANGUAGES.map(({ code, label }) => (
        <OptionWrapper key={code} isSelected={currentLanguage === code} onPress={() => onSelect(code)}>
          <Checkbox
            value={currentLanguage === code}
            color={currentLanguage === code ? theme.colors.purple : theme.colors.separatorColor}
            onValueChange={() => onSelect(code)}
          />
          <Label>{label}</Label>
        </OptionWrapper>
      ))}
    </Wrapper>
  );
};

export default LanguageScreen;
