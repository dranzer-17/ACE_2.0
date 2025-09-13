# File: backend/app/routes/navigation_routes.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
import shutil
import os

# Import the AI logic from our navigation service
from ..services.navigation_service import find_best_match, precompute_db_embeddings

# Location data and path information
LOCATION_DATA = {
    "ace_event_hall": {
        "human_name": "ACE Event Hall",
        "description": "A spacious event hall with networking setup and stage area for presentations and gatherings",
        "image_files": ["ACE_Event_Hall_Networking.jpg", "ACE_Event_Hall_Side_View.jpg", "ACE_Event_Students_Gathering.jpg", "ACE_Hackathon_Stage_Setup.jpg"]
    },
    "ace_seminar_hall": {
        "human_name": "ACE Seminar Hall", 
        "description": "A professional seminar hall with center aisle seating for academic presentations and lectures",
        "image_files": ["ACE_Event_Seminar_Hall_Center_Aisle.jpg", "ACE_Event_Seminar_Hall_Wide_Angle.jpg"]
    },
    "mpstme_building": {
        "human_name": "MPSTME Building",
        "description": "The main MPSTME building with directory signage, elevators, and modern classroom facilities",
        "image_files": ["MPSTME_Building_Directory_Sign.jpg", "MPSTME_Classroom_Hallway_Signage.jpg", "MPSTME_Elevator_Lobby.jpg", "MPSTME_Entrance_Turnstiles.jpg", "MPSTME_Hallway_Near_Glass_Room.jpg", "MPSTME_Upper_Corridor_View.jpg"]
    },
    "nmims_atrium": {
        "human_name": "NMIMS Atrium Cafeteria",
        "description": "A modern cafeteria with overhead views, side angles, student crowds, and quiet areas for dining and socializing",
        "image_files": ["NMIMS_Atrium_Cafeteria_OverheadView.jpg", "NMIMS_Atrium_Cafeteria_SideAngle.jpg", "NMIMS_Atrium_Cafeteria_StudentCrowd.jpg", "NMIMS_Atrium_Cafeteria_WideView.jpg", "NMIMS_Cafeteria_Entrance_Sign.jpg", "NMIMS_Cafeteria_Quiet_Area.jpg", "NMIMS_Cafeteria.jpg"]
    },
    "nmims_elevator": {
        "human_name": "NMIMS Elevator Lobby",
        "description": "Elevator lobby area with angled views, empty spaces, fire lift access, and student activity",
        "image_files": ["NMIMS_Elevator_Lobby_Angled_View.jpg", "NMIMS_Elevator_Lobby_Empty.jpg", "NMIMS_Elevator_Lobby_Fire_Lift.jpg", "NMIMS_Elevator_Lobby_WithStudents.jpg"]
    },
    "nmims_entrance": {
        "human_name": "NMIMS Entrance Turnstiles",
        "description": "Main entrance area with turnstiles for building access control and security",
        "image_files": ["NMIMS_Entrance_Turnstiles_FrontView.jpg", "NMIMS_Entrance_Turnstiles_SideView.jpg"]
    },
    "nmims_classroom": {
        "human_name": "NMIMS Modern Classroom",
        "description": "Modern classroom interior with hallway signage and contemporary learning environment",
        "image_files": ["NMIMS_Hallway_Classroom_Signage.jpg", "NMIMS_Modern_Classroom_Interior.jpg"]
    }
}

