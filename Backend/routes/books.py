from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from schemas.book import BookCreate, Book, BookResponse, BookUpdate
from database.database import get_db
from crud.book import (
    get_all_books,
    create_book,
    get_book_by_id,
    get_books_filtered,
    get_book_count,
    update_book,
    delete_book,
)
from crud.edition import get_edition_by_id

router = APIRouter(tags=['books'])


@router.get("/books", response_model=List[Book])
def get_all_books_endpoint(db: Session = Depends(get_db)):
    return get_all_books(db)


@router.get("/books/filter", response_model=List[Book])
def filter_books_endpoint(
    title: Optional[str]    = Query(default=None, description="Search in title"),
    author: List[str]       = Query(default=[], description="Filter by author", alias="author"),
    genre: List[str]        = Query(default=[], description="Filter by genre", alias="genre"),
    db: Session             = Depends(get_db),
):
    books = get_books_filtered(
        db,
        title   = title or "",
        authors = author,
        genres  = genre,
    )
    if not books:
        return JSONResponse(status_code=200, content=[])
    return books


@router.get("/books/count")
def count_books_endpoint(db: Session = Depends(get_db)):
    count = get_book_count(db)
    return JSONResponse(content={"count": count})


@router.get("/books/{book_id}", response_model=Book)
def get_book_details_endpoint(book_id: int, db: Session = Depends(get_db)):
    db_book = get_book_by_id(db, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@router.post("/books", response_model=BookResponse)
def create_book_endpoint(book: BookCreate, db: Session = Depends(get_db)):
    return create_book(db, book)


@router.patch("/books/{book_id}", response_model=Book)
def update_book_endpoint(book_id: int, book_update: BookUpdate, db: Session = Depends(get_db)):
    updated = update_book(db, book_id, book_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated


@router.delete("/books/{book_id}", response_model=Book)
def delete_book_endpoint(book_id: int, db: Session = Depends(get_db)):
    deleted = delete_book(db, book_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Book not found")
    return deleted


@router.get("/editions/{edition_id}/book", response_model=Book)
def get_book_by_edition_id(edition_id: int, db: Session = Depends(get_db)):
    edition = get_edition_by_id(db, edition_id)
    if not edition:
        raise HTTPException(status_code=404, detail="Edition not found")
    book = get_book_by_id(db, edition.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
