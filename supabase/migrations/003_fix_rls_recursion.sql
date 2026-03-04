-- =============================================================
-- Fix infinite recursion in shooter_entries RLS policy
--
-- shooter_entries_select_as_shooter referenced shooter_entries
-- itself, causing infinite recursion when accessed via other
-- tables' RLS chains (target_results → stands → shooter_entries).
-- =============================================================

-- 1. SECURITY DEFINER function bypasses RLS to look up squad membership
CREATE OR REPLACE FUNCTION public.get_user_squad_ids(uid text)
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT squad_id FROM shooter_entries WHERE user_id = uid;
$$;

-- 2. Drop the self-referencing policy
DROP POLICY shooter_entries_select_as_shooter ON public.shooter_entries;

-- 3. Recreate using the SECURITY DEFINER function (no recursion)
CREATE POLICY shooter_entries_select_as_shooter ON public.shooter_entries
  FOR SELECT USING (
    squad_id IN (SELECT public.get_user_squad_ids(auth.uid()::text))
  );
