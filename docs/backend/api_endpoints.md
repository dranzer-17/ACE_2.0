## Backend API Endpoints

This section describes the various API endpoints provided by the ACE 2.0 backend.

### Authentication Endpoints

All authentication-related endpoints are prefixed with `/auth`.

#### `POST /auth/signup/student`

Registers a new student user in the system. This endpoint validates the uniqueness of the email, SAP ID, and Roll Number before creating a new user and an associated student profile.

- **Purpose**: To allow new students to register an account on the platform.
- **Method**: `POST`
- **URL**: `/auth/signup/student`
- **Tags**: `Authentication`

**Request Body (`application/json`)**

The request body should conform to the `StudentCreate` schema, containing the student's personal and academic details.

```json
{
  "full_name": "John Student",
  "email": "john.student@example.com",
  "password": "secure_password_123",
  "sap_id": 1234567890,
  "roll_number": "S12345",
  "branch": "COMPS",
  "year": 2
}
```

**Responses**

- **`201 Created`**: Successfully registered the student.
  ```json
  {
    "id": 1,
    "full_name": "John Student",
    "email": "john.student@example.com",
    "role": {
      "id": 1,
      "name": "student"
    },
    "student_profile": {
      "user_id": 1,
      "sap_id": 1234567890,
      "roll_number": "S12345",
      "branch": "COMPS",
      "year": 2
    }
  }
  ```
- **`400 Bad Request`**: If the email, SAP ID, or Roll Number is already registered.
  ```json
  {
    "detail": "Email already registered"
  }
  ```
- **`500 Internal Server Error`**: If the 'student' role is not found in the database (indicates a missing initial setup/seed).
  ```json
  {
    "detail": "Essential 'student' role not found in database. Please run initial data seed."
  }
  ```

### Integrated Routers

The `main.py` file now includes several new routers, indicating the presence of additional API endpoints for various modules:

- `auth_routes`
- `canteen_routes`
- `management_routes`
- `timetable_routes`
- `feedback_routes`
- `library_routes`
- `navigation_routes`
- `chat_routes`

Detailed documentation for endpoints under these routers will be provided in their respective sections.