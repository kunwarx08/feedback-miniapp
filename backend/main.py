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

# Robust CORS Configuration: Allow all origins (localhost, Netlify, Render)
# Note: allow_credentials=False is set because authentication uses Authorization Bearer headers (not cookies),
# which allows browsers to accept wildcard '*' origins without CORS preflight failures.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under both /feedback and /api/feedback for maximum compatibility
app.include_router(feedback.router)
app.include_router(feedback.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Student Feedback Collector API",
        "version": "4.0.0",
        "endpoints": {
            "feedback": "/feedback",
            "api_feedback": "/api/feedback"
        },
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
