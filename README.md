![banner](.github/github-banner.png)

# PACE - Local Fitness App

PACE is a local-only fitness app that allows you to record, track and analyse your workouts. All data is stored on-device using SQLite — no account, no server, no sync.

## Features

- **Local storage**: All data is stored on-device with SQLite. Nothing leaves your phone.
- **No sign-up required**: Open the app and start recording immediately.
- **Running and bike rides**: Record your running and bike rides with GPS tracking.
- **Offline**: Works entirely offline. No internet connection required except for map tiles.
- **Analysis**: Analyse your workouts with detailed statistics and graphs.
- **Weekly and monthly summaries**: Get a weekly and monthly summary of your activities with distance and duration.

## Building from source

PACE is built with [Expo](https://expo.io/), written in TypeScript.

1. Setup Expo following the official [documentation](https://docs.expo.io/get-started/installation/)
2. Clone this repository `git clone git@github.com:withpaceio/pace-app.git`
3. Copy the `.env.example` file to `.env` and fill in the required values
4. Install dependencies using `npm install`
5. Start the app (add `--device` to start on a physical device):
   - Android: `npm run android`
   - iOS: `npm run ios`

## Building an Android APK locally

### Prerequisites

- **Java 17** — e.g. `sudo apt install openjdk-17-jdk` on Debian/Ubuntu
- **Android SDK** — install via [Android Studio](https://developer.android.com/studio) or the standalone [command line tools](https://developer.android.com/studio#command-tools)
  - Required SDK components: `platform-tools`, `build-tools;34.0.0`, `platforms;android-34`
- Set environment variables (add to `~/.bashrc` or equivalent):
  ```bash
  export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
  export ANDROID_HOME=$HOME/android-sdk
  export ANDROID_SDK_ROOT=$ANDROID_HOME
  export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
  ```

### Build

```bash
# First time, or after changing app.config.js (generates the android/ project):
npm run android:prebuild

# Build a debug APK:
npm run android:debug
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# Build a release APK:
npm run android:release
# Output: android/app/build/outputs/apk/release/

# Prebuild + debug in one command:
npm run android:build
```

> The first build downloads Gradle and all dependencies (~10–15 min). Subsequent builds are much faster.
