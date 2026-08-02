# 🎓 Student Feedback Collector

A clean, modern, and production-ready full-stack web application designed for collecting and viewing student course feedback in real-time.

Built with **React**, **Vite**, **Modern CSS**, and **Supabase (PostgreSQL)**, and ready to be deployed directly to **Netlify**.

---

## 🚀 Features

- 📝 **Interactive Feedback Form**: Submit student name, course title, star rating (1–5 stars), and detailed feedback.
- ⭐️ **Star Rating Widget**: Interactive 1–5 star selector with hover states and visual star rating display.
- ⚡️ **Real-Time Feed**: Automatically refreshes and displays newest feedback first (`created_at` descending).
- ✅ **Form Validation**: Friendly error notifications and field highlight validations.
- 🎨 **Modern Aesthetics**: Sleek glassmorphism cards, responsive dual-column grid, subtle animations, and loading skeletons.
- 🛢️ **Supabase Integration**: Direct database connection using PostgreSQL and Row Level Security (RLS).
- ☁️ **Netlify Ready**: Configured with `netlify.toml` for easy deployment and SPA routing.

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

## 🛠️ Step-by-Step Setup & Deployment Guide

Follow these 10 steps to run the project locally, set up your Supabase database, push to GitHub, and deploy to Netlify.

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

### Step 2: Run Locally

Start the Vite development server:

```bash
npm run dev
```

Your app will run locally at `http://localhost:3000`.

---

### Step 3: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New Project**.
3. Enter a **Project Name** (e.g., `student-feedback-app`).
4. Set a secure **Database Password** (save it somewhere safe).
5. Choose a region close to you and select the **Free Tier**.
6. Click **Create new project** and wait a few moments for provisioning to finish.

---

### Step 4: Create Database Table

1. In your Supabase Dashboard, click on the **SQL Editor** tab in the left sidebar.
2. Click **New Query**.
3. Copy and paste the following SQL script (or copy from `supabase/schema.sql`):

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

4. Click **Run** to create the table and set up public access permissions.

---

### Step 5: Obtain API Keys

1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Locate the following two values:
   - **Project URL**: Found under `Project URL` (e.g., `https://xyzcompany.supabase.co`)
   - **anon public key**: Found under `Project API keys` labeled `anon` `public`

---

### Step 6: Configure `.env`

1. Duplicate the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

2. Open `.env` in your code editor and insert your actual Supabase URL and Anon Key:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

3. Restart your dev server (`npm run dev`) to load the updated credentials.

---

### Step 7: Push to GitHub

1. Initialize git in your local directory (if not already initialized):

```bash
git init
git add .
git commit -m "Initial commit: Complete Student Feedback Collector app"
```

2. Create a new repository on [GitHub](https://github.com/new) named `student-feedback-collector`.
3. Link your local repository and push:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/student-feedback-collector.git
git branch -M main
git push -u origin main
```

---

### Step 8: Deploy to Netlify

1. Log in to [Netlify](https://app.netlify.com).
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and authorize Netlify.
4. Select your `student-feedback-collector` repository.
5. Verify build settings (automatically populated from `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

---

### Step 9: Configure Environment Variables on Netlify

Before clicking deploy (or right after):

1. Under the Site settings in Netlify, go to **Environment variables** (or **Site configuration** -> **Environment variables**).
2. Click **Add a variable** and add:
   - Key: `VITE_SUPABASE_URL` | Value: `https://your-actual-project-id.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY` | Value: `your-actual-anon-key-here`
3. Click **Save**.
4. Go to **Deploys** tab and click **Trigger deploy** -> **Deploy site**.

---

### Step 10: Verify Deployment

1. Once Netlify completes building, click the generated live site URL (e.g., `https://your-site-name.netlify.app`).
2. Fill out the feedback form:
   - Name: `Jane Doe`
   - Course: `Web Development 101`
   - Rating: `5 Stars`
   - Feedback: `Amazing experience building full-stack apps!`
3. Click **Submit Feedback**.
4. Confirm that:
   - Form resets automatically.
   - Success toast appears.
   - New feedback card instantly appears at the top of the **Student Reviews** feed.

---

## 🧰 Tech Stack Summary

- **Frontend**: React (v18), Vite, JavaScript (ES6+), Modern CSS3, Lucide React Icons.
- **Backend & DB**: Supabase (PostgreSQL database with Row Level Security).
- **Deployment**: Netlify.

---

## 📄 License

MIT License. Open source for learning and educational purposes.
