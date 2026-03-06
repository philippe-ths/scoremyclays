import type { AbstractPowerSyncDatabase } from '@powersync/common';
import * as Crypto from 'expo-crypto';
import { PresentationType, TargetConfig } from '@/lib/types';

interface SeedStand {
  stand_number: number;
  target_config: TargetConfig;
  presentation: PresentationType;
  presentation_notes: string | null;
  num_targets: number;
}

interface SeedPosition {
  position_number: number;
  name: string | null;
  stands: SeedStand[];
}

interface SeedClub {
  name: string;
  description: string | null;
  positions: SeedPosition[];
}

const SEED_CLUBS: SeedClub[] = [
  {
    name: 'Donarton Shooting Club',
    description: 'A premier sporting clay ground in the rolling Devon hills with challenging woodland layouts.',
    positions: [
      {
        position_number: 1,
        name: 'The Grouse Butt',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: 'High driven pair from tower', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.CROSSER, presentation_notes: 'Left-to-right, fast', num_targets: 8 },
        ],
      },
      {
        position_number: 2,
        name: 'Woodland Walk',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.TEAL, presentation_notes: 'Steep teal through trees', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.GOING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.SINGLE, presentation: PresentationType.LOOPER, presentation_notes: 'Loops over clearing', num_targets: 6 },
          { stand_number: 4, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'Tower Drive',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: '80ft tower, high and fast', num_targets: 10 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.BATTUE, presentation_notes: 'Thin battue from left', num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.CHANDELLE, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 4,
        name: 'Rabbit Run',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.RABBIT, presentation_notes: 'Ground-level bouncer', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.SPRINGING, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: 'Angled approach from gully', num_targets: 8 },
        ],
      },
      {
        position_number: 5,
        name: 'The Ravine',
        stands: [
          { stand_number: 1, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.DROPPING, presentation_notes: 'Drops into valley', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.CROSSER, presentation_notes: 'Right-to-left crossing ravine', num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 10 },
        ],
      },
    ],
  },
  {
    name: 'Northumberland Shooting School',
    description: 'Set in the Northumberland countryside with scenic views and a mix of driven and sporting stands.',
    positions: [
      {
        position_number: 1,
        name: 'Moorland',
        stands: [
          { stand_number: 1, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 2,
        name: 'Hedgerow',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.SPRINGING, presentation_notes: 'Springs over hedge', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.GOING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.TEAL, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'Riverside',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.LOOPER, presentation_notes: 'Loops over the river', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.BATTUE, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 4,
        name: 'The Bluff',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.CHANDELLE, presentation_notes: 'Rises and curves left', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DROPPING, presentation_notes: 'Drops from hilltop', num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: null, num_targets: 8 },
        ],
      },
    ],
  },
  {
    name: 'West Midlands Clay Sports',
    description: 'Compact sporting ground offering variety in a tight layout. Perfect for practice sessions.',
    positions: [
      {
        position_number: 1,
        name: 'Paddock',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 2,
        name: 'Copse',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.TEAL, presentation_notes: null, num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.GOING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.RABBIT, presentation_notes: 'Along the tree line', num_targets: 6 },
        ],
      },
      {
        position_number: 3,
        name: 'Top Field',
        stands: [
          { stand_number: 1, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.SPRINGING, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 8 },
          { stand_number: 4, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.LOOPER, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 4,
        name: 'The Ditch',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.DROPPING, presentation_notes: 'Drops into ditch', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 5,
        name: 'Orchard',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.CHANDELLE, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.BATTUE, presentation_notes: 'Thin battue through orchard gap', num_targets: 6 },
        ],
      },
      {
        position_number: 6,
        name: 'Bottom Meadow',
        stands: [
          { stand_number: 1, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
        ],
      },
    ],
  },
  {
    name: 'Highland Game Fair Ground',
    description: 'Challenging simulated game layout in the Scottish Highlands with long-range driven birds.',
    positions: [
      {
        position_number: 1,
        name: 'Glen Drive',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: 'High driven from hillside', num_targets: 10 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: 'Slightly lower angle', num_targets: 10 },
          { stand_number: 3, target_config: TargetConfig.SINGLE, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 8 },
          { stand_number: 4, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.CROSSER, presentation_notes: 'Fast crossing glen', num_targets: 10 },
          { stand_number: 5, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: null, num_targets: 12 },
        ],
      },
      {
        position_number: 2,
        name: 'Pheasant Flush',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.GOING_AWAY, presentation_notes: 'Flushing pheasant sim', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 10 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.SPRINGING, presentation_notes: null, num_targets: 10 },
          { stand_number: 4, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.LOOPER, presentation_notes: 'Loops over fir trees', num_targets: 10 },
          { stand_number: 5, target_config: TargetConfig.SINGLE, presentation: PresentationType.TEAL, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'Grouse Moor',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: 'Fast low driven', num_targets: 12 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 10 },
          { stand_number: 3, target_config: TargetConfig.SINGLE, presentation: PresentationType.CHANDELLE, presentation_notes: null, num_targets: 8 },
          { stand_number: 4, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 10 },
          { stand_number: 5, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DROPPING, presentation_notes: 'Drops behind butt', num_targets: 10 },
        ],
      },
    ],
  },
  {
    name: 'Surrey Hills Shooting Academy',
    description: 'Professional-grade coaching facility in the Surrey Hills AONB with beautifully maintained grounds.',
    positions: [
      {
        position_number: 1,
        name: 'Chalk Pit',
        stands: [
          { stand_number: 1, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.CROSSER, presentation_notes: 'Crosses over chalk quarry', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.TEAL, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 2,
        name: 'Beech Avenue',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: 'Through beech canopy', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.GOING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.LOOPER, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'The Dell',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.BATTUE, presentation_notes: 'Battue pair into dell', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.RABBIT, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.SPRINGING, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 4,
        name: 'Hilltop',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.CHANDELLE, presentation_notes: 'Wide chandelle over valley', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.DROPPING, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 5,
        name: 'The Yew Walk',
        stands: [
          { stand_number: 1, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: 'Tight angle through yews', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: 'Final stand, high tower', num_targets: 10 },
        ],
      },
    ],
  },
  {
    name: 'Yorkshire Clay Pigeon Club',
    description: 'Traditional Yorkshire club with a friendly atmosphere and varied terrain.',
    positions: [
      {
        position_number: 1,
        name: 'Dales View',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.GOING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 4, target_config: TargetConfig.SINGLE, presentation: PresentationType.TEAL, presentation_notes: 'Against the sky', num_targets: 6 },
        ],
      },
      {
        position_number: 2,
        name: 'Stone Wall',
        stands: [
          { stand_number: 1, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.RABBIT, presentation_notes: 'Along stone wall base', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.SINGLE, presentation: PresentationType.BATTUE, presentation_notes: null, num_targets: 6 },
          { stand_number: 4, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.INCOMING, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'Moor Top',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: 'Grouse sim, very fast', num_targets: 10 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.LOOPER, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.SPRINGING, presentation_notes: null, num_targets: 8 },
          { stand_number: 4, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.CHANDELLE, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 4,
        name: 'Beck Side',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.DROPPING, presentation_notes: 'Drops towards beck', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.CROSSER, presentation_notes: 'Wide crossing over water', num_targets: 8 },
          { stand_number: 4, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
        ],
      },
    ],
  },
  {
    name: 'Cornish Shooting Centre',
    description: 'Coastal clay ground with ocean breezes adding extra challenge to every stand.',
    positions: [
      {
        position_number: 1,
        name: 'Cliff Edge',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.CROSSER, presentation_notes: 'Wind-affected crossing', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.DROPPING, presentation_notes: 'Drops over cliff edge sim', num_targets: 8 },
        ],
      },
      {
        position_number: 2,
        name: 'Tin Mine',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.TEAL, presentation_notes: 'Springs from mine shaft', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.LOOPER, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'Harbour View',
        stands: [
          { stand_number: 1, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.INCOMING, presentation_notes: 'Comes in from the sea side', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.RABBIT, presentation_notes: 'Along harbour wall sim', num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.CHANDELLE, presentation_notes: null, num_targets: 8 },
        ],
      },
    ],
  },
  {
    name: 'Borders Gun Club',
    description: 'Scottish Borders club with rolling farmland terrain and well-designed sporting layouts.',
    positions: [
      {
        position_number: 1,
        name: 'Sheepfold',
        stands: [
          { stand_number: 1, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.DRIVEN, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.GOING_AWAY, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.QUARTERING_TOWARDS, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 2,
        name: 'Pine Ridge',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SINGLE, presentation: PresentationType.SPRINGING, presentation_notes: 'Springs through pines', num_targets: 6 },
          { stand_number: 2, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.CROSSER, presentation_notes: null, num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.BATTUE, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 3,
        name: 'Tweed Valley',
        stands: [
          { stand_number: 1, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.INCOMING, presentation_notes: 'Over the river', num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SINGLE, presentation: PresentationType.DROPPING, presentation_notes: null, num_targets: 6 },
          { stand_number: 3, target_config: TargetConfig.REPORT_PAIR, presentation: PresentationType.TEAL, presentation_notes: null, num_targets: 8 },
        ],
      },
      {
        position_number: 4,
        name: 'High Pasture',
        stands: [
          { stand_number: 1, target_config: TargetConfig.FOLLOWING_PAIR, presentation: PresentationType.QUARTERING_AWAY, presentation_notes: null, num_targets: 8 },
          { stand_number: 2, target_config: TargetConfig.SIMULTANEOUS_PAIR, presentation: PresentationType.LOOPER, presentation_notes: 'Wide looping pair', num_targets: 8 },
          { stand_number: 3, target_config: TargetConfig.SINGLE, presentation: PresentationType.CHANDELLE, presentation_notes: null, num_targets: 6 },
        ],
      },
    ],
  },
];

/**
 * Seeds the clubs, club_positions, and club_stands tables with realistic UK shooting club data.
 * Idempotent — only inserts if the clubs table is empty.
 */
export async function seedClubs(db: AbstractPowerSyncDatabase): Promise<void> {
  const existing = await db.getOptional<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM clubs',
  );
  if (existing && existing.cnt > 0) return;

  const createdBy = 'system';
  const now = new Date().toISOString();

  for (const club of SEED_CLUBS) {
    const clubId = Crypto.randomUUID();
    await db.execute(
      'INSERT INTO clubs (id, name, description, created_by, created_at) VALUES (?, ?, ?, ?, ?)',
      [clubId, club.name, club.description, createdBy, now],
    );

    for (const position of club.positions) {
      const positionId = Crypto.randomUUID();
      await db.execute(
        'INSERT INTO club_positions (id, club_id, position_number, name, created_at) VALUES (?, ?, ?, ?, ?)',
        [positionId, clubId, position.position_number, position.name, now],
      );

      for (const stand of position.stands) {
        const standId = Crypto.randomUUID();
        await db.execute(
          'INSERT INTO club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [standId, positionId, stand.stand_number, stand.target_config, stand.presentation, stand.presentation_notes, stand.num_targets, now],
        );
      }
    }
  }
}
