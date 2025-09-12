from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from ..database import Base

# Represents the 'roles' table
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)


# Represents the 'users' table
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) # Plaintext for hackathon
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    # Establishes a relationship to the Role model
    role = relationship("Role")
    # Establishes a relationship to the StudentProfile model
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


# Represents the 'student_profiles' table
class StudentProfile(Base):
    __tablename__ = "student_profiles"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    sap_id = Column(BigInteger, unique=True, nullable=False, index=True)
    roll_number = Column(String, unique=True, nullable=False, index=True)
    class_name = Column(String)
    division = Column(String)

    # Establishes the reverse relationship back to the User model
    user = relationship("User", back_populates="student_profile")