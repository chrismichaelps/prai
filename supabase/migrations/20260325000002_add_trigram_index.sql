-- Migration: Add trigram index for profile search performance
-- Version: 20260325000002

-- Enable pg_trgm extension for trigram similarity search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on profiles for fast ILIKE '%term%' searches
-- This enables index usage even with leading wildcards
CREATE INDEX IF NOT EXISTS idx_profiles_display_name_trgm 
ON profiles USING gin (display_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_handle_trgm 
ON profiles USING gin (handle gin_trgm_ops);

-- Optional: Create composite index if searching both columns together
-- Note: GIN indexes are not combined automatically, but individual indexes help

COMMENT ON INDEX idx_profiles_display_name_trgm IS 'Trigram GIN index for fast profile display_name search in @mentions';
COMMENT ON INDEX idx_profiles_handle_trgm IS 'Trigram GIN index for fast profile handle search in @mentions';
