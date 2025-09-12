from pydantic import BaseModel, EmailStr
from typing import Optional

# Defines the shape of student-specific data.
# This will be nested inside the main user response.
class StudentProfileSchema(BaseModel):
    sap_id: int
    roll_number: str
    class_name: str
    division: str

    # Pydantic configuration to work with SQLAlchemy models
    class Config:
        from_attributes = True

# Validates the data for a new student signing up.
# This is what the /signup/student endpoint will expect.
class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    sap_id: int
    roll_number: str
    class_name: str
    division: str

# Validates the data for any user logging in.
# This is what the /login endpoint will expect.
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Defines the shape of the user data we send back to the frontend.
# This prevents sensitive data like passwords from ever being sent out.
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    student_details: Optional[StudentProfileSchema] = None

    class Config:
        from_attributes = True

class UserList(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    
    # We add a role field to be populated manually in the route
    role: str 

    class Config:
        from_attributes = True