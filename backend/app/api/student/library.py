from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import traceback
from ...database import get_db
from ...models.library import Book, BookAllocation, BookQueue, BookStatus, AllocationStatus, QueueStatus
from ...models.user_models import User
from pydantic import BaseModel

router = APIRouter()

class BookRequest(BaseModel):
    book_id: int

@router.get("/books")
def get_available_books(db: Session = Depends(get_db)):
    """Get all books available for students to browse"""
    books = db.query(Book).filter(Book.status == BookStatus.available).all()
    
    result = []
    for book in books:
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
            "available_copies": book.available_copies,
            "total_copies": book.total_copies,
            "queue_count": queue_count,
            "is_available": book.available_copies > 0
        })
    
    return result

@router.post("/books/{book_id}/request")
def request_book(book_id: int, db: Session = Depends(get_db)):
    """Student requests a book - either allocate immediately or add to queue"""
    
    # For demo, using student user ID = 3 (in real app, get from auth token)
    student_user = db.query(User).filter(User.id == 3).first()
    if not student_user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if book exists
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book.status != BookStatus.available:
        raise HTTPException(status_code=400, detail="Book is not available for allocation")
    
    # Check if student already has an active allocation (one book limit)
    existing_allocation = db.query(BookAllocation).filter(
        and_(
            BookAllocation.student_id == student_user.id,
            BookAllocation.status == AllocationStatus.active
        )
    ).first()
    
    if existing_allocation:
        raise HTTPException(
            status_code=400,
            detail="You already have a book allocated. Return it before requesting another."
        )
    
    # Check if student is already in queue for this book
    existing_queue = db.query(BookQueue).filter(
        and_(
            BookQueue.book_id == book_id,
            BookQueue.student_id == student_user.id,
            BookQueue.status == QueueStatus.waiting
        )
    ).first()
    
    if existing_queue:
        raise HTTPException(
            status_code=400,
            detail="You are already in the queue for this book"
        )
    
    # If book is available, allocate immediately
    if book.available_copies > 0:
        # Create allocation
        allocation = BookAllocation(
            book_id=book_id,
            student_id=student_user.id,
            due_date=datetime.utcnow() + timedelta(days=7),  # 7 days allocation
            status=AllocationStatus.active
        )
        
        # Decrease available copies
        book.available_copies -= 1
        
        db.add(allocation)
        db.commit()
        db.refresh(allocation)
        
        return {
            "message": "Book allocated successfully",
            "allocation_id": allocation.id,
            "due_date": allocation.due_date.isoformat(),
            "status": "allocated"
        }
    
    else:
        # Add to queue
        # Get next position in queue
        max_position = db.query(BookQueue).filter(
            and_(
                BookQueue.book_id == book_id,
                BookQueue.status == QueueStatus.waiting
            )
        ).count()
        
        queue_entry = BookQueue(
            book_id=book_id,
            student_id=student_user.id,
            position=max_position + 1,
            status=QueueStatus.waiting
        )
        
        db.add(queue_entry)
        db.commit()
        db.refresh(queue_entry)
        
        return {
            "message": "Book is not available. You have been added to the queue.",
            "queue_position": queue_entry.position,
            "status": "queued"
        }

@router.get("/my-books")
def get_my_books(db: Session = Depends(get_db)):
    """Get current student's allocated books and queue status"""
    
    try:
        # For demo, using student user ID = 3
        student_user = db.query(User).filter(User.id == 3).first()
        if not student_user:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get active allocations
        allocations = db.query(BookAllocation).join(Book).filter(
            and_(
                BookAllocation.student_id == student_user.id,
                BookAllocation.status == AllocationStatus.active
            )
        ).all()
        
        # Get queue entries
        queue_entries = db.query(BookQueue).join(Book).filter(
            and_(
                BookQueue.student_id == student_user.id,
                BookQueue.status.in_([QueueStatus.waiting, QueueStatus.notified])
            )
        ).all()
        
        result = {
            "allocated_books": [],
            "queued_books": []
        }
        
        for allocation in allocations:
            now = datetime.now(timezone.utc)
            days_remaining = (allocation.due_date - now).days
            result["allocated_books"].append({
                "id": allocation.id,
                "book": {
                    "id": allocation.book.id,
                    "title": allocation.book.title,
                    "author": allocation.book.author,
                    "isbn": allocation.book.isbn
                },
                "allocated_at": allocation.allocated_at.isoformat(),
                "due_date": allocation.due_date.isoformat(),
                "days_remaining": max(0, days_remaining),
                "is_overdue": days_remaining < 0
            })
        
        for queue_entry in queue_entries:
            result["queued_books"].append({
                "id": queue_entry.id,
                "book": {
                    "id": queue_entry.book.id,
                    "title": queue_entry.book.title,
                    "author": queue_entry.book.author,
                    "isbn": queue_entry.book.isbn
                },
                "position": queue_entry.position,
                "requested_at": queue_entry.requested_at.isoformat(),
                "status": queue_entry.status.value,
                "notified_at": queue_entry.notified_at.isoformat() if queue_entry.notified_at else None,
                "expires_at": queue_entry.expires_at.isoformat() if queue_entry.expires_at else None
            })
        
        return result
        
    except Exception as e:
        print(f"Error in get_my_books: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/allocations/{allocation_id}/return")
