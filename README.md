# ScoreMyClays

An offline-first mobile app for recording clay pigeon shooting scores. Works without signal at the shooting ground and syncs between devices when connectivity returns.

## Why

Clay shooting grounds often have poor or no mobile signal. Shooters track scores on paper cards that are easy to lose and hard to analyse. Existing scoring apps require internet connectivity, making them useless at the ground.

## What It Does

- Record kill/loss results for every target during a round of sporting clays
- Score for a squad of up to 6 shooters on a single device
- Create rounds from pre-configured club layouts or custom stand setups
- Invite other users to join a round by handle
- View round summaries with shooter totals and stand breakdowns
- Detect and resolve scoring conflicts when multiple devices record simultaneously
- All data stored locally — sync to cloud when connected

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile Framework | React Native + Expo |
| Language | TypeScript |
| Routing | Expo Router (file-based) |
| Local Database | SQLite via PowerSync |
| Sync Engine | PowerSync (offline-first) |
| Backend | Supabase (PostgreSQL + Auth) |
| Build & Deploy | Expo EAS Build |

## Architecture

The app is a client-side modular monolith with an offline-first data layer. PowerSync provides a local SQLite database that syncs CRUD operations to Supabase when connected.

```
app/           Route screens (auth, tabs, round workflows)
providers/     Database, auth, and sync context providers
db/            Local schema, query modules, platform DB entrypoints
lib/           Types, constants, formatting, sync connector
components/    Reusable scoring and selection UI
supabase/      SQL migrations and PowerSync sync rules
```

Provider chain: `DatabaseProvider` (PowerSync init) → `AuthProvider` (Supabase auth) → `SyncProvider` (sync status + error banners) → app screens.

All reads and writes go through typed query functions, keeping screens decoupled from the database layer.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A web browser (Chrome recommended for development)
- For native builds: Xcode (iOS) or Android Studio (Android)

### Setup

```bash
git clone https://github.com/philippe-ths/scoremyclays.git
cd scoremyclays
npm install
```

### Run

```bash
npm run web        # Web — opens at http://localhost:8081
npm run ios        # iOS — requires Xcode
npm run android    # Android — requires Android Studio
```

### Environment Variables

The app runs locally without configuration. To enable sync and invites, create a `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_POWERSYNC_URL=https://your-instance.powersync.journeyapps.com
```

## Documentation

| Document | Description |
|----------|-------------|
| [Overview](docs/overview.md) | Domain terminology, target configurations, MVP scope |
| [Architecture](docs/architecture.md) | Provider hierarchy, data flow, schema, directory structure |
| [Screens and Routing](docs/screens-and-routing.md) | All routes, screen purposes, navigation flow |
| [Scoring Flow](docs/scoring-flow.md) | How the scoring state machine works |
| [Offline-First](docs/offline-first.md) | PowerSync architecture, platform split, sync strategy |
| [Testing](docs/testing.md) | How to run, write, and maintain tests |
| [Getting Started](docs/getting-started.md) | Full setup guide, migrations, common issues |
