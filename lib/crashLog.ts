import { Platform } from 'react-native';

const STORAGE_KEY = 'smc_crash_log';
const MAX_ENTRIES = 200;

export interface Breadcrumb {
  ts: number;
  event: string;
  data?: Record<string, unknown>;
}

function canUseStorage(): boolean {
  if (Platform.OS !== 'web') return false;
  if (typeof window === 'undefined') return false;
  try {
    return typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function read(): Breadcrumb[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: Breadcrumb[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage full or disabled; ignore
  }
}

export function breadcrumb(event: string, data?: Record<string, unknown>): void {
  const entry: Breadcrumb = { ts: Date.now(), event, data };
  try {
    console.log('[SMC]', event, data ?? '');
  } catch {
    // console unavailable; ignore
  }
  if (!canUseStorage()) return;
  const entries = read();
  entries.push(entry);
  while (entries.length > MAX_ENTRIES) entries.shift();
  write(entries);
}

export function getBreadcrumbs(): Breadcrumb[] {
  return read();
}

export function clearBreadcrumbs(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function installGlobalHandlers(): void {
  if (Platform.OS !== 'web') return;
  if (typeof window === 'undefined') return;
  const w = window as unknown as { _smcCrashLogInstalled?: boolean };
  if (w._smcCrashLogInstalled) return;
  w._smcCrashLogInstalled = true;

  window.addEventListener('error', (event) => {
    breadcrumb('window.error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error instanceof Error ? event.error.stack : undefined,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    breadcrumb('window.unhandledrejection', {
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });

  window.addEventListener('pageshow', (event) => {
    breadcrumb('pageshow', { persisted: (event as PageTransitionEvent).persisted });
  });

  window.addEventListener('visibilitychange', () => {
    breadcrumb('visibilitychange', { state: document.visibilityState });
  });

  (window as unknown as { _smcLog?: () => Breadcrumb[] })._smcLog = getBreadcrumbs;
  (window as unknown as { _smcLogClear?: () => void })._smcLogClear = clearBreadcrumbs;
}
