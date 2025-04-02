from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Genre(Base):
    __tablename__ = "genres"
    
    genre_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable = False)

    books = relationship("BookGenre", back_populates="genre")
