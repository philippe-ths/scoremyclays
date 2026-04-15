import { Platform } from 'react-native';

export function registerServiceWorker(): void {
  if (Platform.OS !== 'web') return;
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (!('serviceWorker' in window.navigator)) return;

  const BUILD = 'fix/113-pwa-stability | sw: v3 | powersync: worker';
  (window as any)._smcBuild = BUILD;
  setTimeout(() => console.log('[SMC] build:', BUILD), 3000);

  window.addEventListener('load', () => {
    window.navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        console.warn('[sw] registration failed', err);
      });
  });
}
