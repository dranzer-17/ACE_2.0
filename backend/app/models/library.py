from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user_models import Base
import enum

class BookStatus(enum.Enum):
    available = "available"
    allocated = "allocated"
    maintenance = "maintenance"

class AllocationStatus(enum.Enum):
    active = "active"
    returned = "returned"
    overdue = "overdue"

class QueueStatus(enum.Enum):
    waiting = "waiting"
    notified = "notified"
    expired = "expired"

class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), nullable=False)
    isbn = Column(String(20), unique=True, index=True)
    description = Column(Text)
    category = Column(String(100))
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    status = Column(Enum(BookStatus), default=BookStatus.available)
    added_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    added_by = relationship("User", foreign_keys=[added_by_id])
    allocations = relationship("BookAllocation", back_populates="book")
    queue_entries = relationship("BookQueue", back_populates="book")

class BookAllocation(Base):
    __tablename__ = "book_allocations"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    allocated_at = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True), nullable=False)
    returned_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(AllocationStatus), default=AllocationStatus.active)
    notes = Column(Text)

    # Relationships
    book = relationship("Book", back_populates="allocations")
    student = relationship("User", foreign_keys=[student_id])

class BookQueue(Base):
    __tablename__ = "book_queue"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    position = Column(Integer, nullable=False)
    status = Column(Enum(QueueStatus), default=QueueStatus.waiting)
    notified_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    book = relationship("Book", back_populates="queue_entries")
    student = relationship("User", foreign_keys=[student_id])
