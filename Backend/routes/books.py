from fastapi import APIRouter, Depends, HTTPException
from schemas.book import BookCreate, Book
from database.database import get_db
from crud.book import get_all_books, create_book, get_book_by_id, delete_book

router = APIRouter(tags=['books'])

@router.get("/books", response_model=list[Book])
def get_all_books_endpoint(db = Depends(get_db)):
    return get_all_books(db)

@router.post("/books", response_model=Book)
def create_book_endpoint(book: BookCreate, db = Depends(get_db)):
    return create_book(db, book)

@router.delete("/books/{book_id}", response_model=Book)
def delete_book_endpoint(book_id: int, db = Depends(get_db)):
    book = delete_book(db, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.get("/books/{book_id}", response_model=Book)
def get_book_details_endpoint(book_id: int, db = Depends(get_db)):
    db_book = get_book_by_id(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

