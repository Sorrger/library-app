from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from schemas.edition import Edition, EditionCreate, EditionStatusUpdate
from database.database import get_db
from models.enums import EditionStatus
from crud.edition import get_all_editions, create_edition, get_editions_by_book_id, get_all_available_editions, update_edition_status, get_edition_by_id, get_edition_count

router = APIRouter(tags=['editions'])

@router.get("/editions", response_model=list[Edition])
def get_all_editions_endpoint(db = Depends(get_db)):
    return get_all_editions(db)
    
@router.get("/editions/{edition_id}", response_model=Edition)
def get_edition_detail_endpoint(edition_id: int, db = Depends(get_db)):
    edition = get_edition_by_id(db, edition_id)
    if edition is None:
        raise HTTPException(status_code=404, detail="Edition not found")
    return edition

@router.post("/editions", response_model=Edition)
def create_editions_endpoint(edition: EditionCreate, db = Depends(get_db)):
    return create_edition(db, edition)

@router.get("/books/{book_id}/editions", response_model=list[Edition])
def get_editions_for_book_endpoint(book_id: int, db = Depends(get_db)):
    return get_editions_by_book_id(db, book_id)

@router.get("/editions/available", response_model=list[Edition])
def get_all_avaialble_editions_endpoint(db = Depends(get_db)):
    return get_all_available_editions(db)

@router.get("/rented-editions", response_model=list[Edition])
def get_rented_editions_endpoint(db = Depends(get_db)):
    return db.query(Edition).filter(Edition.status == "borrowed").all()

@router.get("/editions/count")
def count_editions_endpoint(db = Depends(get_db)):
    count = get_edition_count(db)
    return JSONResponse(content={"count": count})


@router.patch("/edition/{id}/{status}/", response_model=EditionStatusUpdate)
def edition_status_change_endpoint(id: int, status: str, db = Depends(get_db)):
    try:
        parsed_status = EditionStatus(status.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: '{status}'. Must be one of: {[s.value for s in EditionStatus]}")
    
    updated = update_edition_status(db, id, parsed_status)
    if not updated:
        raise HTTPException(status_code=404, detail="Edition not found")
    return updated