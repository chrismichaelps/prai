-- Migration: Fix profiles handle trigger
-- Version: 20260326000001

-- Add handle column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS handle TEXT NOT NULL DEFAULT 'user';

-- Update the trigger function to include handle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, handle, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'user-' || LEFT(NEW.id::TEXT, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    handle = EXCLUDED.handle,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
