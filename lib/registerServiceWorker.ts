import { Platform } from 'react-native';
import { breadcrumb } from './crashLog';

export function registerServiceWorker(): void {
  if (Platform.OS !== 'web') return;
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (!('serviceWorker' in window.navigator)) return;

  const BUILD = 'fix/113-pwa-stability | sw: v3 | powersync: opfs';
  (window as any)._smcBuild = BUILD;
  breadcrumb('sw.build', { build: BUILD });
  setTimeout(() => console.log('[SMC] build:', BUILD), 3000);

  window.addEventListener('load', () => {
    window.navigator.serviceWorker
      .register('/sw.js')
      .then(() => breadcrumb('sw.registered'))
      .catch((err) => {
        breadcrumb('sw.register.error', { message: err instanceof Error ? err.message : String(err) });
        console.warn('[sw] registration failed', err);
      });
  });
}
