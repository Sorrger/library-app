from fastapi import APIRouter, Depends
from schemas.author import AuthorCreate, Author
from database.database import get_db
from crud.author import get_all_authors, create_author

router = APIRouter(tags=['authors'])

@router.get("/authors", response_model=list[Author])
def get_all_authors_endpoint(db = Depends(get_db)):
    return get_all_authors(db)

@router.post("/authors", response_model=Author)
def create_author_endpoint(author: AuthorCreate, db = Depends(get_db)):
    return create_author(db, author)