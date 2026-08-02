-- ==========================================
-- Student Feedback Collector Schema (Auth Upgraded)
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

-- If the table already exists from the previous version without user_id, add the column:
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

-- 3. Drop legacy public policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.feedback;
DROP POLICY IF EXISTS "Allow public insert access" ON public.feedback;
DROP POLICY IF EXISTS "Users can read own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.feedback;

-- 4. Create strict user-level RLS policies

-- Policy 1: Users can ONLY read feedback that belongs to their auth account
CREATE POLICY "Users can read own feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Users can ONLY insert feedback associated with their own user_id
CREATE POLICY "Users can insert own feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
