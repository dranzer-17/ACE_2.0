# ACE 2.0 Backend API Documentation

This document describes the publicly exposed API endpoints for the ACE 2.0 Campus Solution Platform.

## Table of Contents
1. [Setup and Configuration](#setup-and-configuration)
2. [Authentication](#authentication)
   - [/auth/signup/student](#authsignupstudent)
   - [/auth/login](#authlogin)
3. [Data Models](#data-models)
   - [User Model](#user-model)
   - [Student Profile Model](#student-profile-model)
   - [Role Model](#role-model)

---

## Setup and Configuration

Before running the ACE 2.0 backend, ensure the following environment variables are set:

### `DATABASE_URL`

**Required:** Yes

**Description:** The connection string for the PostgreSQL database. This URL tells SQLAlchemy how to connect to your database. Example formats:

*   `postgresql://user:password@host:port/database_name`

**Example (`.env` file):**
```dotenv
DATABASE_URL="postgresql://ace_user:strong_password@localhost:5432/ace_db"
```

**Database Initialization:**

Upon initial setup, ensure database migrations are run to create tables. Essential roles (e.g., 'student', 'admin') should be seeded if they don't exist, as the signup endpoints depend on these roles.

---

## Authentication

The Authentication API provides endpoints for user registration (specifically students) and login.

### `/auth/signup/student`

**Endpoint:** `POST /auth/signup/student`

**Description:** Registers a new student user in the system. Ensures uniqueness of email, SAP ID, and Roll Number. Assigns the 'student' role upon successful registration.

**Request Body (`application/json`):
   - Schema:** `StudentCreate`
   - Example:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "sap_id": 70000000012,
  "roll_number": "D10AS1234",
  "class_name": "SE Comp",
  "division": "A"
}
```

**Response (`201 CREATED` - `application/json`):
   - Success:**
```json
{
  "message": "Student registered successfully."
}
```

**Error Responses:**
*   `400 Bad Request`: If email, SAP ID, or Roll Number already registered.
*   `500 Internal Server Error`: If the 'student' role is not found in the database.

### `/auth/login`

**Endpoint:** `POST /auth/login`

**Description:** Authenticates a user with their email and password. On successful authentication, returns user details.

**Request Body (`application/json`):
   - Schema:** `UserLogin`
   - Example:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response (`200 OK` - `application/json`):
   - Schema:** `UserResponse`
   - Example:**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "role": {
    "id": 1,
    "name": "student"
  },
  "student_details": {
    "sap_id": 70000000012,
    "roll_number": "D10AS1234",
    "class_name": "SE Comp",
    "division": "A"
  }
}
```
*(Note: The `role` field might return a string or an object depending on future token implementation. For now, it returns a Role object.)*

**Error Responses:**
*   `401 Unauthorized`: For invalid credentials.

---

## Data Models

These are the underlying data structures used by the application, defined using SQLAlchemy models and Pydantic schemas. 

### User Model (`User`) 

Represents a user account in the system.

| Field       | Type      | Description                               |
|-------------|-----------|-------------------------------------------|
| `id`        | Integer   | Primary key, unique identifier            |
| `full_name` | String    | User's full name                          |
| `email`     | String    | User's email, unique                      |
| `password`  | String    | Hashed password (currently plaintext for hackathon) |
| `role_id`   | Integer   | Foreign key to the `Role` model           |
| `role`      | Relationship | Related `Role` object                     |
| `student_profile` | Relationship | Related `StudentProfile` object (one-to-one) |

### Student Profile Model (`StudentProfile`)

Contains additional details specific to student users.

| Field          | Type      | Description                               |
|----------------|-----------|-------------------------------------------|
| `user_id`      | Integer   | Primary key, foreign key to `User` model  |
| `sap_id`       | BigInteger | Student's SAP ID, unique                 |
| `roll_number`  | String    | Student's Roll Number, unique             |
| `class_name`   | String    | Student's class (e.g., 'SE Comp')         |
| `division`     | String    | Student's division (e.g., 'A')            |
| `user`         | Relationship | Related `User` object                     |

### Role Model (`Role`)

Defines user roles within the system (e.g., 'student', 'admin').

| Field    | Type      | Description                               |
|----------|-----------|-------------------------------------------|
| `id`     | Integer   | Primary key, unique identifier            |
| `name`   | String    | Name of the role (e.g., 'student'), unique |

---
