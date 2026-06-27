from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas

def get_snippet(db: Session, snippet_id: int):
    """Retrieve a single snippet by its ID."""
    return db.query(models.Snippet).filter(models.Snippet.id == snippet_id).first()

def get_snippets(db: Session, offset: int = 0, limit: int = 10, q: str = None):
    """
    Retrieve multiple snippets.
    Supports pagination via offset and limit.
    Supports searching by title, language, or tags via the `q` parameter.
    """
    query = db.query(models.Snippet)
    
    # Apply search filter if query string is provided
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                models.Snippet.title.ilike(search_term),
                models.Snippet.language.ilike(search_term),
                models.Snippet.tags.ilike(search_term)
            )
        )
        
    # Apply pagination (OFFSET and LIMIT)
    return query.offset(offset).limit(limit).all()

def create_snippet(db: Session, snippet: schemas.SnippetCreate):
    """Create a new snippet in the database."""
    # Convert Pydantic schema to SQLAlchemy model
    db_snippet = models.Snippet(**snippet.model_dump())
    db.add(db_snippet)
    db.commit()
    db.refresh(db_snippet) # Refresh to get the generated ID and created_at
    return db_snippet

def delete_snippet(db: Session, snippet_id: int) -> bool:
    """Delete a snippet by its ID. Returns True if deleted, False if not found."""
    db_snippet = get_snippet(db, snippet_id)
    if db_snippet:
        db.delete(db_snippet)
        db.commit()
        return True
    return False
