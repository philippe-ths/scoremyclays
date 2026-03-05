-- =============================================================
-- Allow invitees to insert their own shooter_entry on accept
--
-- shooter_entries_owner only allows the round OWNER to write.
-- When an invitee accepts, their PowerSync client tries to
-- upload a new shooter_entry — blocked by RLS.
--
-- Fix: SECURITY DEFINER function + INSERT policy scoped to
-- rows where user_id = auth.uid() and a PENDING invite exists.
-- Also add a simpler invites update policy using invitee_id.
-- =============================================================

-- 1. SECURITY DEFINER: check if user has an invite for this round
--    Checks ANY status (not just PENDING) because the invite PATCH
--    may arrive before the shooter_entry PUT in the same upload cycle.
CREATE OR REPLACE FUNCTION public.has_pending_invite(rid text, uid text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM invites
    WHERE round_id = rid
      AND invitee_id = uid
  );
$$;

-- 2. Allow invitees to INSERT their own shooter_entry
CREATE POLICY shooter_entries_insert_as_invitee ON public.shooter_entries
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()::text
    AND public.has_pending_invite(round_id, auth.uid()::text)
  );

-- 3. Simpler invites update policy using invitee_id (UUID) directly
--    The existing invites_invitee_update uses a cross-table lookup
--    via user_id handle, which may fail in some RLS contexts.
CREATE POLICY invites_invitee_update_by_id ON public.invites
  FOR UPDATE
  USING (invitee_id = auth.uid()::text);
