import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager


# --- Import necessary database and model components ---
from .database import engine, SessionLocal
from .models import user_models
from .routes import auth_routes, canteen_routes, management_routes, timetable_routes, feedback_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup: Checking database...")
    db = SessionLocal()
    try:
        # --- Check and Seed Roles/Users ---
        if db.query(user_models.Role).count() == 0:
            print("Roles/Users are empty. Seeding initial data...")
            
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
                password="adminpass",
                role_id=admin_role.id
            )

            # 3. Create Default Faculty User
            faculty_user = user_models.User(
                full_name="Faculty Member",
                email="teacher@college.edu",
                password="teacherpass",
                role_id=faculty_role.id
            )
            
            db.add_all([admin_user, faculty_user])
            db.commit()
            print("Database roles/users seeding complete!")
        else:
            print("Database roles/users already exist. Skipping.")

        # --- Check and Seed Menu Items from JSON ---
        if db.query(user_models.MenuItem).count() == 0:
            print("Menu is empty. Seeding initial menu items from JSON...")
            try:
                with open("app/menu_data.json", "r") as f:
                    menu_data = json.load(f)
                
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
user_models.Base.metadata.create_all(bind=engine)

# --- Initialize the FastAPI app with the lifespan event ---
app = FastAPI(
    title="ACE 2.0 API",
    description="Backend API for the ACE 2.0 Campus Solution Platform.",
    version="1.0.0",
    lifespan=lifespan
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
app.include_router(management_routes.router) # <-- ADD THIS LINE
app.include_router(timetable_routes.router)
app.include_router(feedback_routes.router) 

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the ACE 2.0 Backend API!"}