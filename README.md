# 🎓 Student Feedback Collector

A clean, modern, and production-ready full-stack web application for collecting and viewing student course feedback in real-time. Built with **React**, **Vite**, **Modern CSS**, **Supabase Authentication**, and **PostgreSQL (Row Level Security)**, ready to deploy directly to **Netlify**.

---

## ⚡ Version 3 (v3-crud) Changelog

### 🚀 New Features Added
- ✏️ **Edit Feedback**: Users can now edit their existing feedback (Student Name, Course, Star Rating, and Feedback body) directly in an inline form.
- 🗑️ **Delete Feedback**: Users can delete their own feedback entries with a confirmation prompt.
- 🛡️ **Full CRUD Row Level Security**: Added PostgreSQL `UPDATE` and `DELETE` RLS policies ensuring users can strictly update and delete **only their own** feedback entries (`auth.uid() = user_id`).
- 🔔 **Toast Feedback Notifications**: Friendly toast alerts for successful updates, successful deletions, and error messaging.

### 📂 Files Modified
- `[MODIFY] src/components/FeedbackCard.jsx`: Added inline edit mode, delete confirmation prompt, and Edit/Delete action buttons.
- `[MODIFY] src/components/FeedbackList.jsx`: Passed `onUpdate` and `onDelete` props down to `FeedbackCard`.
- `[MODIFY] src/services/supabase.js`: Added `updateFeedback(id, updatedFields)` and `deleteFeedback(id)` methods.
- `[MODIFY] src/App.jsx`: Connected `handleUpdateFeedback` and `handleDeleteFeedback` functions to Supabase services and toast alerts.
- `[MODIFY] src/index.css`: Added styles for card action buttons (`btn-edit`, `btn-delete`) and edit mode container.
- `[MODIFY] supabase/schema.sql`: Added `UPDATE` and `DELETE` Row Level Security policies.

### 🛢️ Database & RLS Policy Changes
- **No new tables created.** Uses the existing `public.feedback` table.
- Added `UPDATE` policy: `CREATE POLICY "Users can update own feedback" ON public.feedback FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`
- Added `DELETE` policy: `CREATE POLICY "Users can delete own feedback" ON public.feedback FOR DELETE TO authenticated USING (auth.uid() = user_id);`

### 🔑 Environment Variables & Deployment
- **No changes to deployment configuration or environment variables!** Uses the existing `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, GitHub pipeline, and Netlify hosting.

---

## 📋 Version 2 (v2) Changelog

### 🚀 New Features Added
- 🔐 **Supabase Email & Password Authentication**: Full Login, Sign Up, and Sign Out workflow.
- 🔄 **Persistent Session Management**: User sessions persist automatically across page refreshes (`supabase.auth.getSession()` & `onAuthStateChange`).
- 🛡️ **User-Isolated Row Level Security (RLS)**: Users can **only read** and **only insert** feedback tied directly to their authenticated account (`auth.uid() = user_id`).
- 🚦 **Conditional View Routing**: Unauthenticated visitors see only the Auth (Sign In / Sign Up) screen. Authenticated users access the feedback dashboard.
- 🧭 **Navigation Bar Component**: Displays app logo, current user email badge, and Logout action.

### 📂 Files Modified / Created
- `[NEW] src/components/Auth.jsx`: Tabbed Sign In and Sign Up form component.
- `[NEW] src/components/Navbar.jsx`: Top navigation header with user email and Logout action.
- `[MODIFY] src/App.jsx`: Auth state management, persistent session routing, and conditional view rendering.
- `[MODIFY] src/services/supabase.js`: Added `signUpUser`, `signInUser`, `signOutUser`, and updated `fetchFeedback`/`createFeedback` to handle `user_id`.
- `[MODIFY] src/index.css`: Added modern styles for Auth forms, tabs, user badges, navbar, and spinners.
- `[MODIFY] supabase/schema.sql`: Updated database schema with `user_id` foreign key and strict RLS policies.

### 🛢️ Database Changes
- Added column `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid()` to `public.feedback` table.

### 🛡️ RLS Policies Added
- `Users can read own feedback`: `SELECT` policy restricted to `auth.uid() = user_id`.
- `Users can insert own feedback`: `INSERT` policy restricted to `auth.uid() = user_id`.

### 🔑 Environment Variables
- **No new environment variables required!** The existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` fully support Supabase Auth and RLS.

### ⚠️ Breaking Changes
- **Database Access Restriction**: Existing anonymous/unauthenticated feedback entries created in v1 without a `user_id` are no longer readable by regular users under strict v2 RLS policies.

