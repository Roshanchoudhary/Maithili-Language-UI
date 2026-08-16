-- ================================================================
-- TIRHUTA LEARNING PLATFORM - Supabase Schema
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT 'साधक',
    email TEXT NOT NULL,
    progress JSONB DEFAULT '{}',
    exam_scores JSONB DEFAULT '[]',
    certificate JSONB DEFAULT NULL,
    streak INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0,
    last_practice TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);

-- Set up Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can read their own data
CREATE POLICY "Users can view own data" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can read all data
CREATE POLICY "Admin can read all" ON public.user_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create admin user (optional - run this once)
-- INSERT INTO auth.users (email, raw_user_meta_data)
-- VALUES ('admin@tirhuta.com', '{"role": "admin", "name": "एडमिन"}')
-- ON CONFLICT (email) DO NOTHING;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_progress
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
