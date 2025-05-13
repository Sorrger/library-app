from fastapi import APIRouter, Depends, HTTPException
from schemas.edition import Edition, EditionCreate, EditionStatusUpdate
from database.database import get_db
from crud.edition import get_all_editions, create_edition, get_editions_by_book_id, get_all_available_editions, update_edition_status

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

@router.get("/editions/available", response_model=list[Edition])
def get_all_avaialble_editions_endpoint(db = Depends(get_db)):
    return get_all_editions(db)

@router.patch("/editions/{edition_id}/status", response_model=Edition)
def update_edition_status_endpoint(edition_id: int,
    status_update: EditionStatusUpdate,
    db = Depends(get_db)
):
    updated_edition = update_edition_status(db, edition_id, status_update.status)
    if updated_edition is None:
        raise HTTPException(status_code=404, detail="Edition not found")
    return updated_edition  