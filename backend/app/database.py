from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load variables from your .env file
load_dotenv()

# Force SQLite for local development to avoid PostgreSQL dependency issues
DATABASE_URL = "sqlite:///./ace_app.db"

# For SQLite, we need to add some additional configuration
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency function to get a database session for each API request.
# This is a key FastAPI pattern for managing database connections.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()