---

## 🏗️ Architecture Comparison (v1 vs v2 vs v3)

### Diagram Representation

```text
[ VERSION 1 ARCHITECTURE ]

  React Frontend (Netlify)  ──▶  Supabase Database (Public Access / No Auth)
                                 - Open SELECT / INSERT policies
                                 - All feedback visible to anyone


[ VERSION 2 ARCHITECTURE ]

  React Frontend (Netlify)
       │
       ├─► 1. Supabase Authentication (GoTrue Engine)
       │      - Email + Password Auth
       │      - Session Token Storage & Refresh
       │
       └─► 2. Supabase PostgreSQL Database (Row Level Security)
              - Foreign Key: user_id ──▶ auth.users(id)
              - RLS Policy: auth.uid() = user_id (SELECT, INSERT)


[ VERSION 3 ARCHITECTURE (FULL CRUD) ]

  React Frontend (Netlify)
       │
       ├─► 1. Supabase Authentication (GoTrue Engine)
       │      - Email + Password Auth
       │      - Session Token Storage & Refresh
       │
       └─► 2. Supabase PostgreSQL Database (Full CRUD Row Level Security)
              - Foreign Key: user_id ──▶ auth.users(id)
              - RLS Policies: auth.uid() = user_id for SELECT, INSERT, UPDATE, & DELETE
              - Full CRUD operations: Create, Read, Update, Delete
```

---

## 📁 Project Structure

```
student-feedback-collector/
├── netlify.toml               # Netlify deployment build settings & SPA redirects
├── package.json               # Node.js dependencies and scripts
├── vite.config.js             # Vite configuration
├── index.html                 # App HTML entry point & Google Fonts
├── .env.example               # Template for required environment variables
├── .env                       # Local environment variables (do not commit secrets)
├── supabase/
│   └── schema.sql             # SQL script to create table & full CRUD RLS policies
├── src/
│   ├── components/
│   │   ├── Auth.jsx           # Sign In and Sign Up tabbed form component
│   │   ├── Navbar.jsx         # App header, user email indicator, & Logout action
│   │   ├── FeedbackForm.jsx   # Form component for input & validation
│   │   ├── FeedbackCard.jsx   # Card component with inline edit & delete controls
│   │   ├── FeedbackList.jsx   # Container rendering cards, loading skeletons, & states
│   │   ├── StarRating.jsx     # Interactive input and read-only star component
│   │   └── Toast.jsx          # Auto-dismissing success/error toast notification
│   ├── services/
│   │   └── supabase.js        # Supabase client initialization & CRUD service methods
│   ├── index.css              # Custom design system with modern CSS variables
│   ├── App.jsx                # Main application container & CRUD state handlers
│   └── main.jsx               # React DOM render entry point
└── README.md                  # Comprehensive setup and deployment guide
```

---

## 🛢️ Database Schema & Full CRUD RLS Policies

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

## 🛠️ Step-by-Step Setup & Deployment Guide

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Run Locally

```bash
npm run dev
```

### Step 3: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a project.

### Step 4: Create Database Table & RLS Policies

Run the SQL script from `supabase/schema.sql` in the Supabase SQL Editor.

### Step 5: Obtain API Keys

Copy your **Project URL** and **anon public key** from Supabase Settings -> API.

### Step 6: Configure `.env`

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 7: Enable Supabase Email Auth

1. Go to **Authentication** -> **Providers** -> **Email**.
2. Ensure **Email provider** is **Enabled**.
3. **RECOMMENDED FOR TESTING**: Disable **Confirm Email** (toggle OFF under **Authentication** -> **Providers** -> **Email**).

### Step 8: Push to GitHub

```bash
git checkout -b v3-crud
git add .
git commit -m "feat(crud): add Edit and Delete feedback functionality with RLS policies"
git push origin v3-crud
```

### Step 9: Deploy to Netlify

Import your GitHub repository into Netlify and configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify environment variables.

### Step 10: Verify Deployment

1. Open your Netlify live URL.
2. Sign up with a deliverable email (e.g. `student1@gmail.com` or `student1@university.edu`).
3. Submit a review, click **Edit** to modify it, and click **Delete** to test complete CRUD capabilities.

---

## 🧰 Tech Stack Summary

- **Frontend**: React (v18), Vite, JavaScript (ES6+), Modern CSS3, Lucide React Icons.
- **Backend & DB**: Supabase (GoTrue Auth + PostgreSQL database with Row Level Security).
- **Deployment**: Netlify.

---

## 📄 License

MIT License. Open source for learning and educational purposes.
