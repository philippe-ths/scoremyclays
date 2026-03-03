# Getting Started

## Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** (`npx expo` — no global install needed)
- A web browser for development (Chrome recommended)
- For native development: Xcode (iOS) or Android Studio (Android), or use Expo Go on a physical device

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/philippe-ths/scoremyclays.git
cd scoremyclays
npm install
```

The `postinstall` script automatically copies PowerSync WASM assets to `public/` for web support. If this step fails, run it manually:

```bash
npx powersync-web copy-assets --output public
```

## Environment Variables

For guest mode (the current default), no environment variables are needed. All data stays on-device.

When Supabase sync is enabled, create a `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Running the App

### Web (recommended for development)

```bash
npm run web
```

Opens at `http://localhost:8081`. Hot reload is enabled.

### iOS

```bash
npm run ios
```

Requires Xcode, or use Expo Go on a physical iPhone.

### Android

```bash
npm run android
```

Requires Android Studio with an emulator, or use Expo Go on a physical Android device.

## Project Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `expo start` | Start dev server (pick platform interactively) |
| `web` | `expo start --web` | Start web dev server |
| `ios` | `expo start --ios` | Start iOS dev server |
| `android` | `expo start --android` | Start Android dev server |
| `postinstall` | `npx powersync-web copy-assets --output public` | Copy WASM assets for web |

## Common Issues

### `Cannot use 'import.meta' outside a module`

This means the custom Babel plugin in `babel.config.js` is not being applied. Ensure the file exists and contains the `MetaProperty` visitor that transforms `import.meta`. Clear the Metro cache:

```bash
npx expo start --clear
```

### WASM file loading errors (`expected magic word 00 61 73 6d`)

Metro is returning HTML instead of the WASM binary files. Run the postinstall script to copy them to `public/`:

```bash
npx powersync-web copy-assets --output public
```

### `Your web project is importing a module from 'react-native'`

A file is importing directly from `@powersync/react-native` instead of using the platform-specific split. Database imports should go through `@/db/openDatabase` (which resolves to `.web.ts` or `.native.ts` automatically). Schema and query files should import types from `@powersync/common`, not from a platform-specific package.
