from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

class Snippet(Base):
    """
    SQLAlchemy model representing a code snippet in the database.
    """
    __tablename__ = "snippets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    language = Column(String, index=True)
    code = Column(Text)
    tags = Column(String, index=True) # Storing tags as a comma-separated string
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
