# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

PACE is a React Native / Expo fitness tracking app. All data is stored **locally on-device** using SQLite — there is no server, no account, and no sign-up required.

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
Expo Router file-system routing. `_layout.tsx` is the root layout that wraps everything in providers (ThemeProvider, QueryClientProvider, DatabaseProvider, LocaleProvider). Route groups: `(app)/` for main screens, `(home)/` for the home screen.

### Auth Layer (`src/auth/`)
Stub context only — `AuthContext` provides a static username and creation date. There is no sign-up, sign-in, or remote authentication.

### Data Layer (`src/db/`)
`expo-sqlite` for all persistent storage. Repositories handle CRUD for activities, locations, health information, preferences, and profile pictures. `migrations.ts` manages schema upgrades. `DatabaseProvider` exposes the database via React context.

### API Layer (`src/api/`)
TanStack Query hooks organised by domain (`activity/`, `preferences/`, `healthInformation/`, `profilePicture/`). Hooks read from and write to the local SQLite database — there are no HTTP requests.

### Activity Layer (`src/activity/`)
Pure business logic — computes distance, pace, elevation, splits, calories, and histograms. Map snapshots are written to `expo-file-system` (`documentDirectory/maps/`).

### Data Persistence
TanStack Query with `staleTime: Infinity` + `gcTime: Infinity` for in-memory caching on top of SQLite. The source of truth is always the local database.

### Background GPS (`src/tasks/ActivityTask.ts`)
Singleton class wrapping `expo-task-manager` + `expo-location` for background GPS recording (foreground service on Android). Uses a listener pattern to push locations to UI components.

### UI & Styling (`src/components/`, `src/theme/`)
`styled-components/native` v6 with a typed theme (light/dark). Theme is declared via `src/theme/styled.d.ts` declaration merging into `DefaultTheme`. Purple `#A749FF` is the primary brand colour. Charts use `@shopify/react-native-skia` + D3 (scale/shape).

### Map Language (`src/utils/useLocalizedMapStyle.ts`)
`useLocalizedMapStyle(baseUrl, locale)` fetches the MapTiler style JSON, rewrites all `text-field` expressions to use the localised OSM name field (`name:zh`, etc.) with a fallback to `name`, and writes the result to `expo-file-system` cache. MapTiler's `&language=` URL parameter does not work reliably for the `topo` and `dataviz-dark` styles.

## Path Aliases

Both `tsconfig.json` and `babel.config.js` define these aliases rooted at `./src`:

| Alias | Path |
|---|---|
| `@activity` | `src/activity/` |
| `@api/*` | `src/api/` |
| `@auth` | `src/auth/` |
| `@components/*` | `src/components/` |
| `@models/*` | `src/models/` |
| `@theme` | `src/theme/` |
| `@translations/*` | `src/translations/` |
| `@utils/*` | `src/utils/` |
| `@tasks/*` | `src/tasks/` |

## Key Patterns

- **TypeScript strict mode** is enabled. New code must satisfy type checking (`npm run check:types`).
- **Yup schemas** in `src/models/` validate data at system boundaries (form inputs).
- **Translations**: All user-facing strings go through `i18n-js` with locale files in `src/translations/en/` (English) and `src/translations/zh/` (Chinese). `LocaleProvider` reads the saved language from SQLite on startup.
- **`patch-package`**: A patch exists for `@maplibre/maplibre-react-native`. Run `npm install` after changing dependencies (postinstall applies patches automatically).
- **New Architecture** is enabled (see `app.config.js`). Avoid patterns incompatible with the React Native New Architecture (Fabric / JSI).
