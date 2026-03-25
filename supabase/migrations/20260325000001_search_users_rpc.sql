-- Migration: Create search_users RPC function
-- Version: 007
-- Created: 2026-03-25

CREATE OR REPLACE FUNCTION public.search_users(
  search_term TEXT,
  requesting_user_id UUID,
  result_limit INT DEFAULT 10,
  result_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  handle TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.display_name, p.handle, p.avatar_url
  FROM public.profiles p
  WHERE p.id <> requesting_user_id
    AND (
      p.display_name ILIKE '%' || search_term || '%'
      OR p.handle ILIKE '%' || search_term || '%'
    )
  ORDER BY p.display_name ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

COMMENT ON FUNCTION public.search_users IS 'Securely search profiles excluding the requesting user, optimized for mention autocomplete.';
