const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'PACE (Dev)' : 'PACE',
    description: 'Private Fitness App',
    slug: 'mykeep',
    scheme: IS_DEV ? 'pace-dev' : 'pace',
    splash: {
      image: './assets/images/splash.png',
      backgroundColor: '#000000',
    },
    userInterfaceStyle: 'automatic',
    icon: './assets/images/app-icon.png',
    android: {
      package: IS_DEV ? 'com.freedy.keep.dev' : 'com.freedy.keep',
      versionCode: 16,
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'RECEIVE_BOOT_COMPLETED',
        'FOREGROUND_SERVICE',
        'FOREGROUND_SERVICE_LOCATION',
      ],
      blockedPermissions: ['RECORD_AUDIO'],
      adaptiveIcon: {
        foregroundImage: './assets/images/android-app-icon.png',
        backgroundColor: '#000000',
      },
    },
    ios: {
      bundleIdentifier: IS_DEV ? 'com.freedy.keep.dev' : 'com.freedy.keep',
      buildNumber: '15',
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Turning on location services allows PACE to record your activities.',
        NSLocationAlwaysUsageDescription:
          'Turning on location services allows PACE to record your activities.',
        NSLocationWhenInUseUsageDescription:
          'Turning on location services allows PACE to record your activities.',
        NSCameraUsageDescription: 'This allows you to create a profile picture with your camera.',
        NSPhotoLibraryUsageDescription:
          'This allows you to choose an existing picture in your library for your profile picture.',
        UIBackgroundModes: ['location'],
      },
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
          },
        ],
      },
    },
    plugins: [
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/roboto/Roboto-Regular.ttf',
            './assets/fonts/roboto/Roboto-Bold.ttf',
            './assets/fonts/roboto/Roboto-BlackItalic.ttf',
          ],
        },
      ],
      'expo-router',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Turning on location services allows PACE to record your activities.',
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true,
        },
      ],
      'expo-task-manager',
      '@maplibre/maplibre-react-native',
      [
        'expo-build-properties',
        {
          android: {
            extraGradleProperties: {
              'org.gradle.jvmargs':
                '-Xmx4g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8',
              'org.gradle.daemon': 'false',
            },
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'bdfe803a-1991-41a6-bc46-d93a9ee9ffd8',
      },
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    updates: {
      url: 'https://u.expo.dev/bdfe803a-1991-41a6-bc46-d93a9ee9ffd8',
    },
  },
};
