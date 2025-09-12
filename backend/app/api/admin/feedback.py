# backend/app/api/admin/feedback.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# Assuming you have these utility functions
from app.database import get_db
from app.models.feedback import Feedback
from app.models.user_models import User # Import your User model

router = APIRouter()

# You would define a Pydantic schema for the response to control the output
class UserResponse(BaseModel):
    full_name: str
    email: str

class FeedbackResponse(BaseModel):
    id: int
    category: str
    subject: str
    rating: Optional[int]
    comment: str
    is_anonymous: bool
    created_at: datetime
    student: Optional[UserResponse] = None

    class Config:
        orm_mode = True

@router.get("/", response_model=List[FeedbackResponse])
def get_all_feedback(
    db: Session = Depends(get_db)
):
    """
    Endpoint for admins to retrieve all feedback submissions.
    For now, no authentication required.
    """
    feedback_list = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
    return feedback_list