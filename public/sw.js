// ScoreMyClays service worker
// Strategy:
// - Precache the static asset shell on install (manifest, icons, root WASM).
// - Stale-while-revalidate for same-origin GET requests (handles hashed JS bundles
//   and the @powersync/ worker + WASM directory whose filenames we cannot enumerate
//   ahead of time).
// - Network-first for navigation requests, falling back to cached '/' so the SPA
//   shell loads offline. The web build is `output: "single"`, so a single index.html
//   serves every route.

const VERSION = 'v1';
const STATIC_CACHE = `smc-static-${VERSION}`;
const RUNTIME_CACHE = `smc-runtime-${VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/wa-sqlite-async.wasm',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put('/', copy));
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
          if (response && response.status === 200 && response.type === 'basic') {
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
