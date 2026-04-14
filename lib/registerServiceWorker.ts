import { Platform } from 'react-native';

export function registerServiceWorker(): void {
  if (Platform.OS !== 'web') return;
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (!('serviceWorker' in window.navigator)) return;

  window.addEventListener('load', () => {
    window.navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        console.warn('[sw] registration failed', err);
      });
  });
}
