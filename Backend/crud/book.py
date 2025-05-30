from sqlalchemy.orm import Session, joinedload
from models.book import Book
from models.author import Author
from models.genre import Genre
from schemas.book import BookCreate

# == Create ==
def create_book(db: Session, book: BookCreate):
    db_book = Book(
        title=book.title,
        release_date=book.release_date
    )

    if book.author_ids:
        db_book.authors = db.query(Author).filter(Author.author_id.in_(book.author_ids)).all()

    if book.genre_ids:
        db_book.genres = db.query(Genre).filter(Genre.genre_id.in_(book.genre_ids)).all()

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# == Read ==
def get_all_books(db: Session):
    return db.query(Book).all()

def get_book_count(db: Session):
    return db.query(Book).count()

def get_book_by_id(db: Session, book_id: int):
    return (
        db.query(Book)
        .options(joinedload(Book.authors), joinedload(Book.genres))
        .filter(Book.book_id == book_id)
        .first()
    )

def get_books_filtered(db: Session, title: str = "", author: str = "", genre: str = ""):
    query = db.query(Book).options(joinedload(Book.authors), joinedload(Book.genres))

    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))
    if author:
        query = query.join(Book.authors).filter(
            (Author.name + " " + Author.surname).ilike(f"%{author}%")
        )
    if genre:
        query = query.join(Book.genres).filter(Genre.name.ilike(f"%{genre}%"))

    return query.all()
# == Update ==
# == Delete ==

def delete_book(db: Session, book_id: int):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if book is None:
        return None
    db.delete(book)
    db.commit()
    return book

