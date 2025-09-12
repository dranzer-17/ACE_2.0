import enum
from sqlalchemy import (
    Column, Integer, String, ForeignKey, TEXT, Boolean, TIMESTAMP, Enum
)
from sqlalchemy.orm import relationship
from ..database import Base

# --- Enums for Status Fields ---
class BookStatus(enum.Enum):
    available = "available"
    unavailable = "unavailable" # e.g., under repair, lost

class AllocationStatus(enum.Enum):
    active = "active"
    returned = "returned"

class QueueStatus(enum.Enum):
    waiting = "waiting"
    notified = "notified"
    expired = "expired"
    fulfilled = "fulfilled"

# --- Main Models ---
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
    created_at = Column(TIMESTAMP(timezone=True), server_default='now()')

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
    student = relationship("User")

class BookQueue(Base):
    __tablename__ = "library_queue"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("library_books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    position = Column(Integer, nullable=False)
    status = Column(Enum(QueueStatus), default=QueueStatus.waiting)
    requested_at = Column(TIMESTAMP(timezone=True), server_default='now()')
    notified_at = Column(TIMESTAMP(timezone=True))
    expires_at = Column(TIMESTAMP(timezone=True))
    
    book = relationship("Book")
    student = relationship("User")