DUMMY_PATHS = {
    "ACE Event Hall": {
        "ACE Seminar Hall": ["Walk towards the main corridor", "Turn left at the intersection", "Continue straight for 50 meters"],
        "NMIMS Atrium Cafeteria": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building", "Take elevator to ground floor"],
        "MPSTME Building": ["Exit the building", "Walk across the campus", "Enter the MPSTME building main entrance"],
        "NMIMS Elevator Lobby": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building", "Take elevator to ground floor"],
        "NMIMS Entrance Turnstiles": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building main entrance"],
        "NMIMS Modern Classroom": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building", "Take elevator to upper floors"]
    },
    "ACE Seminar Hall": {
        "ACE Event Hall": ["Walk towards the main corridor", "Turn right at the intersection", "Continue straight for 50 meters"],
        "NMIMS Atrium Cafeteria": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building", "Take elevator to ground floor"],
        "MPSTME Building": ["Exit the building", "Walk across the campus", "Enter the MPSTME building main entrance"],
        "NMIMS Elevator Lobby": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building", "Take elevator to ground floor"],
        "NMIMS Entrance Turnstiles": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building main entrance"],
        "NMIMS Modern Classroom": ["Exit the building", "Cross the courtyard", "Enter the NMIMS building", "Take elevator to upper floors"]
    },
    "NMIMS Atrium Cafeteria": {
        "ACE Event Hall": ["Take elevator to ground floor", "Exit the NMIMS building", "Cross the courtyard", "Enter the ACE building"],
        "ACE Seminar Hall": ["Take elevator to ground floor", "Exit the NMIMS building", "Cross the courtyard", "Enter the ACE building"],
        "MPSTME Building": ["Exit the NMIMS building", "Walk across the campus", "Enter the MPSTME building main entrance"],
        "NMIMS Elevator Lobby": ["Walk towards the main entrance", "Follow signs to elevator lobby"],
        "NMIMS Entrance Turnstiles": ["Walk towards the main entrance", "Follow signs to entrance turnstiles"],
        "NMIMS Modern Classroom": ["Take elevator to upper floors", "Follow hallway signs to classroom area"]
    },
    "MPSTME Building": {
        "ACE Event Hall": ["Exit the MPSTME building", "Walk across the campus", "Enter the ACE building"],
        "ACE Seminar Hall": ["Exit the MPSTME building", "Walk across the campus", "Enter the ACE building"],
        "NMIMS Atrium Cafeteria": ["Exit the MPSTME building", "Walk across the campus", "Enter the NMIMS building", "Take elevator to ground floor"],
        "NMIMS Elevator Lobby": ["Exit the MPSTME building", "Walk across the campus", "Enter the NMIMS building", "Take elevator to ground floor"],
        "NMIMS Entrance Turnstiles": ["Exit the MPSTME building", "Walk across the campus", "Enter the NMIMS building main entrance"],
        "NMIMS Modern Classroom": ["Exit the MPSTME building", "Walk across the campus", "Enter the NMIMS building", "Take elevator to upper floors"]
    },
    "NMIMS Elevator Lobby": {
        "ACE Event Hall": ["Exit the NMIMS building", "Cross the courtyard", "Enter the ACE building"],
        "ACE Seminar Hall": ["Exit the NMIMS building", "Cross the courtyard", "Enter the ACE building"],
        "NMIMS Atrium Cafeteria": ["Take elevator to ground floor", "Follow signs to cafeteria"],
        "MPSTME Building": ["Exit the NMIMS building", "Walk across the campus", "Enter the MPSTME building main entrance"],
        "NMIMS Entrance Turnstiles": ["Walk towards the main entrance", "Follow signs to entrance turnstiles"],
        "NMIMS Modern Classroom": ["Take elevator to upper floors", "Follow hallway signs to classroom area"]
    },
    "NMIMS Entrance Turnstiles": {
        "ACE Event Hall": ["Enter the NMIMS building", "Exit through rear entrance", "Cross the courtyard", "Enter the ACE building"],
        "ACE Seminar Hall": ["Enter the NMIMS building", "Exit through rear entrance", "Cross the courtyard", "Enter the ACE building"],
        "NMIMS Atrium Cafeteria": ["Enter the building", "Take elevator to ground floor", "Follow signs to cafeteria"],
        "MPSTME Building": ["Enter the NMIMS building", "Exit through rear entrance", "Walk across the campus", "Enter the MPSTME building main entrance"],
        "NMIMS Elevator Lobby": ["Enter the building", "Follow signs to elevator lobby"],
        "NMIMS Modern Classroom": ["Enter the building", "Take elevator to upper floors", "Follow hallway signs to classroom area"]
    },
    "NMIMS Modern Classroom": {
        "ACE Event Hall": ["Take elevator to ground floor", "Exit the NMIMS building", "Cross the courtyard", "Enter the ACE building"],
        "ACE Seminar Hall": ["Take elevator to ground floor", "Exit the NMIMS building", "Cross the courtyard", "Enter the ACE building"],
        "NMIMS Atrium Cafeteria": ["Take elevator to ground floor", "Follow signs to cafeteria"],
        "MPSTME Building": ["Take elevator to ground floor", "Exit the NMIMS building", "Walk across the campus", "Enter the MPSTME building main entrance"],
        "NMIMS Elevator Lobby": ["Take elevator to ground floor", "Follow signs to elevator lobby"],
        "NMIMS Entrance Turnstiles": ["Take elevator to ground floor", "Walk towards the main entrance", "Follow signs to entrance turnstiles"]
    }
}

DESTINATIONS = [
    "ACE Event Hall", 
    "ACE Seminar Hall", 
    "NMIMS Atrium Cafeteria", 
    "MPSTME Building",
    "NMIMS Elevator Lobby",
    "NMIMS Entrance Turnstiles", 
    "NMIMS Modern Classroom"
]

router = APIRouter(
    prefix="/navigation",
    tags=["Navigation"]
)

UPLOAD_DIR = "uploaded_nav_photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# This is a new endpoint to provide the list of destinations to the frontend
@router.get("/destinations", response_model=list[str])
async def get_destinations():
    """Returns a list of all possible navigation destinations."""
    return DESTINATIONS

@router.post("/find-path/")
async def find_path(file: UploadFile = File(...), destination: str = Form(...)):
    """
    Identifies user's location from an uploaded photo and provides a path
    to the selected destination.
    """
    temp_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Use our AI service to find the best match
        matched_key, score = find_best_match(temp_path)

        if not matched_key:
            return JSONResponse(
                status_code=404,
                content={"error": "Could not confidently identify your location.", "confidence": f"{score:.2f}"}
            )

        current_location = LOCATION_DATA[matched_key]["human_name"]
        path_steps = DUMMY_PATHS.get(current_location, {}).get(destination)

        if not path_steps:
            raise HTTPException(status_code=500, detail="Path data missing for this route.")

        return JSONResponse(content={
            "current_location": current_location,
            "destination": destination,
            "confidence": f"{score:.2f}",
            "path": path_steps
        })
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# We need a small helper function to load the AI models on startup
def initialize_navigation_models():
    print("Pre-computing multi-modal embeddings for navigation...")
    # Make sure to point to the correct photos directory
    precompute_db_embeddings(location_data=LOCATION_DATA, db_folder_path="app/database_photos")
    print("Navigation models ready.")