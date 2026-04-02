-- Migration: Add session_memory table
-- Issue: #133 - SessionMemory persistence in Supabase

CREATE TABLE IF NOT EXISTS session_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_key VARCHAR(255) NOT NULL,
  memory_value TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('preference', 'fact', 'itinerary', 'contact')),
  extracted_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, memory_key)
);

CREATE INDEX idx_session_memory_user_id ON session_memory(user_id);
CREATE INDEX idx_session_memory_category ON session_memory(category);

-- Enable RLS
ALTER TABLE session_memory ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own memory
CREATE POLICY "Users can manage their own session memory"
  ON session_memory FOR ALL
  USING (auth.uid() = user_id);

COMMENT ON TABLE session_memory IS 'Stores extracted user preferences and memories across sessions';