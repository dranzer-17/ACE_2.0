## Backend Data Models

This section outlines the SQLAlchemy data models used in the ACE 2.0 backend, specifying their attributes and relationships.

### Library Management Models (`library_models.py`)

These models manage the library's book inventory, allocations to students, and a queuing system for unavailable books.

#### Enums

- **`BookStatus`**: Represents the current status of a book.
  - `available`: The book is ready to be allocated.
  - `unavailable`: The book is not currently available (e.g., under repair, lost).
- **`AllocationStatus`**: Represents the status of a book allocation.
  - `active`: The book is currently allocated to a student.
  - `returned`: The book has been returned by the student.
- **`QueueStatus`**: Represents the status of a book in the queue.
  - `waiting`: Student is waiting for the book.
  - `notified`: Student has been notified that the book is available.
  - `expired`: Notification period expired without allocation.
  - `fulfilled`: Student successfully allocated the book from the queue.

#### `Book` Model (`library_books` table)

Represents a book in the library's catalog.

- `id`: Primary key, integer.
- `title`: Book title, string, required, indexed.
- `author`: Book author, string, required.
- `isbn`: International Standard Book Number, string, unique, required, indexed.
- `description`: Book description, text.
- `category`: Book category, string (e.g., 'Programming', 'Computer Science').
- `total_copies`: Total number of copies of this book, integer, default 1.
- `available_copies`: Number of currently available copies, integer, default 1.
- `status`: Current status of the book, `BookStatus` enum, default `available`.
- `added_by_id`: Foreign key to `users.id`, indicating who added the book.
- `created_at`: Timestamp of when the book was added, default `now()`.

#### `BookAllocation` Model (`library_allocations` table)

Records the allocation of a specific book to a student.

- `id`: Primary key, integer.
- `book_id`: Foreign key to `library_books.id`, required.
- `student_id`: Foreign key to `users.id`, required.
- `allocated_at`: Timestamp of allocation, default `now()`.
- `due_date`: Date when the book is due for return, required.
- `returned_at`: Timestamp of when the book was returned (nullable).
- `status`: Current status of the allocation, `AllocationStatus` enum, default `active`.
- `book`: Relationship to `Book` model.
- `student`: Relationship to `User` model.

#### `BookQueue` Model (`library_queue` table)

Manages students waiting for books that are currently unavailable.

- `id`: Primary key, integer.
- `book_id`: Foreign key to `library_books.id`, required.
- `student_id`: Foreign key to `users.id`, required.
- `queued_at`: Timestamp when the student joined the queue, default `now()`.
- `notified_at`: Timestamp when the student was notified of availability (nullable).
- `expires_at`: Timestamp when the queue entry expires after notification (nullable).
- `fulfilled_at`: Timestamp when the queue request was fulfilled (nullable).
- `status`: Current status of the queue entry, `QueueStatus` enum, default `waiting`.
- `position`: Student's position in the queue for that book, integer.
- `book`: Relationship to `Book` model.
- `student`: Relationship to `User` model.

### User and Authentication Models (`user_models.py`)

These models define the core user structure, roles, and student-specific profiles.

#### `Role` Model (`roles` table)

Defines user roles within the system (e.g., 'student', 'admin').

- `id`: Primary key, integer.
- `name`: Role name, string, unique, required.

#### `User` Model (`users` table)

Represents a generic user in the system.

- `id`: Primary key, integer.
- `full_name`: User's full name, string, required.
- `email`: User's email address, string, unique, required, indexed.
- `password`: Hashed password, string, required.
- `role_id`: Foreign key to `roles.id`, required.
- `role`: Relationship to `Role` model.
- `student_profile`: One-to-one relationship to `StudentProfile` (if user is a student).

#### `StudentProfile` Model (`student_profiles` table)

Stores specific details for student users.

- `user_id`: Foreign key to `users.id`, primary key, links to `User`.
- `sap_id`: Student Academic Program ID, bigint, unique, required, indexed.
- `roll_number`: Student's roll number, string, unique, required, indexed.
- `branch`: Student's academic branch (e.g., 'COMPS', 'IT').
- `year`: Student's academic year (e.g., 1 for FE, 2 for SE).
- `user`: Bidirectional relationship to `User` model.

#### `Course` Model (`courses` table)

Defines academic courses offered.

