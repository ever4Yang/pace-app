import { type FC, useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { Slot, SplashScreen } from 'expo-router';

import MapLibreGL from '@maplibre/maplibre-react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { focusManager, onlineManager, useIsRestoring } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import styled, { ThemeProvider } from 'styled-components/native';

import { AuthProvider } from '@auth';
import { useTheme } from '@theme';

import QueryClientProvider from '@components/QueryClientProvider';

import loadFonts from '@utils/loadFonts';

MapLibreGL.setAccessToken(null);

SplashScreen.preventAutoHideAsync();

const RootWrapper = styled(GestureHandlerRootView)`
  flex: 1;
`;

const RootLayout: FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [netInfoReady, setNetInfoReady] = useState(false);

  const theme = useTheme();
  const isRestoring = useIsRestoring();

  const load = useCallback(async () => {
    await loadFonts();
    setFontLoaded(true);
  }, []);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (!fontLoaded || isRestoring || !netInfoReady) {
      return;
    }

    await SplashScreen.hideAsync();
  }, [fontLoaded, isRestoring, netInfoReady]);

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected !== null && state.isInternetReachable !== null) {
        setNetInfoReady(true);
      }

      onlineManager.setOnline(
        state.isConnected !== null && state.isConnected && Boolean(state.isInternetReachable),
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontLoaded || isRestoring || !netInfoReady) {
    return null;
  }

  return (
    <RootWrapper onLayout={onLayoutRootView}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <QueryClientProvider>
            <NavigationThemeProvider value={theme.dark ? DarkTheme : DefaultTheme}>
              <Slot />
            </NavigationThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </RootWrapper>
  );
};

export default RootLayout;
