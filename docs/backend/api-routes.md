# Backend API Routes

This document outlines the API routers integrated into the main FastAPI application, `backend/app/main.py`.

## Core API Routers

The `main.py` file includes various routers to organize API endpoints by feature. The following routers have been added or updated:

- `auth_routes.router`: Handles user authentication and authorization.
- `canteen_routes.router`: Manages canteen-related functionalities (e.g., menu, orders).
- `management_routes.router`: Likely covers various management functionalities (e.g., user management, committee management, application review). **(New)**
- `timetable_routes.router`: Manages academic timetables.
- `feedback_routes.router`: Handles user feedback submissions.
- `library_routes.router`: Provides endpoints for the new Library Service. **(New)**
- `navigation_routes.router`: Manages navigational data.
- `chat_routes.router`: Provides endpoints for real-time chat functionality. **(New)**

### Integration in `main.py`

The routers are integrated into the FastAPI application using `app.include_router()`:

```python
# --- Include API Routers ---
app.include_router(auth_routes.router)
app.include_router(canteen_routes.router)
app.include_router(management_routes.router)
app.include_router(timetable_routes.router)
app.include_router(feedback_routes.router)
app.include_router(library_routes.router)
app.include_router(navigation_routes.router)
app.include_router(chat_routes.router)
```