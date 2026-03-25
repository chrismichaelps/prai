-- Fix: re-target issues.user_id and issue_comments.user_id FKs to public.profiles
-- instead of auth.users so PostgREST can resolve the author embed join.
-- profiles.id = auth.users.id by Supabase convention so data integrity is maintained.

ALTER TABLE public.issues
  DROP CONSTRAINT IF EXISTS issues_user_id_fkey;

ALTER TABLE public.issues
  ADD CONSTRAINT issues_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.issue_comments
  DROP CONSTRAINT IF EXISTS issue_comments_user_id_fkey;

ALTER TABLE public.issue_comments
  ADD CONSTRAINT issue_comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;
