# Snippet Vault 📦

Snippet Vault is a full-stack web application designed for storing, searching, and managing code snippets efficiently. It was built as a take-home assignment demonstrating modern full-stack development practices, clean API design, and component-driven UI architecture.

## Overview
The application provides a seamless experience for developers to save code snippets with syntax tagging. It supports complete CRUD operations, full-text searching across titles, languages, and tags, and utilizes offset-based pagination for performance. 

## Architecture
The project follows a decoupled client-server architecture:
- **Backend API**: A RESTful API built with FastAPI, utilizing SQLAlchemy for ORM and a SQLite database for persistent storage.
- **Frontend Client**: A React application built with the Next.js App Router, using Tailwind CSS for responsive and modern styling.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS
- **Backend:** FastAPI, Python, SQLAlchemy, Pydantic v2
- **Database:** SQLite
- **Infrastructure:** Docker, Uvicorn

## Folder Structure
```text
Snippet-Vault/
├── app/                  # FastAPI Backend Source
│   ├── main.py           # Application entry point & CORS
│   ├── routes.py         # API endpoints definition
│   ├── crud.py           # Database transaction logic
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic validation schemas
│   └── database.py       # DB connection setup
├── web/                  # Next.js Frontend Source
│   ├── src/app/          # Next.js App Router (page.tsx, layout.tsx)
│   ├── src/components/   # Reusable UI components (SearchBar, SnippetCard)
│   └── src/lib/          # API fetch logic and types
├── Dockerfile            # Containerization instructions
├── requirements.txt      # Python dependencies
└── snippets.db           # SQLite database (auto-generated)
```

## Running Locally

### Backend Setup
1. Create a virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
   ```

### Frontend Setup
1. Navigate to the `web` directory and install dependencies:
   ```bash
   cd web
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## API Endpoints
The backend provides interactive Swagger UI documentation at `http://127.0.0.1:8001/docs`.
- `POST /snippets/`: Create a new snippet.
- `GET /snippets/`: Retrieve snippets. Supports query parameters `q` (search), `page`, and `limit`.
- `DELETE /snippets/{id}`: Delete a snippet by its ID.

## Docker Instructions
A production-ready Dockerfile is included for the backend API. It leverages multi-stage-like caching by separating dependency installation from application code to optimize build times.

To build and run the Docker container:
```bash
docker build -t snippet-vault-api .
docker run -p 8000:8000 snippet-vault-api
```
*(Note: If running the frontend locally while the backend is in Docker, ensure the frontend API URL points to port 8000 instead of 8001).*

## Decisions Made
- **SQLite over PostgreSQL**: Selected for simplicity and zero-configuration requirement for a take-home assignment, while SQLAlchemy ensures easy migration to a robust DB later.
- **Next.js App Router**: Chosen for its modern paradigm, server-side rendering capabilities, and robust architecture.
- **Separation of Concerns**: Kept the FastAPI routes, CRUD operations, and DB schemas completely isolated to ensure maintainability and testability.
- **Port 8001**: Used for the backend during local development to avoid common conflicts with other local services that default to port 8000.

## Known Limitations
- **No Authentication**: Currently, any user can read, create, or delete snippets.
- **Basic Search**: The search functionality utilizes a simple SQL `ILIKE` query across multiple columns. It is not optimized for typo-tolerance or fuzzy matching.
- **Pagination**: Uses standard OFFSET/LIMIT, which performs well on small datasets but can degrade on massive tables.

## What I Would Improve With More Time
- Implement **JWT Authentication** to allow users to have private, isolated snippet vaults.
- Add **Syntax Highlighting** (e.g., Prism.js or Highlight.js) on the frontend for the code blocks.
- Introduce **Cursor-based Pagination** for more scalable and resilient list rendering.
- Add **Unit and E2E Tests** (using Pytest for backend and Playwright/Cypress for frontend) to the CI/CD pipeline.

## Approximate Development Time
- **Backend Setup & Architecture**: ~1.5 hours
- **Frontend Scaffolding & Components**: ~2 hours
- **Dockerization & Documentation**: ~0.5 hours
- **Total Time**: ~4 hours
