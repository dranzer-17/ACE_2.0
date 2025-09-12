from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from .. import database
from ..models import user_models as models
from ..schemas import feedback_schemas as schemas

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)

# --- Student Endpoint ---
@router.post("/student", status_code=status.HTTP_201_CREATED)
def submit_feedback(feedback_data: schemas.FeedbackCreate, db: Session = Depends(database.get_db)):
    student_id_to_save = None
    if not feedback_data.is_anonymous:
        # If not anonymous, use the student_id provided in the request
        student_id_to_save = feedback_data.student_id

    db_feedback = models.Feedback(
        category=feedback_data.category,
        subject=feedback_data.subject,
        rating=feedback_data.rating,
        comment=feedback_data.comment,
        is_anonymous=feedback_data.is_anonymous,
        student_id=student_id_to_save
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return {"message": "Feedback submitted successfully!", "id": db_feedback.id}

# --- Admin Endpoint ---
@router.get("/admin", response_model=List[schemas.Feedback])
def get_all_feedback(db: Session = Depends(database.get_db)):
    # Use joinedload to efficiently fetch the related student details
    feedback_list = (
        db.query(models.Feedback)
        .options(joinedload(models.Feedback.student))
        .order_by(models.Feedback.created_at.desc())
        .all()
    )
    return feedback_list