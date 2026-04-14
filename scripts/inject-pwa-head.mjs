// Injects PWA head tags into dist/index.html after `expo export --platform web`.
// Needed because the web build uses `output: "single"` (SPA) and Expo Router's
// +html.tsx template does not apply in that mode.

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const HTML_PATH = resolve(process.cwd(), 'dist', 'index.html');

const HEAD_TAGS = `
    <meta name="description" content="Record clay shooting round results across mobile and web." />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#D97706" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="ScoreMyClays" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
`;

const VIEWPORT_WITH_NOTCH =
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no" />';
const VIEWPORT_DEFAULT =
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />';

const html = await readFile(HTML_PATH, 'utf8');

if (html.includes('rel="manifest"')) {
  console.log('[inject-pwa-head] manifest link already present, skipping');
  process.exit(0);
}

let updated = html.replace(VIEWPORT_DEFAULT, VIEWPORT_WITH_NOTCH);
updated = updated.replace('</head>', `${HEAD_TAGS}  </head>`);

if (updated === html) {
  console.error('[inject-pwa-head] failed to find </head> in dist/index.html');
  process.exit(1);
}

await writeFile(HTML_PATH, updated, 'utf8');
console.log('[inject-pwa-head] injected PWA head tags into dist/index.html');
