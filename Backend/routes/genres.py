from fastapi import APIRouter, Depends
from schemas.genre import GenreCreate, Genre
from database.database import get_db
from crud.genre import get_all_genres, create_genre

router = APIRouter(tags=['genres'])

@router.get("/genres", response_model=list[Genre])
def get_all_genres_endpoint(db = Depends(get_db)):
    return get_all_genres(db)
    

@router.post("/genres", response_model=Genre)
def create_genre_endpoint(genre: GenreCreate, db = Depends(get_db)):
    return create_genre(db, genre)
