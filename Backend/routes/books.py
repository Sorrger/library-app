from fastapi import APIRouter, Depends
from schemas.book import BookCreate, Book
from database.database import get_db
from crud.book import get_all_books, create_book

router = APIRouter(tags=['books'])

@router.get("/books", response_model=list[Book])
def get_all_books_endpoint(db = Depends(get_db)):
    return get_all_books(db)

@router.post("/books", response_model=Book)
def create_book_endpoint(book: BookCreate, db = Depends(get_db)):
    return create_book(db, book)

#1. egzemplarz
#2. wydawnictwo
#3. relacja
#4. react, axios instalacja wyswietlenei czego prostego