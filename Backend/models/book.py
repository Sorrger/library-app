from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.database import Base

class Book(Base):
    __tablename__ = "books"
    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    release_date = Column(DateTime, nullable=False)

    authors = relationship("BookAuthor", back_populates="book")
    genres = relationship("BookGenre", back_populates="book")
    editions = relationship("Edition", back_populates="book")


class BookGenre(Base):
    __tablename__ = "book_genre"

    book_id = Column(Integer, ForeignKey("books.book_id"), primary_key=True)
    genre_id = Column(Integer, ForeignKey("genres.genre_id"), primary_key=True)

    book = relationship("Book", back_populates="genres")
    genre = relationship("Genre", back_populates="books")


class BookAuthor(Base):
    __tablename__ = "book_author"
    
    book_id = Column(Integer, ForeignKey("books.book_id"), primary_key=True)
    author_id = Column(Integer, ForeignKey("authors.author_id"), primary_key=True)

    book = relationship("Book", back_populates="authors")
    author = relationship("Author", back_populates="books")
