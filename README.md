# 🎓 Student Feedback Collector

A clean, modern, and production-ready full-stack web application for collecting and viewing student course feedback in real-time. Built with **React**, **Vite**, **FastAPI (Python)**, **Supabase Authentication**, and **PostgreSQL**, deployed across **Netlify** and **Render**.

---

## 🏛️ Version 4 (v4-fastapi-backend) Architecture Migration

### 🚀 What Changed in Version 4?
- **3-Tier Architecture Migration**: The React frontend no longer performs direct database CRUD calls to Supabase. Instead, all database operations flow through a dedicated **FastAPI REST API backend** deployed on Render.
- **FastAPI REST Backend (`backend/`)**: Built a modular Python backend exposing `GET /feedback`, `POST /feedback`, `PUT /feedback/{id}`, and `DELETE /feedback/{id}` endpoints.
- **JWT Authorization Dependency**: All REST API endpoints extract the `Authorization: Bearer <token>` header from incoming HTTP requests and verify it against Supabase Auth engine before executing database queries.
- **Supabase Authentication Preserved**: Supabase Auth continues to manage user credentials, login sessions, and JWT token issuance on the frontend.

---

## 🏗️ Architecture Flow Diagram (v1 ➔ v3 ➔ v4)

```text
[ VERSION 3 ARCHITECTURE (2-TIER DIRECT DB) ]

  React Frontend (Netlify)  ──▶  Supabase Database (PostgreSQL + RLS)
                                 - Frontend calls database directly
                                 - Direct Supabase JS Client dependency


[ VERSION 4 ARCHITECTURE (3-TIER PRODUCTION BACKEND) ]

  React Frontend (Netlify)
       │
       ├──► 1. Supabase Auth (Front-End Auth Engine)
       │       - Logs in user & issues JWT session access token
       │
       └──► 2. FastAPI REST API Backend (Render)
               │    - Validates Authorization: Bearer <jwt_token>
               │    - Enforces backend business logic & data validation
               │
               └──► 3. Supabase PostgreSQL Database
                       - Executes CRUD queries securely on behalf of user
```

---

## 🔒 Security & Environment Variable Breakdown

### Why Use a Dedicated Backend?
1. **Centralized Business Logic**: Validation, audit logging, rate limiting, and data transformation are handled on the server, preventing client-side tampering.
2. **Secret Protection**: The **Supabase Service Role Key** grants full administrative privileges to the database. It must **NEVER** be exposed in the frontend JavaScript code. Moving database queries to the backend keeps administrative keys hidden safely on the server.

### Environment Variable Matrix

| Variable Name | Belonging Environment | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | **Netlify (Frontend)** | Public URL of your Supabase project used for client authentication. |
| `VITE_SUPABASE_ANON_KEY` | **Netlify (Frontend)** | Public Anon key for client-side authentication requests. |
| `VITE_API_URL` | **Netlify (Frontend)** | Public URL of your FastAPI backend hosted on Render. |
| `SUPABASE_URL` | **Render (Backend)** | Server-side URL connection string for Supabase API. |
| `SUPABASE_KEY` | **Render (Backend)** | Secret API / Service Role key used by FastAPI server to query database. |
| `ALLOWED_ORIGINS` | **Render (Backend)** | Comma-separated list of origins allowed by CORS (e.g. your Netlify domain). |

---

## 🌐 FastAPI REST API Endpoints

| HTTP Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API health status check | ❌ Public |
| `GET` | `/feedback` | List all feedback belonging to current user | ✅ Bearer JWT |
| `POST` | `/feedback` | Submit a new feedback record bound to user | ✅ Bearer JWT |
| `PUT` | `/feedback/{id}` | Update an existing feedback entry owned by user | ✅ Bearer JWT |
| `DELETE` | `/feedback/{id}` | Delete a feedback entry owned by user | ✅ Bearer JWT |

---

## 🚀 Step-by-Step Render Backend Deployment Guide

1. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`student-feedback-collector`).
3. Set the following deployment configuration:
   - **Name**: `student-feedback-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the **Environment Variables** in Render:
   - `SUPABASE_URL`: `https://your-project-id.supabase.co`
   - `SUPABASE_KEY`: `your-supabase-service-role-key-or-anon-key`
   - `ALLOWED_ORIGINS`: `https://your-netlify-app.netlify.app`
5. Click **Create Web Service**. Once deployed, copy your live Render URL (e.g. `https://student-feedback-api.onrender.com`).
6. Update Netlify environment variable: Set `VITE_API_URL` to your live Render URL and trigger a redeploy on Netlify!

---

## 📁 Project Structure

```
student-feedback-collector/
├── backend/                   # [NEW v4] FastAPI REST Backend
│   ├── main.py                # FastAPI entry point & CORS configuration
│   ├── routers/
│   │   └── feedback.py        # REST API endpoints (GET, POST, PUT, DELETE)
│   ├── services/
│   │   └── supabase_client.py # Backend Supabase client & JWT security dependency
│   ├── models/
│   │   └── schemas.py         # Pydantic request & response data models
│   ├── requirements.txt       # Python dependencies (FastAPI, Uvicorn, Supabase)
│   ├── .env.example           # Backend environment template
│   └── .env                   # Local backend environment variables
├── netlify.toml               # Netlify deployment build settings & SPA redirects
├── package.json               # Node.js dependencies and scripts
├── vite.config.js             # Vite configuration
├── index.html                 # App HTML entry point & Google Fonts
├── .env.example               # Frontend environment template
├── .env                       # Frontend local environment variables
├── supabase/
│   └── schema.sql             # SQL database script & RLS policies
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
│   │   ├── api.js             # [NEW v4] Frontend REST API client for FastAPI
│   │   └── supabase.js        # Supabase Auth client initialization
│   ├── index.css              # Custom design system with modern CSS variables
│   ├── App.jsx                # Main application container & API state handlers
│   └── main.jsx               # React DOM render entry point
└── README.md                  # Comprehensive setup and deployment guide
```

---

## 🧪 Local Execution (Frontend + Backend)

1. **Start FastAPI Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
   FastAPI interactive documentation will be available at `http://localhost:8000/docs`.

2. **Start React Frontend**:
   ```bash
   # In project root
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📄 License

MIT License. Open source for learning and educational purposes.
