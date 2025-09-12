# ACE_2.0 Backend

This directory contains the FastAPI backend application and its Docker-based database services.

## Prerequisites

- Python 3.8+ and `pip`
- Docker and Docker Compose
- An IDE like VSCode

## First-Time Setup

1.  **Create a Virtual Environment:**
    Navigate to the `backend` directory and create a virtual environment. This isolates the project's Python dependencies.

    ```sh
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

2.  **Install Dependencies:**
    Create a `requirements.txt` file with the necessary packages and install them.

    **`requirements.txt`:**
    ```
    fastapi
    uvicorn[standard]
    python-dotenv
    psycopg2-binary
    ```

    **Installation command:**
    ```sh
    pip install -r requirements.txt
    ```

## Managing Database Services (Docker)

The `docker-compose.yml` file manages the PostgreSQL database and the Adminer GUI.

-   **Start the Database and Adminer:**
    Run this command from the `backend` directory in the background.

    ```sh
    docker compose up -d
    ```

-   **Stop the Services:**
    This command stops and removes the containers. Your data is safe in the Docker volume.

    ```sh
    docker compose down
    ```

-   **View Logs:**
    To see the logs for a specific service (e.g., the database):

    ```sh
    docker compose logs -f db
    ```

### Accessing the Database

-   **Web Interface (Adminer):**
    -   URL: `http://localhost:8080`
    -   **System:** `PostgreSQL`
    -   **Server:** `db`
    -   **Username:** `postgres` (from `.env`)
    -   **Password:** `ace_pass123` (from `.env`)
    -   **Database:** `ace_db` (from `.env`)

-   **From the Backend App:**
    The app connects automatically using the `DATABASE_URL` in the `.env` file.

## Running the FastAPI Development Server

Make sure your virtual environment is activated (`source venv/bin/activate`) and the Docker services are running.

-   **Start the server:**
    This command tells Uvicorn to run the `app` instance from the `main.py` file located in the `app` directory. The `--reload` flag automatically restarts the server when you make code changes.

    ```sh
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```

-   The backend will be available at **`http://localhost:8000`**.
-   The interactive API documentation (Swagger UI) will be at **`http://localhost:8000/docs`**.