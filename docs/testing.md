# Testing

How to run, write, and maintain tests in ScoreMyClays.

## Running Tests

```bash
npm test
```

This runs Jest via the `test` script in `package.json`. All `.test.ts` files under `__tests__/` are discovered and executed in parallel.

## Configuration

| File | Purpose |
|------|---------|
| `jest.config.ts` | Jest config — ts-jest preset, node environment, `@/` path alias |
| `package.json` | `"test": "jest"` script |
| `__tests__/helpers/mockDb.ts` | Shared mock factory for `AbstractPowerSyncDatabase` |

**Key config details:**
- **Preset:** `ts-jest` — compiles TypeScript on-the-fly, no build step needed
- **Environment:** `node` — pure logic tests, no browser/React Native runtime
- **Path alias:** `@/` maps to project root via `moduleNameMapper`, matching `tsconfig.json`

## Test Structure

```
__tests__/
  db/queries/       # Query function tests (one file per query module)
    scoring.test.ts
    stands.test.ts
    users.test.ts
    invites.test.ts
    clubs.test.ts
  lib/              # Core logic tests
    uuid.test.ts
    powersync-connector.test.ts
  helpers/
    mockDb.ts       # Shared mock factory
```

## Writing Tests

### Mock Database Pattern

All query functions accept `db: AbstractPowerSyncDatabase` as their first parameter. Use the shared mock factory:

```typescript
import { createMockDb } from '../../helpers/mockDb';

it('does something', async () => {
  const db = createMockDb();
  (db.getAll as jest.Mock).mockResolvedValue([{ id: '1', name: 'Test' }]);

  const result = await someQueryFunction(db, 'arg');

  expect(result).toHaveLength(1);
});
```

The mock provides stubs for: `execute`, `getAll`, `getOptional`, `writeTransaction`, `getNextCrudTransaction`.

### What to Test

Test functions with **logic beyond simple CRUD** — these are the highest-value targets:

- Deduplication, filtering, or transformation logic
- Dynamic SQL builders (e.g., `updateStand`, `updateUserProfile`)
- Conflict detection and resolution
- Search patterns and case-insensitive lookups
- Error handling and edge cases

### What NOT to Test

- Trivial single-query CRUD wrappers (e.g., `getRound`, `getStand`) — they delegate entirely to the database
- React Native UI components or rendering
- Framework behavior (PowerSync, Supabase, Expo)

### Mocking External Modules

For modules with native dependencies (like `expo-crypto`), use `jest.mock` at the top of the test file:

```typescript
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: jest.fn().mockImplementation(async (_algo, input) => {
    const { createHash } = require('crypto');
    return createHash('sha256').update(input).digest('hex');
  }),
}));
```

For module-level imports like Supabase, mock before the import:

```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({ /* chain methods */ }),
  },
}));

import { SupabaseConnector } from '@/lib/powersync-connector';
```

## Agent Instructions

When adding new query functions or modifying existing logic:

1. **Run `npm test` before and after changes** to verify nothing breaks
2. **Add tests for new logic** — if a function has branching, transformation, or validation, it needs a test
3. **Use `createMockDb()`** from `__tests__/helpers/mockDb.ts` for all query tests
4. **Create a fresh mock per test** — do not share mock state across tests
5. **Follow the existing file convention** — one test file per source module, mirroring the source path under `__tests__/`
6. **Never commit with failing tests**
