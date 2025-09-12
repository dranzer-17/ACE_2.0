from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import user_models
from .routes import auth_routes

# --- CRITICAL STEP ---
# This line tells SQLAlchemy to create all the database tables
# based on the models defined in `user_models.py`.
# It runs when the application starts and will not re-create tables that already exist.
user_models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI application instance
app = FastAPI(
    title="ACE 2.0 API",
    description="Backend API for the ACE 2.0 Campus Solution Platform.",
    version="1.0.0",
)

# --- CORS MIDDLEWARE ---
# This is ESSENTIAL for allowing your Next.js frontend to talk to the backend.
# Without this, you will get CORS errors in the browser.
origins = [
    "http://localhost:3000", # The URL of your running frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# --- INCLUDE API ROUTERS ---
# This makes the endpoints from `auth_routes.py` available in the application.
# All routes in `auth_routes` will now be accessible under the `/auth` prefix.
app.include_router(auth_routes.router)

# A simple root endpoint to quickly check if the API is running
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the ACE_2.0 Backend API!"}