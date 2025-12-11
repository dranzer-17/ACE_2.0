# Backend Setup Guide

This guide details how to set up and understand the backend services for ACE 2.0.

## Database Configuration (`backend/app/database.py`)

The application uses SQLAlchemy for database interactions. For local development, it is configured to use SQLite, with an option to switch to PostgreSQL for production environments.

### Connection Details
- **Local Development**: `sqlite:///./ace_app.db`
  - This creates a SQLite database file named `ace_app.db` in the `backend/app` directory.
- **PostgreSQL**: Configuration for PostgreSQL should be set via environment variables (e.g., `DATABASE_URL`) which would override the default SQLite URL.

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ace_app.db") # Added os.getenv for flexibility

# Special configuration for SQLite to allow multiple threads to access the same connection
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency function for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### `get_db` Dependency
The `get_db` function is a FastAPI dependency that provides a database session for each request, ensuring proper session management (opening and closing).

## Application Initialization (`backend/app/main.py`)

The `main.py` file serves as the entry point for the FastAPI application. It handles:
- Database table creation based on defined models.
- Application lifespan management for startup and shutdown hooks.
- CORS (Cross-Origin Resource Sharing) middleware configuration.
- Inclusion of all API routers from different modules.

```python
# ... imports ...

# --- Create the database tables ---
# These lines ensure that all tables defined in your SQLAlchemy models (like User, Role, Book) 
# are created in the database when the application starts.
user_models.Base.metadata.create_all(bind=engine)
library_models.Base.metadata.create_all(bind=engine)

# --- Initialize the FastAPI app with the lifespan event ---
app = FastAPI(
    title="ACE 2.0 API",
    description="Backend API for the ACE 2.0 Campus Solution Platform.",
    version="1.0.0",
    lifespan=lifespan
)

# --- CORS Middleware ---
# Configures CORS to allow requests from http://localhost:3000 (typical for frontend development).
# Adjust origins as needed for deployment.
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[" rửa ", " * "],
    allow_headers=[" * "],
)

# --- Include API Routers ---
# All application-specific routes are included here to organize the API endpoints.
app.include_router(auth_routes.router)
app.include_router(canteen_routes.router)
app.include_router(management_routes.router)
app.include_router(timetable_routes.router)
app.include_router(feedback_routes.router) 
app.include_router(library_routes.router)
app.include_router(navigation_routes.router)
app.include_router(chat_routes.router)

# ... root endpoint ...
```