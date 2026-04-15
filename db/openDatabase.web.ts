import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema';

// Pass an explicit worker URL so PowerSync uses `new Worker(urlString)` rather
// than `new Worker(new URL('./WASQLiteDB.worker.js', import.meta.url))`.
// The explicit URL path bypasses the Metro/Babel import.meta transform issue
// while keeping WASM compilation on a background thread (off the main thread),
// which prevents WebKit OOM crashes on iPhone.
// The UMD bundle is copied to public/ by the postinstall script.
export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'scoremyclays.db',
    worker: '/@powersync/worker/WASQLiteDB.umd.js',
  },
  flags: { useWebWorker: true },
});
