# PWA Deployment

## What this deployment method is

ScoreMyClays can be served as a Progressive Web App (PWA) from Vercel and installed on an iPhone via Safari's "Add to Home Screen." It is the existing Expo web build wrapped in a PWA shell (manifest, iOS meta tags, service worker for offline app-shell caching) plus an in-app install prompt for first-time iOS Safari visitors.

This deployment method is intended for developer testing and small-group early feedback. The production deployment path for end users will be native builds via EAS / TestFlight / App Store, which provide full native module support, haptics, background sync, and reliable persistent storage. The PWA and native paths share the same codebase and backend and can coexist.

## Vercel project setup

- Connect the GitHub repository to a Vercel project.
- Vercel reads `vercel.json` at the repo root for build configuration:
  - **Build command:** `npm run build:web` (runs `expo export --platform web` and a small post-build script that injects the PWA head tags into `dist/index.html`)
  - **Output directory:** `dist`
  - **Headers:** `/sw.js` is served `no-store`; `/manifest.json` is served as `application/manifest+json`; `*.wasm` is served as `application/wasm`.
- Set the following **build-time** environment variables in the Vercel project (they are inlined into the bundle by `expo export`, not read at runtime):
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `EXPO_PUBLIC_POWERSYNC_URL`
- Push to the configured production branch to trigger a deploy.

## Installing on iPhone

1. Open the deployment URL in Safari on the iPhone.
2. The app shows a one-time prompt explaining the install flow. Tap the Share icon, then **Add to Home Screen**.
3. Launch from the home screen icon. The app opens in standalone mode (no Safari chrome).

## Known constraints and limitations

- **No haptic feedback.** The scoring flow degrades gracefully to a no-op on web. Scoring still works; you just do not get the tactile confirmation.
- **iOS storage eviction.** Safari may reclaim PWA storage (including the local SQLite database) after approximately 7 days of non-use, or under device storage pressure. The PWA is therefore not suitable as a long-term persistent data store. For our use case (offline during a 2–3 hour round, syncing when back online), this is acceptable. Do not rely on local data persisting across weeks of inactivity.
- **No background sync.** PowerSync only syncs while the app is in the foreground. If the user switches away from the app, sync pauses and resumes when they return.
- **WASM cold start.** The wa-sqlite engine initialises each time the PWA launches. This adds a brief loading delay (typically under 1 second on modern iPhones) that does not exist in the native build.
- **Auth session persistence.** Supabase auth tokens stored in `localStorage` should survive normal app backgrounding and reopening. If Safari evicts storage, the user will need to log in again.
- **500 MB storage cap.** iOS imposes a per-origin storage limit for web apps. Scoring data is small, so this is unlikely to be a practical issue.
- **No native install banner on iOS.** Unlike Android, iOS Safari does not show a native install prompt. The app includes a custom in-app prompt for iOS Safari users explaining the "Add to Home Screen" flow. The prompt is dismissible and not shown again after dismissal.
- **External links open in Safari.** When the PWA runs in standalone mode, tapping an external link bounces to Safari proper. The current auth flow is email/password, so this does not affect login. If OAuth or magic-link flows are added later, test the round trip back into the standalone PWA.
- **First offline use requires one online load.** The service worker pre-caches the SPA shell (root HTML, manifest, icons) at install time; the hashed JS bundles, `@powersync/` worker assets, and WASM files are cached on first request. After one full online load the app shell is available offline.
- **Service worker updates.** When a new version is deployed to Vercel, the updated service worker installs in the background but waits to take over. It only activates once every PWA window is fully closed and the app is relaunched. This avoids mid-session controller swaps, which iOS Safari previously surfaced as spontaneous reloads. To force a pending update to apply, fully close the PWA (swipe away from the app switcher) and reopen it from the home screen.

## How this fits alongside native deployment

The PWA path is for development and early user testing. Production user distribution will be native builds via EAS / TestFlight / App Store, which provide:

- Native haptics (the scoring flow already uses `expo-haptics` and degrades on web).
- Reliable persistent storage (no Safari eviction policy).
- Background sync.
- App Store distribution and updates.

Both paths share the same codebase, providers, query layer, and Supabase / PowerSync backend. Adding the PWA does not change any native behaviour.
