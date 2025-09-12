from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
# --- CORRECTED IMPORTS ---
from .. import database, models
from ..schemas import user_schemas as schemas # This alias makes the code clean

# Create a "router" to group all authentication-related endpoints
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# --- Endpoint for Student Signup ---
@router.post("/signup/student", status_code=status.HTTP_201_CREATED)
def signup_student(request: schemas.StudentCreate, db: Session = Depends(database.get_db)):
    """
    Handles the registration of a new student.
    Validates that the email, SAP ID, and Roll Number are unique.
    """
    # 1. Check for existing user, sap_id, or roll_number to prevent duplicates
    if db.query(models.User).filter(models.User.email == request.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if db.query(models.StudentProfile).filter(models.StudentProfile.sap_id == request.sap_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SAP ID already registered")
    if db.query(models.StudentProfile).filter(models.StudentProfile.roll_number == request.roll_number).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Roll Number already registered")

    # 2. Find the 'student' role from the database. This is critical for assigning the correct role.
    student_role = db.query(models.Role).filter(models.Role.name == "student").first()
    if not student_role:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Essential 'student' role not found in database. Please run initial data seed.")

    # 3. Create the new user record in the 'users' table
    new_user = models.User(
        full_name=request.full_name,
        email=request.email,
        password=request.password, # Storing plaintext password for hackathon
        role_id=student_role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # Get the new user's ID from the database

    # 4. Create the associated student profile record in the 'student_profiles' table
    new_profile = models.StudentProfile(
        user_id=new_user.id,
        sap_id=request.sap_id,
        roll_number=request.roll_number,
        class_name=request.class_name,
        division=request.division
    )
    db.add(new_profile)
    db.commit()

    return {"message": "Student account created successfully"}


# --- Endpoint for Generic Login (Student, Admin, Faculty) ---
@router.post("/login", response_model=schemas.UserResponse)
def login(request: schemas.UserLogin, db: Session = Depends(database.get_db)):
    """
    Handles login for any user role.
    Returns the user's details and role upon successful authentication.
    """
    # 1. Find the user by their email, as it's the unique identifier for login
    user = db.query(models.User).filter(models.User.email == request.email).first()

    # 2. Check if the user exists and if the provided password matches the one in the database
    if not user or user.password != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # 3. Build the response. If the user is a student, we fetch and include their profile details.
    student_details_response = None
    if user.role.name == 'student' and user.student_profile:
        # Use the Pydantic schema to format the student profile data
        student_details_response = schemas.StudentProfileSchema.from_orm(user.student_profile)

    # 4. Return the user data, shaped by the UserResponse schema to ensure no password is sent.
    return schemas.UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role.name,
        student_details=student_details_response
    )