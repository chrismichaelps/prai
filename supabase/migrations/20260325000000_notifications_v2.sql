-- Notifications V2 Migration
-- Adds: read_at (replaces read boolean), seen_at, archived_at, resource_type, resource_id, title, body
-- Note: First migrates existing 'read' boolean to 'read_at' timestamp

-- Add new columns
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS read_at timestamptz,
ADD COLUMN IF NOT EXISTS seen_at timestamptz,
ADD COLUMN IF NOT EXISTS archived_at timestamptz,
ADD COLUMN IF NOT EXISTS resource_type text,
ADD COLUMN IF NOT EXISTS resource_id uuid,
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS body text;

-- Migrate existing read=true to read_at = now()
UPDATE notifications SET read_at = NOW() WHERE read = true;

-- Update existing data to populate title from issues table
UPDATE notifications n
SET title = COALESCE(
  (SELECT i.title FROM issues i WHERE i.id = n.issue_id LIMIT 1),
  'Notification'
)
WHERE n.title IS NULL;

-- Set resource_type based on existing data
UPDATE notifications
SET resource_type = CASE
  WHEN comment_id IS NOT NULL THEN 'comment'
  ELSE 'issue'
END,
resource_id = COALESCE(comment_id, issue_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON notifications(recipient_id, created_at DESC) 
WHERE read_at IS NULL AND archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON notifications(recipient_id, created_at DESC) 
WHERE read_at IS NOT NULL AND archived_at IS NULL;

-- RPC function: Get notifications with limit (updated to include issue_id)
CREATE OR REPLACE FUNCTION public.get_notifications(
  p_user_id uuid,
  p_limit int DEFAULT 20,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  type text,
  title text,
  body text,
  resource_type text,
  resource_id uuid,
  issue_id uuid,
  actor_id uuid,
  actor_handle text,
  actor_avatar_url text,
  is_read boolean,
  created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT 
    n.id,
    n.type::text,
    COALESCE(n.title, 'Notification')::text,
    n.body,
    n.resource_type::text,
    n.resource_id,
    n.issue_id,
    n.actor_id,
    p.handle AS actor_handle,
    p.avatar_url AS actor_avatar_url,
    (n.read_at IS NOT NULL) AS is_read,
    n.created_at
  FROM notifications n
  LEFT JOIN profiles p ON p.id = n.actor_id
  WHERE n.recipient_id = p_user_id
    AND n.archived_at IS NULL
  ORDER BY n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- RPC function: Get unread count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id uuid)
RETURNS int
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COUNT(*)::int
  FROM notifications
  WHERE recipient_id = p_user_id
    AND read_at IS NULL
    AND archived_at IS NULL;
$$;

-- RPC function: Mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  p_user_id uuid,
  p_notification_ids uuid[] DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_notification_ids IS NULL THEN
    UPDATE notifications
    SET read_at = now()
    WHERE recipient_id = p_user_id
      AND read_at IS NULL;
  ELSE
    UPDATE notifications
    SET read_at = now()
    WHERE recipient_id = p_user_id
      AND id = ANY(p_notification_ids)
      AND read_at IS NULL;
  END IF;
END;
$$;

-- RPC function: Mark notifications as seen (when opening panel)
CREATE OR REPLACE FUNCTION public.mark_notifications_seen(p_user_id uuid)
RETURNS void
LANGUAGE sql SECURITY DEFINER
AS $$
  UPDATE notifications
  SET seen_at = now()
  WHERE recipient_id = p_user_id
    AND seen_at IS NULL;
$$;

-- RPC function: Archive old notifications
CREATE OR REPLACE FUNCTION public.archive_old_notifications()
RETURNS void
LANGUAGE sql SECURITY DEFINER
AS $$
  UPDATE notifications
  SET archived_at = now()
  WHERE read_at IS NOT NULL
    AND read_at < now() - INTERVAL '30 days'
    AND archived_at IS NULL;
$$;
