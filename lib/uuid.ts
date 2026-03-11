import { CryptoDigestAlgorithm, digestStringAsync } from 'expo-crypto';

/**
 * Generate a deterministic UUID from an input string.
 * Uses SHA-256 and formats the first 16 bytes as a UUID v4-shaped string.
 * Two calls with the same input always produce the same UUID.
 */
export async function deterministicUUID(input: string): Promise<string> {
  const hex = await digestStringAsync(CryptoDigestAlgorithm.SHA256, input);

  // Format first 32 hex chars as UUID: 8-4-4-4-12
  // Set version nibble (position 12) to 4 and variant bits (position 16) to 8-b
  const h = hex.slice(0, 32).split('');
  h[12] = '4'; // version 4
  h[16] = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16); // variant 10xx

  return [
    h.slice(0, 8).join(''),
    h.slice(8, 12).join(''),
    h.slice(12, 16).join(''),
    h.slice(16, 20).join(''),
    h.slice(20, 32).join(''),
  ].join('-');
}
