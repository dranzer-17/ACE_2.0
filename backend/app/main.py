from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create the FastAPI app instance
app = FastAPI()

# --- Middleware ---
# Set up CORS to allow requests from your frontend
# This is crucial for development

# Get the frontend URL from an environment variable, with a default
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

origins = [
    FRONTEND_URL,
    # You can add more origins here if needed (e.g., your deployed frontend URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)


# --- API Routes ---

@app.get("/")
def read_root():
    """
    Root endpoint for the API.
    """
    return {"message": "Welcome to the ACE_2.0 Backend API!"}


@app.get("/api/hello")
def get_hello_message():
    """
    A simple example endpoint that the frontend can call.
    """
    return {"message": "Hello from the FastAPI backend!"}