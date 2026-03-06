-- =============================================================
-- Fix ALL remaining infinite-recursion RLS policies
--
-- Migration 003 fixed only shooter_entries_select_as_shooter.
-- The other 7 cross-table policies still cause:
--   "infinite recursion detected in policy for relation ..."
-- on rounds, squads, shooter_entries, stands, target_results.
--
-- Strategy:
--   1. Create SECURITY DEFINER functions that bypass RLS
--   2. Drop + recreate each policy using only those functions
--      and denormalized columns (no cross-table JOINs in RLS)
--
-- Depends on: 002 (denormalized round_id on shooter_entries,
--             target_results) and 003 (get_user_squad_ids).
-- =============================================================

-- -----------------------------------------------------------
-- 1. SECURITY DEFINER helper functions
-- -----------------------------------------------------------

-- Returns all round IDs the user can access (as owner or shooter)
CREATE OR REPLACE FUNCTION public.get_user_round_ids(uid text)
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id::text FROM rounds WHERE created_by = uid
  UNION
  SELECT round_id FROM shooter_entries
    WHERE user_id = uid AND round_id IS NOT NULL;
$$;

-- Returns TRUE if the user owns the given round
CREATE OR REPLACE FUNCTION public.is_round_owner(rid text, uid text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM rounds WHERE id::text = rid AND created_by = uid
  );
$$;

-- -----------------------------------------------------------
-- 2. Drop and recreate the 7 remaining recursive policies
-- -----------------------------------------------------------

-- ROUNDS: select as shooter -----------------------------------
DROP POLICY IF EXISTS rounds_select_as_shooter ON public.rounds;
CREATE POLICY rounds_select_as_shooter ON public.rounds
  FOR SELECT USING (
    id::text IN (SELECT public.get_user_round_ids(auth.uid()::text))
  );

-- SQUADS: owner (full access for round owner) -----------------
DROP POLICY IF EXISTS squads_owner ON public.squads;
CREATE POLICY squads_owner ON public.squads
  FOR ALL USING (
    public.is_round_owner(round_id, auth.uid()::text)
  );

-- SQUADS: select as shooter -----------------------------------
DROP POLICY IF EXISTS squads_select_as_shooter ON public.squads;
CREATE POLICY squads_select_as_shooter ON public.squads
  FOR SELECT USING (
    id::text IN (SELECT public.get_user_squad_ids(auth.uid()::text))
  );

-- SHOOTER ENTRIES: owner (full access for round owner) --------
DROP POLICY IF EXISTS shooter_entries_owner ON public.shooter_entries;
CREATE POLICY shooter_entries_owner ON public.shooter_entries
  FOR ALL USING (
    public.is_round_owner(round_id, auth.uid()::text)
  );

-- STANDS: owner (full access for round owner) -----------------
DROP POLICY IF EXISTS stands_owner ON public.stands;
CREATE POLICY stands_owner ON public.stands
  FOR ALL USING (
    public.is_round_owner(round_id, auth.uid()::text)
  );

-- STANDS: select as shooter -----------------------------------
DROP POLICY IF EXISTS stands_select_as_shooter ON public.stands;
CREATE POLICY stands_select_as_shooter ON public.stands
  FOR SELECT USING (
    round_id IN (SELECT public.get_user_round_ids(auth.uid()::text))
  );

-- TARGET RESULTS: owner (full access for round owner) ---------
DROP POLICY IF EXISTS target_results_owner ON public.target_results;
CREATE POLICY target_results_owner ON public.target_results
  FOR ALL USING (
    public.is_round_owner(round_id, auth.uid()::text)
  );

-- TARGET RESULTS: select as shooter ---------------------------
DROP POLICY IF EXISTS target_results_select_as_shooter ON public.target_results;
CREATE POLICY target_results_select_as_shooter ON public.target_results
  FOR SELECT USING (
    round_id IN (SELECT public.get_user_round_ids(auth.uid()::text))
  );
