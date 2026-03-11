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

For basic development, no environment variables are needed to test the UI, but to test user invites or synchronized data, a `.env` file is required:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_POWERSYNC_URL=https://your-instance.powersync.journeyapps.com
```

## Supabase Migrations

The `supabase/migrations/` directory contains migration files that define the full database schema, RLS policies, and seed data:

| Migration | Purpose |
|-----------|---------|
| `001_initial_schema.sql` | Core tables and RLS policies |
| `002_denormalize_round_id.sql` | Add `round_id` to `shooter_entries` and `target_results` for sync rules |
| `003_fix_rls_recursion.sql` | Fix recursive RLS policy issues |
| `004_seed_clubs.sql` | Seed club reference data (clubs, positions, stands) |
| `005_fix_all_rls_recursion.sql` | Additional RLS recursion fixes |
| `006_add_invitee_id.sql` | Add `invitee_id` (UUID) to invites |
| `007_allow_invitee_shooter_entry.sql` | Allow invited users to be added as shooters |
| `008_allow_squad_scoring.sql` | Allow squad members to record scores |
| `010_unique_club_stand_per_round.sql` | Unique index preventing duplicate stands per club stand per round |

If setting up a fresh Supabase project, apply these migrations in order. PowerSync sync rules are defined in `supabase/powersync-sync-rules.yaml`.

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
