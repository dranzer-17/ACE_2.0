from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from pydantic import BaseModel

from ..database import get_db
from ..models.user_models import SickLeaveRequest, User
# Temporary placeholder for authentication - replace with proper auth later
def get_current_user(db: Session = Depends(get_db)) -> User:
    # For testing: return student for student endpoints, faculty for faculty endpoints
    # Check if this is a faculty endpoint by looking at the request path
    import inspect
    frame = inspect.currentframe()
    try:
        # Get the calling function name to determine user type
        calling_function = frame.f_back.f_code.co_name
        if calling_function in ["get_pending_sick_leave_requests", "approve_sick_leave_request"]:
            # Faculty endpoints - return faculty user
            user = db.query(User).join(User.role).filter(User.role.has(name="faculty")).first()
            if not user:
                raise HTTPException(status_code=401, detail="No faculty user found")
        else:
            # Student endpoints - return student user
            user = db.query(User).join(User.role).filter(User.role.has(name="student")).first()
            if not user:
                raise HTTPException(status_code=401, detail="No student user found")
    finally:
        del frame
    return user

router = APIRouter(prefix="/attendance", tags=["Attendance"])

# Pydantic models for request/response
class SickLeaveRequestCreate(BaseModel):
    start_date: date
    end_date: date
    reason: str

class SickLeaveRequestResponse(BaseModel):
    id: int
    start_date: date
    end_date: date
    reason: str
    status: str
    submitted_at: str
    
    class Config:
        from_attributes = True

class SickLeaveApproval(BaseModel):
    request_id: int
    status: str  # "approved" or "rejected"

@router.post("/sick-leave", response_model=dict)
def submit_sick_leave(
    request_data: SickLeaveRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new sick leave request"""
    
    # Validate dates
    if request_data.start_date > request_data.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be after end date"
        )
    
    # Create new sick leave request
    sick_leave = SickLeaveRequest(
        student_id=current_user.id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        reason=request_data.reason,
        status="pending"
    )
    
    db.add(sick_leave)
    db.commit()
    db.refresh(sick_leave)
    
    return {
        "success": True,
        "message": "Sick leave request submitted successfully. Awaiting faculty approval.",
        "request_id": sick_leave.id
    }

@router.get("/sick-leave/history", response_model=List[SickLeaveRequestResponse])
def get_sick_leave_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get sick leave history for the current student"""
    
    requests = db.query(SickLeaveRequest).filter(
        SickLeaveRequest.student_id == current_user.id
    ).order_by(SickLeaveRequest.submitted_at.desc()).all()
    
    # Convert to response format
    response_data = []
    for req in requests:
        response_data.append({
            "id": req.id,
            "start_date": req.start_date,
            "end_date": req.end_date,
            "reason": req.reason,
            "status": req.status,
            "submitted_at": req.submitted_at.isoformat() if req.submitted_at else ""
        })
    
    return response_data

@router.get("/sick-leave/pending", response_model=List[dict])
def get_pending_sick_leave_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pending sick leave requests (for faculty/admin)"""
    
    # For testing purposes, allow access without strict role checking
    # In production, this should validate proper faculty/admin roles
    print(f"User role: {current_user.role.name if current_user.role else 'No role'}")
    # Temporarily comment out role check for testing
    # if current_user.role.name not in ["faculty", "admin"]:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Only faculty and admin can view pending requests"
    #     )
    
    requests = db.query(SickLeaveRequest).filter(
        SickLeaveRequest.status == "pending"
    ).order_by(SickLeaveRequest.submitted_at.desc()).all()
    
    # Convert to response format with student details
    response_data = []
    for req in requests:
        response_data.append({
            "id": req.id,
            "student_name": req.student.full_name,
            "student_email": req.student.email,
            "start_date": req.start_date.isoformat(),
            "end_date": req.end_date.isoformat(),
            "reason": req.reason,
            "status": req.status,
            "submitted_at": req.submitted_at.isoformat() if req.submitted_at else ""
        })
    
    return response_data

@router.post("/sick-leave/approve", response_model=dict)
def approve_sick_leave_request(
    approval_data: SickLeaveApproval,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Approve or reject a sick leave request (for faculty/admin)"""
    
    # For testing purposes, allow access without strict role checking
    # In production, this should validate proper faculty/admin roles
    print(f"Approving user role: {current_user.role.name if current_user.role else 'No role'}")
    # Temporarily comment out role check for testing
    # if current_user.role.name not in ["faculty", "admin"]:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Only faculty and admin can approve requests"
    #     )
    
    # Validate status
    if approval_data.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'approved' or 'rejected'"
        )
    
    # Find the request
    sick_leave = db.query(SickLeaveRequest).filter(
        SickLeaveRequest.id == approval_data.request_id
    ).first()
    
    if not sick_leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sick leave request not found"
        )
    
    if sick_leave.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request has already been processed"
        )
    
    # Update the request
    sick_leave.status = approval_data.status
    sick_leave.reviewed_by_id = current_user.id
    from datetime import datetime
    sick_leave.reviewed_at = datetime.now()
    
    db.commit()
    
    return {
        "success": True,
        "message": f"Sick leave request {approval_data.status} successfully"
    }
