from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database URL. 
# Using a local file 'snippets.db' for this minimal assignment.
SQLALCHEMY_DATABASE_URL = "sqlite:///./snippets.db"

# connect_args={"check_same_thread": False} is required only for SQLite 
# to allow multiple threads (FastAPI workers) to share the same connection.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our SQLAlchemy models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    """
    Creates a new database session for a request and closes it once the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
