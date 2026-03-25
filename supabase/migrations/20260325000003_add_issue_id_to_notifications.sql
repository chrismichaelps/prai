-- Migration: Add issue_id to get_notifications RPC
-- Version: 20260325000003

-- Drop existing function first (required to change return type)
DROP FUNCTION IF EXISTS public.get_notifications(uuid, int, int);

-- RPC function: Get notifications with limit (updated to include issue_id)
CREATE FUNCTION public.get_notifications(
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
