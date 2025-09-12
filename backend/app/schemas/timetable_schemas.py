from pydantic import BaseModel
from typing import List
import datetime

# ===================================================================
# --- Schemas for Basic Building Blocks (Courses, Classrooms) ---
# ===================================================================

class CourseBase(BaseModel):
    name: str
    code: str

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    class Config:
        from_attributes = True

class ClassroomBase(BaseModel):
    name: str
    capacity: int | None = None

class ClassroomCreate(ClassroomBase):
    pass

class Classroom(ClassroomBase):
    id: int
    class Config:
        from_attributes = True

# ===================================================================
# --- Schemas for the Timetable Slots ---
# ===================================================================

# Schema for creating a new timetable slot (sent from Admin)
class TimetableSlotCreate(BaseModel):
    course_id: int
    faculty_id: int
    classroom_id: int
    day_of_week: int
    start_time: datetime.time
    end_time: datetime.time
    branch: str
    year: int

# --- Schemas for Reading/Displaying Timetable Data ---

# A simplified schema for showing faculty details within a slot
class FacultyInSlot(BaseModel):
    id: int
    full_name: str
    class Config:
        from_attributes = True

# The full, detailed schema for sending a single slot to the frontend
class TimetableSlot(BaseModel):
    id: int
    day_of_week: int
    start_time: datetime.time
    end_time: datetime.time
    branch: str
    year: int
    
    # Nest the full details of related items
    course: Course
    faculty: FacultyInSlot
    classroom: Classroom

    class Config:
        from_attributes = True