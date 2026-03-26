-- Fix mark_notifications_read to also update legacy 'read' boolean
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
    SET read_at = now(),
        read = true
    WHERE recipient_id = p_user_id
      AND read_at IS NULL;
  ELSE
    UPDATE notifications
    SET read_at = now(),
        read = true
    WHERE recipient_id = p_user_id
      AND id = ANY(p_notification_ids)
      AND read_at IS NULL;
  END IF;
END;
$$;
