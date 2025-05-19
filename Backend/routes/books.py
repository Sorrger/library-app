from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from schemas.book import BookCreate, Book, BookResponse
from database.database import get_db
from typing import Optional
from crud.book import get_all_books, create_book ,get_book_by_id, get_books_filtered, delete_book, get_book_count

router = APIRouter(tags=['books'])

@router.get("/books", response_model=list[Book])
def get_all_books_endpoint(db = Depends(get_db)):
    return get_all_books(db)


@router.get("/books/filter", response_model=list[Book])
def filter_books_endpoint(
    title: Optional[str] = Query(default=None),
    author: Optional[str] = Query(default=None),
    genre: Optional[str] = Query(default=None),
    db = Depends(get_db)
):
    print(f"Received query params: title={title}, author={author}, genre={genre}")
    title = title or ""
    author = author or ""
    genre = genre or ""

    books = get_books_filtered(db, title=title, author=author, genre=genre)
    print("Fetched books:", books)
    return books

@router.get("/books/count")
def count_books_endpoint(db = Depends(get_db)):
    count = get_book_count(db)
    return JSONResponse(content={"count": count})

@router.get("/books/{book_id}", response_model=Book)
def get_book_details_endpoint(book_id: int, db = Depends(get_db)):
    db_book = get_book_by_id(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@router.post("/books", response_model=BookResponse)
def create_book_endpoint(book: BookCreate, db = Depends(get_db)):
    return create_book(db, book)

@router.delete("/books/{book_id}", response_model=Book)
def delete_book_endpoint(book_id: int, db = Depends(get_db)):
    book = delete_book(db, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


