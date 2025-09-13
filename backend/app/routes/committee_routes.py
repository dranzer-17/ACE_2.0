import json
import os
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/api/committees", tags=["Committees"])

# Pydantic models for request/response
class CommitteeResponse(BaseModel):
    id: int
    name: str
    description: str
    positions: List[Dict[str, Any]]
    category: str
    contact_email: str

class PositionResponse(BaseModel):
    id: int
    title: str
    description: str
    requirements: List[str]
    skills_required: List[str]
    status: str
    application_deadline: str

class ApplicationRequest(BaseModel):
    student_id: str
    student_name: str
    student_email: str
    committee_id: int
    position_id: int
    cover_message: str
    resume_skills: List[str]
    experience: str

class ApplicationResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    student_email: str
    committee_id: int
    position_id: int
    cover_message: str
    resume_skills: List[str]
    experience: str
    recommendation_score: float
    recommendation_reason: str
    applied_at: str
    status: str

# Helper functions
def load_committees_data():
    """Load committees data from JSON file"""
    try:
        with open("app/committees_data.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_applications_data():
    """Load applications data from JSON file"""
    try:
        with open("app/applications_data.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_applications_data(applications):
    """Save applications data to JSON file"""
    with open("app/applications_data.json", "w") as f:
        json.dump(applications, f, indent=2)

def calculate_recommendation_score(position_skills: List[str], student_skills: List[str]) -> tuple:
    """Calculate recommendation score based on skill matching"""
    if not position_skills or not student_skills:
        return 0.0, "No skills data available for comparison"
    
    # Convert to lowercase for case-insensitive matching
    position_skills_lower = [skill.lower() for skill in position_skills]
    student_skills_lower = [skill.lower() for skill in student_skills]
    
    # Calculate matching skills
    matching_skills = set(position_skills_lower) & set(student_skills_lower)
    match_percentage = len(matching_skills) / len(position_skills_lower) * 100
    
    # Generate recommendation reason
    if match_percentage >= 80:
        reason = f"Excellent match! You have {len(matching_skills)} out of {len(position_skills_lower)} required skills: {', '.join(matching_skills)}"
    elif match_percentage >= 60:
        reason = f"Good match! You have {len(matching_skills)} out of {len(position_skills_lower)} required skills: {', '.join(matching_skills)}"
    elif match_percentage >= 40:
        reason = f"Moderate match. You have {len(matching_skills)} out of {len(position_skills_lower)} required skills: {', '.join(matching_skills)}"
    else:
        reason = f"Limited match. You have {len(matching_skills)} out of {len(position_skills_lower)} required skills. Consider developing: {', '.join(set(position_skills_lower) - set(student_skills_lower))}"
    
    return match_percentage, reason

# API Endpoints

@router.get("/", response_model=List[CommitteeResponse])
async def get_all_committees():
    """Get all committees with their positions"""
    committees = load_committees_data()
    return committees

@router.get("/{committee_id}", response_model=CommitteeResponse)
async def get_committee(committee_id: int):
    """Get a specific committee by ID"""
    committees = load_committees_data()
    committee = next((c for c in committees if c["id"] == committee_id), None)
    
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found")
    
    return committee

@router.get("/{committee_id}/positions", response_model=List[PositionResponse])
async def get_committee_positions(committee_id: int):
    """Get all positions for a specific committee"""
    committees = load_committees_data()
    committee = next((c for c in committees if c["id"] == committee_id), None)
    
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found")
    
    return committee["positions"]

@router.get("/positions/{position_id}")
async def get_position(position_id: int):
    """Get a specific position by ID"""
    committees = load_committees_data()
    
    for committee in committees:
        position = next((p for p in committee["positions"] if p["id"] == position_id), None)
        if position:
            return {
                "committee": committee,
                "position": position
            }
    
    raise HTTPException(status_code=404, detail="Position not found")

@router.post("/apply", response_model=ApplicationResponse)
async def apply_to_position(application: ApplicationRequest):
    """Submit an application for a committee position"""
    
    # Validate committee and position exist
    committees = load_committees_data()
    committee = next((c for c in committees if c["id"] == application.committee_id), None)
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found")
    
    position = next((p for p in committee["positions"] if p["id"] == application.position_id), None)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Check if position is still open
    if position["status"] != "open":
        raise HTTPException(status_code=400, detail="Position is no longer accepting applications")
    
    # Load existing applications
    applications = load_applications_data()
    
    # Check if student has already applied for this position
    existing_application = next((app for app in applications 
                               if app["student_id"] == application.student_id 
                               and app["position_id"] == application.position_id), None)
    
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this position")
    
    # Calculate recommendation score
    score, reason = calculate_recommendation_score(
        position["skills_required"], 
        application.resume_skills
    )
    
    # Create new application
    new_application = {
        "id": str(uuid.uuid4()),
        "student_id": application.student_id,
        "student_name": application.student_name,
        "student_email": application.student_email,
        "committee_id": application.committee_id,
        "position_id": application.position_id,
        "cover_message": application.cover_message,
        "resume_skills": application.resume_skills,
        "experience": application.experience,
        "recommendation_score": score,
        "recommendation_reason": reason,
        "applied_at": datetime.now().isoformat(),
        "status": "pending"
    }
    
    # Add to applications list and save
    applications.append(new_application)
    save_applications_data(applications)
    
    return new_application

@router.get("/applications/student/{student_id}", response_model=List[ApplicationResponse])
async def get_student_applications(student_id: str):
    """Get all applications submitted by a specific student"""
    applications = load_applications_data()
    student_applications = [app for app in applications if app["student_id"] == student_id]
    return student_applications

@router.get("/applications/committee/{committee_id}", response_model=List[ApplicationResponse])
async def get_committee_applications(committee_id: int):
    """Get all applications for a specific committee"""
    applications = load_applications_data()
    committee_applications = [app for app in applications if app["committee_id"] == committee_id]
    return committee_applications

@router.get("/applications/position/{position_id}", response_model=List[ApplicationResponse])
async def get_position_applications(position_id: int):
    """Get all applications for a specific position"""
    applications = load_applications_data()
    position_applications = [app for app in applications if app["position_id"] == position_id]
    return position_applications

@router.put("/applications/{application_id}/status")
async def update_application_status(application_id: str, status: str):
    """Update the status of an application (for committee use)"""
    valid_statuses = ["pending", "accepted", "rejected", "under_review"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    applications = load_applications_data()
    application = next((app for app in applications if app["id"] == application_id), None)
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application["status"] = status
    save_applications_data(applications)
    
    return {"message": "Application status updated successfully", "application": application}

@router.get("/recommendations/{student_id}")
async def get_position_recommendations(student_id: str, skills: List[str] = None):
    """Get position recommendations for a student based on their skills"""
    if not skills:
        skills = []
    
    committees = load_committees_data()
    recommendations = []
    
    for committee in committees:
        for position in committee["positions"]:
            if position["status"] == "open":
                score, reason = calculate_recommendation_score(position["skills_required"], skills)
                recommendations.append({
                    "committee": committee,
                    "position": position,
                    "recommendation_score": score,
                    "recommendation_reason": reason
                })
    
    # Sort by recommendation score (highest first)
    recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)
    
    return recommendations[:10]  # Return top 10 recommendations
