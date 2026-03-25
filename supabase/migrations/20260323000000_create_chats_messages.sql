-- Migration: Create chats and messages tables for multi-chat support
-- Version: 001
-- Created: 2026-03-22

-- Enable UUID extension (already exists in Supabase)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chats table: stores chat sessions per user
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table: stores messages per chat
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance (per Architectural_Laws: proper indexing)
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_archived ON public.chats(user_id, is_archived, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON public.messages(chat_id, created_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own chats
CREATE POLICY "Users can view own chats" ON public.chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON public.chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON public.chats
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see messages in their own chats
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE public.chats.id = public.messages.chat_id
      AND public.chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE public.chats.id = public.messages.chat_id
      AND public.chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE public.chats.id = public.messages.chat_id
      AND public.chats.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update chats.updated_at
DROP TRIGGER IF EXISTS update_chats_updated_at ON public.chats;
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON public.chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.chats IS 'Stores chat sessions per user';
COMMENT ON TABLE public.messages IS 'Stores messages within each chat session';
COMMENT ON COLUMN public.chats.title IS 'Chat title, defaults to New Chat';
COMMENT ON COLUMN public.chats.is_archived IS 'Archive flag for deleted/hidden chats';
COMMENT ON COLUMN public.messages.role IS 'Message role: user or assistant';
COMMENT ON COLUMN public.messages.metadata IS 'JSONB for additional message data (thoughts, sources, etc.)';
