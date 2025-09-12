# backend/app/api/student/feedback.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional

# Assuming you have these utility functions
from app.database import get_db
from app.models.user_models import User # Import your User model
from app.models.feedback import Feedback, FeedbackCategory

router = APIRouter()

class FeedbackCreate(BaseModel):
    category: FeedbackCategory
    subject: str = Field(..., min_length=3, max_length=100)
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: str = Field(..., min_length=10)
    is_anonymous: bool = False

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db)
):
    """
    Endpoint for students to submit feedback.
    Associates with a default user when not anonymous for demo purposes.
    """
    # For demo purposes, use a default student user when not anonymous
    student_id = None
    if not feedback_data.is_anonymous:
        # Get the first student user from the database
        student_user = db.query(User).join(User.role).filter(User.role.has(name="student")).first()
        if student_user:
            student_id = student_user.id
    
    db_feedback = Feedback(
        category=feedback_data.category,
        subject=feedback_data.subject,
        rating=feedback_data.rating,
        comment=feedback_data.comment,
        is_anonymous=feedback_data.is_anonymous,
        student_id=student_id
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return {"message": "Feedback submitted successfully!", "id": db_feedback.id}