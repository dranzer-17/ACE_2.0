# Backend Database Configuration

This section details the database configuration and management within the backend, particularly focusing on `backend/app/database.py`.

## Database Connection

The application uses SQLAlchemy for object-relational mapping (ORM) and supports SQLite for local development to simplify setup.

### `database.py` Overview

`database.py` is responsible for:
- Loading environment variables (e.g., for database connection strings).
- Creating the SQLAlchemy engine for connecting to the database.
- Defining `SessionLocal` for creating database sessions.
- Providing the `Base` class for declarative model definition.
- Implementing the `get_db` dependency function for managing database sessions within API requests.

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load variables from your .env file
load_dotenv()

# Force SQLite for local development to avoid PostgreSQL dependency issues
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ace_app.db")

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
```

### Local Development with SQLite

By default, the `DATABASE_URL` is set to `sqlite:///./ace_app.db`, which creates a local SQLite database file named `ace_app.db` in the current directory. This simplifies local development by removing the need for a separate PostgreSQL or other database server.

For SQLite, `connect_args={"check_same_thread": False}` is necessary to allow multiple threads to interact with the database connection, which is common in web servers like FastAPI.

### `get_db` Dependency

The `get_db` function is a FastAPI dependency that provides a database session (`SessionLocal`) to route handlers. It ensures that a new session is created for each request and properly closed afterward, preventing resource leaks and managing transaction scope.