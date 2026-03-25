-- Migration: notifications table for @mention and issue activity alerts
-- Version: 004 | Created: 2026-03-24

DO $$ BEGIN
  CREATE TYPE public.notification_type AS ENUM ('mention', 'comment', 'status_change');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  type         public.notification_type NOT NULL,
  recipient_id UUID               NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id     UUID               NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_id     UUID               NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  comment_id   UUID               REFERENCES public.issue_comments(id) ON DELETE CASCADE,
  read         BOOLEAN            NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
  ON public.notifications(recipient_id, read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_issue_id
  ON public.notifications(issue_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "notifications_insert_auth"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = recipient_id);

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  USING (auth.uid() = recipient_id);

COMMENT ON TABLE public.notifications
  IS 'Per-user notification feed: mentions, comments, status changes on issues';
