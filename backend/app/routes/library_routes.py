from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from typing import List
from datetime import datetime, timedelta, timezone

from ..database import get_db
from ..models import library_models as models
from ..models import user_models
from ..schemas import library_schemas as schemas

router = APIRouter(prefix="/library", tags=["Library"])

# ===================================================================
# --- Admin Endpoints (CORRECTED) ---
# ===================================================================

@router.post("/admin/books", status_code=201)
def create_book(book_data: schemas.BookCreate, db: Session = Depends(get_db)):
    admin_user = db.query(user_models.User).filter(user_models.User.id == 1).first() # Placeholder
    if not admin_user: raise HTTPException(status_code=404, detail="Admin user not found")
    
    new_book = models.Book(
        title=book_data.title, author=book_data.author, isbn=book_data.isbn,
        description=book_data.description, category=book_data.category,
        total_copies=book_data.total_copies, available_copies=book_data.total_copies,
        added_by_id=admin_user.id
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.get("/admin/books")
def get_all_books_admin(db: Session = Depends(get_db)):
    """
    Get all books with allocation and queue information.
    THIS IS THE CORRECTED FUNCTION.
    """
    books = db.query(models.Book).all()
    result = []
    for book in books:
        active_allocations = db.query(models.BookAllocation).filter(and_(models.BookAllocation.book_id == book.id, models.BookAllocation.status == models.AllocationStatus.active)).count()
        queue_count = db.query(models.BookQueue).filter(and_(models.BookQueue.book_id == book.id, models.BookQueue.status == models.QueueStatus.waiting)).count()
        
        result.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "description": book.description,
            "category": book.category,
            "total_copies": book.total_copies,
            "available_copies": book.available_copies,
            "active_allocations": active_allocations,
            "queue_count": queue_count,
        })
    return result

@router.get("/admin/allocations")
def get_all_allocations_admin(db: Session = Depends(get_db)):
    """
    Get all allocations with book and student details.
    THIS IS THE CORRECTED FUNCTION.
    """
    allocations = db.query(models.BookAllocation).options(joinedload(models.BookAllocation.book), joinedload(models.BookAllocation.student)).all()
    result = []
    for alloc in allocations:
        result.append({
            "id": alloc.id,
            "book": {"title": alloc.book.title},
            "student": {"full_name": alloc.student.full_name, "email": alloc.student.email} if alloc.student else None,
            "due_date": alloc.due_date.isoformat(),
            "status": alloc.status.value,
        })
    return result

@router.post("/admin/allocations/{allocation_id}/return")
def return_book_admin(allocation_id: int, db: Session = Depends(get_db)):
    allocation = db.query(models.BookAllocation).filter(models.BookAllocation.id == allocation_id).first()
    if not allocation or allocation.status != models.AllocationStatus.active:
        raise HTTPException(status_code=400, detail="Active allocation not found")
    
    allocation.status = models.AllocationStatus.returned
    allocation.returned_at = datetime.now(timezone.utc)
    book = allocation.book
    book.available_copies += 1
    
    next_in_queue = db.query(models.BookQueue).filter(and_(models.BookQueue.book_id == book.id, models.BookQueue.status == models.QueueStatus.waiting)).order_by(models.BookQueue.position).first()
    if next_in_queue:
        next_in_queue.status = models.QueueStatus.notified
        next_in_queue.notified_at = datetime.now(timezone.utc)
        next_in_queue.expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    
    db.commit()
    return {"message": "Book returned successfully"}

# ===================================================================
# --- Student Endpoints (CORRECTED) ---
# ===================================================================

