import {
  PowerSyncDatabase,
  WASQLiteOpenFactory,
  WASQLiteVFS,
} from '@powersync/web';
import { AppSchema } from './schema';

// iOS Safari's default VFS (IDBBatchAtomicVFS) overflows the call stack via
// Asyncify under sustained writes. PowerSync's troubleshooting docs direct
// Safari users to OPFSCoopSyncVFS, which uses OPFS sync access handles and
// avoids the Asyncify shadow-stack growth entirely. Requires iOS 16.4+.
//
// The worker UMD URL bypasses the Metro/Babel import.meta transform issue.
// cacheSizeKb is bounded at 4 MB to stay well under iOS WebContent limits.
const openFactory = new WASQLiteOpenFactory({
  dbFilename: 'scoremyclays.db',
  vfs: WASQLiteVFS.OPFSCoopSyncVFS,
  worker: '/@powersync/worker/WASQLiteDB.umd.js',
  cacheSizeKb: 4 * 1024,
  flags: { useWebWorker: true },
});

export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: openFactory,
  flags: { useWebWorker: true },
});
