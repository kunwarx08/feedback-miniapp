# 🎓 Student Feedback Collector — Version 3 (v3-crud)

A full-stack web application for student course feedback upgraded with **Full CRUD (Create, Read, Update, Delete)** operations and complete PostgreSQL **Row Level Security (RLS)**.

---

## ⚡ Version 3 Features

- ✏️ **Edit Feedback**: Users can edit their existing feedback (Student Name, Course, Star Rating, and Feedback body) directly in an inline form.
- 🗑️ **Delete Feedback**: Users can delete their own feedback entries with a confirmation prompt.
- 🛡️ **Full CRUD Row Level Security**: Added PostgreSQL `UPDATE` and `DELETE` RLS policies ensuring users can strictly update and delete **only their own** feedback entries (`auth.uid() = user_id`).
- 🔔 **Toast Feedback Notifications**: Friendly toast alerts for successful updates, successful deletions, and error messaging.

---

## 🛢️ Database Schema & Full CRUD RLS Policies (v3)

Run the following SQL in your **Supabase Dashboard -> SQL Editor**:

```sql
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 3. Create complete user-level RLS policies for full CRUD

-- READ (SELECT)
CREATE POLICY "Users can read own feedback"
  ON public.feedback FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- CREATE (INSERT)
CREATE POLICY "Users can insert own feedback"
  ON public.feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "Users can update own feedback"
  ON public.feedback FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE
CREATE POLICY "Users can delete own feedback"
  ON public.feedback FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
```

---

## 📄 Supported CRUD Operations Summary

| Operation | Action | Scope / RLS Security Rule |
| :--- | :--- | :--- |
| **Create (C)** | Submit Feedback Form | `FOR INSERT WITH CHECK (auth.uid() = user_id)` |
| **Read (R)** | View Reviews List | `FOR SELECT USING (auth.uid() = user_id)` |
| **Update (U)** | Inline Card Edit Form | `FOR UPDATE USING (auth.uid() = user_id)` |
| **Delete (D)** | Delete Card Button | `FOR DELETE USING (auth.uid() = user_id)` |
