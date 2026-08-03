import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import feedback

load_dotenv()

app = FastAPI(
    title="Student Feedback Collector API",
    description="Production REST API backend connecting React frontend to Supabase PostgreSQL database.",
    version="4.0.0"
)

# Parse CORS origins from environment variable or default to wildcard/localhost for development
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(feedback.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Student Feedback Collector API",
        "version": "4.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
