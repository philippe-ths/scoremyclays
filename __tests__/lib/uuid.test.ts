import { deterministicUUID } from '@/lib/uuid';

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: jest.fn().mockImplementation(async (_algo: string, input: string) => {
    // Simple mock hash: use a deterministic mapping
    // Real SHA-256 would produce 64 hex chars; we simulate that
    const { createHash } = require('crypto');
    return createHash('sha256').update(input).digest('hex');
  }),
}));

describe('deterministicUUID', () => {
  it('produces the same output for the same input', async () => {
    const uuid1 = await deterministicUUID('test-input');
    const uuid2 = await deterministicUUID('test-input');

    expect(uuid1).toBe(uuid2);
  });

  it('produces different output for different inputs', async () => {
    const uuid1 = await deterministicUUID('input-a');
    const uuid2 = await deterministicUUID('input-b');

    expect(uuid1).not.toBe(uuid2);
  });

  it('matches UUID v4 format', async () => {
    const uuid = await deterministicUUID('format-test');

    // UUID format: 8-4-4-4-12 hex chars
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});
