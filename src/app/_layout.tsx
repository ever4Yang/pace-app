import { type FC, useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { Slot, SplashScreen } from 'expo-router';

import MapLibreGL from '@maplibre/maplibre-react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { focusManager } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styled, { ThemeProvider } from 'styled-components/native';

import { useTheme } from '@theme';

import QueryClientProvider from '@components/QueryClientProvider';

import loadFonts from '@utils/loadFonts';

import DatabaseProvider from '../db/DatabaseProvider';
import LocaleProvider, { useLocale } from '../translations/LocaleProvider';

MapLibreGL.setAccessToken(null);

SplashScreen.preventAutoHideAsync();

const RootWrapper = styled(GestureHandlerRootView)`
  flex: 1;
`;

const LocaleSlot: FC = () => {
  const { locale } = useLocale();
  return <Slot key={locale} />;
};

const RootLayout: FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const theme = useTheme();

  const load = useCallback(async () => {
    await loadFonts();
    setFontLoaded(true);
  }, []);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (!fontLoaded) {
      return;
    }
    await SplashScreen.hideAsync();
  }, [fontLoaded]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });

    return () => {
      listener.remove();
    };
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <RootWrapper onLayout={onLayoutRootView}>
      <ThemeProvider theme={theme}>
        <DatabaseProvider>
          <QueryClientProvider>
            <LocaleProvider>
              <NavigationThemeProvider value={theme.dark ? DarkTheme : DefaultTheme}>
                <LocaleSlot />
              </NavigationThemeProvider>
            </LocaleProvider>
          </QueryClientProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </RootWrapper>
  );
};

export default RootLayout;
