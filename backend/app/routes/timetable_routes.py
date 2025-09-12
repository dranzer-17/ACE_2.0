from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from .. import database
from ..models import user_models as models
from ..schemas import timetable_schemas as schemas

router = APIRouter(
    prefix="/timetables",
    tags=["Timetables"]
)

# A placeholder for getting the current student's info.
# In a real app with JWT, you'd get the user from the token.
# For now, we'll simulate it, assuming we can fetch the user by ID.
def get_current_student_placeholder(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return user.student_profile

# ===================================================================
# --- Admin Endpoints ---
# ===================================================================

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.TimetableSlot)
def create_timetable_slot(slot: schemas.TimetableSlotCreate, db: Session = Depends(database.get_db)):
    """
    Creates a new lecture slot in the timetable.
    """
    new_slot = models.TimetableSlot(**slot.dict())
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/{branch}/{year}", response_model=List[schemas.TimetableSlot])
def get_timetable_for_group(branch: str, year: int, db: Session = Depends(database.get_db)):
    """
    Fetches the entire timetable for a specific branch and year.
    """
    # Use joinedload to efficiently fetch related course, faculty, and classroom data
    slots = (
        db.query(models.TimetableSlot)
        .options(
            joinedload(models.TimetableSlot.course),
            joinedload(models.TimetableSlot.faculty),
            joinedload(models.TimetableSlot.classroom)
        )
        .filter(models.TimetableSlot.branch == branch, models.TimetableSlot.year == year)
        .all()
    )
    return slots

@router.put("/{slot_id}", response_model=schemas.TimetableSlot)
def update_timetable_slot(slot_id: int, slot_data: schemas.TimetableSlotCreate, db: Session = Depends(database.get_db)):
    """
    Updates an existing lecture slot.
    """
    slot_query = db.query(models.TimetableSlot).filter(models.TimetableSlot.id == slot_id)
    existing_slot = slot_query.first()
    if not existing_slot:
        raise HTTPException(status_code=404, detail="Timetable slot not found")
    
    slot_query.update(slot_data.dict())
    db.commit()
    db.refresh(existing_slot)
    return existing_slot

@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_timetable_slot(slot_id: int, db: Session = Depends(database.get_db)):
    """
    Deletes a lecture slot from the timetable.
    """
    slot_to_delete = db.query(models.TimetableSlot).filter(models.TimetableSlot.id == slot_id).first()
    if not slot_to_delete:
        raise HTTPException(status_code=404, detail="Timetable slot not found")
        
    db.delete(slot_to_delete)
    db.commit()
    return

# ===================================================================
# --- Student Endpoint ---
# ===================================================================

@router.get("/my-schedule/{user_id}", response_model=List[schemas.TimetableSlot])
def get_my_schedule(user_id: int, db: Session = Depends(database.get_db)):
    """
    Fetches the timetable for the currently logged-in student.
    We pass user_id as a path parameter for simplicity in the hackathon.
    """
    student_profile = get_current_student_placeholder(user_id, db)
    
    if not student_profile.branch or not student_profile.year:
        # Return an empty list if the student's profile is incomplete
        return []

    # Reuse the same function as the admin to get the data
    return get_timetable_for_group(student_profile.branch, student_profile.year, db)