from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import database
from ..models import user_models as models
from ..schemas import timetable_schemas as schemas
from ..schemas import user_schemas # For fetching faculty

router = APIRouter(
    prefix="/management",
    tags=["Management"]
)

# ===================================================================
# --- CRUD Endpoints for Courses ---
# ===================================================================

@router.post("/courses", status_code=status.HTTP_201_CREATED, response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(database.get_db)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/courses", response_model=List[schemas.Course])
def get_all_courses(db: Session = Depends(database.get_db)):
    courses = db.query(models.Course).all()
    return courses

# ===================================================================
# --- CRUD Endpoints for Classrooms ---
# ===================================================================

@router.post("/classrooms", status_code=status.HTTP_201_CREATED, response_model=schemas.Classroom)
def create_classroom(classroom: schemas.ClassroomCreate, db: Session = Depends(database.get_db)):
    new_classroom = models.Classroom(**classroom.dict())
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    return new_classroom

@router.get("/classrooms", response_model=List[schemas.Classroom])
def get_all_classrooms(db: Session = Depends(database.get_db)):
    classrooms = db.query(models.Classroom).all()
    return classrooms

# ===================================================================
# --- Endpoint for Fetching Faculty Users ---
# ===================================================================

@router.get("/faculty", response_model=List[user_schemas.UserResponse])
def get_all_faculty(db: Session = Depends(database.get_db)):
    """
    Fetches all users with the 'faculty' role to populate dropdowns.
    """
    faculty_role = db.query(models.Role).filter(models.Role.name == "faculty").first()
    if not faculty_role:
        return [] # Return empty list if role doesn't exist
        
    faculty_users = db.query(models.User).filter(models.User.role_id == faculty_role.id).all()
    return faculty_users