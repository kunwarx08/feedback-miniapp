# 🎓 Student Feedback Collector — Version 1 (v1)

A clean, modern, and production-ready full-stack web application designed for collecting and viewing student course feedback in real-time.

Built with **React**, **Vite**, **Modern CSS**, and **Supabase (PostgreSQL)**, and ready to be deployed directly to **Netlify**.

---

## 🚀 Version 1 Features

- 📝 **Interactive Feedback Form**: Submit student name, course title, star rating (1–5 stars), and detailed feedback.
- ⭐️ **Star Rating Widget**: Interactive 1–5 star selector with hover states and visual star rating display.
- ⚡️ **Real-Time Feed**: Automatically refreshes and displays newest feedback first (`created_at` descending).
- ✅ **Form Validation**: Friendly error notifications and field highlight validations.
- 🎨 **Modern Aesthetics**: Sleek glassmorphism cards, responsive dual-column grid, subtle animations, and loading skeletons.
- 🛢️ **Supabase Integration**: Direct database connection using PostgreSQL and Row Level Security (RLS).
- ☁️ **Netlify Ready**: Configured with `netlify.toml` for easy deployment and SPA routing.

---

## 📁 Project Structure (v1)

```
student-feedback-collector/
├── netlify.toml               # Netlify deployment build settings & SPA redirects
├── package.json               # Node.js dependencies and scripts
├── vite.config.js             # Vite configuration
├── index.html                 # App HTML entry point & Google Fonts
├── .env.example               # Template for required environment variables
├── .env                       # Local environment variables (do not commit secrets)
├── supabase/
│   └── schema.sql             # SQL script to create table & RLS policies
├── src/
│   ├── components/
│   │   ├── FeedbackForm.jsx   # Form component for input & validation
│   │   ├── FeedbackCard.jsx   # Card component to render single feedback item
│   │   ├── FeedbackList.jsx   # Container rendering cards, loading skeletons, & states
│   │   ├── StarRating.jsx     # Interactive input and read-only star component
│   │   └── Toast.jsx          # Auto-dismissing success/error toast notification
│   ├── services/
│   │   └── supabase.js        # Supabase client initialization & API methods
│   ├── index.css              # Custom design system with modern CSS variables
│   ├── App.jsx                # Main application component & state management
│   └── main.jsx               # React DOM render entry point
└── README.md                  # Comprehensive setup and deployment guide
```

---

## 🛢️ Database Schema (v1)

Run the following SQL in your **Supabase Dashboard -> SQL Editor**:

```sql
-- Create the feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to READ feedback
CREATE POLICY "Allow public read access"
  ON public.feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anonymous users to INSERT new feedback
CREATE POLICY "Allow public insert access"
  ON public.feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

---

## 🛠️ Step-by-Step Setup & Deployment Guide (v1)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Locally
```bash
npm run dev
```
Runs locally at `http://localhost:3000`.

### Step 3: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a project.

### Step 4: Create Database Table
Run the SQL query in Supabase SQL Editor.

### Step 5: Obtain API Keys
Copy Project URL and anon key from Supabase Settings -> API.

### Step 6: Configure `.env`
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 7: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Complete Student Feedback Collector app"
git remote add origin https://github.com/YOUR_USERNAME/student-feedback-collector.git
git branch -M main
git push -u origin main
```

### Step 8: Deploy to Netlify
Import GitHub repo to Netlify.

### Step 9: Configure Netlify Environment Variables
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Step 10: Verify Deployment
Open site URL, submit feedback, and confirm it appears in the live feed.

---

## 🧰 Tech Stack Summary
- **Frontend**: React (v18), Vite, JavaScript (ES6+), Modern CSS3, Lucide React Icons.
- **Backend & DB**: Supabase (PostgreSQL).
- **Deployment**: Netlify.
