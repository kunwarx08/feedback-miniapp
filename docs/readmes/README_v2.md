# 🎓 Student Feedback Collector — Version 2 (v2)

A production-ready full-stack web application for collecting and managing student course feedback, upgraded with **Supabase Email + Password Authentication** and user-isolated **Row Level Security (RLS)** in PostgreSQL.

---

## 🚀 Version 2 Upgrade Highlights

- 🔐 **Supabase Email & Password Authentication**: Full Login, Sign Up, and Sign Out workflow.
- 🔄 **Persistent Session Management**: User sessions persist automatically across page refreshes (`supabase.auth.getSession()` & `onAuthStateChange`).
- 🛡️ **User-Isolated Row Level Security (RLS)**: Users can **only read** and **only insert** feedback tied directly to their authenticated account (`auth.uid() = user_id`).
- 🚦 **Conditional View Routing**: Unauthenticated visitors see only the Auth (Sign In / Sign Up) screen. Authenticated users access the feedback dashboard.
- 🧭 **Navigation Bar Component**: Displays app logo, current user email badge, and Logout action.

---

## 📁 Project Structure (v2)

```
student-feedback-collector/
├── netlify.toml               # Netlify build configuration & SPA redirects
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite bundler configuration
├── index.html                 # App HTML entry point & Google Fonts
├── .env.example               # Template for environment variables
├── .env                       # Local environment variables
├── supabase/
│   └── schema.sql             # SQL script for schema migration & RLS policies
├── src/
│   ├── components/
│   │   ├── Auth.jsx           # Sign In and Sign Up tabbed form component
│   │   ├── Navbar.jsx         # App header, user email indicator, & Logout action
│   │   ├── FeedbackForm.jsx   # Feedback input form & validation
│   │   ├── FeedbackCard.jsx   # Feedback review card display
│   │   ├── FeedbackList.jsx   # List container with skeleton loaders & error retry
│   │   ├── StarRating.jsx     # Interactive & read-only star selector
│   │   └── Toast.jsx          # Auto-dismissing notification toasts
│   ├── services/
│   │   └── supabase.js        # Supabase client & authentication/database services
│   ├── index.css              # Design system with modern CSS variables
│   ├── App.jsx                # Application container & auth state router
│   └── main.jsx               # React DOM entry point
└── README.md                  # Detailed documentation & deployment guide
```

---

## 🛢️ Database Schema & RLS Policies (v2)

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

-- 3. Drop unauthenticated public policies if present
DROP POLICY IF EXISTS "Allow public read access" ON public.feedback;
DROP POLICY IF EXISTS "Allow public insert access" ON public.feedback;

-- 4. Create user-isolated RLS policies
CREATE POLICY "Users can read own feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## ⚙️ Supabase Dashboard Configuration

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** -> **Providers** -> **Email**.
3. Ensure **Email provider** is **Enabled**.
4. **RECOMMENDED FOR TESTING**: Disable **Confirm Email** (toggle OFF under **Authentication** -> **Providers** -> **Email**). 
   *Note: Supabase's built-in default email service has a strict rate limit of ~3 confirmation emails per hour. Disabling "Confirm Email" bypasses rate limits and allows instant account creation during development.*
5. *(For Production)*: Configure a custom SMTP provider (e.g. Resend, SendGrid, Mailtrap) under **Authentication** -> **SMTP Settings**.

---

## 🧪 Local Testing Steps (v2)

1. Install dependencies: `npm install`
2. Configure `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
3. Start dev server: `npm run dev`
4. **Test Auth Flow**:
   - Open `http://localhost:3000`. Verify only Login/Sign Up screen is visible.
   - Register a user with a valid deliverable email (e.g. `student1@gmail.com`).
   - Submit feedback and refresh page to verify **session persistence**.
   - Logout and log in as a second user. Confirm user data isolation enforced by RLS.

---

## 📄 Architecture Changes Comparison (v1 vs v2)

| Feature / Aspect | Version 1 | Version 2 |
| :--- | :--- | :--- |
| **Authentication** | None (Public access) | Supabase Email + Password Auth |
| **Unauthenticated View** | Full feedback app accessible | Restricted to Login / Sign Up screens |
| **Feedback Data Ownership** | Unbound (Anonymous) | Bound to authenticated `user_id` (`auth.users`) |
| **Database Security** | Public SELECT & INSERT policies | Strict RLS: `auth.uid() = user_id` |
| **Data Visibility** | Global list visible to everyone | User-isolated private feedback history |
| **Session Persistence** | N/A | Automated token restoration via `onAuthStateChange` |
