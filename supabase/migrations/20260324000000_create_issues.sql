-- Migration: Create issues, issue_comments, and issue_upvotes tables
-- Version: 003
-- Created: 2026-03-24
-- Adds is_admin flag to profiles

-- Profiles: add is_admin
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.is_admin IS 'Marks PRAI team admins who can pin issues and reply with admin badge';

-- Issues
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_status') THEN
    CREATE TYPE public.issue_status AS ENUM ('open', 'in_progress', 'closed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_label') THEN
    CREATE TYPE public.issue_label AS ENUM ('bug', 'feature', 'question', 'docs');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.issues (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT          NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  body        TEXT,
  status      public.issue_status NOT NULL DEFAULT 'open',
  label       public.issue_label,
  is_pinned   BOOLEAN       NOT NULL DEFAULT FALSE,
  upvotes     INTEGER       NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_issues_user_id   ON public.issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status     ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_pinned     ON public.issues(is_pinned DESC, created_at DESC);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_issues_updated_at ON public.issues;
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "issues_select_all"   ON public.issues FOR SELECT USING (true);
CREATE POLICY "issues_insert_auth"  ON public.issues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "issues_update_owner" ON public.issues FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));
CREATE POLICY "issues_delete_owner" ON public.issues FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

COMMENT ON TABLE  public.issues           IS 'User-submitted bug reports and feature requests';
COMMENT ON COLUMN public.issues.upvotes   IS 'Denormalized upvote counter maintained by trigger — avoids COUNT(*) at query time';
COMMENT ON COLUMN public.issues.is_pinned IS 'Admin-pinnable issues that always appear at the top of the list';

-- Issue Comments
CREATE TABLE IF NOT EXISTS public.issue_comments (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id       UUID        NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body           TEXT        NOT NULL CHECK (char_length(body) > 0),
  is_admin_reply BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issue_comments_issue_id   ON public.issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_created_at ON public.issue_comments(issue_id, created_at);

ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "issue_comments_select_all"  ON public.issue_comments FOR SELECT USING (true);
CREATE POLICY "issue_comments_insert_auth" ON public.issue_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "issue_comments_delete_owner" ON public.issue_comments FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

COMMENT ON TABLE  public.issue_comments               IS 'Comments on issues, supports admin badge via is_admin_reply';
COMMENT ON COLUMN public.issue_comments.is_admin_reply IS 'When true, the comment is shown with the PRAI Team badge';

-- Issue Upvotes
CREATE TABLE IF NOT EXISTS public.issue_upvotes (
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
  PRIMARY KEY (issue_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_issue_upvotes_issue_id ON public.issue_upvotes(issue_id);

ALTER TABLE public.issue_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "issue_upvotes_select_all"   ON public.issue_upvotes FOR SELECT USING (true);
CREATE POLICY "issue_upvotes_insert_auth"  ON public.issue_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "issue_upvotes_delete_own"   ON public.issue_upvotes FOR DELETE USING (auth.uid() = user_id);

COMMENT ON TABLE public.issue_upvotes IS 'Per-user upvote relationship — one row per (issue, user). A trigger maintains the denormalized issues.upvotes counter.';

-- Upvote counter trigger
-- Increments/decrements issues.upvotes atomically when upvotes are added/removed
CREATE OR REPLACE FUNCTION public.handle_issue_upvote_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.issues SET upvotes = upvotes + 1 WHERE id = NEW.issue_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.issues SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.issue_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_issue_upvote_change ON public.issue_upvotes;
CREATE TRIGGER on_issue_upvote_change
  AFTER INSERT OR DELETE ON public.issue_upvotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_issue_upvote_change();
