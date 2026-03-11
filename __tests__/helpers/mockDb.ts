import type { AbstractPowerSyncDatabase } from '@powersync/common';

/**
 * Creates a mock PowerSync database with jest.fn() stubs for all query methods.
 * Tests can configure return values via mockResolvedValue/mockResolvedValueOnce.
 */
export function createMockDb() {
  return {
    execute: jest.fn().mockResolvedValue(undefined),
    getAll: jest.fn().mockResolvedValue([]),
    getOptional: jest.fn().mockResolvedValue(null),
    writeTransaction: jest.fn().mockImplementation(async (cb: (tx: any) => Promise<void>) => {
      const tx = { execute: jest.fn().mockResolvedValue(undefined) };
      await cb(tx);
      return tx;
    }),
    getNextCrudTransaction: jest.fn().mockResolvedValue(null),
  } as unknown as jest.Mocked<AbstractPowerSyncDatabase> & {
    writeTransaction: jest.Mock;
    getNextCrudTransaction: jest.Mock;
  };
}
