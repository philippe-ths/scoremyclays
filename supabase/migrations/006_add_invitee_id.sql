-- =============================================================
-- Add invitee_id (UUID) to invites table
--
-- PowerSync sync rules require single-table parameter queries.
-- The invited_rounds bucket needs to look up invites by the
-- invitee's UUID (request.user_id()), but invitee_user_id
-- stores the handle. Adding invitee_id allows a direct match.
-- =============================================================

ALTER TABLE public.invites ADD COLUMN invitee_id TEXT;

CREATE INDEX idx_invites_by_invitee_id ON public.invites (invitee_id);

-- Backfill existing invites with the invitee's UUID
UPDATE public.invites
SET invitee_id = u.id::text
FROM public.users u
WHERE u.user_id = invites.invitee_user_id;
