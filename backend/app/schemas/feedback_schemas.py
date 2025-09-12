from pydantic import BaseModel, Field
from typing import Optional
import datetime

# Schema for the data a student sends when creating feedback
class FeedbackCreate(BaseModel):
    category: str
    subject: str = Field(..., min_length=3, max_length=100)
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: str = Field(..., min_length=10)
    is_anonymous: bool = False
    
    # We will pass the student_id in the body for simplicity
    student_id: Optional[int] = None

# A simplified schema for displaying user info
class UserInFeedback(BaseModel):
    full_name: str
    email: str
    class Config:
        from_attributes = True

# The full schema for sending feedback data to the admin
class Feedback(BaseModel):
    id: int
    category: str
    subject: str
    rating: Optional[int]
    comment: str
    is_anonymous: bool
    created_at: datetime.datetime
    student: Optional[UserInFeedback] = None

    class Config:
        from_attributes = True