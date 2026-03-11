-- =============================================================
-- Migration 010: Unique constraint on stands for club rounds
-- Prevents duplicate stand rows for the same club stand in a round.
--
-- Fixes: #60 — Duplicate stand creation race condition
--
-- When two squad members select the same club stand before sync,
-- both may attempt to insert a stand row. The app now uses
-- deterministic UUIDs so IDs match, but this constraint is a
-- DB-level safety net for any remaining edge cases.
-- =============================================================

CREATE UNIQUE INDEX idx_stands_unique_club_stand
  ON public.stands (round_id, club_stand_id)
  WHERE club_stand_id IS NOT NULL;
