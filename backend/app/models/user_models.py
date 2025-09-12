# --- CORRECTED IMPORT STATEMENTS ---
# We REMOVED the faulty postgresql import and added TIMESTAMP to the main import
from sqlalchemy import (
    Column, Integer, String, ForeignKey, BigInteger, Date, Time, 
    DECIMAL, TEXT, Boolean, TIMESTAMP
)
from sqlalchemy.orm import relationship
from ..database import Base

# --- Role Model ---
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

# --- User Model ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    role = relationship("Role")
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

# --- Student Profile Model ---
class StudentProfile(Base):
    __tablename__ = "student_profiles"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    sap_id = Column(BigInteger, unique=True, nullable=False, index=True)
    roll_number = Column(String, unique=True, nullable=False, index=True)
    branch = Column(String) # e.g., "COMPS", "IT", "AI"
    year = Column(Integer)  # e.g., 1 for FE, 2 for SE, etc.
    user = relationship("User", back_populates="student_profile")

# --- Course Model ---
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)

# --- Classroom Model ---
class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    capacity = Column(Integer)



# --- Attendance Model ---
class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("timetable_slots.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

# --- Grade Model ---
class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    assignment_name = Column(String, nullable=False)
    score = Column(DECIMAL(5, 2), nullable=False)
    total_marks = Column(DECIMAL(5, 2), nullable=False)
    # --- CORRECTED TIMESTAMP ---
    graded_at = Column(TIMESTAMP(timezone=True), server_default='now()')

# --- Event Model ---
class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(TEXT)
    location = Column(String)
    # --- CORRECTED TIMESTAMP ---
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    end_time = Column(TIMESTAMP(timezone=True))
    created_by_id = Column(Integer, ForeignKey("users.id"))

# --- Activity Log Model ---
class ActivityLog(Base):
    __tablename__ = "activity_log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(TEXT, nullable=False)
    # --- CORRECTED TIMESTAMP ---
    timestamp = Column(TIMESTAMP(timezone=True), server_default='now()')

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(TEXT)
    price = Column(DECIMAL(10, 2), nullable=False)
    # --- CHANGE ---
    # We will store categories as a comma-separated string like "veg,jain"
    category = Column(String, nullable=False, default="veg")
    is_available = Column(Boolean, default=True)

# --- Order Model ---
class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="placed")
    # --- CORRECTED TIMESTAMP ---
    created_at = Column(TIMESTAMP(timezone=True), server_default='now()')
    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

# --- OrderItem Model ---
class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    special_instructions = Column(TEXT)
    menu_item = relationship("MenuItem")
    order = relationship("Order", back_populates="items")
    
    
class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False) # 1=Mon, 2=Tue, etc.
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    # --- ADD THESE TWO COLUMNS ---
    # These link the lecture to a specific student group
    branch = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    course = relationship("Course")
    faculty = relationship("User")
    classroom = relationship("Classroom")


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    # The student who submitted, can be NULL if anonymous
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    rating = Column(Integer, nullable=True) # Optional rating from 1-5
    comment = Column(TEXT, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default='now()')

    # Relationship to get the student's details
    student = relationship("User")