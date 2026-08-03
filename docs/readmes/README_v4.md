# 🎓 Student Feedback Collector — Version 4 (v4-fastapi-backend)

A 3-tier production architecture migrating direct database queries to a dedicated **FastAPI REST API backend** deployed on Render.

---

## 🏛️ Architecture Migration Details

```text
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

## 🌐 FastAPI REST API Endpoints

| HTTP Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API health status check | ❌ Public |
| `GET` | `/feedback` | List all feedback belonging to current user | ✅ Bearer JWT |
| `POST` | `/feedback` | Submit a new feedback record bound to user | ✅ Bearer JWT |
| `PUT` | `/feedback/{id}` | Update an existing feedback entry owned by user | ✅ Bearer JWT |
| `DELETE` | `/feedback/{id}` | Delete a feedback entry owned by user | ✅ Bearer JWT |

---

## 🔒 Environment Variable Matrix

| Variable Name | Belonging Environment | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | **Netlify (Frontend)** | Public URL of your Supabase project. |
| `VITE_SUPABASE_ANON_KEY` | **Netlify (Frontend)** | Public Anon key for client-side authentication. |
| `VITE_API_URL` | **Netlify (Frontend)** | Public URL of your FastAPI backend hosted on Render. |
| `SUPABASE_URL` | **Render (Backend)** | Server-side URL connection string for Supabase API. |
| `SUPABASE_KEY` | **Render (Backend)** | Secret API key used by FastAPI server. |
| `ALLOWED_ORIGINS` | **Render (Backend)** | Comma-separated list of allowed CORS origins. |
