import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema';

// Pass an explicit worker URL so PowerSync uses `new Worker(urlString)` rather
// than `new Worker(new URL('./WASQLiteDB.worker.js', import.meta.url))`.
// The explicit URL path bypasses the Metro/Babel import.meta transform issue.
//
// cacheSizeKb is capped at 4 MB (default is 50 MB). The 50 MB default SQLite
// page cache allocated in WASM memory, combined with the JS bundle heap,
// exceeds iOS Safari's per-process memory limit and causes silent OOM crashes.
// 4 MB is sufficient for this app's data volume.
// The UMD bundle is copied to public/ by the postinstall script.
export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'scoremyclays.db',
    worker: '/@powersync/worker/WASQLiteDB.umd.js',
    cacheSizeKb: 4 * 1024,
  },
  flags: { useWebWorker: true },
});
