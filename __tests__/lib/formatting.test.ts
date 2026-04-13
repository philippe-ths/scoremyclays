import { describe, expect, it } from '@jest/globals';
import { formatRoundStatusLabel } from '@/lib/formatting';
import { RoundStatus } from '@/lib/types';

describe('formatRoundStatusLabel', () => {
  it('formats known round statuses consistently', () => {
    expect(formatRoundStatusLabel(RoundStatus.SETUP)).toBe('Setup');
    expect(formatRoundStatusLabel(RoundStatus.IN_PROGRESS)).toBe('In Progress');
    expect(formatRoundStatusLabel(RoundStatus.COMPLETED)).toBe('Completed');
    expect(formatRoundStatusLabel(RoundStatus.ABANDONED)).toBe('Abandoned');
  });

  it('returns unknown statuses unchanged', () => {
    expect(formatRoundStatusLabel('CUSTOM')).toBe('CUSTOM');
  });
});