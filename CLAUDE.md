# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

PACE is a React Native / Expo fitness tracking app. All data is stored **locally on-device** using SQLite — there is no server, no account, and no sign-up required. Two activity types are supported: **Running** (pace in min/km or min/mi) and **Cycling** (speed in km/h or mph).

## Commands

```bash
# Development
npm run start          # Start Expo dev server (requires dev client build)
npm run android        # Build and run on Android
npm run ios            # Build and run on iOS
npm run prebuild       # Regenerate native project files

# Quality checks
npm run check:types    # TypeScript type checking (no emit)
npm run lint           # ESLint on all JS/TS files

# Tests
npm run test           # Run Jest (note: no test files exist yet)
```

CI runs `check:types` then `lint` on every PR and push to `main`.

## Environment Variables

Copy `.env.example` to `.env`. Required variables:
- `EXPO_PUBLIC_MAPTILER_API_KEY` — MapTiler API key for map tiles

## Architecture

### Routing (`src/app/`)

Expo Router file-system routing. `src/app/_layout.tsx` is the root layout wrapping everything in:
`GestureHandlerRootView` → `ThemeProvider` (styled-components) → `DatabaseProvider` → `QueryClientProvider` → `LocaleProvider` → `NavigationThemeProvider` → `BottomSheetModalProvider`.

Route structure under `(app)/`:
- `(home)/_layout.tsx` — Tabs navigator: `index` (home feed), `record` (GPS recording), `account` (profile). Record tab shows a green dot badge while recording; tab bar is hidden on the record tab.
- `activity/save.tsx` — Save a completed activity (name + type form)
- `activity/[id]/index.tsx` — Activity detail
- `activity/[id]/edit.tsx` — Edit activity name/type
- `activity/[id]/map.tsx` — Full-screen zoomable map
- `settings/index.tsx` + sub-screens — Display preferences, health information, default activity type, language, profile picture
- `summary/weekly.tsx`, `summary/monthly.tsx` — Training summary views

### Auth Layer (`src/auth/`)

Stub context only — `AuthContext` provides a static username and creation date. There is no sign-up, sign-in, or remote authentication.

### Data Layer (`src/db/`)

`expo-sqlite` for all persistent storage. Database file: `pace.db`. Repositories:
- `activityRepository.ts` — activities + locations (batch insert in transaction)
- `preferencesRepository.ts` — singleton row: measurement system, default activity type, language
- `healthInformationRepository.ts` — singleton row: gender, birth date, weight
- `profilePictureRepository.ts` — singleton row: profile picture as base64 TEXT

`migrations.ts` creates all 5 tables (`activities`, `locations`, `preferences`, `health_information`, `profile_picture`) and handles incremental schema upgrades. `DatabaseProvider` exposes the database via React context using `expo-sqlite`'s `SQLiteProvider`.

### API Layer (`src/api/`)

TanStack Query hooks organised by domain (`activity/`, `preferences/`, `healthInformation/`, `profilePicture/`). Hooks read from and write to the local SQLite database — there are no HTTP requests.

The `QueryClient` (in `src/queryClient/queryClient.ts`) uses `staleTime: Infinity` + `gcTime: Infinity`. The source of truth is always the local database.

`useCreateActivity` generates UUIDs via `expo-crypto`, writes map snapshot JPEGs to `documentDirectory/maps/` (both `{id}_light.jpg` and `{id}_dark.jpg`), then calls `insertActivity` + `insertLocations`. `useDeleteActivity` cleans up both map files.

### Activity Layer (`src/activity/`)

Pure business logic. All functions exported from `index.ts`:

