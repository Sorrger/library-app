from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base

class Genre(Base):
    __tablename__ = "genres"

    genre_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)

    books = relationship("BookGenre", back_populates="genre")
