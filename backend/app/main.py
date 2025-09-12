import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# --- Import necessary database and model components ---
from .database import engine, SessionLocal
from .models import user_models
from .models import feedback
from .models import collaboration
from .models import library
from .routes import auth_routes, canteen_routes
from .api.student import feedback as student_feedback, collaboration as student_collaboration, library as student_library
from .api.admin import feedback as admin_feedback, library as admin_library

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup: Checking database...")
    db = SessionLocal()
    try:
        # --- Check and Seed Roles/Users ---
        if db.query(user_models.Role).count() == 0:
            print("Roles/Users are empty. Seeding initial data...")
            
            # --- THIS IS THE MISSING LOGIC THAT IS NOW RESTORED ---
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

        # --- Check and Seed Collaboration Posts ---
        if db.query(collaboration.CollaborationPost).count() == 0:
            print("Collaboration posts are empty. Seeding sample posts...")
            
            # Get a student user to be the creator
            student_user = db.query(user_models.User).join(user_models.Role).filter(user_models.Role.name == "student").first()
            if not student_user:
                # Create a sample student if none exists
                student_role = db.query(user_models.Role).filter(user_models.Role.name == "student").first()
                if not student_role:
                    student_role = user_models.Role(name="student")
                    db.add(student_role)
                    db.commit()
                
                student_user = user_models.User(
                    full_name="John Doe",
                    email="john.doe@student.edu",
                    password="studentpass",
                    role_id=student_role.id
                )
                db.add(student_user)
                db.commit()
            
            # Create sample collaboration posts
            sample_posts = [
                collaboration.CollaborationPost(
                    creator_id=student_user.id,
                    post_type=collaboration.PostType.task,
                    title="Web Development Project Partner Needed",
                    description="Looking for a partner to work on a React.js e-commerce website. Need someone with backend experience in Node.js or Python.",
                    tags=["react", "nodejs", "python", "web-development"],
                    status=collaboration.PostStatus.open
                ),
                collaboration.CollaborationPost(
                    creator_id=student_user.id,
                    post_type=collaboration.PostType.research,
                    title="Machine Learning Research on Climate Data",
                    description="Seeking collaborators for research project analyzing climate change patterns using ML algorithms. Experience with Python and data science preferred.",
                    tags=["machine-learning", "python", "research", "climate"],
                    status=collaboration.PostStatus.open
                ),
                collaboration.CollaborationPost(
                    creator_id=student_user.id,
                    post_type=collaboration.PostType.hackathon,
                    title="Hackathon Team Formation - FinTech App",
                    description="Building a team for upcoming hackathon. Planning to create a personal finance management app. Need UI/UX designer and mobile developer.",
                    tags=["hackathon", "fintech", "mobile", "ui-ux"],
                    status=collaboration.PostStatus.open
                )
            ]
            
            db.add_all(sample_posts)
            db.commit()
            print("Collaboration posts seeding complete!")
        else:
            print("Collaboration posts already exist. Skipping.")

        # --- Check and Seed Library Books ---
        if db.query(library.Book).count() == 0:
            print("Library books are empty. Seeding sample books...")
            
            # Get admin user to be the creator
            admin_user = db.query(user_models.User).join(user_models.Role).filter(user_models.Role.name == "admin").first()
            if not admin_user:
                admin_user = db.query(user_models.User).filter(user_models.User.id == 1).first()
            
            if admin_user:
                sample_books = [
                    library.Book(
                        title="Clean Code: A Handbook of Agile Software Craftsmanship",
                        author="Robert C. Martin",
                        isbn="9780132350884",
                        description="A comprehensive guide to writing clean, maintainable code with practical examples and best practices.",
                        category="Programming",
                        total_copies=3,
                        available_copies=3,
                        added_by_id=admin_user.id
                    ),
                    library.Book(
                        title="The Pragmatic Programmer",
                        author="David Thomas, Andrew Hunt",
                        isbn="9780201616224",
                        description="Essential reading for software developers, covering practical approaches to programming and career development.",
                        category="Programming",
                        total_copies=2,
                        available_copies=2,
                        added_by_id=admin_user.id
                    ),
                    library.Book(
                        title="Introduction to Algorithms",
                        author="Thomas H. Cormen",
                        isbn="9780262033848",
                        description="Comprehensive introduction to algorithms and data structures with mathematical rigor.",
                        category="Computer Science",
                        total_copies=5,
                        available_copies=5,
                        added_by_id=admin_user.id
                    ),
                    library.Book(
                        title="Design Patterns: Elements of Reusable Object-Oriented Software",
                        author="Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                        isbn="9780201633610",
                        description="Classic book on software design patterns with examples in C++ and Smalltalk.",
                        category="Software Engineering",
                        total_copies=2,
                        available_copies=2,
                        added_by_id=admin_user.id
                    ),
                    library.Book(
                        title="JavaScript: The Good Parts",
                        author="Douglas Crockford",
                        isbn="9780596517748",
                        description="A concise guide to the best features of JavaScript programming language.",
                        category="Web Development",
                        total_copies=4,
                        available_copies=4,
                        added_by_id=admin_user.id
                    )
                ]
                
                db.add_all(sample_books)
                db.commit()
                print("Library books seeding complete!")
            else:
                print("No admin user found for library seeding.")
        else:
            print("Library books already exist. Skipping.")

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
app.include_router(student_feedback.router, prefix="/api/student/feedback", tags=["Student Feedback"])
app.include_router(student_collaboration.router, prefix="/api/student/collaboration", tags=["Student Collaboration"])
app.include_router(student_library.router, prefix="/api/student/library", tags=["Student Library"])
app.include_router(admin_feedback.router, prefix="/api/admin/feedback", tags=["Admin Feedback"])
app.include_router(admin_library.router, prefix="/api/admin/library", tags=["Admin Library"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the ACE 2.0 Backend API!"}