- **Distance**: `getDistanceInKilometers` (Haversine), `getCumulativeDistanceInMeters` (adds `cumulativeDistance` + instantaneous `pace` to each location)
- **Time**: `getDurationInSeconds`, `getMovingDurationInSeconds` (excludes paused time between segments)
- **Pace/Speed**: `getPaceInMinutesPerKilometers`, `getSpeedInKilometersPerHour`, plus `convert*` functions for switching between unit systems and activity types
- **Elevation**: `getElevationInMeters`, `getElevationGainInMeters`
- **Splits**: `getSplitPace` — per-km/mi splits with `{distance, pace, elevation, startIndex, endIndex}`
- **Calories**: `getCalories` — MET-based (`calories/met/running.ts` and `calories/met/cycling.ts` lookup tables)
- **Histograms**: `histogram/getPaceHistogram.ts` (running) and `histogram/getSpeedHistogram.ts` (cycling)
- **Map**: `getBounds`, `getLineCoordinatesFromSegments` (handles pause/resume segment gaps), `getFilteredLocations` (GPS noise removal)
- **Summary**: `buildSummary` (raw recording → `ActivitySummary`), `updateSummary` (edit → recomputes pace/calories for new type)
- **Formatting**: `format.ts` — `formatDistance`, `formatDuration`, `formatPace`, `formatSpeed`, etc. Several functions marked `'worklet'` for Reanimated use.

Map snapshots are written to `expo-file-system` (`documentDirectory/maps/`).

### Background GPS (`src/tasks/ActivityTask.ts`)

Singleton class wrapping `expo-task-manager` + `expo-location` for background GPS recording (foreground service on Android). Manages `locations[]`, `currentSegmentIndex`, `startTimestamp`, `endTimestamp`, `distance`. The `TaskManager.defineTask` callback filters incoming GPS points via `getFilteredLocations` and accumulates them in real time. Uses a listener pattern to push locations and recording state to UI components.

### UI & Styling (`src/components/`, `src/theme/`)

`styled-components/native` v6 with a typed theme (light/dark). Theme is declared via `src/theme/styled.d.ts` declaration merging into `DefaultTheme`. Purple `#A749FF` is the primary brand colour. Charts use `@shopify/react-native-skia` + D3 (scale/shape).

`index.js` (root entry point) shims `global.document` before requiring `expo-router/entry` — required because styled-components references DOM APIs under Hermes/New Architecture.

### Map Language (`src/utils/useLocalizedMapStyle.ts`)

`useLocalizedMapStyle(baseUrl, locale)` fetches the MapTiler style JSON, rewrites all `text-field` expressions to use the localised OSM name field (`name:zh`, etc.) with a fallback to `name`, and writes the result to `expo-file-system` cache. MapTiler's `&language=` URL parameter does not work reliably for the `topo` and `dataviz-dark` styles.

### Constants (`src/consts.ts`)

`MAPTILER_URL_LIGHT` (topo), `MAPTILER_URL_DARK` (dataviz-dark), `CONTRIBUTORS_COPYRIGHT`, `ACTIVITY_TITLE_MIN_LENGTH` (3), `ACTIVITY_TITLE_MAX_LENGTH` (100).

## Path Aliases

Both `tsconfig.json` and `babel.config.js` define these aliases rooted at `./src`:

| Alias | Path |
|---|---|
| `@activity` | `src/activity/` |
| `@api` / `@api/*` | `src/api/` |
| `@auth` | `src/auth/` |
| `@components` / `@components/*` | `src/components/` |
| `@models` / `@models/*` | `src/models/` |
| `@tasks` / `@tasks/*` | `src/tasks/` |
| `@theme` | `src/theme/` |
| `@translations` / `@translations/*` | `src/translations/` |
| `@utils` / `@utils/*` | `src/utils/` |

## Key Patterns

- **TypeScript strict mode** is enabled. New code must satisfy type checking (`npm run check:types`).
- **Yup schemas** in `src/models/` validate data at system boundaries (form inputs).
- **Translations**: All user-facing strings go through `i18n-js` with locale files in `src/translations/en/` (English) and `src/translations/zh/` (Chinese). `LocaleProvider` reads the saved language from SQLite on startup.
- **New Architecture** is enabled (`newArchEnabled=true` in `android/gradle.properties`). Expo SDK 52+ sets this by default in generated native files. Avoid patterns incompatible with Fabric / TurboModules / JSI.
