from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime, timedelta
from ...database import get_db
from ...models.library import Book, BookAllocation, BookQueue, BookStatus, AllocationStatus, QueueStatus
from ...models.user_models import User
from pydantic import BaseModel

router = APIRouter()

# Pydantic schemas
class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    description: Optional[str] = None
    category: Optional[str] = None
    total_copies: int = 1

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    total_copies: Optional[int] = None
    status: Optional[str] = None

@router.post("/books", status_code=201)
def create_book(book_data: BookCreate, db: Session = Depends(get_db)):
    """Admin endpoint to add a new book to the library"""
    
    # Check if book with same ISBN already exists
    existing_book = db.query(Book).filter(Book.isbn == book_data.isbn).first()
    if existing_book:
        raise HTTPException(
            status_code=400,
            detail="Book with this ISBN already exists"
        )
    
    # For now, using admin user ID = 1 (in real app, get from auth token)
    admin_user = db.query(User).filter(User.id == 1).first()
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    new_book = Book(
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        description=book_data.description,
        category=book_data.category,
        total_copies=book_data.total_copies,
        available_copies=book_data.total_copies,
        added_by_id=admin_user.id
    )
    
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    
    return {
        "id": new_book.id,
        "title": new_book.title,
        "author": new_book.author,
        "isbn": new_book.isbn,
        "description": new_book.description,
        "category": new_book.category,
        "total_copies": new_book.total_copies,
        "available_copies": new_book.available_copies,
        "status": new_book.status.value,
        "created_at": new_book.created_at.isoformat()
    }

@router.get("/books")
def get_all_books(db: Session = Depends(get_db)):
    """Get all books with allocation information"""
    books = db.query(Book).all()
    
    result = []
    for book in books:
        # Get current allocations
        active_allocations = db.query(BookAllocation).filter(
            and_(
                BookAllocation.book_id == book.id,
                BookAllocation.status == AllocationStatus.active
            )
        ).count()
        
        # Get queue count
        queue_count = db.query(BookQueue).filter(
            and_(
                BookQueue.book_id == book.id,
                BookQueue.status == QueueStatus.waiting
            )
        ).count()
        
        result.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "isbn": book.isbn,
            "description": book.description,
            "category": book.category,
            "total_copies": book.total_copies,
            "available_copies": book.available_copies,
            "active_allocations": active_allocations,
            "queue_count": queue_count,
            "status": book.status.value,
            "created_at": book.created_at.isoformat()
        })
    
    return result

@router.put("/books/{book_id}")
def update_book(book_id: int, book_data: BookUpdate, db: Session = Depends(get_db)):
    """Update book information"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    update_data = book_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "status":
            setattr(book, field, BookStatus(value))
        else:
            setattr(book, field, value)
    
    # If total_copies is updated, adjust available_copies
    if "total_copies" in update_data:
        active_allocations = db.query(BookAllocation).filter(
            and_(
                BookAllocation.book_id == book.id,
                BookAllocation.status == AllocationStatus.active
            )
        ).count()
        book.available_copies = max(0, book.total_copies - active_allocations)
    
    db.commit()
    db.refresh(book)
    
    return {"message": "Book updated successfully"}

@router.get("/allocations")
def get_all_allocations(db: Session = Depends(get_db)):
    """Get all book allocations with student and book information"""
    allocations = db.query(BookAllocation).join(Book).join(User).all()
    
    result = []
    for allocation in allocations:
        result.append({
            "id": allocation.id,
            "book": {
                "id": allocation.book.id,
                "title": allocation.book.title,
                "author": allocation.book.author,
                "isbn": allocation.book.isbn
            },
            "student": {
                "id": allocation.student.id,
                "full_name": allocation.student.full_name,
                "email": allocation.student.email
            },
            "allocated_at": allocation.allocated_at.isoformat(),
            "due_date": allocation.due_date.isoformat(),
            "returned_at": allocation.returned_at.isoformat() if allocation.returned_at else None,
            "status": allocation.status.value,
            "notes": allocation.notes
        })
    
    return result

@router.post("/allocations/{allocation_id}/return")
def return_book(allocation_id: int, db: Session = Depends(get_db)):
    """Mark a book as returned and process queue"""
    allocation = db.query(BookAllocation).filter(BookAllocation.id == allocation_id).first()
    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")
    
    if allocation.status != AllocationStatus.active:
        raise HTTPException(status_code=400, detail="Book is not currently allocated")
    
    # Mark as returned
    allocation.status = AllocationStatus.returned
    allocation.returned_at = datetime.utcnow()
    
    # Increase available copies
    book = allocation.book
    book.available_copies += 1
    
    # Process queue - notify next person in line
    next_in_queue = db.query(BookQueue).filter(
        and_(
            BookQueue.book_id == book.id,
            BookQueue.status == QueueStatus.waiting
        )
    ).order_by(BookQueue.position).first()
    
    if next_in_queue:
        next_in_queue.status = QueueStatus.notified
        next_in_queue.notified_at = datetime.utcnow()
        next_in_queue.expires_at = datetime.utcnow() + timedelta(hours=24)  # 24 hour notification
    
    db.commit()
    
    return {"message": "Book returned successfully", "next_student_notified": bool(next_in_queue)}

@router.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book (only if no active allocations)"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check for active allocations
    active_allocations = db.query(BookAllocation).filter(
        and_(
            BookAllocation.book_id == book.id,
            BookAllocation.status == AllocationStatus.active
        )
    ).count()
    
    if active_allocations > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete book with active allocations"
        )
    
    db.delete(book)
    db.commit()
    
    return {"message": "Book deleted successfully"}