def return_my_book(allocation_id: int, db: Session = Depends(get_db)):
    """Student returns their allocated book"""
    
    # For demo, using student user ID = 3
    student_user = db.query(User).filter(User.id == 3).first()
    if not student_user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    allocation = db.query(BookAllocation).filter(
        and_(
            BookAllocation.id == allocation_id,
            BookAllocation.student_id == student_user.id,
            BookAllocation.status == AllocationStatus.active
        )
    ).first()
    
    if not allocation:
        raise HTTPException(status_code=404, detail="Active allocation not found")
    
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
        next_in_queue.expires_at = datetime.utcnow() + timedelta(hours=24)
    
    db.commit()
    
    return {"message": "Book returned successfully"}

@router.delete("/queue/{queue_id}")
def cancel_queue_request(queue_id: int, db: Session = Depends(get_db)):
    """Student cancels their queue request"""
    
    # For demo, using student user ID = 3
    student_user = db.query(User).filter(User.id == 3).first()
    if not student_user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    queue_entry = db.query(BookQueue).filter(
        and_(
            BookQueue.id == queue_id,
            BookQueue.student_id == student_user.id,
            BookQueue.status == QueueStatus.waiting
        )
    ).first()
    
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    
    # Update positions of other queue entries
    db.query(BookQueue).filter(
        and_(
            BookQueue.book_id == queue_entry.book_id,
            BookQueue.position > queue_entry.position,
            BookQueue.status == QueueStatus.waiting
        )
    ).update({"position": BookQueue.position - 1})
    
    db.delete(queue_entry)
    db.commit()
    
    return {"message": "Queue request cancelled successfully"}

@router.post("/notifications/{queue_id}/accept")
def accept_notification(queue_id: int, db: Session = Depends(get_db)):
    """Student accepts book allocation notification"""
    
    # For demo, using student user ID = 3
    student_user = db.query(User).filter(User.id == 3).first()
    if not student_user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    queue_entry = db.query(BookQueue).filter(
        and_(
            BookQueue.id == queue_id,
            BookQueue.student_id == student_user.id,
            BookQueue.status == QueueStatus.notified
        )
    ).first()
    
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Notification not found or expired")
    
    # Check if notification has expired
    if queue_entry.expires_at and datetime.utcnow() > queue_entry.expires_at:
        queue_entry.status = QueueStatus.expired
        db.commit()
        raise HTTPException(status_code=400, detail="Notification has expired")
    
    # Check if student already has an active allocation
    existing_allocation = db.query(BookAllocation).filter(
        and_(
            BookAllocation.student_id == student_user.id,
            BookAllocation.status == AllocationStatus.active
        )
    ).first()
    
    if existing_allocation:
        raise HTTPException(
            status_code=400,
            detail="You already have a book allocated. Return it before accepting another."
        )
    
    # Create allocation
    allocation = BookAllocation(
        book_id=queue_entry.book_id,
        student_id=student_user.id,
        due_date=datetime.utcnow() + timedelta(days=7),
        status=AllocationStatus.active
    )
    
    # Decrease available copies
    book = queue_entry.book
    book.available_copies -= 1
    
    # Remove from queue
    db.delete(queue_entry)
    
    # Update positions of remaining queue entries
    db.query(BookQueue).filter(
        and_(
            BookQueue.book_id == book.id,
            BookQueue.position > queue_entry.position,
            BookQueue.status == QueueStatus.waiting
        )
    ).update({"position": BookQueue.position - 1})
    
    db.add(allocation)
    db.commit()
    db.refresh(allocation)
    
    return {
        "message": "Book allocated successfully",
        "allocation_id": allocation.id,
        "due_date": allocation.due_date.isoformat()
    }
