# Authentication API

This section describes the authentication endpoints available in the ACE 2.0 API.

## Student Signup

### `POST /auth/signup/student`

Registers a new student user in the system. Ensures uniqueness of email, SAP ID, and Roll Number. Assigns the 'student' role.

**Endpoint:** `/auth/signup/student`
**Method:** `POST`
**Status Code:** `201 Created` on success

### Request Body Schema (`StudentCreate`)

```json
{
  "full_name": "string",     // Required, e.g., "John Doe"
  "email": "string",         // Required, unique, e.g., "john.doe@example.com"
  "password": "string",      // Required, plain text password (should be strong and will be hashed server-side)
  "sap_id": 1234567890,      // Required, unique long integer, e.g., SAP ID
  "roll_number": "string",   // Required, unique, e.g., "A123"
  "branch": "string",        // Optional, e.g., "COMPS", "IT"
  "year": 1                  // Optional, e.g., 1 (for FE), 2 (for SE)
}
```

### Example Request

```bash
curl -X POST "http://localhost:8000/auth/signup/student" \
-H "Content-Type: application/json" \
-d '{
  "full_name": "Jane Doe",
  "email": "jane.doe@university.com",
  "password": "SecurePass123",
  "sap_id": 1000000002,
  "roll_number": "S002",
  "branch": "IT",
  "year": 2
}'
```

### Successful Response (201 Created)

Returns the created user's basic information (without the password).

```json
{
  "id": 2,
  "full_name": "Jane Doe",
  "email": "jane.doe@university.com",
  "role_id": 1, // Assuming 'student' role has ID 1
  "student_profile": {
    "user_id": 2,
    "sap_id": 1000000002,
    "roll_number": "S002",
    "branch": "IT",
    "year": 2
  }
}
```

### Error Responses

-   **400 Bad Request**: 
    - `{"detail": "Email already registered"}`: If the provided email already exists.
    - `{"detail": "SAP ID already registered"}`: If the provided SAP ID already exists.
    - `{"detail": "Roll Number already registered"}`: If the provided Roll Number already exists.
-   **500 Internal Server Error**: 
    - `{"detail": "Essential 'student' role not found in database. Please run initial data seed."}`: If the 'student' role is not properly seeded in the database.