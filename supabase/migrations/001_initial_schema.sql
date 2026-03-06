-- =============================================================
-- ScoreMyClays: Initial Supabase PostgreSQL schema
-- Mirrors the local PowerSync SQLite schema in db/schema.ts
--
-- Structure: All tables & indexes first, then RLS policies,
-- so cross-table policy references resolve correctly.
-- =============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================================
-- 1. CREATE TABLES & INDEXES
-- ===========================================================

-- -----------------------------------------------------------
-- USERS
-- -----------------------------------------------------------
CREATE TABLE public.users (
  id UUID PRIMARY KEY,  -- matches Supabase auth.users.id
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  user_id TEXT UNIQUE,  -- unique handle for invites (e.g. philippe_20)
  discoverable INTEGER NOT NULL DEFAULT 0,  -- 0 = private, 1 = visible in search
  favourite_club_ids TEXT NOT NULL DEFAULT '[]',  -- JSON array
  gear TEXT NOT NULL DEFAULT '[]',  -- JSON array
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
  updated_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

-- -----------------------------------------------------------
-- CLUBS (reference data, read-only for users)
-- -----------------------------------------------------------
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

-- -----------------------------------------------------------
-- CLUB POSITIONS
-- -----------------------------------------------------------
CREATE TABLE public.club_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id TEXT NOT NULL,
  position_number INTEGER NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

CREATE INDEX idx_club_positions_by_club ON public.club_positions (club_id);

-- -----------------------------------------------------------
-- CLUB STANDS
-- -----------------------------------------------------------
CREATE TABLE public.club_stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_position_id TEXT NOT NULL,
  stand_number INTEGER NOT NULL,
  target_config TEXT,
  presentation TEXT,
  presentation_notes TEXT,
  num_targets INTEGER,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

CREATE INDEX idx_club_stands_by_position ON public.club_stands (club_position_id);

-- -----------------------------------------------------------
-- ROUNDS
-- -----------------------------------------------------------
CREATE TABLE public.rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by TEXT NOT NULL,
  ground_name TEXT,
  date TEXT,
  total_targets INTEGER,
  status TEXT,
  notes TEXT,
  club_id TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
  updated_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

-- -----------------------------------------------------------
-- SQUADS
-- -----------------------------------------------------------
CREATE TABLE public.squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id TEXT NOT NULL
);

-- -----------------------------------------------------------
-- SHOOTER ENTRIES
-- -----------------------------------------------------------
CREATE TABLE public.shooter_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id TEXT NOT NULL,
  user_id TEXT,  -- nullable: guest shooters don't have accounts
  shooter_name TEXT,
  position_in_squad INTEGER
);

CREATE INDEX idx_shooter_entries_by_squad ON public.shooter_entries (squad_id);

-- -----------------------------------------------------------
-- STANDS
-- -----------------------------------------------------------
CREATE TABLE public.stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id TEXT NOT NULL,
  stand_number INTEGER,
  target_config TEXT,
  presentation TEXT,
  presentation_notes TEXT,
  num_targets INTEGER,
  club_stand_id TEXT,
  club_position_id TEXT
);

CREATE INDEX idx_stands_by_round ON public.stands (round_id);

-- -----------------------------------------------------------
-- TARGET RESULTS
-- -----------------------------------------------------------
CREATE TABLE public.target_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stand_id TEXT NOT NULL,
  shooter_entry_id TEXT NOT NULL,
  target_number INTEGER,
  bird_number INTEGER,
  result TEXT,
  recorded_by TEXT,
  device_id TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

CREATE INDEX idx_target_results_by_stand ON public.target_results (stand_id);
CREATE INDEX idx_target_results_by_shooter ON public.target_results (shooter_entry_id);

-- -----------------------------------------------------------
-- INVITES
-- -----------------------------------------------------------
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id TEXT NOT NULL,
  inviter_id TEXT NOT NULL,  -- User.id (UUID) of the person sending
  invitee_user_id TEXT NOT NULL,  -- User.user_id (handle) of the person invited
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
);

