### Application Routers

The FastAPI application organizes its endpoints into distinct modules, each handled by a dedicated `APIRouter`. These routers are included in the `main.py` file to form the complete API surface.

- `auth_routes.router`: Handles user authentication and authorization.
- `canteen_routes.router`: Manages canteen-related functionalities like menu and orders.
- `management_routes.router`: Provides management-specific functionalities.
- `timetable_routes.router`: Manages academic timetables.
- `feedback_routes.router`: Handles general feedback submission and retrieval (deprecated/overridden by new admin/student specific feedback routes).
- `library_routes.router`: Manages library-related operations for both admins and students.
- `navigation_routes.router`: Provides navigation data.
- `chat_routes.router`: Handles chat functionalities.
- **New**: `admin/feedback.router`: Endpoints for administrators to manage feedback.
- **New**: `admin/library.router`: Endpoints for administrators to manage library books, allocations, and queues.
- **New**: `student/collaboration.router`: Endpoints for students to manage collaboration posts and initiate chats.
- **New**: `student/feedback.router`: Endpoints for students to submit feedback.
- **New**: `student/library.router`: Endpoints for students to browse books, request books, and manage their personal allocations and queue.

This modular approach helps in maintaining a clean and scalable API structure.