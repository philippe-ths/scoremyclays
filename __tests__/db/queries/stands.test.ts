import { createMockDb } from '../../helpers/mockDb';
import { smcUpdateStand } from '@/db/queries/smc-stands';
import { TargetConfig, PresentationType } from '@/lib/types';

describe('smcUpdateStand', () => {
  it('builds dynamic SQL for partial updates', async () => {
    const db = createMockDb();

    await smcUpdateStand(db, 'stand1', {
      num_targets: 5,
      presentation: PresentationType.DRIVEN,
    });

    expect(db.execute).toHaveBeenCalledTimes(1);
    const [sql, params] = (db.execute as jest.Mock).mock.calls[0];
    expect(sql).toContain('num_targets = ?');
    expect(sql).toContain('presentation = ?');
    expect(params).toContain(5);
    expect(params).toContain(PresentationType.DRIVEN);
    expect(params[params.length - 1]).toBe('stand1');
  });

  it('does not execute when no params provided', async () => {
    const db = createMockDb();

    await smcUpdateStand(db, 'stand1', {});

    expect(db.execute).not.toHaveBeenCalled();
  });

  it('handles single field update', async () => {
    const db = createMockDb();

    await smcUpdateStand(db, 'stand1', { target_config: TargetConfig.REPORT_PAIR });

    const [sql, params] = (db.execute as jest.Mock).mock.calls[0];
    expect(sql).toBe('UPDATE stands SET target_config = ? WHERE id = ?');
    expect(params).toEqual([TargetConfig.REPORT_PAIR, 'stand1']);
  });
});