- `id`: Primary key, integer.
- `name`: Course full name, string, required.
- `code`: Course code (e.g., 'CS201'), string, unique, required.

#### `Classroom` Model (`classrooms` table)

Defines physical classrooms.

- `id`: Primary key, integer.
- `name`: Classroom name/number, string, unique, required.
- `capacity`: Seating capacity, integer.

#### `Attendance` Model (`attendance` table)

Records student attendance for courses.

- `id`: Primary key, integer.
- `student_id`: Foreign key to `users.id`, required.
- `course_id`: Foreign key to `courses.id`, required.
- `date`: Date of attendance, date, required.
- `status`: Attendance status (e.g., 'present', 'absent'), string, required.
- `attended_by_id`: Foreign key to `users.id` (who marked attendance).
- `course_session_id`: Foreign key to `course_sessions.id`.
- `student`: Relationship to `User` model.
- `course`: Relationship to `Course` model.

#### `CanteenItem` Model (`canteen_items` table)

Represents food items available in the canteen.

- `id`: Primary key, integer.
- `name`: Item name, string, unique, required.
- `description`: Item description, text.
- `price`: Item price, decimal, required.
- `category`: Item categories (e.g., 'veg', 'non-veg', 'jain'), string.
- `is_available`: Boolean indicating availability, default `True`.

#### `Order` Model (`orders` table)

Represents a customer's order from the canteen.

- `id`: Primary key, integer.
- `user_id`: Foreign key to `users.id`, required.
- `order_time`: Timestamp of order, default `now()`.
- `total_amount`: Total price of the order, decimal, required.
- `status`: Order status (e.g., 'pending', 'completed'), string.
- `user`: Relationship to `User` model.

#### `OrderItem` Model (`order_items` table)

Details individual items within an order.

- `id`: Primary key, integer.
- `order_id`: Foreign key to `orders.id`, required.
- `item_id`: Foreign key to `canteen_items.id`, required.
- `quantity`: Quantity of the item, integer, required, default 1.
- `price_at_order`: Price of the item at the time of order, decimal.
- `order`: Relationship to `Order` model.
- `item`: Relationship to `CanteenItem` model.

#### `Feedback` Model (`feedback` table)

Stores user feedback.

- `id`: Primary key, integer.
- `user_id`: Foreign key to `users.id`, required.
- `category`: Feedback category (e.g., 'bug', 'feature_request'), string.
- `subject`: Feedback subject, string.
- `message`: Feedback message, text, required.
- `rating`: Optional rating (1-5), integer.
- `submitted_at`: Timestamp of submission, default `now()`.
- `status`: Feedback status (e.g., 'pending', 'resolved'), string.
- `user`: Relationship to `User` model.

#### `NavigationItem` Model (`navigation_items` table)

Defines items for the navigation menu.

- `id`: Primary key, integer.
- `name`: Navigation item name, string, required.
- `path`: URL path for the item, string, unique.
- `icon`: Icon name for the item, string.
- `order`: Display order, integer.
- `parent_id`: Foreign key to `navigation_items.id` for nested items (nullable).
- `is_visible`: Boolean for visibility, default `True`.

#### `CourseSession` Model (`course_sessions` table)

Represents a scheduled class session for a course.

- `id`: Primary key, integer.
- `course_id`: Foreign key to `courses.id`, required.
- `classroom_id`: Foreign key to `classrooms.id`, required.
- `instructor_id`: Foreign key to `users.id` (the instructor), required.
- `scheduled_time`: Time of the session, time, required.
- `scheduled_date`: Date of the session, date, required.
- `duration_minutes`: Duration in minutes, integer.
- `course`: Relationship to `Course` model.
- `classroom`: Relationship to `Classroom` model.
- `instructor`: Relationship to `User` model.

#### `TimetableEntry` Model (`timetable_entries` table)

Represents individual entries in a student's timetable.

- `id`: Primary key, integer.
- `student_id`: Foreign key to `users.id`, required.
- `course_session_id`: Foreign key to `course_sessions.id`, required.
- `day_of_week`: Day of the week (e.g., 'Monday'), string, required.
- `start_time`: Start time of the entry, time, required.
- `end_time`: End time of the entry, time, required.
- `student`: Relationship to `User` model.
- `course_session`: Relationship to `CourseSession` model.

