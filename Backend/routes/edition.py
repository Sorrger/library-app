from fastapi import APIRouter, Depends
from schemas.edition import Edition, EditionCreate
from database.database import get_db
from crud.edition import get_all_editions, create_edition

router = APIRouter(tags=['editions'])

@router.get("/editions", response_model=list[Edition])
def get_all_editions_endpoint(db = Depends(get_db)):
    return get_all_editions(db)
    

@router.post("/editions", response_model=Edition)
def create_editions_endpoint(edition: EditionCreate, db = Depends(get_db)):
    return create_edition(db, edition)
