from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base

class Author(Base):
    __tablename__ = "authors"

    author_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    surname = Column(String(255), nullable=False)

    books = relationship(
        "Book",
        secondary="book_author",
        back_populates="authors"
    )
