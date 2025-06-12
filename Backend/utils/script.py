# seed.py
from sqlalchemy.orm import Session
from database.database import get_db 
from crud.author import create_author
from crud.genre import create_genre
from crud.book import create_book
from crud.edition import create_edition
from crud.publishing_house import create_publishing_house
from schemas.author import AuthorCreate
from schemas.genre import GenreCreate
from schemas.book import BookCreate
from schemas.edition import EditionCreate
from schemas.publishing_house import PublishingHouseCreate
from models.enums import EditionStatus

def seed_data(db: Session):
    # Create authors
    author1 = create_author(db, AuthorCreate(name="George Orwell"))
    author2 = create_author(db, AuthorCreate(name="J.K. Rowling"))

    # Create genres
    genre1 = create_genre(db, GenreCreate(name="Dystopian"))
    genre2 = create_genre(db, GenreCreate(name="Fantasy"))

    # Create publishing house
    publisher = create_publishing_house(db, PublishingHouseCreate(name="Penguin", headquarters="London"))

    # Create books
    book1 = create_book(db, BookCreate(
        title="1984",
        release_date="1949-06-08",
        author_ids=[author1.author_id],
        genre_ids=[genre1.genre_id]
    ))
    
    book2 = create_book(db, BookCreate(
        title="Harry Potter and the Philosopher's Stone",
        release_date="1997-06-26",
        author_ids=[author2.author_id],
        genre_ids=[genre2.genre_id]
    ))

    # Create editions
    create_edition(db, EditionCreate(
        status=EditionStatus.AVAILABLE,
        book_format="Hardcover",
        book_id=book1.book_id,
        publishing_house_id=publisher.publishing_house_id
    ))

    create_edition(db, EditionCreate(
        status=EditionStatus.BORROWED,
        book_format="Paperback",
        book_id=book2.book_id,
        publishing_house_id=publisher.publishing_house_id
    ))

def main():
    db = get_db()
    try:
        seed_data(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
