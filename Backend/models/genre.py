from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base
from .association_tables import book_genre

class Genre(Base):
    __tablename__ = "genres"

    genre_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)

    books = relationship(
        "Book",
        secondary=book_genre,
        back_populates="genres"
    )
