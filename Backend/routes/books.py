from fastapi import APIRouter, Depends, HTTPException
from schemas.book import BookCreate
from models import Book
from database.database import get_db
from crud.book import get_all_books, create_book

router = APIRouter(tags=['books'])

@router.get("/books", response_model=list[BookCreate])
async def get_all_books(db = Depends(get_db)):
    books = get_all_books(db)
    return [BookCreate(**book) for book in books]

@router.post("/books", response_model=BookCreate)
async def create_book(book: BookCreate, db = Depends(get_db)):
    return create_book(db, book)