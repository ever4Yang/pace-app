import { type FC, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { Slot, SplashScreen } from 'expo-router';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { focusManager } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styled, { ThemeProvider } from 'styled-components/native';

import { useTheme } from '@theme';

import QueryClientProvider from '@components/QueryClientProvider';

import DatabaseProvider from '../db/DatabaseProvider';
import LocaleProvider, { useLocale } from '../translations/LocaleProvider';

SplashScreen.preventAutoHideAsync();

const RootWrapper = styled(GestureHandlerRootView)`
  flex: 1;
`;

const LocaleSlot: FC = () => {
  const { locale } = useLocale();
  return <Slot key={locale} />;
};

const RootLayout: FC = () => {
  const theme = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <RootWrapper>
      <ThemeProvider theme={theme}>
        <DatabaseProvider>
          <QueryClientProvider>
            <LocaleProvider>
              <NavigationThemeProvider value={theme.dark ? DarkTheme : DefaultTheme}>
                <BottomSheetModalProvider>
                  <LocaleSlot />
                </BottomSheetModalProvider>
              </NavigationThemeProvider>
            </LocaleProvider>
          </QueryClientProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </RootWrapper>
  );
};

export default RootLayout;
