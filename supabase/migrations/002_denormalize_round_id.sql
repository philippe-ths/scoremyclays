-- =============================================================
-- Add denormalized round_id to shooter_entries and target_results
-- Required for PowerSync sync rules (single-table queries only)
-- =============================================================

ALTER TABLE public.shooter_entries ADD COLUMN round_id TEXT;
ALTER TABLE public.target_results ADD COLUMN round_id TEXT;

CREATE INDEX idx_shooter_entries_by_round ON public.shooter_entries (round_id);
CREATE INDEX idx_target_results_by_round ON public.target_results (round_id);
