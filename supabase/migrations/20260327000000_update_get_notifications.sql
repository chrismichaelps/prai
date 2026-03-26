-- Recreate get_notifications to fix is_read column mapping
DROP FUNCTION IF EXISTS get_notifications(UUID, INT, INT) CASCADE;

CREATE FUNCTION get_notifications(p_user_id UUID, p_limit INT DEFAULT 20, p_offset INT DEFAULT 0)
RETURNS TABLE (
  id UUID,
  type TEXT,
  title TEXT,
  body TEXT,
  resource_type TEXT,
  resource_id UUID,
  issue_id UUID,
  comment_id UUID,
  actor_id UUID,
  actor_handle TEXT,
  actor_avatar_url TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.type::TEXT,
    n.title,
    n.body,
    n.resource_type,
    n.resource_id,
    n.issue_id,
    n.comment_id,
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
END;
$$;
