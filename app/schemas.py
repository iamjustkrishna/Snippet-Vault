from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class SnippetBase(BaseModel):
    """
    Base Pydantic schema containing common attributes for Snippet.
    """
    title: str = Field(..., description="Title of the snippet", min_length=1)
    language: str = Field(..., description="Programming language of the snippet (e.g., python, javascript)", min_length=1)
    code: str = Field(..., description="The actual code content", min_length=1)
    tags: Optional[str] = Field(None, description="Comma separated tags (e.g., 'fastapi,python')")

class SnippetCreate(SnippetBase):
    """
    Schema for creating a new Snippet. Inherits all fields from SnippetBase.
    """
    pass

class Snippet(SnippetBase):
    """
    Schema for reading a Snippet from the API. Includes ID and created_at.
    """
    id: int
    created_at: datetime

    class Config:
        # Pydantic v2 configuration to allow parsing from SQLAlchemy ORM objects
        from_attributes = True
