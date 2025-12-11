# Backend Data Models

This section describes the SQLAlchemy data models used in the ACE 2.0 backend.

## User Management Models (`backend/app/models/user_models.py`)

### `Role` Model
Represents user roles within the system (e.g., 'student', 'admin', 'faculty').

```python
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
```

### `User` Model
Represents a user account with basic authentication details and a link to their role.

```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) # Hashed password expected
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    role = relationship("Role")
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
```

### `StudentProfile` Model
Stores specific academic details for student users, linked to the `User` model.

```python
class StudentProfile(Base):
    __tablename__ = "student_profiles"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    sap_id = Column(BigInteger, unique=True, nullable=False, index=True)
    roll_number = Column(String, unique=True, nullable=False, index=True)
    branch = Column(String) # e.g., "COMPS", "IT", "AI"
    year = Column(Integer)  # e.g., 1 for FE, 2 for SE, etc.
    user = relationship("User", back_populates="student_profile")
```

### `Course` Model
Defines academic courses offered.

```python
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
```

### `Classroom` Model
Defines physical classrooms with their capacity.

```python
class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    capacity = Column(Integer)
```

### Other User Models
The `user_models.py` file also defines models like `Attendance`, `TimetableEntry`, `Feedback`, `CanteenItem`, `CanteenOrder`, `Order_Item`, `ChatMessage`, `ChatRoom`, and `NavigationNode`. These will be detailed when their respective APIs are documented.


## Library Management Models (`backend/app/models/library_models.py`)

### `BookStatus` Enum
Defines possible statuses for books.

```python
class BookStatus(enum.Enum):
    available = "available"
    unavailable = "unavailable" # e.g., under repair, lost
```

### `AllocationStatus` Enum
Defines possible statuses for book allocations.

```python
class AllocationStatus(enum.Enum):
    active = "active"
    returned = "returned"
```

### `QueueStatus` Enum
Defines possible statuses for book queue entries.

```python
class QueueStatus(enum.Enum):
    waiting = "waiting"
    notified = "notified"
    expired = "expired"
    fulfilled = "fulfilled"
```

### `Book` Model
Represents a book in the library with details like title, author, ISBN, and availability.

```python
class Book(Base):
    __tablename__ = "library_books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False)
    isbn = Column(String, unique=True, nullable=False, index=True)
    description = Column(TEXT)
    category = Column(String)
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    status = Column(Enum(BookStatus), default=BookStatus.available)
    added_by_id = Column(Integer, ForeignKey("users.id")) # Links to a User who added the book
    created_at = Column(TIMESTAMP(timezone=True), server_default='now()')
```

### `BookAllocation` Model
Records details of a book lent out to a student, including due dates and return status.

```python
class BookAllocation(Base):
    __tablename__ = "library_allocations"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("library_books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    allocated_at = Column(TIMESTAMP(timezone=True), server_default='now()')
    due_date = Column(TIMESTAMP(timezone=True), nullable=False)
    returned_at = Column(TIMESTAMP(timezone=True))
    status = Column(Enum(AllocationStatus), default=AllocationStatus.active)
    
    book = relationship("Book")
    student = relationship("User") # Links to the student who borrowed the book
```

### `BookQueue` Model
Manages a waiting list for books that are not currently available.

```python
class BookQueue(Base):
    __tablename__ = "library_queue"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("library_books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    queued_at = Column(TIMESTAMP(timezone=True), server_default='now()')
    notified_at = Column(TIMESTAMP(timezone=True)) # When the user was notified the book is available
    status = Column(Enum(QueueStatus), default=QueueStatus.waiting)

    book = relationship("Book")
    student = relationship("User") # Links to the student in the queue
```