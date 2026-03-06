-- =============================================================
-- Migration 004: Seed reference clubs data
-- Clubs are reference data synced to all clients via PowerSync.
-- Must live in Supabase so the reference_data bucket has data.
-- =============================================================

DO $$
DECLARE
  v_club_id UUID;
  v_pos_id UUID;
  v_now TEXT := to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
BEGIN
  -- Only seed if clubs table is empty
  IF EXISTS (SELECT 1 FROM public.clubs LIMIT 1) THEN
    RETURN;
  END IF;

  -- -------------------------------------------------------
  -- 1. Donarton Shooting Club
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Donarton Shooting Club',
    'A premier sporting clay ground in the rolling Devon hills with challenging woodland layouts.',
    'system', v_now);

  -- Position 1: The Grouse Butt
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'The Grouse Butt', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'DRIVEN', 'High driven pair from tower', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'INCOMING', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'CROSSER', 'Left-to-right, fast', 8, v_now);

  -- Position 2: Woodland Walk
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Woodland Walk', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'TEAL', 'Steep teal through trees', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'FOLLOWING_PAIR', 'GOING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SINGLE', 'LOOPER', 'Loops over clearing', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'REPORT_PAIR', 'QUARTERING_AWAY', NULL, 8, v_now);

  -- Position 3: Tower Drive
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Tower Drive', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'DRIVEN', '80ft tower, high and fast', 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'BATTUE', 'Thin battue from left', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'CHANDELLE', NULL, 8, v_now);

  -- Position 4: Rabbit Run
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 4, 'Rabbit Run', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'RABBIT', 'Ground-level bouncer', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SIMULTANEOUS_PAIR', 'SPRINGING', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'QUARTERING_TOWARDS', 'Angled approach from gully', 8, v_now);

  -- Position 5: The Ravine
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 5, 'The Ravine', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'FOLLOWING_PAIR', 'DROPPING', 'Drops into valley', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'CROSSER', 'Right-to-left crossing ravine', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'INCOMING', NULL, 10, v_now);

  -- -------------------------------------------------------
  -- 2. Northumberland Shooting School
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Northumberland Shooting School',
    'Set in the Northumberland countryside with scenic views and a mix of driven and sporting stands.',
    'system', v_now);

  -- Position 1: Moorland
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Moorland', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'REPORT_PAIR', 'DRIVEN', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'QUARTERING_AWAY', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'CROSSER', NULL, 8, v_now);

  -- Position 2: Hedgerow
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Hedgerow', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'SPRINGING', 'Springs over hedge', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'FOLLOWING_PAIR', 'GOING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'TEAL', NULL, 8, v_now);

  -- Position 3: Riverside
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Riverside', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'LOOPER', 'Loops over the river', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'BATTUE', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'INCOMING', NULL, 8, v_now);

  -- Position 4: The Bluff
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 4, 'The Bluff', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'CHANDELLE', 'Rises and curves left', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SIMULTANEOUS_PAIR', 'DROPPING', 'Drops from hilltop', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'FOLLOWING_PAIR', 'QUARTERING_TOWARDS', NULL, 8, v_now);

  -- -------------------------------------------------------
  -- 3. West Midlands Clay Sports
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'West Midlands Clay Sports',
    'Compact sporting ground offering variety in a tight layout. Perfect for practice sessions.',
    'system', v_now);

  -- Position 1: Paddock
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Paddock', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'CROSSER', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'DRIVEN', NULL, 8, v_now);

  -- Position 2: Copse
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Copse', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'TEAL', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SIMULTANEOUS_PAIR', 'GOING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'RABBIT', 'Along the tree line', 6, v_now);

  -- Position 3: Top Field
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Top Field', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'FOLLOWING_PAIR', 'QUARTERING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'SPRINGING', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'INCOMING', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'REPORT_PAIR', 'LOOPER', NULL, 8, v_now);

  -- Position 4: The Ditch
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 4, 'The Ditch', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'DROPPING', 'Drops into ditch', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'CROSSER', NULL, 8, v_now);

  -- Position 5: Orchard
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 5, 'Orchard', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'CHANDELLE', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'BATTUE', 'Thin battue through orchard gap', 6, v_now);

  -- Position 6: Bottom Meadow
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 6, 'Bottom Meadow', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'REPORT_PAIR', 'QUARTERING_TOWARDS', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'FOLLOWING_PAIR', 'DRIVEN', NULL, 8, v_now);

  -- -------------------------------------------------------
  -- 4. Highland Game Fair Ground
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Highland Game Fair Ground',
    'Challenging simulated game layout in the Scottish Highlands with long-range driven birds.',
    'system', v_now);

  -- Position 1: Glen Drive
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Glen Drive', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'DRIVEN', 'High driven from hillside', 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'DRIVEN', 'Slightly lower angle', 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SINGLE', 'INCOMING', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'FOLLOWING_PAIR', 'CROSSER', 'Fast crossing glen', 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 5, 'SIMULTANEOUS_PAIR', 'QUARTERING_TOWARDS', NULL, 12, v_now);

  -- Position 2: Pheasant Flush
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Pheasant Flush', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'GOING_AWAY', 'Flushing pheasant sim', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'QUARTERING_AWAY', NULL, 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'SPRINGING', NULL, 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'FOLLOWING_PAIR', 'LOOPER', 'Loops over fir trees', 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 5, 'SINGLE', 'TEAL', NULL, 8, v_now);

  -- Position 3: Grouse Moor
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Grouse Moor', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'DRIVEN', 'Fast low driven', 12, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'CROSSER', NULL, 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SINGLE', 'CHANDELLE', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'FOLLOWING_PAIR', 'INCOMING', NULL, 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 5, 'SIMULTANEOUS_PAIR', 'DROPPING', 'Drops behind butt', 10, v_now);

  -- -------------------------------------------------------
  -- 5. Surrey Hills Shooting Academy
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Surrey Hills Shooting Academy',
    'Professional-grade coaching facility in the Surrey Hills AONB with beautifully maintained grounds.',
    'system', v_now);

  -- Position 1: Chalk Pit
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Chalk Pit', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'REPORT_PAIR', 'CROSSER', 'Crosses over chalk quarry', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'TEAL', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'DRIVEN', NULL, 8, v_now);

  -- Position 2: Beech Avenue
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Beech Avenue', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'QUARTERING_AWAY', 'Through beech canopy', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'FOLLOWING_PAIR', 'GOING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'LOOPER', NULL, 8, v_now);

  -- Position 3: The Dell
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'The Dell', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'BATTUE', 'Battue pair into dell', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'RABBIT', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'SPRINGING', NULL, 8, v_now);

  -- Position 4: Hilltop
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 4, 'Hilltop', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'CHANDELLE', 'Wide chandelle over valley', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SIMULTANEOUS_PAIR', 'INCOMING', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'FOLLOWING_PAIR', 'DROPPING', NULL, 8, v_now);

  -- Position 5: The Yew Walk
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 5, 'The Yew Walk', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'REPORT_PAIR', 'QUARTERING_TOWARDS', 'Tight angle through yews', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'CROSSER', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'DRIVEN', 'Final stand, high tower', 10, v_now);

  -- -------------------------------------------------------
  -- 6. Yorkshire Clay Pigeon Club
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Yorkshire Clay Pigeon Club',
    'Traditional Yorkshire club with a friendly atmosphere and varied terrain.',
    'system', v_now);

  -- Position 1: Dales View
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Dales View', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'DRIVEN', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'CROSSER', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'GOING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'SINGLE', 'TEAL', 'Against the sky', 6, v_now);

  -- Position 2: Stone Wall
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Stone Wall', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'FOLLOWING_PAIR', 'RABBIT', 'Along stone wall base', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'QUARTERING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SINGLE', 'BATTUE', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'SIMULTANEOUS_PAIR', 'INCOMING', NULL, 8, v_now);

  -- Position 3: Moor Top
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Moor Top', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'DRIVEN', 'Grouse sim, very fast', 10, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'LOOPER', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'SPRINGING', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'FOLLOWING_PAIR', 'CHANDELLE', NULL, 8, v_now);

  -- Position 4: Beck Side
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 4, 'Beck Side', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'DROPPING', 'Drops towards beck', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'REPORT_PAIR', 'QUARTERING_TOWARDS', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'CROSSER', 'Wide crossing over water', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 4, 'FOLLOWING_PAIR', 'DRIVEN', NULL, 8, v_now);

  -- -------------------------------------------------------
  -- 7. Cornish Shooting Centre
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Cornish Shooting Centre',
    'Coastal clay ground with ocean breezes adding extra challenge to every stand.',
    'system', v_now);

  -- Position 1: Cliff Edge
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Cliff Edge', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'CROSSER', 'Wind-affected crossing', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'DRIVEN', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'DROPPING', 'Drops over cliff edge sim', 8, v_now);

  -- Position 2: Tin Mine
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Tin Mine', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'TEAL', 'Springs from mine shaft', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'FOLLOWING_PAIR', 'QUARTERING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'LOOPER', NULL, 8, v_now);

  -- Position 3: Harbour View
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Harbour View', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'REPORT_PAIR', 'INCOMING', 'Comes in from the sea side', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'RABBIT', 'Along harbour wall sim', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'CHANDELLE', NULL, 8, v_now);

  -- -------------------------------------------------------
  -- 8. Borders Gun Club
  -- -------------------------------------------------------
  v_club_id := gen_random_uuid();
  INSERT INTO public.clubs (id, name, description, created_by, created_at)
  VALUES (v_club_id, 'Borders Gun Club',
    'Scottish Borders club with rolling farmland terrain and well-designed sporting layouts.',
    'system', v_now);

  -- Position 1: Sheepfold
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 1, 'Sheepfold', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'REPORT_PAIR', 'DRIVEN', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'GOING_AWAY', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SIMULTANEOUS_PAIR', 'QUARTERING_TOWARDS', NULL, 8, v_now);

  -- Position 2: Pine Ridge
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 2, 'Pine Ridge', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SINGLE', 'SPRINGING', 'Springs through pines', 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'FOLLOWING_PAIR', 'CROSSER', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'BATTUE', NULL, 8, v_now);

  -- Position 3: Tweed Valley
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 3, 'Tweed Valley', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'SIMULTANEOUS_PAIR', 'INCOMING', 'Over the river', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SINGLE', 'DROPPING', NULL, 6, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'REPORT_PAIR', 'TEAL', NULL, 8, v_now);

  -- Position 4: High Pasture
  v_pos_id := gen_random_uuid();
  INSERT INTO public.club_positions (id, club_id, position_number, name, created_at)
  VALUES (v_pos_id, v_club_id::text, 4, 'High Pasture', v_now);
  INSERT INTO public.club_stands (id, club_position_id, stand_number, target_config, presentation, presentation_notes, num_targets, created_at) VALUES
    (gen_random_uuid(), v_pos_id::text, 1, 'FOLLOWING_PAIR', 'QUARTERING_AWAY', NULL, 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 2, 'SIMULTANEOUS_PAIR', 'LOOPER', 'Wide looping pair', 8, v_now),
    (gen_random_uuid(), v_pos_id::text, 3, 'SINGLE', 'CHANDELLE', NULL, 6, v_now);

END $$;
