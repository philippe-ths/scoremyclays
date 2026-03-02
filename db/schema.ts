import { column, Schema, Table } from '@powersync/common';

const users = new Table({
  display_name: column.text,
  email: column.text,
  created_at: column.text,
});

const rounds = new Table({
  created_by: column.text,
  ground_name: column.text,
  date: column.text,
  total_targets: column.integer,
  status: column.text,
  notes: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const squads = new Table({
  round_id: column.text,
});

const shooter_entries = new Table(
  {
    squad_id: column.text,
    user_id: column.text,
    shooter_name: column.text,
    position_in_squad: column.integer,
  },
  { indexes: { by_squad: ['squad_id'] } }
);

const stands = new Table(
  {
    round_id: column.text,
    stand_number: column.integer,
    target_config: column.text,
    presentation: column.text,
    presentation_notes: column.text,
    num_targets: column.integer,
  },
  { indexes: { by_round: ['round_id'] } }
);

const target_results = new Table(
  {
    stand_id: column.text,
    shooter_entry_id: column.text,
    target_number: column.integer,
    bird_number: column.integer,
    result: column.text,
    recorded_by: column.text,
    device_id: column.text,
    created_at: column.text,
  },
  { indexes: { by_stand: ['stand_id'], by_shooter: ['shooter_entry_id'] } }
);

export const AppSchema = new Schema({
  users,
  rounds,
  squads,
  shooter_entries,
  stands,
  target_results,
});

export type Database = (typeof AppSchema)['types'];
