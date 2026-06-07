/**
 * ScoreMyClays service worker.
 *
 * Makes the PWA boot offline. The app's data layer (PowerSync SQLite) already
 * works without a connection, but the page that loads it was never cached, so
 * reopening offline failed with Safari's "not connected to the internet" error.
 *
 * The precache list and cache version below are placeholders that
 * `scripts/generate-pwa.js` fills in after `expo export`, using the real
 * (build-hashed) file list from `dist/`. Precaching the whole export on install
 * is what makes the app bootable offline after a single online visit — the
 * hashed JS bundle and the dynamically-imported wa-sqlite chunks are otherwise
 * fetched before the worker takes control and would never reach the cache.
 *
 * Strategy:
 * - Install: precache every exported asset (best-effort per file).
 * - Navigations: network-first, falling back to the cached app shell offline.
 *   With Expo web `output: "single"` every route is the same index.html (SPA).
 * - Same-origin assets: cache-first, with runtime caching as a backstop.
 * - Cross-origin requests (Supabase / PowerSync) are never intercepted; they
 *   fail naturally offline and PowerSync handles that against local SQLite.
 */
const CACHE = 'smc-shell-' + '__BUILD_ID__';

// Replaced at build time with the full list of exported asset URLs.
const PRECACHE_URLS = '__PRECACHE_PLACEHOLDER__';

self.addEventListener('install', (event) => {
  const urls = Array.isArray(PRECACHE_URLS) ? PRECACHE_URLS : ['/'];
  event.waitUntil(
    caches
      .open(CACHE)
      // Per-file so one failed asset doesn't abort the whole precache.
      .then((cache) => Promise.allSettled(urls.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle our own origin. Supabase / PowerSync calls pass through untouched.
  if (url.origin !== self.location.origin) return;

  // Navigations (the document request): network-first, fall back to cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/').then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Static assets: cache-first, then network (and cache the result for next time).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
