# File: backend/app/routes/navigation_routes.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
import shutil
import os

# Import the AI logic from our new service
from .navigation_routes import find_best_match, precompute_db_embeddings, LOCATION_DATA, DUMMY_PATHS, DESTINATIONS

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
        # Note: We need to point it to the correct photos directory now
        matched_key, score = find_best_match(temp_path, db_folder_path="app/database_photos")

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