@router.get("/student/books")
def get_available_books_student(db: Session = Depends(get_db)):
    """
    Get available books for students with queue counts.
    THIS IS THE CORRECTED FUNCTION.
    """
    books = db.query(models.Book).filter(models.Book.status == models.BookStatus.available).all()
    result = []
    for book in books:
        queue_count = db.query(models.BookQueue).filter(and_(models.BookQueue.book_id == book.id, models.BookQueue.status == models.QueueStatus.waiting)).count()
        result.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "description": book.description,
            "category": book.category,
            "available_copies": book.available_copies,
            "total_copies": book.total_copies,
            "queue_count": queue_count,
            "is_available": book.available_copies > 0,
        })
    return result

@router.post("/student/books/{book_id}/request")
def request_book_student(book_id: int, student_id: int = Body(..., embed=True), db: Session = Depends(get_db)):
    student_user = db.query(user_models.User).filter(user_models.User.id == student_id).first()
    if not student_user: raise HTTPException(status_code=404, detail="Student not found")
    
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book or book.status != models.BookStatus.available:
        raise HTTPException(status_code=400, detail="Book not available")
    
    # Check for existing active allocation
    existing_alloc = db.query(models.BookAllocation).filter(and_(models.BookAllocation.student_id == student_user.id, models.BookAllocation.status == models.AllocationStatus.active)).first()
    if existing_alloc:
        raise HTTPException(status_code=400, detail="You already have an active book allocation.")
    
    if book.available_copies > 0:
        allocation = models.BookAllocation(book_id=book_id, student_id=student_user.id, due_date=datetime.now(timezone.utc) + timedelta(days=7), status=models.AllocationStatus.active)
        book.available_copies -= 1
        db.add(allocation)
        db.commit()
        return {"message": "Book allocated successfully!", "status": "allocated"}
    else:
        # Check if already in queue
        existing_queue = db.query(models.BookQueue).filter(and_(models.BookQueue.book_id == book_id, models.BookQueue.student_id == student_user.id, models.BookQueue.status == models.QueueStatus.waiting)).first()
        if existing_queue:
            raise HTTPException(status_code=400, detail="You are already in the queue for this book.")

        max_pos = db.query(models.BookQueue).filter(models.BookQueue.book_id == book_id).count()
        queue_entry = models.BookQueue(book_id=book_id, student_id=student_user.id, position=max_pos + 1)
        db.add(queue_entry)
        db.commit()
        return {"message": "Book unavailable, you have been added to the queue.", "position": queue_entry.position, "status": "queued"}

@router.get("/student/my-books/{student_id}")
def get_my_books_student(student_id: int, db: Session = Depends(get_db)):
    """
    Get all of student's books (allocated and queued).
    THIS IS THE CORRECTED FUNCTION.
    """
    student_user = db.query(user_models.User).filter(user_models.User.id == student_id).first()
    if not student_user: raise HTTPException(status_code=404, detail="Student not found")

    allocations = db.query(models.BookAllocation).options(joinedload(models.BookAllocation.book)).filter(and_(models.BookAllocation.student_id == student_user.id, models.BookAllocation.status == models.AllocationStatus.active)).all()
    queues = db.query(models.BookQueue).options(joinedload(models.BookQueue.book)).filter(and_(models.BookQueue.student_id == student_user.id, models.BookQueue.status != models.QueueStatus.fulfilled)).all()
    
    # Manually build the response to match the reference code and avoid serialization errors
    now = datetime.now(timezone.utc)
    alloc_list = []
    for alloc in allocations:
        days_remaining = (alloc.due_date - now).days
        alloc_list.append({
            "id": alloc.id,
            "book": {"title": alloc.book.title, "author": alloc.book.author},
            "due_date": alloc.due_date.isoformat(),
            "days_remaining": max(0, days_remaining),
            "is_overdue": days_remaining < 0
        })
        
    queue_list = []
    for queue in queues:
         queue_list.append({
             "id": queue.id,
             "book": {"title": queue.book.title, "author": queue.book.author},
             "position": queue.position,
             "status": queue.status.value,
             "expires_at": queue.expires_at.isoformat() if queue.expires_at else None
         })

    return {"allocated_books": alloc_list, "queued_books": queue_list}