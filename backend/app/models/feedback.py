# backend/app/models/feedback.py

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

# Use the same Base as user models
from .user_models import Base


class FeedbackCategory(str, enum.Enum):
    faculty = "faculty"
    resources = "resources"
    canteen = "canteen"
    events = "events" # For committees/hackathons
    general = "general"


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    
    # Nullable, as anonymous feedback won't have a student_id
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    category = Column(Enum(FeedbackCategory), nullable=False)
    
    # e.g., "Prof. John Doe", "Main Library", "Annual Tech Fest"
    subject = Column(String, nullable=False, index=True)
    
    rating = Column(Integer, nullable=True) # Optional rating from 1-5
    comment = Column(String, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to the User model (assuming you have a User model in user.py)
    student = relationship("User", back_populates="feedback")