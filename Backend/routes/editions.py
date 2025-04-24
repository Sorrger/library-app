from fastapi import APIRouter, Depends
from schemas.edition import Edition, EditionCreate
from database.database import get_db
from crud.edition import get_all_editions, create_edition, get_editions_by_book_id

router = APIRouter(tags=['editions'])

@router.get("/editions", response_model=list[Edition])
def get_all_editions_endpoint(db = Depends(get_db)):
    return get_all_editions(db)
    

@router.post("/editions", response_model=Edition)
def create_editions_endpoint(edition: EditionCreate, db = Depends(get_db)):
    return create_edition(db, edition)

@router.get("/books/{book_id}/editions", response_model=list[Edition])
def get_editions_for_book_endpoint(book_id: int, db = Depends(get_db)):
    return get_editions_by_book_id(db, book_id)