-- ==========================================
-- Student Feedback Collector Schema (v3-crud Upgraded)
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- 1. Create or alter the feedback table with user_id foreign key
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ensure user_id column exists if upgrading from an earlier table version
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'feedback' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.feedback 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
  END IF;
END $$;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 3. Drop legacy policies if present
DROP POLICY IF EXISTS "Allow public read access" ON public.feedback;
DROP POLICY IF EXISTS "Allow public insert access" ON public.feedback;
DROP POLICY IF EXISTS "Users can read own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can update own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can delete own feedback" ON public.feedback;

-- 4. Create complete user-level RLS policies for full CRUD

-- READ (SELECT): Users can ONLY read their own feedback
CREATE POLICY "Users can read own feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- CREATE (INSERT): Users can ONLY insert feedback associated with their user_id
CREATE POLICY "Users can insert own feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can ONLY update their own feedback
CREATE POLICY "Users can update own feedback"
  ON public.feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can ONLY delete their own feedback
CREATE POLICY "Users can delete own feedback"
  ON public.feedback
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
