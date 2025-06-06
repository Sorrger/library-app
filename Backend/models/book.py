from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from database.database import Base
from .association_tables import book_author, book_genre

class Book(Base):
    __tablename__ = "books"

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    release_date = Column(Date, nullable=False)

    authors = relationship(
        "Author",
        secondary=book_author,
        back_populates="books"
    )
    genres = relationship(
        "Genre",
        secondary=book_genre,
        back_populates="books"
    )
    editions = relationship("Edition", back_populates="book", cascade="all, delete-orphan")
