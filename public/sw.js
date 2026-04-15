// ScoreMyClays service worker
// Strategy:
// - Precache only the minimal SPA shell on install (root HTML, manifest, icons).
//   WASM assets populate the runtime cache on first fetch, giving the same
//   offline behaviour after one full online load without bloating install.
// - Stale-while-revalidate for same-origin GET requests (handles hashed JS
//   bundles, the @powersync/ worker + WASM directory, and the root-level WASM
//   files whose filenames we know ahead of time).
// - Network-first for navigation requests with a strict ok-response guard,
//   falling back to cached '/' so the SPA shell loads offline. The web build
//   is `output: "single"`, so a single index.html serves every route.
// - A new worker waits in the background and activates only when every PWA
//   client has closed. No `skipWaiting()` / `clients.claim()` — mid-session
//   controller swaps were causing spontaneous reloads on iOS Safari.

const VERSION = 'v3';
const STATIC_CACHE = `smc-static-${VERSION}`;
const RUNTIME_CACHE = `smc-runtime-${VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
});

function isCacheableResponse(response) {
  return !!response && response.status === 200 && response.type === 'basic';
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isCacheableResponse(response)) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put('/', copy));
          }
          return response;
        })
        .catch(() =>
          caches.match('/').then((cached) => cached || caches.match(request))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (isCacheableResponse(response)) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
