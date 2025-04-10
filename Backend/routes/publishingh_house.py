from fastapi import APIRouter, Depends
from schemas.genre import GenreCreate, Genre
from database.database import get_db
from crud.genre import get_all_publishing_houses, create_publishing_house

router = APIRouter(tags=['genres'])

@router.get("/genres", response_model=list[Genre])
def get_all_publishing_houses_endpoint(db = Depends(get_db)):
    return get_all_publishing_houses(db)
    

@router.post("/genres", response_model=Genre)
def create_genre_endpoint(genre: GenreCreate, db = Depends(get_db)):
    return create_publishing_house(db, genre)
