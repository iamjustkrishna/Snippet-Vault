from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from . import crud, schemas
from .database import get_db

# Create an APIRouter for snippet endpoints
router = APIRouter(
    prefix="/snippets",
    tags=["snippets"]
)

@router.post("/", response_model=schemas.Snippet, status_code=status.HTTP_201_CREATED)
def create_snippet(snippet: schemas.SnippetCreate, db: Session = Depends(get_db)):
    """
    Create a new snippet.
    """
    return crud.create_snippet(db=db, snippet=snippet)

@router.get("/", response_model=List[schemas.Snippet])
def read_snippets(
    page: int = 1, 
    limit: int = 10, 
    q: str = None, 
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of snippets.
    
    - **page**: Page number for pagination (starts at 1)
    - **limit**: Maximum number of snippets to return per page
    - **q**: Optional search query (matches title, language, or tags)
    """
    # Ensure page is at least 1, then calculate OFFSET for SQL
    current_page = max(1, page)
    offset = (current_page - 1) * limit
    
    snippets = crud.get_snippets(db, offset=offset, limit=limit, q=q)
    return snippets

@router.delete("/{snippet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_snippet(snippet_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific snippet by its ID.
    """
    success = crud.delete_snippet(db, snippet_id=snippet_id)
    if not success:
        # If the snippet wasn't found, return a 404 error
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Snippet not found")
    
    # 204 response has no body, so we just return nothing
    return
