from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Author(Base):
    __tablename__ = "authors"

    author_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable = False)
    surrname = Column(String(255), nullable = False)

    books = relationship("BookAuthor", back_populates = "author")
