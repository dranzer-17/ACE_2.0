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
    # --- Code to run on STARTUP ---
    print("Application startup: Checking database...")
    db = SessionLocal()
    try:
        # Check if the roles table is empty
        if db.query(user_models.Role).count() == 0:
            print("Database is empty. Seeding initial data...")
            
            # 1. Create Roles
            student_role = user_models.Role(name="student")
            faculty_role = user_models.Role(name="faculty")
            admin_role = user_models.Role(name="admin")
            
            db.add_all([student_role, faculty_role, admin_role])
            db.commit() # Commit roles first to get their IDs

            # 2. Create Default Admin User
            admin_user = user_models.User(
                full_name="Admin User",
                email="admin@college.edu",
                password="adminpass", # Plaintext for hackathon
                role_id=admin_role.id
            )

            # 3. Create Default Faculty User
            faculty_user = user_models.User(
                full_name="Faculty Member",
                email="teacher@college.edu",
                password="teacherpass", # Plaintext for hackathon
                role_id=faculty_role.id
            )
            
            db.add_all([admin_user, faculty_user])
            db.commit()
            print("Database seeding complete!")
        else:
            print("Database already contains data. Skipping seeding.")
    finally:
        db.close()
    
    yield # --- The application runs while the 'yield' is active ---
    
    # --- Code to run on SHUTDOWN (optional) ---
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

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the ACE_2.0 Backend API!"}


