-- ==========================================
-- Student Feedback Collector Schema
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- 1. Create the feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy to allow anyone (anonymous) to READ feedback
CREATE POLICY "Allow public read access"
  ON public.feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Create RLS policy to allow anyone (anonymous) to INSERT new feedback
CREATE POLICY "Allow public insert access"
  ON public.feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Add sample initial data (Optional)
INSERT INTO public.feedback (name, course, rating, feedback)
VALUES
  ('Alex Johnson', 'Web Development 101', 5, 'Great intro to React and Vite! The hands-on projects were super helpful.'),
  ('Sam Taylor', 'Database Design with PostgreSQL', 4, 'Supabase makes database management so straightforward. Highly recommend!')
ON CONFLICT DO NOTHING;
