/**
 * Post-export PWA step. Runs after `expo export --platform web`.
 *
 * Expo web `output: "single"` ignores `app/+html.tsx` and emits a default
 * index.html, so the PWA head tags and service-worker registration are injected
 * here instead. It also fills the service worker's precache list with the real
 * build-hashed asset URLs from `dist/`, so the app can boot fully offline after
 * a single online visit.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(DIST)) {
  console.error('[generate-pwa] dist/ not found — run `expo export --platform web` first.');
  process.exit(1);
}

/** Recursively list every file under a directory as posix-style paths relative to DIST. */
function walk(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const rel = base ? `${base}/${name}` : name;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...walk(full, rel));
    else out.push(rel);
  }
  return out;
}

// The worker caches itself implicitly; metadata.json is build bookkeeping.
const EXCLUDE = new Set(['sw.js', 'metadata.json']);

const assets = walk(DIST)
  .filter((rel) => !EXCLUDE.has(rel))
  .map((rel) => '/' + rel);

// '/' is the navigation entry point; keep it first and de-duplicate.
const precache = Array.from(new Set(['/', ...assets]));

const buildId = Date.now().toString(36);

// 1. Embed the precache list and a per-build cache version into the worker.
const swPath = path.join(DIST, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw
  .replace("'__BUILD_ID__'", JSON.stringify(buildId))
  .replace("'__PRECACHE_PLACEHOLDER__'", JSON.stringify(precache));
fs.writeFileSync(swPath, sw);

// 2. Inject PWA head tags + service-worker registration into index.html.
const htmlPath = path.join(DIST, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const headTags = `
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#D97706" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="ScoreMyClays" />
    <link rel="apple-touch-icon" href="/app-icon.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function (e) {
            console.warn('Service worker registration failed:', e);
          });
        });
      }
    </script>
`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${headTags}  </head>`);
  fs.writeFileSync(htmlPath, html);
}

console.log(`[generate-pwa] precached ${precache.length} files, build ${buildId}`);
