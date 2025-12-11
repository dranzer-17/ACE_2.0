## Backend Setup and Initialization

This section details the necessary steps to set up and initialize the backend server, including database configuration and data seeding.

### Database Configuration

The backend uses SQLAlchemy for database interactions. By default, for local development, it is configured to use SQLite to minimize setup complexity. For production environments, PostgreSQL is typically used (though the current configuration forces SQLite).

**Environment Variables (`.env`)**

The application loads environment variables from a `.env` file for configuration. While `DATABASE_URL` is currently hardcoded to SQLite for local development, in a production setup, you would define database connection strings here.

```env
# Example for PostgreSQL (not currently active due to forced SQLite for local dev)
# DATABASE_URL="postgresql://user:password@host:port/dbname"

# Or for local SQLite (currently default)
# DATABASE_URL="sqlite:///./ace_app.db"
```

**SQLite Database**

- The application will automatically create an `ace_app.db` file in the `backend/app/` directory if it doesn't exist.
- The `connect_args={"check_same_thread": False}` option for SQLite is crucial when using SQLAlchemy with SQLite in a multi-threaded web application like FastAPI (which uses `uvicorn`).

### Database Table Creation

Database models (like `User`, `Role`, `Book`, etc.) are defined using SQLAlchemy's declarative base. The `create_all` method is called in `main.py` to create all defined tables in the connected database if they don't already exist.

```python
# backend/app/main.py
# ...
import os

# --- Create the database tables --- (Simplified for documentation)
# Call create_all for all Base instances from your models
user_models.Base.metadata.create_all(bind=engine)
library_models.Base.metadata.create_all(bind=engine)
# Call for other models as they are added...
# ...
```

### Initial Data Seeding

Several JSON files are used to provide initial data for various modules. These files are typically loaded during development or initial deployment to populate the database with sensible default records.

- **`chat_data.json`**: Contains initial chat rooms with participants.
- **`library_data.json`**: Contains a list of books available in the library.
- **`menu_data.json`**: Provides menu items for the canteen.
- **`messages_data.json`**: Contains initial messages for chat rooms.

These JSON files are illustrative data and might be imported into the database via separate scripts or initializers in a real-world scenario.