CREATE INDEX idx_invites_by_round ON public.invites (round_id);
CREATE INDEX idx_invites_by_invitee ON public.invites (invitee_user_id);
CREATE INDEX idx_invites_by_inviter ON public.invites (inviter_id);

-- ===========================================================
-- 2. ENABLE RLS ON ALL TABLES
-- ===========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shooter_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- ===========================================================
-- 3. RLS POLICIES (all tables exist, cross-references OK)
-- ===========================================================

-- --- USERS ---
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_select_discoverable ON public.users
  FOR SELECT USING (discoverable = 1);

CREATE POLICY users_insert_own ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- --- CLUBS (read-only for authenticated) ---
CREATE POLICY clubs_select_all ON public.clubs
  FOR SELECT TO authenticated USING (true);

-- --- CLUB POSITIONS (read-only for authenticated) ---
CREATE POLICY club_positions_select_all ON public.club_positions
  FOR SELECT TO authenticated USING (true);

-- --- CLUB STANDS (read-only for authenticated) ---
CREATE POLICY club_stands_select_all ON public.club_stands
  FOR SELECT TO authenticated USING (true);

-- --- ROUNDS ---
CREATE POLICY rounds_owner ON public.rounds
  FOR ALL USING (auth.uid()::text = created_by);

CREATE POLICY rounds_select_as_shooter ON public.rounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shooter_entries se
      JOIN public.squads s ON se.squad_id = s.id::text
      WHERE s.round_id = rounds.id::text
      AND se.user_id = auth.uid()::text
    )
  );

-- --- SQUADS ---
CREATE POLICY squads_owner ON public.squads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rounds r
      WHERE r.id = squads.round_id::uuid
      AND r.created_by = auth.uid()::text
    )
  );

CREATE POLICY squads_select_as_shooter ON public.squads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shooter_entries se
      WHERE se.squad_id = squads.id::text
      AND se.user_id = auth.uid()::text
    )
  );

-- --- SHOOTER ENTRIES ---
CREATE POLICY shooter_entries_owner ON public.shooter_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.squads s
      JOIN public.rounds r ON s.round_id = r.id::text
      WHERE s.id::text = shooter_entries.squad_id
      AND r.created_by = auth.uid()::text
    )
  );

CREATE POLICY shooter_entries_select_as_shooter ON public.shooter_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shooter_entries se2
      WHERE se2.squad_id = shooter_entries.squad_id
      AND se2.user_id = auth.uid()::text
    )
  );

-- --- STANDS ---
CREATE POLICY stands_owner ON public.stands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rounds r
      WHERE r.id = stands.round_id::uuid
      AND r.created_by = auth.uid()::text
    )
  );

CREATE POLICY stands_select_as_shooter ON public.stands
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shooter_entries se
      JOIN public.squads s ON se.squad_id = s.id::text
      WHERE s.round_id = stands.round_id
      AND se.user_id = auth.uid()::text
    )
  );

-- --- TARGET RESULTS ---
CREATE POLICY target_results_owner ON public.target_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.stands st
      JOIN public.rounds r ON r.id = st.round_id::uuid
      WHERE st.id = target_results.stand_id::uuid
      AND r.created_by = auth.uid()::text
    )
  );

CREATE POLICY target_results_select_as_shooter ON public.target_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shooter_entries se
      WHERE se.id = target_results.shooter_entry_id::uuid
      AND se.user_id = auth.uid()::text
    )
  );

-- --- INVITES ---
CREATE POLICY invites_inviter ON public.invites
  FOR ALL USING (auth.uid()::text = inviter_id);

CREATE POLICY invites_invitee_select ON public.invites
  FOR SELECT USING (
    invitee_user_id IN (
      SELECT user_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY invites_invitee_update ON public.invites
  FOR UPDATE USING (
    invitee_user_id IN (
      SELECT user_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ===========================================================
-- 4. PUBLICATION for PowerSync replication
-- ===========================================================
CREATE PUBLICATION powersync FOR TABLE
  public.users,
  public.rounds,
  public.squads,
  public.shooter_entries,
  public.stands,
  public.target_results,
  public.clubs,
  public.club_positions,
  public.club_stands,
  public.invites;
