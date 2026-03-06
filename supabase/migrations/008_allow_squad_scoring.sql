-- =============================================================
-- Migration 008: Allow Squad Scoring
-- Permits any squad member to write to target_results.
-- Replaces the SELECT-only policy for shooters with an ALL policy.
-- =============================================================

DROP POLICY IF EXISTS target_results_select_as_shooter ON public.target_results;

CREATE POLICY target_results_all_as_shooter ON public.target_results
  FOR ALL USING (
    round_id IN (SELECT public.get_user_round_ids(auth.uid()::text))
  );
