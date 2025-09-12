import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# --- Import necessary database and model components ---
from .database import engine, SessionLocal
from .models import user_models
from .routes import auth_routes
# --- 1. Import the new router ---
from .routes import auth_routes, canteen_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup: Checking database...")
    db = SessionLocal()
    try:
        # --- Check and Seed Roles/Users (existing code) ---
        if db.query(user_models.Role).count() == 0:
            # ... (your existing role/user seeding logic)
            print("Database roles/users seeding complete!")
        else:
            print("Database roles/users already exist. Skipping.")

        # --- NEW: Check and Seed Menu Items from JSON ---
        if db.query(user_models.MenuItem).count() == 0:
            print("Menu is empty. Seeding initial menu items from JSON...")
            try:
                # <-- 2. Open and load the JSON file ---
                with open("app/menu_data.json", "r") as f:
                    menu_data = json.load(f)
                
                # <-- 3. Loop through the loaded data ---
                for item in menu_data:
                    db.add(user_models.MenuItem(**item))
                
                db.commit()
                print("Menu seeding complete!")
            except FileNotFoundError:
                print("ERROR: app/menu_data.json not found. Skipping menu seeding.")
            except Exception as e:
                print(f"An error occurred during menu seeding: {e}")
        else:
            print("Menu already exists. Skipping.")

    finally:
        db.close()
    
    yield
    print("Application shutdown.")


# --- Create the database tables ---
# This still runs first to ensure tables exist before the lifespan event
user_models.Base.metadata.create_all(bind=engine)

# --- Initialize the FastAPI app, now with the lifespan event ---
app = FastAPI(
    title="ACE 2.0 API",
    description="Backend API for the ACE 2.0 Campus Solution Platform.",
    version="1.0.0",
    lifespan=lifespan # This is the key change
)

# --- CORS Middleware ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include API Routers ---
app.include_router(auth_routes.router)
app.include_router(canteen_routes.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the ACE_2.0 Backend API!"}


