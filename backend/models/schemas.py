from pydantic import BaseModel, Field
from typing import Optional

class FeedbackCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Student Name")
    course: str = Field(..., min_length=1, description="Course Name")
    rating: int = Field(..., ge=1, le=5, description="Star Rating from 1 to 5")
    feedback: str = Field(..., min_length=1, description="Feedback comment")

class FeedbackUpdate(BaseModel):
    name: Optional[str] = None
    course: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: str
    course: str
    rating: int
    feedback: str
    created_at: str
