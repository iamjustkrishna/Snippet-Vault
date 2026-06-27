from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routes import router

# Create database tables automatically
# Note: In a larger production app, you would use a migration tool like Alembic.
# For a minimal take-home assignment, this is perfectly fine.
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI app
app = FastAPI(
    title="Snippet API",
    description="A minimal production-quality API for managing code snippets.",
    version="1.0.0"
)

# Add CORS middleware to allow the frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the endpoints from routes.py
app.include_router(router)

@app.get("/")
def read_root():
    """
    Root endpoint serving as a simple health check or welcome message.
    """
    return {"message": "Welcome to the Snippet API. Visit /docs for Swagger UI documentation."}
