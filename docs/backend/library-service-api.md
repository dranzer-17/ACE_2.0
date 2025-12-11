# Backend Library Service API

This section describes the API endpoints and database models for the Library Service, enabling management of books, their allocation to students, and a queuing system for unavailable books.

## Database Models (`backend/app/models/library_models.py`)

The Library Service utilizes the following SQLAlchemy models to manage library data:

### `Book` Model

Represents a library book with its details, total copies, and availability status.

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
    added_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
```

**`BookStatus` Enum:**
```python
class BookStatus(enum.Enum):
    available = "available"
    unavailable = "unavailable"
```

### `BookAllocation` Model

Records the allocation of a book to a student, including allocation and due dates, and return status.

```python
class BookAllocation(Base):
    __tablename__ = "library_allocations"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("library_books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    allocated_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    due_date = Column(TIMESTAMP(timezone=True), nullable=False)
    returned_at = Column(TIMESTAMP(timezone=True))
    status = Column(Enum(AllocationStatus), default=AllocationStatus.active)
    
    book = relationship("Book")
    student = relationship("User")
```

**`AllocationStatus` Enum:**
```python
class AllocationStatus(enum.Enum):
    active = "active"
    returned = "returned"
```

### `BookQueue` Model

Manages a queue for students waiting for a book that is currently unavailable.

```python
class BookQueue(Base):
    __tablename__ = "library_queue"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("library_books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    queued_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    notified_at = Column(TIMESTAMP(timezone=True))
    expires_at = Column(TIMESTAMP(timezone=True))
    status = Column(Enum(QueueStatus), default=QueueStatus.waiting)
    
    book = relationship("Book")
    student = relationship("User")
```

**`QueueStatus` Enum:**
```python
class QueueStatus(enum.Enum):
    waiting = "waiting"
    notified = "notified"
    expired = "expired"
    fulfilled = "fulfilled"
```

## API Endpoints (`backend/app/routes/library_routes.py`)

*(Note: Specific routes will be defined based on the implementation in `library_routes.py` once available. Expected functionalities include:)*

### Books Management
- `GET /api/library/books`: Retrieve a list of all books.
- `GET /api/library/books/{book_id}`: Retrieve details for a specific book.
- `POST /api/library/books`: Add a new book.
- `PUT /api/library/books/{book_id}`: Update book details.
- `DELETE /api/library/books/{book_id}`: Remove a book.

### Book Allocation
- `GET /api/library/allocations`: Retrieve all book allocations.
- `POST /api/library/allocations`: Allocate a book to a student.
- `PUT /api/library/allocations/{allocation_id}/return`: Mark a book as returned.

### Book Queue
- `GET /api/library/queue`: Retrieve the book queue.
- `POST /api/library/queue/{book_id}/join`: Join the queue for a specific book.
- `DELETE /api/library/queue/{book_id}/leave`: Leave the queue for a specific book.
- `POST /api/library/queue/{queue_id}/notify`: Notify a student that a book is available.
