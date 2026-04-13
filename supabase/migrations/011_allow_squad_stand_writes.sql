-- =============================================================
-- Migration 011: Allow Squad Stand Writes
-- Permits any squad member to write to stands.
-- Replaces the SELECT-only policy for shooters with an ALL policy.
--
-- Fixes: #59 — RLS policy violation when syncing stands table
--
-- Follows the same pattern as migration 008 (target_results).
-- =============================================================

DROP POLICY IF EXISTS stands_select_as_shooter ON public.stands;

CREATE POLICY stands_all_as_shooter ON public.stands
  FOR ALL USING (
    round_id IN (SELECT public.get_user_round_ids(auth.uid()::text))
  );
