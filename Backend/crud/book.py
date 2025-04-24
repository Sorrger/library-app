from sqlalchemy.orm import Session
from models.book import Book
from schemas.book import BookCreate

# == Create ==
def create_book(db: Session, book: BookCreate):
    db_book = Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book
# == Read ==
def get_all_books(db: Session):
    return db.query(Book).all()

def get_book_by_id(db: Session, book_id: int):
    return db.query(Book).filter(Book.book_id == book_id).first()
# == Update ==
# == Delete ==

def delete_book(db: Session, book_id: int):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if book is None:
        return None  # or raise an exception
    db.delete(book)
    db.commit()
    return book

