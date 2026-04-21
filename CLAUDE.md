# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

PACE is a React Native / Expo fitness tracking app with **end-to-end encryption** as its central design constraint. The server stores only ciphertext — all encryption and decryption happens on-device.

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
- `EXPO_PUBLIC_API_URL` — backend API base URL
- `EXPO_PUBLIC_WEB_URL` — web URL
- `EXPO_PUBLIC_MAPTILER_API_KEY` — MapTiler API key for map tiles
- `EXPO_PUBLIC_REVENUE_CAT_API_KEY_ANDROID` / `_IOS` — RevenueCat subscription keys
- `EXPO_PUBLIC_NUMBER_FREE_ACTIVITIES` — free tier activity limit (prod = 10)

## Architecture

### Routing (`src/app/`)
Expo Router file-system routing. `_layout.tsx` is the root layout that wraps everything in providers (ThemeProvider, AuthProvider, QueryClientProvider). Route groups: `(app)/` for authenticated screens, `auth/` for sign-in/sign-up.

### Auth Layer (`src/auth/`)
Context + reducer pattern. Implements **SRP-6a** (Secure Remote Password) — the server never sees the user's password. On signup, passwords are stretched with Argon2id (32 MB memory), then HKDF derives the authentication token. The derived session key decrypts an auth token returned by the server.

### Crypto Layer (`src/crypto/`)
Generates NaCl box (X25519) keypairs for encryption and Ed25519 keypairs for signing via `react-native-nacl-jsi`. Keys are generated on signup and stored in secure storage.

### Activity Layer (`src/activity/`)
Pure business logic — encrypt/decrypt activities, locations, map snapshots, health info. Also computes distance, pace, elevation, splits, calories, and histograms. Each activity's encryption key is itself asymmetrically encrypted with the user's NaCl box keypair.

### API Layer (`src/api/`)
TanStack Query hooks organized by domain (`activity/`, `account/`, `auth/`). Auth token is passed as `X-Auth-Token` header. HTTP goes through `src/utils/sendRequest.ts` which uses native `fetch`. 401 errors from the QueryCache trigger a "logged out" modal.

### Data Persistence
TanStack Query with `staleTime: Infinity` + `gcTime: Infinity`, persisted to MMKV via `@tanstack/query-sync-storage-persister`. This makes the app **offline-first** — data is cached indefinitely and synced when connectivity resumes (`@react-native-community/netinfo` + `onlineManager`).

### Background GPS (`src/tasks/ActivityTask.ts`)
Singleton class wrapping `expo-task-manager` + `expo-location` for background GPS recording (foreground service on Android). Uses a listener pattern to push locations to UI components.

### Subscriptions (`src/subscription/`)
RevenueCat (`react-native-purchases`) with entitlement IDs `pro` and `pro-yearly`. Free tier limit is controlled by `EXPO_PUBLIC_NUMBER_FREE_ACTIVITIES`.

### UI & Styling (`src/components/`, `src/theme/`)
`styled-components/native` v6 with a typed theme (light/dark). Theme is declared via `src/theme/styled.d.ts` declaration merging into `DefaultTheme`. Purple `#A749FF` is the primary brand color. Charts use `@shopify/react-native-skia` + D3 (scale/shape).

## Path Aliases

Both `tsconfig.json` and `babel.config.js` define these aliases rooted at `./src`:

| Alias | Path |
|---|---|
| `@activity` | `src/activity/` |
| `@api/*` | `src/api/` |
| `@auth` | `src/auth/` |
| `@components/*` | `src/components/` |
| `@crypto` | `src/crypto/` |
| `@models/*` | `src/models/` |
| `@theme` | `src/theme/` |
| `@translations/*` | `src/translations/` |
| `@utils/*` | `src/utils/` |
| `@tasks/*` | `src/tasks/` |
| `@subscription/*` | `src/subscription/` |

## Key Patterns

- **TypeScript strict mode** is enabled. New code must satisfy type checking (`npm run check:types`).
- **Yup schemas** in `src/models/` validate data at system boundaries (form inputs, API responses).
- **Translations**: All user-facing strings go through `i18n-js` with English locale files in `src/translations/en/`.
- **`patch-package`**: A patch exists for `@maplibre/maplibre-react-native`. Run `npm install` after changing dependencies (postinstall applies patches automatically).
- **New Architecture** is enabled (see `app.config.js`). Avoid patterns incompatible with the React Native New Architecture (Fabric / JSI).
